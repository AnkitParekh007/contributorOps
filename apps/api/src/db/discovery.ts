import { getSupabaseAdmin } from "./client.js";

/** DB-oriented issue candidate (Supabase schema). */
export interface IssueCandidateDB {
  id: string;
  repo: string;
  number: number;
  title: string;
  htmlUrl: string;
  score?: number;
  labels: string[];
}

export async function saveDiscoveredIssues(userId: string, issues: IssueCandidateDB[]): Promise<void> {
  if (!issues.length) return;
  const db = getSupabaseAdmin();

  const rows = issues.map((issue) => ({
    user_id: userId,
    github_repo: issue.repo,
    github_issue_number: issue.number,
    title: issue.title,
    url: issue.htmlUrl,
    score: issue.score ?? null,
    labels: issue.labels || [],
  }));

  // Upsert — if same user+repo+issue already exists, update the score
  const { error } = await db
    .from("discovered_issues")
    .upsert(rows, { onConflict: "user_id,github_repo,github_issue_number" });

  if (error) throw new Error(`Save discovered issues failed: ${error.message}`);
}

export async function getDiscoveredIssues(userId: string, limit = 50): Promise<IssueCandidateDB[]> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("discovered_issues")
    .select("*")
    .eq("user_id", userId)
    .order("discovered_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Get discovered issues failed: ${error.message}`);

  return (data || []).map((row) => ({
    id: row.id as string,
    repo: row.github_repo as string,
    number: row.github_issue_number as number,
    title: row.title as string,
    htmlUrl: row.url as string,
    score: row.score as number | undefined,
    labels: (row.labels as string[]) || [],
  }));
}
