import { getSupabaseAdmin } from "./client.js";

/** DB-oriented portfolio entry (Supabase schema). */
export interface PortfolioEntryDB {
  id: string;
  repo: string;
  prUrl?: string;
  title: string;
  description: string;
  tags: string[];
  status: "discovered" | "planned" | "in progress" | "PR opened" | "merged" | "rejected";
  proof?: Record<string, unknown>;
  isPublic: boolean;
  mergedAt?: string;
  createdAt: string;
}

function dbRowToPortfolioEntry(row: Record<string, unknown>): PortfolioEntryDB {
  return {
    id: row.id as string,
    repo: row.repo as string,
    prUrl: (row.pr_url as string) || undefined,
    title: row.title as string,
    description: (row.description as string) || "",
    tags: (row.tags as string[]) || [],
    status: (row.status as PortfolioEntryDB["status"]) || "discovered",
    proof: (row.proof as Record<string, unknown>) || undefined,
    isPublic: (row.is_public as boolean) || false,
    mergedAt: (row.merged_at as string) || undefined,
    createdAt: row.created_at as string,
  };
}

export async function getPortfolioByUser(userId: string): Promise<PortfolioEntryDB[]> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("portfolio_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Get portfolio failed: ${error.message}`);
  return (data || []).map(dbRowToPortfolioEntry);
}

export async function createPortfolioEntry(userId: string, entry: Partial<PortfolioEntryDB>): Promise<PortfolioEntryDB> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("portfolio_entries")
    .insert({
      user_id: userId,
      repo: entry.repo,
      pr_url: entry.prUrl || null,
      title: entry.title,
      description: entry.description || null,
      tags: entry.tags || [],
      status: entry.status || "discovered",
      proof: entry.proof || {},
      is_public: entry.isPublic || false,
      merged_at: entry.mergedAt || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Create portfolio entry failed: ${error.message}`);
  return dbRowToPortfolioEntry(data as Record<string, unknown>);
}

export async function updatePortfolioEntry(userId: string, id: string, updates: Partial<PortfolioEntryDB>): Promise<PortfolioEntryDB> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("portfolio_entries")
    .update({
      ...(updates.prUrl !== undefined && { pr_url: updates.prUrl }),
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.tags !== undefined && { tags: updates.tags }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.proof !== undefined && { proof: updates.proof }),
      ...(updates.isPublic !== undefined && { is_public: updates.isPublic }),
      ...(updates.mergedAt !== undefined && { merged_at: updates.mergedAt }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId) // safety: ensure ownership
    .select()
    .single();

  if (error) throw new Error(`Update portfolio entry failed: ${error.message}`);
  return dbRowToPortfolioEntry(data as Record<string, unknown>);
}

export async function deletePortfolioEntry(userId: string, id: string): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = await db
    .from("portfolio_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", userId); // safety: ensure ownership

  if (error) throw new Error(`Delete portfolio entry failed: ${error.message}`);
}
