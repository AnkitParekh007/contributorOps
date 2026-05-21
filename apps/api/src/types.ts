export type Difficulty = "starter" | "steady" | "stretch";

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

export interface RawIssueCandidate {
  id: number;
  repoFullName: string;
  repoName: string;
  repoUrl: string;
  repoDescription: string;
  repoTopics: string[];
  repoLanguage: string;
  issueNumber: number;
  issueTitle: string;
  issueUrl: string;
  issueBody: string;
  labels: string[];
  comments: number;
  updatedAt: string;
  createdAt: string;
  author: string;
}

export interface JobModeDrafts {
  resumeBullet: string;
  linkedInPost: string;
  interviewStarStory: string;
  recruiterOutreach: string;
  githubProfileSnippet: string;
}

export interface ContributionPlan {
  summary: string;
  contributionPlan: string[];
  likelyFiles: string[];
  testingStrategy: string[];
  maintainerQuestionDraft: string;
  prDescriptionDraft: string;
  resumeBulletDraft: string;
  jobMode: JobModeDrafts;
}

export interface IssueCandidate extends ContributionPlan {
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

export interface PortfolioEntry extends JobModeDrafts {
  id: string;
  selectedRepo: string;
  issueUrl: string;
  prUrl: string;
  status: PortfolioStatus;
  notes: string;
  interviewStarStory: string;
  resumeBullet: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanningIssueRequest {
  title?: string;
  body?: string;
}
