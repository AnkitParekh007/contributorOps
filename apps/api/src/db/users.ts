import { getSupabaseAdmin } from "./client.js";
import { encrypt, decrypt } from "../lib/crypto.js";

export interface UserDB {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getUserById(userId: string): Promise<UserDB | null> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error?.code === "PGRST116") return null; // not found
  if (error) throw new Error(`Get user failed: ${error.message}`);
  return data as UserDB;
}

/**
 * Saves an encrypted GitHub OAuth token for a user.
 * Upserts into oauth_accounts (one row per user+provider).
 */
export async function saveGithubToken(userId: string, token: string, scopes: string[]): Promise<void> {
  const db = getSupabaseAdmin();
  const encrypted = encrypt(token);
  const { error } = await db.from("oauth_accounts").upsert(
    {
      user_id: userId,
      provider: "github",
      access_token_enc: encrypted,
      scopes,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,provider" }
  );
  if (error) throw new Error(`Save GitHub token failed: ${error.message}`);
}

/**
 * Retrieves and decrypts the GitHub OAuth token for a user.
 * Returns null if no token is stored.
 */
export async function getGithubToken(userId: string): Promise<{ token: string; scopes: string[] } | null> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("oauth_accounts")
    .select("access_token_enc, scopes")
    .eq("user_id", userId)
    .eq("provider", "github")
    .maybeSingle();

  if (error) throw new Error(`Get GitHub token failed: ${error.message}`);
  if (!data) return null;

  const token = decrypt((data as { access_token_enc: string }).access_token_enc);
  return { token, scopes: (data as { scopes: string[] }).scopes || [] };
}

/**
 * Removes the stored GitHub OAuth token for a user.
 */
export async function deleteGithubToken(userId: string): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = await db
    .from("oauth_accounts")
    .delete()
    .eq("user_id", userId)
    .eq("provider", "github");
  if (error) throw new Error(`Delete GitHub token failed: ${error.message}`);
}

export async function updateUser(userId: string, updates: Partial<Pick<UserDB, "display_name" | "avatar_url">>): Promise<UserDB> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(`Update user failed: ${error.message}`);
  return data as UserDB;
}
