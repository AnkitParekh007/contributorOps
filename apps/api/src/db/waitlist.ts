import { getSupabaseAdmin } from "./client.js";

export interface WaitlistEntryDB {
  id: string;
  email: string;
  name: string | null;
  github_username: string | null;
  target_role: string | null;
  plan_interest: string | null;
  problem_statement: string | null;
  source: string;
  created_at: string;
}

export async function upsertWaitlistEntry(entry: {
  email: string;
  name?: string;
  githubUsername?: string;
  targetRole?: string;
  planInterest?: string;
  problemStatement?: string;
  source?: string;
}): Promise<WaitlistEntryDB> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("waitlist_entries")
    .upsert(
      {
        email: entry.email.toLowerCase().trim(),
        name: entry.name || null,
        github_username: entry.githubUsername || null,
        target_role: entry.targetRole || null,
        plan_interest: entry.planInterest || null,
        problem_statement: entry.problemStatement || null,
        source: entry.source || "api"
      },
      { onConflict: "email" }
    )
    .select()
    .single();

  if (error) throw new Error(`Waitlist upsert failed: ${error.message}`);
  return data as WaitlistEntryDB;
}

export async function getWaitlistStats(): Promise<{ total: number; byRole: Record<string, number> }> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("waitlist_entries")
    .select("target_role");

  if (error) throw new Error(`Waitlist stats failed: ${error.message}`);

  const entries = (data || []) as { target_role: string | null }[];
  const byRole: Record<string, number> = {};
  for (const e of entries) {
    const role = e.target_role || "Unknown";
    byRole[role] = (byRole[role] || 0) + 1;
  }
  return { total: entries.length, byRole };
}
