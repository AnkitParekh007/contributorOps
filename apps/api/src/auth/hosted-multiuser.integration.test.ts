import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const apiDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ids = {
  a: "11111111-1111-4111-8111-111111111111",
  b: "22222222-2222-4222-8222-222222222222",
};

async function freePort(): Promise<number> {
  const s = net.createServer();
  await new Promise<void>(resolve => s.listen(0, "127.0.0.1", resolve));
  const address = s.address();
  assert.ok(address && typeof address !== "string");
  await new Promise<void>(resolve => s.close(() => resolve()));
  return address.port;
}

function fakeSupabase() {
  const state = new Map<string, unknown>();
  const waitlist = new Map<string, Record<string, unknown>>();
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    const send = (status: number, value: unknown) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(value));
    };
    const userToken = (req.headers.authorization || "").replace(/^Bearer /, "");
    if (url.pathname === "/auth/v1/user") {
      const userId = userToken === "token-a" ? ids.a : userToken === "token-b" ? ids.b : null;
      return userId ? send(200, { id: userId, email: `${userToken}@example.com`, aud: "authenticated", role: "authenticated" }) :
        send(401, { message: "Invalid token", code: 401 });
    }
    const takeUserId = () => (url.searchParams.get("user_id") || "").replace(/^eq\./, "");
    if (url.pathname === "/rest/v1/user_scoped_state") {
      if (req.method === "GET") {
        const key = (url.searchParams.get("state_key") || "").replace(/^eq\./, "");
        const value = state.get(`${takeUserId()}::${key}`);
        return send(200, value === undefined ? null : { value });
      }
      if (req.method === "POST") {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.from(chunk));
        const row = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {user_id:string;state_key:string;value:unknown};
        state.set(`${row.user_id}::${row.state_key}`, row.value);
        return send(201, []);
      }
    }
    if (url.pathname === "/rest/v1/subscriptions") {
      const user = takeUserId();
      return send(200, { user_id: user, plan: "free", status: "active", stripe_subscription_id: null });
    }
    if (url.pathname === "/rest/v1/public_portfolio_profiles") return send(200, null);
    if (url.pathname === "/rest/v1/waitlist_entries") {
      if (req.method === "GET") return send(200, [...waitlist.values()]);
      if (req.method === "POST") {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.from(chunk));
        const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string,unknown>;
        const row = { ...body, id:"waitlist-id", created_at:new Date().toISOString() };
        waitlist.set(String(body.email), row);
        return send(201,row);
      }
    }
    return send(404, { code: "TEST_ENDPOINT_MISSING", path: url.pathname });
  });
  return server;
}

test("two real HTTP sessions isolate tenant state and reject mock paid plans and GitHub writes", async () => {
  const mock = fakeSupabase();
  await new Promise<void>(resolve => mock.listen(0, "127.0.0.1", resolve));
  const address = mock.address();
  assert.ok(address && typeof address !== "string");
  const apiPort = await freePort();
  const app = spawn(process.execPath, ["--import", "tsx", "src/server.ts"], {
    cwd: apiDir,
    stdio: "ignore",
    env: { ...process.env, STORAGE_MODE: "supabase", PORT: String(apiPort),
      API_HOST: "127.0.0.1", SUPABASE_URL: `http://127.0.0.1:${address.port}`,
      SUPABASE_SERVICE_KEY: "local-test-placeholder-not-a-secret",
      GITHUB_TOKEN: "", GH_CONTRIBUTOROPS_TOKEN: "", AUTO_CONTRIBUTE_ENABLED: "false",
      AUTO_WORKSPACE_ENABLED: "false", CREATE_DAILY_ISSUE: "false" },
  });
  const url = `http://127.0.0.1:${apiPort}`;
  const call = (route: string, token?: string, method = "GET", body?: unknown) =>
    fetch(url + route, { method, headers: { ...(token ? {Authorization:`Bearer ${token}`} : {}),
      "Content-Type":"application/json" }, ...(body === undefined ? {} : {body:JSON.stringify(body)}) });
  try {
    let ready = false;
    for (let i=0; i<90; i++) {
      if (app.exitCode !== null) throw new Error("Hosted API exited during integration test");
      try { ready = (await call("/api/pricing")).ok; if (ready) break; } catch { /* booting */ }
      await new Promise(resolve => setTimeout(resolve, 120));
    }
    assert.ok(ready, "Hosted API failed to start");
    assert.equal((await call("/api/health")).status, 200);
    assert.equal((await call("/api/waitlist", undefined, "POST", {
      name:"Example", email:"example@example.com", targetRole:"Engineer"
    })).status, 201);
    assert.equal((await call("/api/waitlist/stats")).status, 200);
    assert.equal((await call("/api/public/portfolio/unpublished")).status, 404);
    assert.equal((await call("/api/public/user/unpublished")).status, 404);

    const post = await call("/api/control-mode", "token-a", "POST", {safetyLevel:"draft"});
    assert.equal(post.status, 200, "authenticated A can save private control state");
    const [ra,rb] = await Promise.all([call("/api/control-mode","token-a"),call("/api/control-mode","token-b")]);
    assert.equal(ra.status, 200); assert.equal(rb.status, 200);
    const a = await ra.json() as { safetyLevel:string };
    const b = await rb.json() as { safetyLevel:string };
    assert.equal(a.safetyLevel, "draft");
    assert.equal(b.safetyLevel, "research", "B cannot read A's control state");

    const before = await call("/api/billing","token-a");
    assert.equal(before.status, 200);
    assert.equal(((await before.json()) as {billing:{plan:string}}).billing.plan,"free");
    assert.equal((await call("/api/billing/mock-select-plan","token-a","POST",{plan:"team"})).status, 403);
    const after = await call("/api/billing","token-a");
    assert.equal(((await after.json()) as {billing:{plan:string}}).billing.plan,"free");
    assert.equal((await call("/api/contribute/approve-comment","token-a","POST",{})).status,403);
    assert.equal((await call("/api/create-planning-issue","token-a","POST",{})).status,403);
    assert.equal((await call("/api/portfolio","token-b")).status,404, "test backend does not publish user data");
    assert.equal((await call("/api/billing")).status,401);
    assert.equal((await call("/api/billing","invalid-token")).status,401);
  } finally {
    app.kill("SIGTERM");
    await new Promise<void>(resolve => mock.close(() => resolve()));
  }
});
