import { getSupabaseAdmin } from "./client.js";

export interface ApprovalRequestDB {
  id: string;
  user_id: string;
  action_type: string;
  target_repo: string;
  target_ref: string | null;
  payload: Record<string, unknown>;
  status: "pending" | "approved" | "rejected" | "executed";
  idempotency_key: string | null;
  approved_at: string | null;
  executed_at: string | null;
  created_at: string;
}

export async function createApprovalRequest(params: {
  userId: string;
  actionType: string;
  targetRepo: string;
  targetRef?: string;
  payload: Record<string, unknown>;
  idempotencyKey?: string;
}): Promise<ApprovalRequestDB> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("approval_requests")
    .insert({
      user_id: params.userId,
      action_type: params.actionType,
      target_repo: params.targetRepo,
      target_ref: params.targetRef || null,
      payload: params.payload,
      status: "pending",
      idempotency_key: params.idempotencyKey || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Create approval request failed: ${error.message}`);
  return data as ApprovalRequestDB;
}

export async function approveRequest(userId: string, requestId: string): Promise<ApprovalRequestDB> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("approval_requests")
    .update({ status: "approved", approved_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("user_id", userId)
    .eq("status", "pending")
    .select()
    .single();

  if (error) throw new Error(`Approve request failed: ${error.message}`);
  return data as ApprovalRequestDB;
}

export async function markApprovalExecuted(requestId: string, result?: Record<string, unknown>): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = await db
    .from("approval_requests")
    .update({
      status: "executed",
      executed_at: new Date().toISOString(),
      ...(result && { payload: result }),
    })
    .eq("id", requestId)
    .eq("status", "approved"); // safety: only approved requests can be executed

  if (error) throw new Error(`Mark approval executed failed: ${error.message}`);
}

export async function getPendingApprovals(userId: string): Promise<ApprovalRequestDB[]> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("approval_requests")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Get pending approvals failed: ${error.message}`);
  return (data || []) as ApprovalRequestDB[];
}
