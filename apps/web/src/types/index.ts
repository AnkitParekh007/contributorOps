export type Difficulty = "starter" | "steady" | "stretch";
export type ContributionSafetyLevel = "research" | "draft" | "approved-pr";

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
}

export interface JobModeDrafts {
  resumeBullet: string;
  linkedInPost: string;
  interviewStarStory: string;
  recruiterOutreach: string;
  githubProfileSnippet: string;
}

export interface SuggestedFileChange {
  path: string;
  content: string;
  rationale: string;
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

export interface PortfolioEntry {
  id: string;
  selectedRepo: string;
  issueUrl: string;
  prUrl: string;
  status: PortfolioStatus;
  notes: string;
  interviewStarStory: string;
  resumeBullet: string;
  linkedInPost: string;
  recruiterOutreach: string;
  githubProfileSnippet: string;
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
  controlMode: ControlModeState;
}
