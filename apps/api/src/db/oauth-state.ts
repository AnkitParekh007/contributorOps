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

export async function createOAuthState(userId: string, requestedScope: string): Promise<{ state: string; browserBinding: string }> {
  const state = crypto.randomBytes(32).toString("base64url");
  const browserBinding = crypto.randomBytes(32).toString("base64url");
  const db = getSupabaseAdmin();
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

export async function consumeOAuthState(state: string, browserBinding: string): Promise<string | null> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(state) || !/^[A-Za-z0-9_-]{43}$/.test(browserBinding)) return null;
  // A single conditional UPDATE atomically enforces one-use, browser binding and expiry.
  const { data, error } = await getSupabaseAdmin().from("oauth_states")
    .update({ consumed_at: new Date().toISOString() })
    .eq("state_hash", oauthHash(state))
    .eq("browser_binding_hash", oauthHash(browserBinding))
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("user_id")
    .maybeSingle();
  if (error) throw new Error(`OAuth state validation failed: ${error.message}`);
  return data?.user_id ?? null;
}
