import assert from "node:assert/strict";
import test from "node:test";
import { getSupabaseAdmin } from "./client.js";
import {
  createOAuthState,
  inspectOAuthState,
  consumeOAuthState,
  oauthHash,
  OAUTH_COOKIE,
  readOAuthCookie,
} from "./oauth-state.js";

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
      const query = (updates?: Pick<StateRow, "consumed_at">) => {
        const filters: Record<string, string> = {};
        const builder = {
          eq(key: string, value: string) { filters[key] = value; return builder; },
          is(key: string, value: null) { assert.equal(key, "consumed_at"); assert.equal(value, null); return builder; },
          gt(key: string, value: string) { assert.equal(key, "expires_at"); filters.now = value; return builder; },
          select(_fields: string) { return builder; },
          async maybeSingle() {
            const row = data.get(filters.state_hash);
            if (!row || row.browser_binding_hash !== filters.browser_binding_hash ||
              (filters.user_id && row.user_id !== filters.user_id) ||
              row.consumed_at !== null || row.expires_at <= filters.now) {
              return { data: null, error: null };
            }
            if (updates) row.consumed_at = updates.consumed_at;
            return { data: { user_id: row.user_id }, error: null };
          },
        };
        return builder;
      };
      return {
        async insert(row: StateRow) {
          data.set(row.state_hash, { ...row, consumed_at: null });
          return { error: null };
        },
        select(_fields: string) { return query(); },
        update(updates: Pick<StateRow, "consumed_at">) { return query(updates); },
      };
    },
  } as unknown as ReturnType<typeof getSupabaseAdmin>;
  return { db, data };
}

const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";

test("browser-bound state cannot be forged, reused or consumed from another browser", async () => {
  const { db } = fakeOAuthDatabase();
  const { state, browserBinding } = await createOAuthState(USER_A, "read:user", db);
  assert.equal(await inspectOAuthState(state, browserBinding, db), true);
  assert.equal(await inspectOAuthState(state, "forged", db), false);
  assert.equal(await consumeOAuthState("", browserBinding, USER_A, db), null);
  assert.equal(await consumeOAuthState(state, "forged", USER_A, db), null);
  assert.equal(await consumeOAuthState("a".repeat(43), browserBinding, USER_A, db), null);
  const other = await createOAuthState(USER_B, "read:user", db);
  assert.equal(await consumeOAuthState(state, other.browserBinding, USER_A, db), null);
  assert.equal(await consumeOAuthState(state, browserBinding, USER_A, db), USER_A);
  assert.equal(await inspectOAuthState(state, browserBinding, db), false);
  assert.equal(await consumeOAuthState(state, browserBinding, USER_A, db), null, "state is one-use");
});

test("changing Supabase users inside the SAME browser cannot consume another account's OAuth state", async () => {
  const { db } = fakeOAuthDatabase();
  const { state, browserBinding } = await createOAuthState(USER_A, "read:user", db);
  assert.equal(await consumeOAuthState(state, browserBinding, USER_B, db), null);
  assert.equal(await inspectOAuthState(state, browserBinding, db), true, "wrong account must not burn A's state");
  assert.equal(await consumeOAuthState(state, browserBinding, USER_A, db), USER_A);
});

test("expired state fails both inspection and completion", async () => {
  const { db, data } = fakeOAuthDatabase();
  const { state, browserBinding } = await createOAuthState(USER_A, "read:user", db);
  data.get(oauthHash(state))!.expires_at = new Date(Date.now() - 1000).toISOString();
  assert.equal(await inspectOAuthState(state, browserBinding, db), false);
  assert.equal(await consumeOAuthState(state, browserBinding, USER_A, db), null);
});

test("OAuth state uses independent cryptographic 32-byte opaque values", async () => {
  const { db, data } = fakeOAuthDatabase();
  const a = await createOAuthState(USER_A, "read:user", db);
  const b = await createOAuthState(USER_A, "read:user", db);
  // These are randomly generated nonce verifiers, not passwords. Never store
  // either raw nonce or a reusable GitHub access token in the state table.
  const row = data.get(oauthHash(a.state));
  assert.ok(row);
  assert.notEqual(row.state_hash, a.state);
  assert.notEqual(row.browser_binding_hash, a.browserBinding);
  assert.equal(row.state_hash, oauthHash(a.state));
  assert.equal(row.browser_binding_hash, oauthHash(a.browserBinding));
  assert.equal(JSON.stringify([...data.values()]).includes(a.state), false);
  assert.equal(JSON.stringify([...data.values()]).includes(a.browserBinding), false);
  assert.equal(a.state.length, 43);
  assert.notEqual(a.state, b.state);
  assert.notEqual(a.browserBinding, a.state);
  assert.equal(readOAuthCookie(`x=1; ${OAUTH_COOKIE}=${a.browserBinding}; y=2`), a.browserBinding);
  assert.equal(readOAuthCookie("x=1"), null);
  assert.equal(oauthHash(a.state).length, 64);
});
