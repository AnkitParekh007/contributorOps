import { getSupabaseAdmin } from "./client.js";

function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  d.setDate(diff);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function incrementUsageCounter(userId: string, metric: string): Promise<void> {
  const db = getSupabaseAdmin();
  const period = getWeekStart();

  // Read current count, then upsert incremented value
  // Not atomic, but acceptable for non-critical usage tracking
  const { data } = await db
    .from("usage_counters")
    .select("count")
    .eq("user_id", userId)
    .eq("metric", metric)
    .eq("period", period)
    .maybeSingle();

  const current = (data as { count: number } | null)?.count ?? 0;

  const { error } = await db
    .from("usage_counters")
    .upsert(
      { user_id: userId, metric, period, count: current + 1 },
      { onConflict: "user_id,metric,period" }
    );

  if (error) throw new Error(`Increment usage failed: ${error.message}`);
}

export async function getUsageForUser(userId: string): Promise<Record<string, number>> {
  const db = getSupabaseAdmin();
  const period = getWeekStart();

  const { data, error } = await db
    .from("usage_counters")
    .select("metric, count")
    .eq("user_id", userId)
    .eq("period", period);

  if (error) throw new Error(`Get usage failed: ${error.message}`);

  const result: Record<string, number> = {};
  for (const row of data || []) {
    result[row.metric as string] = row.count as number;
  }
  return result;
}
