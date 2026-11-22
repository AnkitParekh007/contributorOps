import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";

test("GitHub OAuth token save, reconnect, read and disconnect use the migrated schema and owner identity", async () => {
  const rows = new Map<string, Record<string, unknown>>();
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    const send = (status: number, data: unknown) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(data));
    };
    if (url.pathname !== "/rest/v1/oauth_accounts") return send(404, { message: "missing mock table" });
    const id = (url.searchParams.get("user_id") || "").replace(/^eq\./, "");
    const provider = (url.searchParams.get("provider") || "").replace(/^eq\./, "");
    const key = `${id}::${provider}`;
    if (req.method === "GET") return send(200, rows.get(key) ?? null);
    if (req.method === "DELETE") { rows.delete(key); return send(204, null); }
    if (req.method === "POST") {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      const value = JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
      if (!value.user_id || !value.provider_user_id || !value.access_token_encrypted || !value.updated_at) {
        return send(400, { code: "BAD_SCHEMA", message: "Canonical OAuth columns required" });
      }
      const differentOwner = [...rows.values()].find((x) =>
        x.user_id !== value.user_id && x.provider === value.provider &&
        x.provider_user_id === value.provider_user_id);
      if (differentOwner) return send(409, { code: "23505", message: "duplicate provider identity" });
      rows.set(`${value.user_id}::${value.provider}`, value);
      return send(201, []);
    }
    return send(405, { message: "unsupported" });
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  process.env.STORAGE_MODE = "supabase";
  process.env.SUPABASE_URL = `http://127.0.0.1:${address.port}`;
  process.env.SUPABASE_SERVICE_KEY = "local-placeholder-not-a-secret";
  process.env.TOKEN_ENCRYPTION_KEY = "test-encryption-key-do-not-use-in-production";
  try {
    const { saveGithubToken, getGithubToken, deleteGithubToken } = await import("./users.js");
    const a = "11111111-1111-4111-8111-111111111111";
    const b = "22222222-2222-4222-8222-222222222222";
    await saveGithubToken(a, "github-user-a-token", ["public_repo"], "123");
    const encrypted = rows.get(`${a}::github`)?.access_token_encrypted;
    assert.equal(typeof encrypted, "string");
    assert.ok(!(encrypted as string).includes("github-user-a-token"), "Tokens must be encrypted at rest");
    assert.equal((await getGithubToken(a))?.token, "github-user-a-token");
    assert.equal(await getGithubToken(b), null, "B cannot read A's token");
    await assert.rejects(saveGithubToken(b, "stolen", ["public_repo"], "123"), /Save GitHub token failed/);
    await saveGithubToken(b, "github-user-b-token", ["public_repo"], "456");
    await saveGithubToken(a, "github-user-a-reconnected", ["read:user"], "123");
    assert.equal((await getGithubToken(a))?.token, "github-user-a-reconnected");
    assert.equal((await getGithubToken(b))?.token, "github-user-b-token");
    await deleteGithubToken(a);
    assert.equal(await getGithubToken(a), null);
    assert.equal((await getGithubToken(b))?.token, "github-user-b-token");
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
