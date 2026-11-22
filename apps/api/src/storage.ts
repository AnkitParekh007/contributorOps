import { getStorageRepository } from "./storage/repository.js";
import { config } from "./config.js";
import { requireRequestUserId } from "./auth/request-context.js";
import { getPortfolioByUser, type PortfolioEntryDB } from "./db/portfolio.js";
import type { BillingState, ContributionRun, ControlModeState, DailyPlan, PortfolioEntry, PullRequestActivity, UsageSnapshot } from "./types.js";

/** Convert the canonical hosted portfolio rows to export/story-generation input. */
export function toExportPortfolioEntry(entry: PortfolioEntryDB): PortfolioEntry {
  const proof = entry.proof || {};
  const field = (name: string) => typeof proof[name] === "string" ? proof[name] as string : "";
  return {
    id: entry.id,
    selectedRepo: entry.repo,
    // New rows store issueUrl in proof. Legacy rows used the title column.
    issueUrl: typeof proof.issueUrl === "string"
      ? proof.issueUrl
      : entry.title.startsWith("https://") ? entry.title : "",
    prUrl: entry.prUrl || "",
    status: entry.status,
    notes: entry.description,
    resumeBullet: field("resumeBullet"),
    interviewStarStory: field("interviewStarStory"),
    interviewSituation: field("interviewSituation"),
    interviewTask: field("interviewTask"),
    interviewAction: field("interviewAction"),
    interviewResult: field("interviewResult"),
    linkedInPost: field("linkedInPost"),
    linkedInShort: field("linkedInShort"),
    linkedInMedium: field("linkedInMedium"),
    linkedInDetailed: field("linkedInDetailed"),
    recruiterOutreach: field("recruiterOutreach"),
    githubProfileSnippet: field("githubProfileSnippet"),
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt || entry.createdAt,
  };
}

/** Map the public React editor contract to the canonical Supabase entry.
 * Partial writes merge existing proof fields instead of silently erasing them.
 * In hosted mode a portfolio's public flag is controlled separately by publication.
 */
const PROOF_FIELDS = [
  "issueUrl", "resumeBullet", "interviewStarStory", "interviewSituation",
  "interviewTask", "interviewAction", "interviewResult", "linkedInPost",
  "linkedInShort", "linkedInMedium", "linkedInDetailed", "recruiterOutreach",
  "githubProfileSnippet",
] as const;

export function toHostedPortfolioWrite(
  payload: Partial<PortfolioEntry>,
  existing?: PortfolioEntryDB
): Partial<PortfolioEntryDB> {
  const proof: Record<string, unknown> = { ...(existing?.proof || {}) };
  for (const key of PROOF_FIELDS) {
    const value = payload[key];
    if (value !== undefined) proof[key] = value;
  }
  const repo = payload.selectedRepo ?? existing?.repo ?? "";
  const issueUrl = payload.issueUrl ??
    (typeof proof.issueUrl === "string" ? proof.issueUrl : undefined);
  // The initial schema has no issue_url column: retain legacy title mapping
  // for compatibility, while the proof object preserves explicit clearing.
  const title = issueUrl || existing?.title || repo;
  return {
    ...(payload.selectedRepo !== undefined && { repo }),
    ...(payload.issueUrl !== undefined && { title }),
    ...(payload.prUrl !== undefined && { prUrl: payload.prUrl }),
    ...(payload.status !== undefined && { status: payload.status }),
    ...(payload.notes !== undefined && { description: payload.notes }),
    ...(existing === undefined && { repo, title, status: payload.status || "discovered" }),
    proof,
  };
}

export async function readPortfolio(): Promise<PortfolioEntry[]> {
  if (config.storageMode === "supabase") {
    return (await getPortfolioByUser(requireRequestUserId())).map(toExportPortfolioEntry);
  }
  return getStorageRepository().read("portfolio", []);
}

export async function writePortfolio(entries: PortfolioEntry[]): Promise<PortfolioEntry[]> {
  if (config.storageMode === "supabase") {
    throw new Error("Hosted portfolio writes must use owner-scoped portfolio entry APIs.");
  }
  return getStorageRepository().write("portfolio", entries);
}

export async function readDailyPlan(): Promise<DailyPlan> {
  return getStorageRepository().read("dailyPlan", {
    generatedAt: "",
    mission: "Run ContributorOps to generate your first mission.",
    markdown: "",
    topOpportunities: []
  });
}

export async function writeDailyPlan(plan: DailyPlan): Promise<DailyPlan> {
  return getStorageRepository().write("dailyPlan", plan);
}

export async function readControlMode(): Promise<ControlModeState> {
  return getStorageRepository().read("controlMode", {
    safetyLevel: "research",
    approvalRequired: true,
    approvalGrantedAt: null,
    approvalReason: "",
    lastUpdatedAt: new Date(0).toISOString()
  });
}

export async function writeControlMode(state: ControlModeState): Promise<ControlModeState> {
  return getStorageRepository().write("controlMode", state);
}

export async function readPullRequestActivity(): Promise<PullRequestActivity[]> {
  return getStorageRepository().read("prActivity", []);
}

export async function writePullRequestActivity(
  activity: PullRequestActivity[]
): Promise<PullRequestActivity[]> {
  return getStorageRepository().write("prActivity", activity);
}

export async function readContributionRuns(): Promise<ContributionRun[]> {
  return getStorageRepository().read("contributionRuns", []);
}

export async function writeContributionRuns(runs: ContributionRun[]): Promise<ContributionRun[]> {
  return getStorageRepository().write("contributionRuns", runs);
}

export async function readBillingState(): Promise<BillingState> {
  return getStorageRepository().read("billing", {
    plan: "free",
    status: "trialing",
    provider: "mock",
    customerName: "",
    customerEmail: "",
    renewalAt: null,
    seatCount: 1,
    publicPortfolioSlug: "",
    publicPortfolioEnabled: false,
    premiumThemeEnabled: false,
    profileHeadline: "ContributorOps helps developers turn open-source contributions into job-ready proof of work.",
    profileSummary:
      "I use ContributorOps to source backend and developer-tooling issues, build credible contribution plans, and package the final work into recruiter-ready proof.",
    featureOverrides: {},
    lastUpdatedAt: new Date(0).toISOString()
  });
}

export async function writeBillingState(state: BillingState): Promise<BillingState> {
  return getStorageRepository().write("billing", state);
}

export async function readUsageSnapshot(): Promise<UsageSnapshot> {
  return getStorageRepository().read("usage", {
    weekKey: "",
    generatedPlans: 0,
    recruiterShares: 0,
    resumeExports: 0,
    publicPortfolioViews: 0
  });
}

export async function writeUsageSnapshot(usage: UsageSnapshot): Promise<UsageSnapshot> {
  return getStorageRepository().write("usage", usage);
}
