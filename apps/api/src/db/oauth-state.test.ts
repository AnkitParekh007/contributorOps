import assert from "node:assert/strict";
import test from "node:test";
import { getSupabaseAdmin } from "./client.js";
import { createOAuthState, consumeOAuthState, oauthHash, OAUTH_COOKIE, readOAuthCookie } from "./oauth-state.js";

interface StateRow {
  state_hash: string;
  browser_binding_hash: string;
  user_id: string;
  requested_scope: string;
  expires_at: string;
  consumed_at: string | null;
}
function fakeOAuthDatabase() {
  const data = new Map<string, StateRow>();
  const db = {
    from(table: string) {
      assert.equal(table, "oauth_states");
      return {
        async insert(row: StateRow) {
          data.set(row.state_hash, { ...row, consumed_at: null });
          return { error: null };
        },
        update(updates: Pick<StateRow, "consumed_at">) {
          const filters: Record<string, string> = {};
          const builder = {
            eq(key: string, value: string) { filters[key] = value; return builder; },
            is(key: string, value: null) { assert.equal(key, "consumed_at"); assert.equal(value, null); return builder; },
            gt(key: string, value: string) { assert.equal(key, "expires_at"); filters.now = value; return builder; },
            select(_fields: string) { return builder; },
            async maybeSingle() {
              const row = data.get(filters.state_hash);
              if (!row || row.browser_binding_hash !== filters.browser_binding_hash ||
                row.consumed_at !== null || row.expires_at <= filters.now) return { data: null, error: null };
              row.consumed_at = updates.consumed_at;
              return { data: { user_id: row.user_id }, error: null };
            },
          };
          return builder;
        },
      };
    },
  } as unknown as ReturnType<typeof getSupabaseAdmin>;
  return { db, data };
}

test("missing, forged and browser-mismatched OAuth state cannot authorize", async () => {
  const { db } = fakeOAuthDatabase();
  const userA = "11111111-1111-4111-8111-111111111111";
  const { state, browserBinding } = await createOAuthState(userA, "public_repo read:user", db);
  assert.equal(await consumeOAuthState("", browserBinding, db), null);
  assert.equal(await consumeOAuthState(state, "forged", db), null);
  assert.equal(await consumeOAuthState("a".repeat(43), browserBinding, db), null);
  const other = await createOAuthState("22222222-2222-4222-8222-222222222222", "read:user", db);
  assert.equal(await consumeOAuthState(state, other.browserBinding, db), null, "another browser/user cannot use A's state");
  assert.equal(await consumeOAuthState(state, browserBinding, db), userA);
  assert.equal(await consumeOAuthState(state, browserBinding, db), null, "state is one-use");
});

test("expired state cannot authorize even with the correct cookie", async () => {
  const { db, data } = fakeOAuthDatabase();
  const { state, browserBinding } = await createOAuthState("33333333-3333-4333-8333-333333333333", "public_repo", db);
  data.get(oauthHash(state))!.expires_at = new Date(Date.now() - 1000).toISOString();
  assert.equal(await consumeOAuthState(state, browserBinding, db), null);
});

test("OAuth state uses random 32-byte opaque values and a cookie-specific binding", async () => {
  const { db } = fakeOAuthDatabase();
  const a = await createOAuthState("44444444-4444-4444-8444-444444444444", "public_repo", db);
  const b = await createOAuthState("44444444-4444-4444-8444-444444444444", "public_repo", db);
  assert.equal(a.state.length, 43);
  assert.notEqual(a.state, b.state);
  assert.notEqual(a.browserBinding, a.state);
  assert.equal(readOAuthCookie(`x=1; ${OAUTH_COOKIE}=${a.browserBinding}; y=2`), a.browserBinding);
  assert.equal(readOAuthCookie("x=1"), null);
  assert.equal(oauthHash(a.state).length, 64);
});
