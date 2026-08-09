export type Difficulty = "starter" | "steady" | "stretch";
export type ContributionSafetyLevel = "research" | "draft" | "approved-pr";
export type ContributionExecutionMode = "research" | "draft" | "approved-auto-contribute";
export type ContributionApprovalAction = "approve-comment" | "approve-branch" | "approve-draft-pr";
export type BillingPlan = "free" | "pro" | "career" | "team";
export type BillingStatus = "active" | "trialing" | "past_due" | "cancelled";
export type TargetRole =
  | "API Developer"
  | "Backend Engineer"
  | "Angular Developer"
  | "Platform Engineer"
  | "Developer Advocate";
export type FeatureKey =
  | "basic-discovery"
  | "daily-plans"
  | "portfolio-tracker"
  | "public-portfolio"
  | "github-resume-export"
  | "linkedin-generator"
  | "interview-star-generator"
  | "recruiter-share-link"
  | "maintainer-trust-score"
  | "pr-quality-checker"
  | "team-dashboard"
  | "shared-repo-radar"
  | "approved-auto-contribute"
  | "premium-public-theme"
  | "github-profile-audit"
  | "export-center";
export type ContributionRunStatus =
  | "prepared"
  | "comment approved"
  | "branch approved"
  | "draft pr approved"
  | "completed"
  | "cancelled"
  | "dry-run"
  | "blocked"
  | "error";

export type PortfolioStatus =
  | "discovered"
  | "planned"
  | "in progress"
  | "PR opened"
  | "merged"
  | "rejected";

export interface DiscoveryFilters {
  topics: string[];
  languages: string[];
  labels: string[];
  targetRole?: TargetRole;
}

export interface JobModeDrafts {
  resumeBullet: string;
  linkedInPost: string;
  linkedInShort: string;
  linkedInMedium: string;
  linkedInDetailed: string;
  interviewStarStory: string;
  interviewSituation: string;
  interviewTask: string;
  interviewAction: string;
  interviewResult: string;
  recruiterOutreach: string;
  githubProfileSnippet: string;
}

export interface SuggestedFileChange {
  path: string;
  content: string;
  rationale: string;
}

export interface SafetyCheckResult {
  key: string;
  passed: boolean;
  detail: string;
  severity: "info" | "warning" | "error";
}

export interface MaintainerTrustReport {
  score: number;
  band: "guarded" | "promising" | "trusted";
  reasons: string[];
}

export interface QualityCheck {
  label: string;
  passed: boolean;
  detail: string;
}

export interface PrQualityReport {
  score: number;
  verdict: "needs-review" | "solid" | "strong";
  riskLevel: "low" | "medium" | "high";
  checks: QualityCheck[];
  suggestions: string[];
}

export interface RoleMatchReport {
  targetRole: TargetRole;
  score: number;
  reasons: string[];
}

export interface GithubProfileAudit {
  username: string;
  score: number;
  strengths: string[];
  checklist: string[];
  readmeSuggestions: string[];
}

export interface IssueCandidate {
  id: string;
  repoName: string;
  repoFullName: string;
  repoUrl: string;
  repoDescription: string;
  issueTitle: string;
  issueNumber: number;
  issueUrl: string;
  labels: string[];
  score: number;
  difficulty: Difficulty;
  reasonForRecommendation: string;
  scoreExplanation: string[];
  summary: string;
  contributionPlan: string[];
  likelyFiles: string[];
  testingStrategy: string[];
  maintainerQuestionDraft: string;
  prDescriptionDraft: string;
  resumeBulletDraft: string;
  jobMode: JobModeDrafts;
  maintainerTrust: MaintainerTrustReport;
  roleMatch: RoleMatchReport;
  updatedAt: string;
  comments: number;
}

export interface DailyPlanOpportunity {
  repo: string;
  issue: string;
  score: number;
  labels: string[];
  whyUseful: string;
  firstAction: string;
  contributionPlan: string[];
  testPlan: string[];
  prDraft: string;
  resumeBullet: string;
  issueUrl: string;
}

export interface DailyPlan {
  generatedAt: string;
  mission: string;
  markdown: string;
  topOpportunities: DailyPlanOpportunity[];
}

export interface ControlModeState {
  safetyLevel: ContributionSafetyLevel;
  approvalRequired: boolean;
  approvalGrantedAt: string | null;
  approvalReason: string;
  lastUpdatedAt: string;
}

export interface PortfolioEntry extends JobModeDrafts {
  id: string;
  selectedRepo: string;
  issueUrl: string;
  prUrl: string;
  status: PortfolioStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DraftProposal extends JobModeDrafts {
  proposalId: string;
  issueId: string;
  upstreamRepoFullName: string;
  upstreamIssueUrl: string;
  branchName: string;
  commitMessage: string;
  prTitle: string;
  prBody: string;
  testEvidence: string;
  suggestedChanges: SuggestedFileChange[];
  generatedAt: string;
  mode: "draft";
  prQuality: PrQualityReport;
}

export interface ContributionRunApprovalEvent {
  action: "prepare" | ContributionApprovalAction | "cancel";
  approved: boolean;
  actor: string;
  reason: string;
  createdAt: string;
}

export interface ContributionRun {
  id: string;
  createdAt: string;
  mode: ContributionExecutionMode;
  targetRepo: string;
  issueNumber: number;
  issueUrl: string;
  status: ContributionRunStatus;
  plannedFiles: string[];
  generatedDiffSummary: string;
  commentDraft: string;
  prTitle: string;
  prBody: string;
  branchName: string;
  forkRepo: string;
  prUrl: string;
  safetyChecks: SafetyCheckResult[];
  approvalEvents: ContributionRunApprovalEvent[];
  errors: string[];
  approvalTokens?: Record<ContributionApprovalAction, string>;
  userApprovalToken?: string;
  riskScore: number;
  dryRun: boolean;
  proposal: DraftProposal;
  issue: IssueCandidate;
  testPlan: string[];
  commentUrl?: string;
  prQuality: PrQualityReport;
}

export interface PricingTier {
  plan: BillingPlan;
  name: string;
  priceLabel: string;
  monthlyPrice: number;
  tagline: string;
  features: string[];
  limits: {
    weeklyPlans: number | null;
    dailyPlans: boolean;
    sharedSeats: number;
  };
}

export interface BillingState {
  plan: BillingPlan;
  status: BillingStatus;
  provider: "mock" | "stripe" | "lemonsqueezy";
  customerName: string;
  customerEmail: string;
  renewalAt: string | null;
  seatCount: number;
  publicPortfolioSlug: string;
  publicPortfolioEnabled: boolean;
  premiumThemeEnabled: boolean;
  profileHeadline: string;
  profileSummary: string;
  featureOverrides: Partial<Record<FeatureKey, boolean>>;
  lastUpdatedAt: string;
}

export interface UsageSnapshot {
  weekKey: string;
  generatedPlans: number;
  recruiterShares: number;
  resumeExports: number;
  publicPortfolioViews: number;
}

export interface FeatureFlags {
  plan: BillingPlan;
  features: Record<FeatureKey, boolean>;
  weeklyPlanLimit: number | null;
}

export interface PublicPortfolioEntry {
  selectedRepo: string;
  issueUrl: string;
  prUrl: string;
  status: PortfolioStatus;
  notes: string;
  resumeBullet: string;
  linkedInPost: string;
  interviewStarStory: string;
  recruiterOutreach: string;
  githubProfileSnippet: string;
  updatedAt: string;
}

export interface PublicPortfolioProfile {
  slug: string;
  username: string;
  owner: string;
  headline: string;
  summary: string;
  recruiterShareUrl: string;
  githubResumeMarkdown: string;
  entries: PublicPortfolioEntry[];
  premiumThemeEnabled: boolean;
}

export interface TeamRadarItem {
  repoFullName: string;
  openOpportunities: number;
  averageScore: number;
  topLabels: string[];
  whyNow: string;
}

export interface ExportBundle {
  resumeMarkdown: string;
  resumeBullets: string;
  linkedInPosts: string;
  portfolioMarkdown: string;
  recruiterPitch: string;
  githubReadmeSnippet: string;
}

export interface DiscoverResponse {
  mode: "demo" | "github";
  issues: IssueCandidate[];
  dailyPlan: DailyPlan;
}

export interface HealthResponse {
  ok: boolean;
  mode: "demo" | "github";
  createDailyIssue: boolean;
  autoContributeEnabled: boolean;
  controlMode: ControlModeState;
  billing: BillingState;
  usage: UsageSnapshot;
  entitlements: FeatureFlags;
}
