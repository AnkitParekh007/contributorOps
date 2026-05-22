import { getSupabaseAdmin } from "./client.js";
import { isSupabaseMode } from "./client.js";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";

const AUDIT_LOG_PATH = path.join(config.dataDir, "audit-log.jsonl");

interface AuditEntry {
  id?: string;
  userId: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

/**
 * Write an audit log entry.
 * In supabase mode: writes to the audit_logs table.
 * In demo mode: appends to data/audit-log.jsonl.
 */
export async function writeAuditLog(entry: Omit<AuditEntry, "id" | "createdAt">): Promise<void> {
  const record: AuditEntry = {
    ...entry,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseMode()) {
    const db = getSupabaseAdmin();
    await db.from("audit_logs").insert({
      user_id: record.userId,
      action: record.action,
      resource_type: record.resourceType || null,
      resource_id: record.resourceId || null,
      metadata: record.metadata || null,
      ip_address: record.ipAddress || null,
      user_agent: record.userAgent || null,
    });
  } else {
    // Demo mode: append to JSONL file
    try {
      await fs.mkdir(path.dirname(AUDIT_LOG_PATH), { recursive: true });
      await fs.appendFile(AUDIT_LOG_PATH, JSON.stringify(record) + "\n", "utf8");
    } catch {
      // Non-fatal — audit log failure should not block the main action
    }
  }
}

export async function getAuditLogs(userId: string, limit = 50): Promise<AuditEntry[]> {
  if (isSupabaseMode()) {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Get audit logs failed: ${error.message}`);
    return (data || []).map((row) => ({
      id: row.id as string,
      userId: row.user_id as string,
      action: row.action as string,
      resourceType: row.resource_type as string | undefined,
      resourceId: row.resource_id as string | undefined,
      metadata: row.metadata as Record<string, unknown> | undefined,
      ipAddress: row.ip_address as string | undefined,
      userAgent: row.user_agent as string | undefined,
      createdAt: row.created_at as string,
    }));
  }

  // Demo mode: read from JSONL file
  try {
    const raw = await fs.readFile(AUDIT_LOG_PATH, "utf8");
    const lines = raw.trim().split("\n").filter(Boolean);
    return lines
      .map((l) => JSON.parse(l) as AuditEntry)
      .filter((e) => e.userId === userId)
      .reverse()
      .slice(0, limit);
  } catch {
    return [];
  }
}
