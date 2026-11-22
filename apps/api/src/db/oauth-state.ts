import crypto from "node:crypto";
import { getSupabaseAdmin } from "./client.js";

export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
export const OAUTH_COOKIE = "contributorops_gh_oauth";

export function oauthHash(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

export function readOAuthCookie(header: string | undefined): string | null {
  const entry = (header || "").split(";").map((x) => x.trim()).find((x) => x.startsWith(`${OAUTH_COOKIE}=`));
  return entry ? entry.slice(OAUTH_COOKIE.length + 1) : null;
}

export async function createOAuthState(userId: string, requestedScope: string, db = getSupabaseAdmin()): Promise<{ state: string; browserBinding: string }> {
  const state = crypto.randomBytes(32).toString("base64url");
  const browserBinding = crypto.randomBytes(32).toString("base64url");
  const { error } = await db.from("oauth_states").insert({
    state_hash: oauthHash(state),
    browser_binding_hash: oauthHash(browserBinding),
    user_id: userId,
    requested_scope: requestedScope,
    expires_at: new Date(Date.now() + OAUTH_STATE_TTL_MS).toISOString(),
  });
  if (error) throw new Error(`Could not initialize OAuth state: ${error.message}`);
  return { state, browserBinding };
}

function validOpaqueState(state: string, browserBinding: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(state) && /^[A-Za-z0-9_-]{43}$/.test(browserBinding);
}

/** Validate the public GitHub redirect before sending it back to the first-party app.
 * This does not consume the nonce or authorize persistence of any token.
 */
export async function inspectOAuthState(state: string, browserBinding: string, db = getSupabaseAdmin()): Promise<boolean> {
  if (!validOpaqueState(state, browserBinding)) return false;
  const { data, error } = await db.from("oauth_states")
    .select("user_id")
    .eq("state_hash", oauthHash(state))
    .eq("browser_binding_hash", oauthHash(browserBinding))
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw new Error(`OAuth state inspection failed: ${error.message}`);
  return Boolean(data?.user_id);
}

/** A user may finalize OAuth only while authenticated as the original initiator.
 * The owner predicate is part of the one-use atomic UPDATE: switching accounts
 * in the same browser cannot attach A's GitHub credentials to account B.
 */
export async function consumeOAuthState(
  state: string,
  browserBinding: string,
  authenticatedUserId: string,
  db = getSupabaseAdmin()
): Promise<string | null> {
  if (!validOpaqueState(state, browserBinding) || !authenticatedUserId) return null;
  const { data, error } = await db.from("oauth_states")
    .update({ consumed_at: new Date().toISOString() })
    .eq("state_hash", oauthHash(state))
    .eq("browser_binding_hash", oauthHash(browserBinding))
    .eq("user_id", authenticatedUserId)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("user_id")
    .maybeSingle();
  if (error) throw new Error(`OAuth state validation failed: ${error.message}`);
  return data?.user_id ?? null;
}
