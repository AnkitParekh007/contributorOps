import fs from "node:fs/promises";
import path from "node:path";
import { Octokit } from "@octokit/rest";
import { config } from "./config.js";
import { discoverIssues, fetchIssueSafetyContext } from "./github.js";
import { prepareManagedContributionWorkspace } from "./github/fork-manager.js";
import { recordManagedWorkspace } from "./github/fork-registry.js";
import { buildDraftProposal, buildIssueCandidate } from "./planner.js";
import type { DiscoveryFilters, IssueCandidate, RawIssueCandidate, SafetyCheckResult } from "./types.js";

export type HourlyRadarCategory = "ai" | "frontend";

export interface HourlyRadarState {
  date: string;
  repos: string[];
}

export interface HourlyRadarSelection {
  category: HourlyRadarCategory;
  issue: IssueCandidate;
  score: number;
  momentumScore: number;
  repositoryStars: number;
  repositoryForks: number;
  branchName: string;
  forkRepo: string;
  workspacePrepared: boolean;
  workspaceMessage: string;
}

export interface HourlyRadarResult {
  generatedAt: string;
  selections: HourlyRadarSelection[];
  rejected: Array<{ category: HourlyRadarCategory; repo: string; issueNumber: number; reason: string }>;
}

const AI_FILTERS: DiscoveryFilters = {
  topics: [
    "artificial-intelligence",
    "ai",
    "llm",
    "agents",
    "mcp",
    "generative-ai",
    "ai-sdk",
    "developer-tools"
  ],
  languages: ["typescript", "javascript"],
  labels: ["bug", "help wanted", "good first issue", "documentation", "performance", "testing"]
};

const FRONTEND_FILTERS: DiscoveryFilters = {
  topics: [
    "react",
    "nextjs",
    "angular",
    "vite",
    "frontend",
    "ui",
    "components",
    "design-system",
    "developer-tools"
  ],
  languages: ["typescript", "javascript"],
  labels: [
    "bug",
    "help wanted",
    "good first issue",
    "documentation",
    "accessibility",
    "performance",
    "testing"
  ]
};

const CONTRIBUTION_POLICY_PATHS = [
  "CONTRIBUTING.md",
  ".github/CONTRIBUTING.md",
  "AGENTS.md",
  "CLAUDE.md"
];

const statePath = path.join(config.dataDir, "hourly-radar-state.json");
const summaryPath = path.join(config.dataDir, "hourly-radar-summary.md");

function statusOf(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) return undefined;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

export function normalizeRadarState(value: Partial<HourlyRadarState> | null | undefined, today: string): HourlyRadarState {
  if (!value || value.date !== today || !Array.isArray(value.repos)) {
    return { date: today, repos: [] };
  }

  return {
    date: today,
    repos: [...new Set(value.repos.map((repo) => repo.trim()).filter(Boolean))]
  };
}

async function readRadarState(today: string): Promise<HourlyRadarState> {
  try {
    const raw = await fs.readFile(statePath, "utf8");
    return normalizeRadarState(JSON.parse(raw) as Partial<HourlyRadarState>, today);
  } catch {
    return { date: today, repos: [] };
  }
}

async function writeRadarState(state: HourlyRadarState): Promise<void> {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
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

export function isLowSignalIssue(issue: Pick<RawIssueCandidate, "issueTitle" | "issueBody" | "labels">): boolean {
  const title = issue.issueTitle.toLowerCase();
  const body = issue.issueBody.trim();
  const labels = issue.labels.join(" ").toLowerCase();

  if (/\b(?:typo|spelling|grammar)\b/.test(title) && body.length < 500) return true;
  if (/\b(?:promotion|marketing|showcase|star|stars|badge)\b/.test(title) && !/bug|accessibility|performance/.test(labels)) {
    return true;
  }

  const hasStrongLabel = /bug|help wanted|good first issue|accessibility|performance|test/.test(labels);
  return body.length < 120 && !hasStrongLabel;
}

async function fetchPolicyTexts(octokit: Octokit, owner: string, repo: string): Promise<string[]> {
  const texts: string[] = [];

  for (const filePath of CONTRIBUTION_POLICY_PATHS) {
    try {
      const response = await octokit.repos.getContent({ owner, repo, path: filePath });
      const data = response.data as { type?: string; content?: string; encoding?: string };
      if (data.type === "file" && data.content) {
        texts.push(Buffer.from(data.content, data.encoding === "base64" ? "base64" : "utf8").toString("utf8"));
      }
    } catch (error) {
      if (statusOf(error) !== 404) throw error;
    }
  }

  return texts;
}

function pullReferencesIssue(
  pull: { title?: string | null; body?: string | null },
  issue: Pick<RawIssueCandidate, "issueNumber" | "issueUrl">
): boolean {
  const text = `${pull.title || ""}\n${pull.body || ""}`.toLowerCase();
  const issueUrl = issue.issueUrl.toLowerCase();
  return (
    text.includes(issueUrl) ||
    new RegExp(`(^|[^0-9])#${issue.issueNumber}([^0-9]|$)`, "m").test(text) ||
    text.includes(`/issues/${issue.issueNumber}`)
  );
}

function blockingSafetyReason(checks: SafetyCheckResult[]): string | null {
  const failed = checks.find((check) => check.severity === "error" && !check.passed);
  return failed ? failed.detail : null;
}

function computeMomentumScore(stars: number, forks: number, pushedAt: string | null | undefined): number {
  const daysSincePush = pushedAt ? Math.max(0, (Date.now() - new Date(pushedAt).getTime()) / 86_400_000) : 365;
  const starPoints = stars >= 50_000 ? 12 : stars >= 10_000 ? 10 : stars >= 2_000 ? 8 : stars >= 500 ? 5 : 2;
  const forkPoints = forks >= 5_000 ? 5 : forks >= 1_000 ? 4 : forks >= 250 ? 3 : forks >= 50 ? 2 : 1;
  const activityPoints = daysSincePush <= 2 ? 8 : daysSincePush <= 7 ? 6 : daysSincePush <= 30 ? 3 : 0;
  return Math.min(25, starPoints + forkPoints + activityPoints);
}

async function evaluateCandidate(
  octokit: Octokit,
  raw: RawIssueCandidate,
  candidate: IssueCandidate,
  minimumScore: number
): Promise<
  | { accepted: true; score: number; momentumScore: number; stars: number; forks: number }
  | { accepted: false; reason: string }
> {
  if (isLowSignalIssue(raw)) {
    return { accepted: false, reason: "Low-signal or vanity issue." };
  }

  const [owner, repo] = raw.repoFullName.split("/");
  if (!owner || !repo) return { accepted: false, reason: "Invalid repository name." };

  const safety = await fetchIssueSafetyContext(raw, {
    safetyLevel: "research",
    approvalRequired: true,
    approvalGrantedAt: null,
    approvalReason: "Scheduled workspace preparation only.",
    lastUpdatedAt: new Date().toISOString()
  });
  const blocked = blockingSafetyReason(safety.safetyChecks);
  if (blocked) return { accepted: false, reason: blocked };

  const [repoResponse, openPulls, policyTexts] = await Promise.all([
    octokit.repos.get({ owner, repo }),
    octokit.pulls.list({ owner, repo, state: "open", per_page: 100 }),
    fetchPolicyTexts(octokit, owner, repo)
  ]);

  if (hasAiContributionProhibition(policyTexts)) {
    return { accepted: false, reason: "Repository policy appears to prohibit AI-assisted contributions." };
  }

  const conflict = openPulls.data.find((pull) => pullReferencesIssue(pull, raw));
  if (conflict) {
    return { accepted: false, reason: `Open PR #${conflict.number} already references this issue.` };
  }

  const momentumScore = computeMomentumScore(
    repoResponse.data.stargazers_count,
    repoResponse.data.forks_count,
    repoResponse.data.pushed_at
  );
  const score = Math.min(100, candidate.score + momentumScore);
  if (score < minimumScore) {
    return { accepted: false, reason: `Combined quality/momentum score ${score} is below ${minimumScore}.` };
  }

  return {
    accepted: true,
    score,
    momentumScore,
    stars: repoResponse.data.stargazers_count,
    forks: repoResponse.data.forks_count
  };
}

async function selectCandidate(
  octokit: Octokit,
  category: HourlyRadarCategory,
  filters: DiscoveryFilters,
  usedRepos: Set<string>,
  minimumScore: number,
  rejected: HourlyRadarResult["rejected"]
): Promise<{ raw: RawIssueCandidate; issue: IssueCandidate; score: number; momentumScore: number; stars: number; forks: number } | null> {
  const discovery = await discoverIssues(filters);
  const ranked = discovery.candidates
    .map((raw) => ({ raw, issue: buildIssueCandidate(raw) }))
    .sort((left, right) => right.issue.score - left.issue.score)
    .slice(0, 12);

  for (const entry of ranked) {
    if (usedRepos.has(entry.raw.repoFullName.toLowerCase())) {
      rejected.push({
        category,
        repo: entry.raw.repoFullName,
        issueNumber: entry.raw.issueNumber,
        reason: "Repository already selected today."
      });
      continue;
    }

    try {
      const evaluation = await evaluateCandidate(octokit, entry.raw, entry.issue, minimumScore);
      if (!evaluation.accepted) {
        rejected.push({
          category,
          repo: entry.raw.repoFullName,
          issueNumber: entry.raw.issueNumber,
          reason: evaluation.reason
        });
        continue;
      }

      return { raw: entry.raw, issue: entry.issue, ...evaluation };
    } catch (error) {
      rejected.push({
        category,
        repo: entry.raw.repoFullName,
        issueNumber: entry.raw.issueNumber,
        reason: error instanceof Error ? error.message : "Unknown candidate validation error."
      });
    }
  }

  return null;
}

async function prepareSelectionWorkspace(
  octokit: Octokit,
  category: HourlyRadarCategory,
  selected: NonNullable<Awaited<ReturnType<typeof selectCandidate>>>
): Promise<HourlyRadarSelection> {
  const proposal = buildDraftProposal(selected.issue);

  if (!config.autoWorkspaceEnabled) {
    return {
      category,
      issue: selected.issue,
      score: selected.score,
      momentumScore: selected.momentumScore,
      repositoryStars: selected.stars,
      repositoryForks: selected.forks,
      branchName: proposal.branchName,
      forkRepo: config.githubUsername ? `${config.githubUsername}/${selected.issue.repoName}` : "",
      workspacePrepared: false,
      workspaceMessage: "AUTO_WORKSPACE_ENABLED is false; contribution packet prepared without GitHub workspace writes."
    };
  }

  if (!config.githubToken || !config.githubUsername) {
    throw new Error("GH_CONTRIBUTOROPS_TOKEN/GITHUB_TOKEN and GITHUB_USERNAME are required for workspace provisioning.");
  }

  const workspace = await prepareManagedContributionWorkspace(
    octokit,
    {
      upstreamRepoFullName: selected.issue.repoFullName,
      forkOwner: config.githubUsername,
      branchName: proposal.branchName
    },
    {
      pollIntervalMs: config.forkPollIntervalMs,
      readyTimeoutMs: config.forkReadyTimeoutMs
    }
  );
  await recordManagedWorkspace(workspace);

  return {
    category,
    issue: selected.issue,
    score: selected.score,
    momentumScore: selected.momentumScore,
    repositoryStars: selected.stars,
    repositoryForks: selected.forks,
    branchName: workspace.branchName,
    forkRepo: workspace.forkRepoFullName,
    workspacePrepared: true,
    workspaceMessage: `${workspace.forkCreated ? "Created" : "Reused"} ${workspace.forkRepoFullName}; synced ${workspace.baseBranch}; ${workspace.branchCreated ? "created" : "reused"} ${workspace.branchName}.`
  };
}

function renderSelection(selection: HourlyRadarSelection): string[] {
  const issue = selection.issue;
  return [
    `## ${selection.category === "ai" ? "AI" : "Frontend"}: ${issue.repoFullName}#${issue.issueNumber}`,
    ``,
    `- Issue: ${issue.issueTitle}`,
    `- URL: ${issue.issueUrl}`,
    `- Score: ${selection.score}/100 (${selection.momentumScore} momentum points)`,
    `- Repository: ${selection.repositoryStars.toLocaleString()} stars / ${selection.repositoryForks.toLocaleString()} forks`,
    `- Fork: ${selection.forkRepo || "not prepared"}`,
    `- Branch: ${selection.branchName}`,
    `- Workspace: ${selection.workspaceMessage}`,
    `- Likely files: ${issue.likelyFiles.join(", ") || "investigate from issue reproduction"}`,
    ``,
    `### Implementation plan`,
    ...issue.contributionPlan.map((step) => `- ${step}`),
    ``,
    `### Test plan`,
    ...issue.testingStrategy.map((step) => `- ${step}`),
    ``,
    `### PR draft`,
    issue.prDescriptionDraft,
    ``
  ];
}

async function writeSummary(result: HourlyRadarResult): Promise<void> {
  const lines = [
    `# ContributorOps Hourly AI + Frontend OSS Radar`,
    ``,
    `Generated: ${result.generatedAt}`,
    ``,
    result.selections.length
      ? `Selected ${result.selections.length} strong contribution opportunit${result.selections.length === 1 ? "y" : "ies"}.`
      : `No candidate passed all quality and safety gates this hour.`,
    ``,
    ...result.selections.flatMap(renderSelection),
    `## Guardrails`,
    ``,
    `- No issue comments were posted.`,
    `- No upstream pull requests were opened.`,
    `- User-owned forks/branches are prepared only when AUTO_WORKSPACE_ENABLED=true.`,
    `- The same upstream repository is selected at most once per UTC day when radar state is restored between runs.`,
    ``
  ];

  await fs.mkdir(path.dirname(summaryPath), { recursive: true });
  await fs.writeFile(summaryPath, lines.join("\n"), "utf8");
}

export async function runHourlyRadar(): Promise<HourlyRadarResult> {
  if (!config.githubToken) {
    throw new Error("GH_CONTRIBUTOROPS_TOKEN or GITHUB_TOKEN is required for the hourly OSS radar.");
  }

  const octokit = new Octokit({ auth: config.githubToken });
  const generatedAt = new Date().toISOString();
  const today = generatedAt.slice(0, 10);
  const state = await readRadarState(today);
  const usedRepos = new Set(state.repos.map((repo) => repo.toLowerCase()));
  const rejected: HourlyRadarResult["rejected"] = [];
  const selections: HourlyRadarSelection[] = [];
  const minimumScore = Number(process.env.HOURLY_RADAR_MIN_SCORE || 70);

  const categories: Array<[HourlyRadarCategory, DiscoveryFilters]> = [
    ["ai", AI_FILTERS],
    ["frontend", FRONTEND_FILTERS]
  ];

  for (const [category, filters] of categories) {
    const selected = await selectCandidate(octokit, category, filters, usedRepos, minimumScore, rejected);
    if (!selected) continue;

    const selection = await prepareSelectionWorkspace(octokit, category, selected);
    selections.push(selection);
    usedRepos.add(selected.issue.repoFullName.toLowerCase());
    state.repos.push(selected.issue.repoFullName);
  }

  state.repos = [...new Set(state.repos)];
  await writeRadarState(state);

  const result: HourlyRadarResult = { generatedAt, selections, rejected };
  await writeSummary(result);
  return result;
}

if (process.argv[1]?.endsWith("hourly.ts")) {
  runHourlyRadar()
    .then((result) => {
      console.log(
        JSON.stringify(
          {
            generatedAt: result.generatedAt,
            selected: result.selections.map((selection) => ({
              category: selection.category,
              repo: selection.issue.repoFullName,
              issue: selection.issue.issueNumber,
              fork: selection.forkRepo,
              branch: selection.branchName,
              workspacePrepared: selection.workspacePrepared
            })),
            rejectedCount: result.rejected.length
          },
          null,
          2
        )
      );
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
