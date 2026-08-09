import fs from "node:fs/promises";
import path from "node:path";
import { Octokit } from "@octokit/rest";
import { config } from "./config.js";
import { prepareManagedContributionWorkspace } from "./github/fork-manager.js";
import { recordManagedWorkspace } from "./github/fork-registry.js";
import { executeExecutablePatchPlan } from "./github/patch-executor.js";
import { validateExecutablePatchPlan, type ExecutablePatchPlan } from "./github/executable-patch.js";
import { readPullRequestActivity, writePullRequestActivity } from "./storage.js";

export interface PatchQueueItem {
  id: string;
  upstreamRepoFullName: string;
  issueNumber: number;
  issueUrl: string;
  issueTitle: string;
  branchName: string;
  plan: ExecutablePatchPlan;
}

export interface PatchQueueResult {
  id: string;
  upstreamRepoFullName: string;
  issueNumber: number;
  status: "submitted" | "blocked" | "error";
  detail: string;
  pullRequestUrl?: string;
  commitSha?: string;
}

const POLICY_PATHS = ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "AGENTS.md", "CLAUDE.md"];
const queueDir = path.join(config.dataDir, "patch-queue");
const resultPath = path.join(config.dataDir, "patch-queue-results.json");

function statusOf(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) return undefined;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

function issueReferenceMatches(title: string | null | undefined, body: string | null | undefined, issue: PatchQueueItem): boolean {
  const text = `${title || ""}\n${body || ""}`.toLowerCase();
  return (
    text.includes(issue.issueUrl.toLowerCase()) ||
    text.includes(`/issues/${issue.issueNumber}`) ||
    new RegExp(`(^|[^0-9])#${issue.issueNumber}([^0-9]|$)`, "m").test(text)
  );
}

export function hasAiContributionProhibition(policyTexts: string[]): boolean {
  const joined = policyTexts.join("\n").toLowerCase();
  if (!joined.trim()) return false;
  const patterns = [
    /(?:do not|don't|must not|should not|prohibit(?:ed)?|forbid(?:den)?|not accept(?:ed)?|no)\s.{0,50}(?:ai|llm|chatgpt|copilot|generated code)/i,
    /(?:ai|llm|chatgpt|copilot)[ -]?(?:generated|assisted)?\s.{0,50}(?:not accepted|prohibited|forbidden|disallowed)/i,
    /(?:no|without)\s+(?:ai|llm|chatgpt|copilot)[ -]?(?:generated|assisted)?\s+(?:code|contributions|pull requests|prs)/i
  ];
  return patterns.some((pattern) => pattern.test(joined));
}

export function validatePatchQueueItem(value: unknown): PatchQueueItem {
  if (typeof value !== "object" || value === null) throw new Error("Patch queue item must be an object.");
  const item = value as Partial<PatchQueueItem>;
  if (!item.id?.trim()) throw new Error("Patch queue item id is required.");
  if (!item.upstreamRepoFullName?.includes("/")) throw new Error("Valid upstreamRepoFullName is required.");
  if (!Number.isInteger(item.issueNumber) || Number(item.issueNumber) <= 0) throw new Error("Valid issueNumber is required.");
  if (!item.issueUrl?.includes(`/issues/${item.issueNumber}`)) throw new Error("issueUrl must reference issueNumber.");
  if (!item.issueTitle?.trim()) throw new Error("issueTitle is required.");
  if (!item.branchName?.trim() || item.branchName.includes("..")) throw new Error("Safe branchName is required.");
  if (!item.plan) throw new Error("Executable patch plan is required.");
  validateExecutablePatchPlan(item.plan);
  return item as PatchQueueItem;
}

async function fetchPolicyTexts(octokit: Octokit, owner: string, repo: string): Promise<string[]> {
  const texts: string[] = [];
  for (const policyPath of POLICY_PATHS) {
    try {
      const response = await octokit.repos.getContent({ owner, repo, path: policyPath });
      const data = response.data;
      if (!Array.isArray(data) && data.type === "file" && "content" in data && data.content) {
        texts.push(Buffer.from(data.content, data.encoding === "base64" ? "base64" : "utf8").toString("utf8"));
      }
    } catch (error) {
      if (statusOf(error) !== 404) throw error;
    }
  }
  return texts;
}

async function assertLiveSafety(octokit: Octokit, item: PatchQueueItem): Promise<{ baseBranch: string }> {
  const [owner, repo] = item.upstreamRepoFullName.split("/");
  const [repoData, issueData, openPulls, policyTexts, activity] = await Promise.all([
    octokit.repos.get({ owner, repo }),
    octokit.issues.get({ owner, repo, issue_number: item.issueNumber }),
    octokit.pulls.list({ owner, repo, state: "open", per_page: 100 }),
    fetchPolicyTexts(octokit, owner, repo),
    readPullRequestActivity()
  ]);

  if (repoData.data.archived) throw new Error("Upstream repository is archived.");
  if (issueData.data.state !== "open") throw new Error("Target issue is no longer open.");
  if (hasAiContributionProhibition(policyTexts)) throw new Error("Repository policy appears to prohibit AI-assisted contributions.");

  const conflict = openPulls.data.find((pull) => issueReferenceMatches(pull.title, pull.body, item));
  if (conflict) throw new Error(`Open PR #${conflict.number} already references this issue.`);

  const today = new Date().toISOString().slice(0, 10);
  if (activity.some((entry) => entry.upstreamRepoFullName === item.upstreamRepoFullName && entry.createdAt.slice(0, 10) === today)) {
    throw new Error("ContributorOps already opened a PR for this upstream repository today.");
  }
  if (activity.filter((entry) => entry.createdAt.slice(0, 10) === today).length >= config.autoPrDailyLimit) {
    throw new Error(`ContributorOps reached the daily PR limit of ${config.autoPrDailyLimit}.`);
  }

  return { baseBranch: repoData.data.default_branch };
}

async function processItem(octokit: Octokit, item: PatchQueueItem): Promise<PatchQueueResult> {
  try {
    const safety = await assertLiveSafety(octokit, item);
    const workspace = await prepareManagedContributionWorkspace(
      octokit,
      {
        upstreamRepoFullName: item.upstreamRepoFullName,
        forkOwner: config.githubUsername,
        branchName: item.branchName
      },
      {
        pollIntervalMs: config.forkPollIntervalMs,
        readyTimeoutMs: config.forkReadyTimeoutMs
      }
    );
    await recordManagedWorkspace(workspace);

    const executed = await executeExecutablePatchPlan(octokit, {
      upstreamRepoFullName: item.upstreamRepoFullName,
      forkOwner: config.githubUsername,
      branchName: workspace.branchName,
      baseBranch: safety.baseBranch,
      plan: item.plan
    });

    const activity = await readPullRequestActivity();
    await writePullRequestActivity([
      {
        upstreamRepoFullName: item.upstreamRepoFullName,
        draftPullRequestUrl: executed.pullRequestUrl,
        createdAt: new Date().toISOString()
      },
      ...activity
    ]);

    return {
      id: item.id,
      upstreamRepoFullName: item.upstreamRepoFullName,
      issueNumber: item.issueNumber,
      status: "submitted",
      detail: `Submitted ${executed.changedFiles.length} changed file(s) as a draft PR.`,
      pullRequestUrl: executed.pullRequestUrl,
      commitSha: executed.commitSha
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown patch queue error.";
    const blocked = /archived|no longer open|policy|already references|already opened|daily PR limit|ambiguous patch|expected exactly one match/i.test(detail);
    return {
      id: item.id,
      upstreamRepoFullName: item.upstreamRepoFullName,
      issueNumber: item.issueNumber,
      status: blocked ? "blocked" : "error",
      detail
    };
  }
}

export async function runPatchQueue(): Promise<PatchQueueResult[]> {
  if (!config.autoContributeEnabled) throw new Error("AUTO_CONTRIBUTE_ENABLED=true is required for patch queue execution.");
  if (!config.githubToken || !config.githubUsername) throw new Error("GH_CONTRIBUTOROPS_TOKEN and GITHUB_USERNAME are required.");

  await fs.mkdir(queueDir, { recursive: true });
  const files = (await fs.readdir(queueDir)).filter((name) => name.endsWith(".json")).sort();
  const octokit = new Octokit({ auth: config.githubToken });
  const results: PatchQueueResult[] = [];

  for (const file of files) {
    try {
      const raw = JSON.parse(await fs.readFile(path.join(queueDir, file), "utf8"));
      const item = validatePatchQueueItem(raw);
      results.push(await processItem(octokit, item));
    } catch (error) {
      results.push({
        id: file,
        upstreamRepoFullName: "unknown",
        issueNumber: 0,
        status: "error",
        detail: error instanceof Error ? error.message : "Invalid queue item."
      });
    }
  }

  await fs.writeFile(resultPath, `${JSON.stringify(results, null, 2)}\n`, "utf8");
  return results;
}

if (process.argv[1]?.endsWith("patch-queue.ts")) {
  runPatchQueue()
    .then((results) => {
      console.log(JSON.stringify(results, null, 2));
      if (results.some((result) => result.status === "error")) process.exitCode = 1;
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
