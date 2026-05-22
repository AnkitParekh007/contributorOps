import { getSupabaseAdmin } from "./client.js";

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
