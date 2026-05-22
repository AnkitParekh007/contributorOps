import { getSupabaseAdmin } from "./client.js";

export interface SubscriptionDB {
  id: string;
  user_id: string;
  plan: "free" | "pro" | "career" | "team" | "founder";
  status: "active" | "cancelled" | "past_due" | "trialing";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export async function getSubscription(userId: string): Promise<SubscriptionDB | null> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(`Get subscription failed: ${error.message}`);
  return data as SubscriptionDB;
}

export async function updateSubscription(userId: string, updates: Partial<SubscriptionDB>): Promise<SubscriptionDB> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("subscriptions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(`Update subscription failed: ${error.message}`);
  return data as SubscriptionDB;
}

export async function recordBillingEvent(params: {
  userId?: string;
  stripeEventId?: string;
  eventType: string;
  payload: Record<string, unknown>;
}): Promise<void> {
  const db = getSupabaseAdmin();
  await db.from("billing_events").insert({
    user_id: params.userId || null,
    stripe_event_id: params.stripeEventId || null,
    event_type: params.eventType,
    payload: params.payload,
    processed_at: new Date().toISOString(),
  });
}
