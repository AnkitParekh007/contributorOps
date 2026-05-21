import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import type {
  BillingState,
  ContributionRun,
  ControlModeState,
  DailyPlan,
  PortfolioEntry,
  PullRequestActivity,
  UsageSnapshot
} from "./types.js";

async function ensureFile<T>(filePath: string, fallback: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureFile(filePath, fallback);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJsonFile<T>(filePath: string, value: T): Promise<T> {
  await ensureFile(filePath, value);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
  return value;
}

export async function readPortfolio(): Promise<PortfolioEntry[]> {
  return readJsonFile(config.portfolioPath, []);
}

export async function writePortfolio(entries: PortfolioEntry[]): Promise<PortfolioEntry[]> {
  return writeJsonFile(config.portfolioPath, entries);
}

export async function readDailyPlan(): Promise<DailyPlan> {
  return readJsonFile(config.dailyPlanPath, {
    generatedAt: "",
    mission: "Run ContributorOps to generate your first mission.",
    markdown: "",
    topOpportunities: []
  });
}

export async function writeDailyPlan(plan: DailyPlan): Promise<DailyPlan> {
  return writeJsonFile(config.dailyPlanPath, plan);
}

export async function readControlMode(): Promise<ControlModeState> {
  return readJsonFile(config.controlModePath, {
    safetyLevel: "research",
    approvalRequired: true,
    approvalGrantedAt: null,
    approvalReason: "",
    lastUpdatedAt: new Date(0).toISOString()
  });
}

export async function writeControlMode(state: ControlModeState): Promise<ControlModeState> {
  return writeJsonFile(config.controlModePath, state);
}

export async function readPullRequestActivity(): Promise<PullRequestActivity[]> {
  return readJsonFile(config.prActivityPath, []);
}

export async function writePullRequestActivity(
  activity: PullRequestActivity[]
): Promise<PullRequestActivity[]> {
  return writeJsonFile(config.prActivityPath, activity);
}

export async function readContributionRuns(): Promise<ContributionRun[]> {
  return readJsonFile(config.contributionRunsPath, []);
}

export async function writeContributionRuns(runs: ContributionRun[]): Promise<ContributionRun[]> {
  return writeJsonFile(config.contributionRunsPath, runs);
}

export async function readBillingState(): Promise<BillingState> {
  return readJsonFile(config.billingPath, {
    plan: "free",
    status: "trialing",
    provider: "mock",
    customerName: "Ankit Parekh",
    customerEmail: "ankit@example.com",
    renewalAt: null,
    seatCount: 1,
    publicPortfolioSlug: "ankit-proof-of-work",
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
  return writeJsonFile(config.billingPath, state);
}

export async function readUsageSnapshot(): Promise<UsageSnapshot> {
  return readJsonFile(config.usagePath, {
    weekKey: "",
    generatedPlans: 0,
    recruiterShares: 0,
    resumeExports: 0,
    publicPortfolioViews: 0
  });
}

export async function writeUsageSnapshot(usage: UsageSnapshot): Promise<UsageSnapshot> {
  return writeJsonFile(config.usagePath, usage);
}
