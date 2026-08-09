import type {
  BillingPlan,
  BillingState,
  ContributionExecutionMode,
  ContributionRun,
  ControlModeState,
  DailyPlan,
  DiscoverResponse,
  DiscoveryFilters,
  DraftProposal,
  ExportBundle,
  FeatureFlags,
  GithubProfileAudit,
  HealthResponse,
  IssueCandidate,
  PortfolioEntry,
  PricingTier,
  PrQualityReport,
  PublicPortfolioProfile,
  TeamRadarItem,
  UsageSnapshot
} from "../types";
import { supabase } from "../lib/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
    }
  } catch {
    // demo mode — no supabase configured
  }
  return headers;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...authHeaders,
      ...(init?.headers as Record<string, string> | undefined),
    },
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
  getPricing: () => request<PricingTier[]>("/api/pricing"),
  getBilling: () =>
    request<{ billing: BillingState; entitlements: FeatureFlags }>("/api/billing"),
  selectPlan: (plan: BillingPlan) =>
    request<{ billing: BillingState; entitlements: FeatureFlags }>("/api/billing/mock-select-plan", {
      method: "POST",
      body: JSON.stringify({ plan })
    }),
  updateBillingProfile: (payload: Partial<BillingState>) =>
    request<{ billing: BillingState; entitlements: FeatureFlags }>("/api/billing/profile", {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  getUsage: () => request<UsageSnapshot>("/api/usage"),
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
  prepareContributionRun: (payload: {
    mode: ContributionExecutionMode;
    issue: IssueCandidate;
    proposal?: DraftProposal;
  }) =>
    request<ContributionRun>("/api/contribute/prepare", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  approveContributionComment: (payload: {
    runId: string;
    approvalToken: string;
    approvalReason: string;
    explicitApproval: boolean;
  }) =>
    request<ContributionRun>("/api/contribute/approve-comment", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  approveContributionBranch: (payload: {
    runId: string;
    approvalToken: string;
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
    approvalToken: string;
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
    }),
  createPortfolioShare: () =>
    request<{ slug: string; recruiterShareUrl: string }>("/api/portfolio/share", {
      method: "POST"
    }),
  getPublicPortfolio: (slug: string) =>
    request<PublicPortfolioProfile>(`/api/public/portfolio/${slug}`),
  getPublicUserPortfolio: (username: string) =>
    request<PublicPortfolioProfile>(`/api/public/user/${username}`),
  exportGithubResume: () =>
    request<{ markdown: string; fileName: string }>("/api/export/github-resume"),
  getExportCenter: () => request<ExportBundle>("/api/export-center"),
  getPrQualityCheck: (issue: IssueCandidate) =>
    request<PrQualityReport>("/api/pr-quality-check", {
      method: "POST",
      body: JSON.stringify({ issue })
    }),
  getTeamRadar: () => request<TeamRadarItem[]>("/api/team/radar"),
  getGithubProfileAudit: (username: string) =>
    request<GithubProfileAudit>(`/api/github-profile-audit?username=${encodeURIComponent(username)}`),
  getGithubStatus: () =>
    request<{ connected: boolean; scopes: string[]; demo?: boolean }>("/api/github/status"),
  connectGithub: () =>
    request<void>("/api/github/connect"),
  disconnectGithub: () =>
    request<{ message: string }>("/api/github/disconnect", { method: "DELETE" }),
  getOnboardingStatus: () =>
    request<{ githubConnected: boolean; safetyModeSet: boolean; firstRunComplete: boolean }>("/api/onboarding/status"),
};
