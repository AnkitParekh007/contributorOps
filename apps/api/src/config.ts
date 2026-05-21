import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");

export const config = {
  port: Number(process.env.PORT || 8787),
  githubToken: process.env.GITHUB_TOKEN || process.env.GH_CONTRIBUTOROPS_TOKEN || "",
  githubUsername: process.env.GITHUB_USERNAME || "",
  createDailyIssue: process.env.CREATE_DAILY_ISSUE === "true",
  autoContributeEnabled: process.env.AUTO_CONTRIBUTE_ENABLED === "true",
  autoPrDailyLimit: Number(process.env.AUTO_PR_DAILY_LIMIT || 3),
  autoCommentDailyLimit: Number(process.env.AUTO_COMMENT_DAILY_LIMIT || 5),
  owner: process.env.CONTRIBUTOROPS_OWNER || "AnkitParekh007",
  repo: process.env.CONTRIBUTOROPS_REPO || "contributorOps",
  publicAppUrl: process.env.PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 8787}`,
  repoRoot,
  dataDir: path.join(repoRoot, "data"),
  portfolioPath: path.join(repoRoot, "data", "portfolio.json"),
  dailyPlanPath: path.join(repoRoot, "data", "daily-plan.json"),
  controlModePath: path.join(repoRoot, "data", "control-mode.json"),
  prActivityPath: path.join(repoRoot, "data", "pr-activity.json"),
  contributionRunsPath: path.join(repoRoot, "data", "contribution-runs.json"),
  billingPath: path.join(repoRoot, "data", "billing.json"),
  usagePath: path.join(repoRoot, "data", "usage.json"),
  webDistPath: path.join(repoRoot, "apps", "web", "dist")
};

export const defaultFilters = {
  topics: ["openapi", "sdk", "api-client", "graphql", "rest-api", "developer-tools"],
  languages: ["typescript", "javascript", "node", "python"],
  labels: ["good first issue", "help wanted", "documentation", "bug"]
};
