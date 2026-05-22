import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config.js";

// We use `any` for the Database generic until `supabase gen types typescript` is run
// against a live project. Replace with the generated type for full type safety.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDB = SupabaseClient<any>;

let _adminClient: AnyDB | null = null;

/**
 * Returns a Supabase client using the service role key.
 * Only available when STORAGE_MODE=supabase and env vars are configured.
 * Throws clearly if called in demo mode.
 */
export function getSupabaseAdmin() {
  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    throw new Error(
      "Supabase is not configured. Set STORAGE_MODE=supabase, SUPABASE_URL, and SUPABASE_SERVICE_KEY."
    );
  }
  if (!_adminClient) {
    _adminClient = createClient(config.supabaseUrl, config.supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as AnyDB;
  }
  return _adminClient;
}

/** Returns true if Supabase is configured and STORAGE_MODE=supabase */
export function isSupabaseMode(): boolean {
  return config.storageMode === "supabase" && !!config.supabaseUrl && !!config.supabaseServiceKey;
}
