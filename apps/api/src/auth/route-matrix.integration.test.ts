import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const apiDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

async function freePort(): Promise<number> {
  const socket = net.createServer();
  await new Promise<void>((resolve) => socket.listen(0, "127.0.0.1", resolve));
  const address = socket.address();
  assert.ok(address && typeof address !== "string");
  await new Promise<void>((resolve) => socket.close(() => resolve()));
  return address.port;
}

async function launch(mode: "demo" | "supabase"): Promise<{
  url: string;
  stop: () => void;
}> {
  const port = await freePort();
  const child: ChildProcess = spawn(process.execPath, ["--import", "tsx", "src/server.ts"], {
    cwd: apiDir,
    env: {
      ...process.env,
      STORAGE_MODE: mode,
      PORT: String(port),
      API_HOST: "127.0.0.1",
      GH_CONTRIBUTOROPS_TOKEN: "",
      GITHUB_TOKEN: "",
      AUTO_CONTRIBUTE_ENABLED: "false",
      AUTO_WORKSPACE_ENABLED: "false",
      CREATE_DAILY_ISSUE: "false",
      SUPABASE_URL: "",
      SUPABASE_SERVICE_KEY: "",
      NODE_ENV: "test",
    },
    stdio: "ignore",
  });
  const url = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (child.exitCode !== null) throw new Error(`API exited prematurely with code ${child.exitCode}`);
    try {
      const r = await fetch(`${url}/api/pricing`);
      if (r.status === 200) return { url, stop: () => child.kill("SIGTERM") };
    } catch { /* startup in progress */ }
    await new Promise((resolve) => setTimeout(resolve, 125));
  }
  child.kill("SIGTERM");
  throw new Error(`API failed to start in ${mode} mode`);
}

test("demo mode keeps public endpoints accessible and uses local-only identity", async () => {
  const api = await launch("demo");
  try {
    for (const endpoint of ["/api/health", "/api/pricing", "/api/meta", "/api/launch-offer", "/api/control-mode", "/api/billing", "/api/portfolio", "/api/github/status", "/api/waitlist/stats"]) {
      const response = await fetch(api.url + endpoint);
      assert.equal(response.status, 200, endpoint);
    }
    const callback = await fetch(api.url + "/api/github/callback?code=x&state=y", { redirect: "manual" });
    assert.equal(callback.status, 403, "demo mode must not accept real OAuth codes");
  } finally {
    api.stop();
  }
});

test("Supabase mode returns public health/pricing but rejects anonymous and invalid tokens", async () => {
  const api = await launch("supabase");
  try {
    for (const endpoint of ["/api/health", "/api/pricing", "/api/meta", "/api/launch-offer"]) {
      assert.equal((await fetch(api.url + endpoint)).status, 200, endpoint);
    }
    for (const endpoint of ["/api/billing", "/api/portfolio", "/api/control-mode", "/api/discover", "/api/github/status", "/api/github/connect", "/api/contribute/runs", "/api/usage"]) {
      assert.equal((await fetch(api.url + endpoint)).status, 401, endpoint);
    }
    const noToken = await fetch(api.url + "/api/billing/mock-select-plan", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: '{"plan":"team"}',
    });
    assert.equal(noToken.status, 401);
    const invalidToken = await fetch(api.url + "/api/portfolio", {
      headers: { Authorization: "Bearer invalid-token" },
    });
    assert.equal(invalidToken.status, 401);
    assert.equal((await fetch(api.url + "/api/github/callback?code=fake", { redirect: "manual" })).status, 400);
  } finally {
    api.stop();
  }
});
