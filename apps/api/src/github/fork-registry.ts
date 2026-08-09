import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";
import type { ManagedContributionWorkspace } from "./fork-manager.js";

export type ManagedForkStatus = "active" | "dormant";

export interface ManagedForkRecord {
  upstreamRepoFullName: string;
  forkRepoFullName: string;
  forkOwner: string;
  repoName: string;
  defaultBranch: string;
  forkHtmlUrl: string;
  status: ManagedForkStatus;
  createdByContributorOps: boolean;
  activeBranchNames: string[];
  lastSyncedAt: string;
  lastUsedAt: string;
}

async function ensureRegistry(): Promise<void> {
  await fs.mkdir(path.dirname(config.managedForksPath), { recursive: true });
  try {
    await fs.access(config.managedForksPath);
  } catch {
    await fs.writeFile(config.managedForksPath, "[]\n", "utf8");
  }
}

export async function readManagedForks(): Promise<ManagedForkRecord[]> {
  await ensureRegistry();
  const raw = await fs.readFile(config.managedForksPath, "utf8");
  return JSON.parse(raw) as ManagedForkRecord[];
}

async function writeManagedForks(records: ManagedForkRecord[]): Promise<ManagedForkRecord[]> {
  await ensureRegistry();
  await fs.writeFile(config.managedForksPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  return records;
}

export async function recordManagedWorkspace(
  workspace: ManagedContributionWorkspace
): Promise<ManagedForkRecord> {
  const records = await readManagedForks();
  const now = new Date().toISOString();
  const existing = records.find(
    (record) =>
      record.upstreamRepoFullName.toLowerCase() === workspace.upstreamRepoFullName.toLowerCase()
  );

  const next: ManagedForkRecord = {
    upstreamRepoFullName: workspace.upstreamRepoFullName,
    forkRepoFullName: workspace.forkRepoFullName,
    forkOwner: workspace.forkOwner,
    repoName: workspace.repoName,
    defaultBranch: workspace.baseBranch,
    forkHtmlUrl: workspace.forkHtmlUrl,
    status: "active",
    createdByContributorOps: existing?.createdByContributorOps ?? workspace.forkCreated,
    activeBranchNames: [...new Set([...(existing?.activeBranchNames || []), workspace.branchName])],
    lastSyncedAt: workspace.lastSyncedAt,
    lastUsedAt: now
  };

  const updated = existing
    ? records.map((record) =>
        record.upstreamRepoFullName.toLowerCase() === workspace.upstreamRepoFullName.toLowerCase()
          ? next
          : record
      )
    : [next, ...records];

  await writeManagedForks(updated);
  return next;
}

export async function markManagedForkDormant(upstreamRepoFullName: string): Promise<ManagedForkRecord | null> {
  const records = await readManagedForks();
  const existing = records.find(
    (record) => record.upstreamRepoFullName.toLowerCase() === upstreamRepoFullName.toLowerCase()
  );

  if (!existing) {
    return null;
  }

  const next: ManagedForkRecord = {
    ...existing,
    status: "dormant",
    activeBranchNames: [],
    lastUsedAt: new Date().toISOString()
  };

  await writeManagedForks(
    records.map((record) =>
      record.upstreamRepoFullName.toLowerCase() === upstreamRepoFullName.toLowerCase()
        ? next
        : record
    )
  );

  return next;
}
