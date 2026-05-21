import type {
  ContributionExecutionMode,
  ContributionRun,
  ControlModeState,
  DailyPlan,
  DiscoverResponse,
  DiscoveryFilters,
  DraftProposal,
  HealthResponse,
  IssueCandidate,
  PortfolioEntry
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message || `Request failed for ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  health: () => request<HealthResponse>("/api/health"),
  discover: (filters: DiscoveryFilters) =>
    request<DiscoverResponse>("/api/discover", {
      method: "POST",
      body: JSON.stringify(filters)
    }),
  getControlMode: () => request<ControlModeState>("/api/control-mode"),
  updateControlMode: (payload: {
    safetyLevel: ControlModeState["safetyLevel"];
    approvalReason?: string;
    explicitApproval?: boolean;
  }) =>
    request<ControlModeState>("/api/control-mode", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getDailyPlan: () => request<DailyPlan>("/api/daily-plan"),
  getPortfolio: () => request<PortfolioEntry[]>("/api/portfolio"),
  createPortfolio: (entry: Partial<PortfolioEntry>) =>
    request<PortfolioEntry>("/api/portfolio", {
      method: "POST",
      body: JSON.stringify(entry)
    }),
  updatePortfolio: (id: string, entry: Partial<PortfolioEntry>) =>
    request<PortfolioEntry>(`/api/portfolio/${id}`, {
      method: "PATCH",
      body: JSON.stringify(entry)
    }),
  deletePortfolio: (id: string) =>
    request<void>(`/api/portfolio/${id}`, {
      method: "DELETE"
    }),
  createPlanningIssue: (title?: string, body?: string) =>
    request<{ created: boolean; message: string; issueUrl?: string }>("/api/create-planning-issue", {
      method: "POST",
      body: JSON.stringify({ title, body })
    }),
  createDraftProposal: (issue: IssueCandidate) =>
    request<DraftProposal>("/api/draft-proposal", {
      method: "POST",
      body: JSON.stringify({ issue })
    }),
  createApprovedPullRequest: (payload: {
    issue: IssueCandidate;
    proposal: DraftProposal;
    forkOwner: string;
    approvalReason: string;
    explicitApproval: boolean;
  }) =>
    request<{ draftPullRequestUrl: string; branchName: string }>("/api/approved-pr", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  prepareContributionRun: (payload: { mode: ContributionExecutionMode; issue: IssueCandidate }) =>
    request<ContributionRun>("/api/contribute/prepare", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  approveContributionComment: (payload: {
    runId: string;
    userApprovalToken: string;
    approvalReason: string;
    explicitApproval: boolean;
  }) =>
    request<ContributionRun>("/api/contribute/approve-comment", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  approveContributionBranch: (payload: {
    runId: string;
    userApprovalToken: string;
    approvalReason: string;
    explicitApproval: boolean;
    forkOwner: string;
  }) =>
    request<ContributionRun>("/api/contribute/approve-branch", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  approveContributionDraftPr: (payload: {
    runId: string;
    userApprovalToken: string;
    approvalReason: string;
    explicitApproval: boolean;
    forkOwner: string;
  }) =>
    request<ContributionRun>("/api/contribute/approve-draft-pr", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getContributionRuns: () => request<ContributionRun[]>("/api/contribute/runs"),
  getContributionRun: (id: string) => request<ContributionRun>(`/api/contribute/runs/${id}`),
  cancelContributionRun: (id: string, reason: string) =>
    request<ContributionRun>(`/api/contribute/runs/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason })
    })
};
