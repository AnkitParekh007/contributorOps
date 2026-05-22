import { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { OnboardingPage } from "./components/OnboardingPage";
import {
  AlertTriangle,
  BadgeDollarSign,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ExternalLink,
  GitBranchPlus,
  LayoutDashboard,
  Radar
} from "lucide-react";
import { apiClient } from "./api/client";
import { AutoContributePage } from "./components/AutoContributePage";
import { BrandLogo } from "./components/BrandLogo";
import { CandidateList } from "./components/CandidateList";
import { ControlModePanel } from "./components/ControlModePanel";
import { ContributionModePanel } from "./components/ContributionModePanel";
import { DeveloperSetupPage, type DeveloperSetupSection } from "./components/DeveloperSetupPage";
import { DiscoveryControls } from "./components/DiscoveryControls";
import { IssueDetailPanel } from "./components/IssueDetailPanel";
import { JobModePanel } from "./components/JobModePanel";
import { MissionCard } from "./components/MissionCard";
import { PortfolioTracker } from "./components/PortfolioTracker";
import { PricingPage } from "./components/PricingPage";
import { ProofOfWorkPage } from "./components/ProofOfWorkPage";
import { PublicPortfolioPage } from "./components/PublicPortfolioPage";
import { TeamRadarPage } from "./components/TeamRadarPage";
import { ThemeToggle } from "./components/ThemeToggle";
import type {
  BillingState,
  ControlModeState,
  ContributionExecutionMode,
  ContributionRun,
  DailyPlan,
  DiscoveryFilters,
  DraftProposal,
  ExportBundle,
  FeatureFlags,
  GithubProfileAudit,
  IssueCandidate,
  PortfolioEntry,
  PricingTier,
  PublicPortfolioProfile,
  TeamRadarItem,
  UsageSnapshot
} from "./types";

function DemoModeBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="demo-mode-banner" role="status">
      <span className="demo-badge">DEMO MODE</span>
      <span>No GitHub token detected — showing sample data. Add a <code>GITHUB_TOKEN</code> to your <code>.env</code> to connect your account.</span>
    </div>
  );
}

interface OnboardingState {
  hasToken: boolean;
  hasGeneratedPlan: boolean;
  hasSavedPortfolioEntry: boolean;
  hasExportedBullet: boolean;
}

function OnboardingChecklist({
  state,
  onDismiss
}: {
  state: OnboardingState;
  onDismiss: () => void;
}) {
  const steps = [
    { key: 'hasToken', label: 'Add GitHub token', detail: 'Set GITHUB_TOKEN in your .env file for live issue discovery' },
    { key: 'hasGeneratedPlan', label: 'Generate first daily plan', detail: 'Click "Generate Daily Plan" to discover job-matched issues' },
    { key: 'hasSavedPortfolioEntry', label: 'Save first portfolio entry', detail: 'Track an issue by clicking "Track This" on any issue card' },
    { key: 'hasExportedBullet', label: 'Export first resume bullet', detail: 'Go to Proof of Work → Export Center to get your first bullet' },
  ] as const;

  const completed = steps.filter((s) => state[s.key as keyof OnboardingState]).length;
  const total = steps.length;

  if (completed === total) return null;

  return (
    <div className="onboarding-checklist">
      <div className="onboarding-header">
        <div>
          <h3 className="onboarding-title">Get started</h3>
          <p className="onboarding-subtitle">{completed}/{total} steps complete</p>
        </div>
        <button className="icon-btn" onClick={onDismiss} aria-label="Dismiss checklist" title="Dismiss">✕</button>
      </div>
      <div className="onboarding-progress">
        <div className="onboarding-bar" style={{ width: `${(completed / total) * 100}%` }} />
      </div>
      <div className="onboarding-steps">
        {steps.map((step) => {
          const done = state[step.key as keyof OnboardingState];
          return (
            <div key={step.key} className={`onboarding-step ${done ? 'step-done' : ''}`}>
              <span className="step-check" aria-hidden="true">{done ? '✓' : '○'}</span>
              <div>
                <span className="step-label">{step.label}</span>
                {!done && <span className="step-detail">{step.detail}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const defaultFilters: DiscoveryFilters = {
  topics: ["openapi", "sdk", "api-client", "graphql", "rest-api", "developer-tools"],
  languages: ["typescript", "javascript", "node", "python"],
  labels: ["good first issue", "help wanted", "documentation", "bug"],
  targetRole: "Backend Engineer"
};

type AppPage = "dashboard" | "auto-contribute" | "proof-of-work" | "pricing" | "team-radar" | "developer-setup";

type ThemeMode = "light" | "dark";

function emptyBillingState(): BillingState {
  return {
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
    lastUpdatedAt: ""
  };
}

function emptyEntitlements(): FeatureFlags {
  return {
    plan: "free",
    weeklyPlanLimit: 3,
    features: {
      "basic-discovery": true,
      "daily-plans": false,
      "portfolio-tracker": false,
      "public-portfolio": false,
      "github-resume-export": false,
      "linkedin-generator": false,
      "interview-star-generator": false,
      "recruiter-share-link": false,
      "maintainer-trust-score": false,
      "pr-quality-checker": false,
      "team-dashboard": false,
      "shared-repo-radar": false,
      "approved-auto-contribute": false,
      "premium-public-theme": false,
      "github-profile-audit": false,
      "export-center": false
    }
  };
}

function emptyUsage(): UsageSnapshot {
  return {
    weekKey: "",
    generatedPlans: 0,
    recruiterShares: 0,
    resumeExports: 0,
    publicPortfolioViews: 0
  };
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isSupabaseEnabled, session, isLoading } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    if (!isSupabaseEnabled || !session) {
      setOnboardingDone(true);
      setOnboardingChecked(true);
      return;
    }
    // Check if onboarding is complete: if user has no portfolio entries they're new
    apiClient
      .getOnboardingStatus()
      .then((status) => {
        // Show onboarding if GitHub is not connected yet and safety mode is default
        const needsOnboarding = !status.githubConnected && !status.safetyModeSet;
        setOnboardingDone(!needsOnboarding);
      })
      .catch(() => {
        setOnboardingDone(true); // fail open
      })
      .finally(() => setOnboardingChecked(true));
  }, [isSupabaseEnabled, session]);

  if (isLoading || !onboardingChecked) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ color: "var(--muted, #888)", fontSize: "0.9rem" }}>Loading…</div>
      </div>
    );
  }

  if (isSupabaseEnabled && !session) {
    return <LoginPage />;
  }

  if (isSupabaseEnabled && !onboardingDone) {
    return <OnboardingPage onComplete={() => setOnboardingDone(true)} />;
  }

  return <>{children}</>;
}

function App() {
  const publicUsername = "AnkitParekh007";
  const usernameMatch =
    typeof window !== "undefined" ? window.location.pathname.match(/^\/u\/([^/]+)$/) : null;
  const usernameSlug = usernameMatch?.[1] || "";
  const initialPage =
    typeof window !== "undefined" && window.location.pathname === "/pricing" ? "pricing" : "dashboard";
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const savedTheme = window.localStorage.getItem("contributorops-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  const [activePage, setActivePage] = useState<AppPage>(initialPage);
  const [modeLabel, setModeLabel] = useState("demo mode");
  const [mode, setMode] = useState<string>("demo");
  const [checklistDismissed, setChecklistDismissed] = useState(false);
  const [autoContributeEnabled, setAutoContributeEnabled] = useState(false);
  const [filters, setFilters] = useState<DiscoveryFilters>(defaultFilters);
  const [controlMode, setControlMode] = useState<ControlModeState>({
    safetyLevel: "research",
    approvalRequired: true,
    approvalGrantedAt: null,
    approvalReason: "",
    lastUpdatedAt: ""
  });
  const [billing, setBilling] = useState<BillingState>(emptyBillingState());
  const [entitlements, setEntitlements] = useState<FeatureFlags>(emptyEntitlements());
  const [usage, setUsage] = useState<UsageSnapshot>(emptyUsage());
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [issues, setIssues] = useState<IssueCandidate[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [planningIssueMessage, setPlanningIssueMessage] = useState("");
  const [approvalReason, setApprovalReason] = useState("");
  const [draftProposal, setDraftProposal] = useState<DraftProposal | null>(null);
  const [contributionMode, setContributionMode] = useState<ContributionExecutionMode>("research");
  const [contributionRuns, setContributionRuns] = useState<ContributionRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [forkOwner, setForkOwner] = useState("");
  const [prResultMessage, setPrResultMessage] = useState("");
  const [githubResumeMarkdown, setGithubResumeMarkdown] = useState("");
  const [recruiterShareUrl, setRecruiterShareUrl] = useState("");
  const [exportBundle, setExportBundle] = useState<ExportBundle | null>(null);
  const [developerSetupSection, setDeveloperSetupSection] = useState<DeveloperSetupSection>("guide");
  const [profileAuditUsername, setProfileAuditUsername] = useState("AnkitParekh007");
  const [profileAudit, setProfileAudit] = useState<GithubProfileAudit | null>(null);
  const [teamRadar, setTeamRadar] = useState<TeamRadarItem[]>([]);
  const [publicProfile, setPublicProfile] = useState<PublicPortfolioProfile | null>(null);
  const [publicError, setPublicError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("contributorops-theme", theme);
  }, [theme]);

  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId) || null;
  const selectedPortfolioEntry =
    portfolio.find((entry) => entry.id === selectedPortfolioId) || portfolio[0] || null;
  const selectedRun = contributionRuns.find((run) => run.id === selectedRunId) || contributionRuns[0] || null;

  useEffect(() => {
    if (usernameSlug) {
      apiClient
        .getPublicUserPortfolio(usernameSlug)
        .then((profile) => setPublicProfile(profile))
        .catch((requestError) => {
          setPublicError(requestError instanceof Error ? requestError.message : "Failed to load public portfolio.");
        });
      return;
    }

    Promise.all([
      apiClient.health(),
      apiClient.getDailyPlan(),
      apiClient.getPortfolio(),
      apiClient.getContributionRuns().catch(() => []),
      apiClient.getPricing()
    ])
      .then(([health, plan, entries, runs, pricingResponse]) => {
        setModeLabel(health.mode === "github" ? "live GitHub mode" : "demo mode");
        setMode(health.mode);
        setAutoContributeEnabled(health.autoContributeEnabled);
        setControlMode(health.controlMode);
        setApprovalReason(health.controlMode.approvalReason);
        setDailyPlan(plan.generatedAt ? plan : null);
        setPortfolio(entries);
        setSelectedPortfolioId(entries[0]?.id ?? null);
        setContributionRuns(runs);
        setSelectedRunId(runs[0]?.id ?? null);
        setBilling(health.billing);
        setEntitlements(health.entitlements);
        setUsage(health.usage);
        setPricing(pricingResponse);
        if (health.billing.publicPortfolioEnabled) {
          setRecruiterShareUrl(`${window.location.origin}/u/${publicUsername}`);
        }
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Failed to load app.");
      });
  }, [usernameSlug]);

  useEffect(() => {
    if (activePage === "team-radar" && entitlements.features["team-dashboard"] && teamRadar.length === 0) {
      apiClient
        .getTeamRadar()
        .then(setTeamRadar)
        .catch((requestError) => {
          setError(requestError instanceof Error ? requestError.message : "Failed to load team radar.");
        });
    }
  }, [activePage, entitlements, teamRadar.length]);

  const refreshPortfolio = async () => {
    const entries = await apiClient.getPortfolio();
    setPortfolio(entries);
    setSelectedPortfolioId(entries[0]?.id ?? null);
  };

  const refreshContributionRuns = async () => {
    const runs = await apiClient.getContributionRuns();
    setContributionRuns(runs);
    setSelectedRunId(runs[0]?.id ?? null);
  };

  const refreshBillingState = async () => {
    const [billingResponse, usageResponse] = await Promise.all([apiClient.getBilling(), apiClient.getUsage()]);
    setBilling(billingResponse.billing);
    setEntitlements(billingResponse.entitlements);
    setUsage(usageResponse);
    if (billingResponse.billing.publicPortfolioEnabled) {
      setRecruiterShareUrl(`${window.location.origin}/u/${publicUsername}`);
    }
  };

  const generateDailyPlan = async () => {
    setError("");
    setIsLoading(true);
    try {
      const result = await apiClient.discover(filters);
      setModeLabel(result.mode === "github" ? "live GitHub mode" : "demo mode");
      setMode(result.mode);
      setIssues(result.issues);
      setSelectedIssueId(result.issues[0]?.id ?? null);
      setDailyPlan(result.dailyPlan);
      setPlanningIssueMessage("");
      setDraftProposal(null);
      setPrResultMessage("");
      await refreshBillingState();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to generate plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const changeControlMode = async (
    safetyLevel: ControlModeState["safetyLevel"],
    options?: { explicitApproval?: boolean; approvalReason?: string }
  ) => {
    setError("");
    setIsLoading(true);
    try {
      const updated = await apiClient.updateControlMode({
        safetyLevel,
        explicitApproval: options?.explicitApproval,
        approvalReason: options?.approvalReason ?? approvalReason
      });
      setControlMode(updated);
      setApprovalReason(updated.approvalReason);
      if (updated.safetyLevel === "research") {
        setDraftProposal(null);
      }
      if (updated.safetyLevel === "approved-pr") {
        setContributionMode("approved-auto-contribute");
      } else if (updated.safetyLevel === "draft") {
        setContributionMode("draft");
      } else {
        setContributionMode("research");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to update safety mode.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveIssueToPortfolio = async (issue: IssueCandidate) => {
    try {
      const entry = await apiClient.createPortfolio({
        selectedRepo: issue.repoFullName,
        issueUrl: issue.issueUrl,
        prUrl: "",
        status: "planned",
        notes: issue.reasonForRecommendation,
        interviewStarStory: issue.jobMode.interviewStarStory,
        interviewSituation: issue.jobMode.interviewSituation,
        interviewTask: issue.jobMode.interviewTask,
        interviewAction: issue.jobMode.interviewAction,
        interviewResult: issue.jobMode.interviewResult,
        resumeBullet: issue.jobMode.resumeBullet,
        linkedInPost: issue.jobMode.linkedInPost,
        linkedInShort: issue.jobMode.linkedInShort,
        linkedInMedium: issue.jobMode.linkedInMedium,
        linkedInDetailed: issue.jobMode.linkedInDetailed,
        recruiterOutreach: issue.jobMode.recruiterOutreach,
        githubProfileSnippet: issue.jobMode.githubProfileSnippet
      });
      setPortfolio((current) => [entry, ...current]);
      setSelectedPortfolioId(entry.id);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to save to portfolio.");
    }
  };

  const updatePortfolioEntry = (entry: PortfolioEntry) => {
    setPortfolio((current) => current.map((item) => (item.id === entry.id ? entry : item)));
  };

  const persistPortfolioEntry = async (entry: PortfolioEntry) => {
    const updated = await apiClient.updatePortfolio(entry.id, entry);
    setPortfolio((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedPortfolioId(updated.id);
  };

  const deletePortfolioEntry = async (id: string) => {
    await apiClient.deletePortfolio(id);
    await refreshPortfolio();
  };

  const createPlanningIssue = async () => {
    if (!dailyPlan) {
      return;
    }

    try {
      const result = await apiClient.createPlanningIssue(
        `ContributorOps daily plan ${new Date().toISOString().slice(0, 10)}`,
        dailyPlan.markdown
      );
      setPlanningIssueMessage(result.issueUrl ? `${result.message} ${result.issueUrl}` : result.message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to create planning issue.");
    }
  };

  const generateDraftProposal = async () => {
    if (!selectedIssue) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const proposal = await apiClient.createDraftProposal(selectedIssue);
      setDraftProposal(proposal);
      setPrResultMessage("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to generate draft proposal.");
    } finally {
      setIsLoading(false);
    }
  };

  const openApprovedDraftPullRequest = async () => {
    if (!selectedIssue || !draftProposal) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const result = await apiClient.createApprovedPullRequest({
        issue: selectedIssue,
        proposal: draftProposal,
        forkOwner,
        approvalReason,
        explicitApproval: true
      });
      setPrResultMessage(`Draft PR opened: ${result.draftPullRequestUrl}`);
      const matchingEntry =
        selectedPortfolioEntry?.issueUrl === selectedIssue.issueUrl
          ? selectedPortfolioEntry
          : portfolio.find((entry) => entry.issueUrl === selectedIssue.issueUrl) || null;

      if (matchingEntry) {
        const nextEntry = {
          ...matchingEntry,
          prUrl: result.draftPullRequestUrl,
          status: "PR opened" as const
        };
        await persistPortfolioEntry(nextEntry);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to open draft PR.");
    } finally {
      setIsLoading(false);
    }
  };

  const prepareContributionRun = async () => {
    if (!selectedIssue) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const run = await apiClient.prepareContributionRun({
        mode: contributionMode,
        issue: selectedIssue
      });
      setContributionRuns((current) => [run, ...current]);
      setSelectedRunId(run.id);
      setDraftProposal(run.proposal);
      setPrResultMessage("");
      setActivePage("auto-contribute");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to prepare contribution run.");
    } finally {
      setIsLoading(false);
    }
  };

  const approveComment = async () => {
    if (!selectedRun) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const updated = await apiClient.approveContributionComment({
        runId: selectedRun.id,
        userApprovalToken: selectedRun.userApprovalToken,
        approvalReason,
        explicitApproval: true
      });
      await refreshContributionRuns();
      setSelectedRunId(updated.id);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to approve comment.");
    } finally {
      setIsLoading(false);
    }
  };

  const approveBranch = async () => {
    if (!selectedRun) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const updated = await apiClient.approveContributionBranch({
        runId: selectedRun.id,
        userApprovalToken: selectedRun.userApprovalToken,
        approvalReason,
        explicitApproval: true,
        forkOwner
      });
      await refreshContributionRuns();
      setSelectedRunId(updated.id);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to approve branch creation.");
    } finally {
      setIsLoading(false);
    }
  };

  const approveDraftPrFromRun = async () => {
    if (!selectedRun) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const updated = await apiClient.approveContributionDraftPr({
        runId: selectedRun.id,
        userApprovalToken: selectedRun.userApprovalToken,
        approvalReason,
        explicitApproval: true,
        forkOwner
      });
      await refreshContributionRuns();
      setSelectedRunId(updated.id);
      setPrResultMessage(updated.prUrl ? `Draft PR opened: ${updated.prUrl}` : "Dry-run completed.");
      const matchingEntry =
        selectedPortfolioEntry?.issueUrl === selectedRun.issueUrl
          ? selectedPortfolioEntry
          : portfolio.find((entry) => entry.issueUrl === selectedRun.issueUrl) || null;

      if (matchingEntry && updated.prUrl) {
        await persistPortfolioEntry({
          ...matchingEntry,
          prUrl: updated.prUrl,
          status: "PR opened"
        });
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to approve draft PR.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRun = async () => {
    if (!selectedRun) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      await apiClient.cancelContributionRun(selectedRun.id, approvalReason || "Cancelled by user.");
      await refreshContributionRuns();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to cancel run.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectPlan = async (plan: BillingState["plan"]) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await apiClient.selectPlan(plan);
      setBilling(response.billing);
      setEntitlements(response.entitlements);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to switch plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const createRecruiterShare = async () => {
    setError("");
    setIsLoading(true);
    try {
      await apiClient.updateBillingProfile({
        profileHeadline: billing.profileHeadline,
        profileSummary: billing.profileSummary,
        publicPortfolioSlug: billing.publicPortfolioSlug,
        publicPortfolioEnabled: true,
        premiumThemeEnabled: billing.premiumThemeEnabled
      });
      const result = await apiClient.createPortfolioShare();
      setRecruiterShareUrl(result.recruiterShareUrl);
      const response = await apiClient.getBilling();
      setBilling(response.billing);
      setEntitlements(response.entitlements);
      await refreshBillingState();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to create recruiter share link.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportResume = async () => {
    setError("");
    setIsLoading(true);
    try {
      const result = await apiClient.exportGithubResume();
      setGithubResumeMarkdown(result.markdown);
      await refreshBillingState();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to export GitHub resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportCareerAssets = async () => {
    setError("");
    setIsLoading(true);
    try {
      setExportBundle(await apiClient.getExportCenter());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to export career assets.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setPrResultMessage("Copied to clipboard.");
    } catch {
      setError("Clipboard copy failed in this browser session.");
    }
  };

  const exportPdfPlaceholder = () => {
    setPrResultMessage("PDF export is intentionally placeholder-only until real document rendering is added.");
  };

  const runGithubProfileAudit = async () => {
    setError("");
    setIsLoading(true);
    try {
      setProfileAudit(await apiClient.getGithubProfileAudit(profileAuditUsername));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to run GitHub profile audit.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTeamRadar = async () => {
    setError("");
    setIsLoading(true);
    try {
      setTeamRadar(await apiClient.getTeamRadar());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to refresh team radar.");
    } finally {
      setIsLoading(false);
    }
  };

  const topOpportunityCount = useMemo(() => dailyPlan?.topOpportunities.length ?? 0, [dailyPlan]);

  const onboardingState: OnboardingState = {
    hasToken: mode !== "demo",
    hasGeneratedPlan: dailyPlan !== null,
    hasSavedPortfolioEntry: portfolio.length > 0,
    hasExportedBullet: false,
  };

  const navigateToPage = (page: AppPage) => {
    setActivePage(page);
    const targetPath = page === "pricing" ? "/pricing" : "/";
    window.history.replaceState({}, "", targetPath);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  if (usernameSlug) {
    return <PublicPortfolioPage profile={publicProfile} error={publicError} />;
  }

  return (
    <AuthProvider>
      <AuthGate>
    <div className="app-shell">
      <div className="app-grid">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="sidebar-brand">
              <BrandLogo theme={theme} compact />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>

            <div className="sidebar-intro">
              <p className="eyebrow">Career engine</p>
              <p className="sidebar-copy">
                Discover quality open-source issues in API, backend, and developer-tooling repos and
                turn every contribution into interview-ready proof.
              </p>
            </div>

            <div className="sidebar-nav-group">
              <span className="sidebar-section-label">Workspace</span>
              <div className="sidebar-nav">
                <button
                  type="button"
                  className={`sidebar-nav-button ${activePage === "dashboard" ? "active" : ""}`}
                  onClick={() => navigateToPage("dashboard")}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
                <button
                  type="button"
                  className={`sidebar-nav-button ${activePage === "auto-contribute" ? "active" : ""}`}
                  onClick={() => navigateToPage("auto-contribute")}
                >
                  <Bot size={16} />
                  Auto-Contribute
                </button>
                <button
                  type="button"
                  className={`sidebar-nav-button ${activePage === "proof-of-work" ? "active" : ""}`}
                  onClick={() => navigateToPage("proof-of-work")}
                >
                  <BriefcaseBusiness size={16} />
                  Proof of Work
                </button>
                <button
                  type="button"
                  className={`sidebar-nav-button ${activePage === "pricing" ? "active" : ""}`}
                  onClick={() => navigateToPage("pricing")}
                >
                  <BadgeDollarSign size={16} />
                  Pricing
                </button>
                <button
                  type="button"
                  className={`sidebar-nav-button ${activePage === "team-radar" ? "active" : ""}`}
                  onClick={() => navigateToPage("team-radar")}
                >
                  <Radar size={16} />
                  Team Radar
                </button>
                <button
                  type="button"
                  className={`sidebar-nav-button ${activePage === "developer-setup" ? "active" : ""}`}
                  onClick={() => navigateToPage("developer-setup")}
                >
                  <BookOpen size={16} />
                  Developer Setup
                </button>
              </div>
            </div>
          </div>

          <div className="sidebar-bottom">
            <div className="sidebar-metrics">
              <div className="sidebar-card sidebar-stat-card">
                <span>Plan</span>
                <strong>{billing.plan.toUpperCase()}</strong>
                <p>
                  {usage.generatedPlans} plan runs this week
                  {entitlements.weeklyPlanLimit !== null ? ` / ${entitlements.weeklyPlanLimit}` : " / unlimited"}
                </p>
              </div>

              <div className="sidebar-card sidebar-stat-card">
                <span>Today</span>
                <strong>{topOpportunityCount}</strong>
                <p>top opportunities in the latest plan</p>
              </div>
            </div>

            <div className="sidebar-card sidebar-context-card">
              <span>Positioning</span>
              <p>ContributorOps helps developers turn open-source contributions into job-ready proof of work.</p>
            </div>

            <div className="sidebar-card sidebar-help-card">
              <div className="sidebar-help-head">
                <BookOpen size={16} />
                <span>Developer setup</span>
              </div>
              <p>Set env files here before switching from demo mode:</p>
              <ul className="sidebar-help-list">
                <li><code>apps/api/.env</code></li>
                <li><code>apps/web/.env.local</code></li>
                <li><code>apps/site/.env.local</code></li>
              </ul>
              <div className="sidebar-help-links">
                <button
                  type="button"
                  className="sidebar-help-link sidebar-help-link-button"
                  onClick={() => {
                    setDeveloperSetupSection("guide");
                    navigateToPage("developer-setup");
                  }}
                >
                  Full env guide
                  <ExternalLink size={14} />
                </button>
                <button
                  type="button"
                  className="sidebar-help-link sidebar-help-link-button"
                  onClick={() => {
                    setDeveloperSetupSection("api-template");
                    navigateToPage("developer-setup");
                  }}
                >
                  API template
                  <ExternalLink size={14} />
                </button>
                <button
                  type="button"
                  className="sidebar-help-link sidebar-help-link-button"
                  onClick={() => {
                    setDeveloperSetupSection("web-template");
                    navigateToPage("developer-setup");
                  }}
                >
                  Web template
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            <div className="sidebar-footnote">
              <span className="sidebar-footnote-label">Operating model</span>
              <p>Human-approved contribution intelligence for credible proof, not volume farming.</p>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <DemoModeBanner show={billing.plan === "free" && mode === "demo"} />
          <MissionCard plan={dailyPlan} modeLabel={modeLabel} planLabel={billing.plan} />

          {error ? (
            <section className="alert-banner">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </section>
          ) : null}

          {activePage === "dashboard" ? (
            <>
              {!checklistDismissed && (
                <OnboardingChecklist
                  state={onboardingState}
                  onDismiss={() => setChecklistDismissed(true)}
                />
              )}
              <div className="layout-grid">
                <div className="main-column">
                  <ControlModePanel
                    controlMode={controlMode}
                    approvalReason={approvalReason}
                    isUpdating={isLoading}
                    onApprovalReasonChange={setApprovalReason}
                    onChangeMode={changeControlMode}
                  />
                  <DiscoveryControls
                    filters={filters}
                    isLoading={isLoading}
                    onChange={setFilters}
                    onGenerate={generateDailyPlan}
                  />
                  <CandidateList
                    issues={issues}
                    selectedId={selectedIssueId}
                    onSelect={(issue) => setSelectedIssueId(issue.id)}
                  />
                  <ContributionModePanel
                    controlMode={controlMode}
                    issue={selectedIssue}
                    proposal={draftProposal}
                    isLoading={isLoading}
                    forkOwner={forkOwner}
                    approvalReason={approvalReason}
                    prResultMessage={prResultMessage}
                    onForkOwnerChange={setForkOwner}
                    onProposalChange={setDraftProposal}
                    onGenerateDraft={generateDraftProposal}
                    onCreatePlanningIssue={createPlanningIssue}
                    onOpenDraftPullRequest={openApprovedDraftPullRequest}
                  />
                  <IssueDetailPanel
                    issue={selectedIssue}
                    onSaveToPortfolio={saveIssueToPortfolio}
                    entitlements={entitlements}
                  />
                </div>

                <div className="side-column">
                  <section className="panel actions-panel">
                    <div className="panel-header">
                      <div>
                        <p className="section-kicker">Safe automation</p>
                        <h2>Create a planning issue in ContributorOps.</h2>
                      </div>
                    </div>
                    <button type="button" className="secondary-button full-width" onClick={createPlanningIssue}>
                      <GitBranchPlus size={16} />
                      Create planning issue
                    </button>
                    <p className="muted-copy">{planningIssueMessage || "This never opens issues on third-party repositories."}</p>
                  </section>
                  <JobModePanel
                    issue={selectedIssue}
                    portfolioEntry={selectedPortfolioEntry}
                    onPortfolioChange={updatePortfolioEntry}
                    entitlements={entitlements}
                  />
                </div>
              </div>

              {entitlements.features["portfolio-tracker"] ? (
                <PortfolioTracker
                  entries={portfolio}
                  selectedEntryId={selectedPortfolioId}
                  onSelect={(entry) => setSelectedPortfolioId(entry.id)}
                  onDelete={deletePortfolioEntry}
                  onChange={updatePortfolioEntry}
                  onSave={persistPortfolioEntry}
                />
              ) : (
                <section className="panel empty-panel">
                  <h2>Portfolio tracker</h2>
                  <p>Upgrade to Pro to save opportunities and turn them into long-lived proof-of-work assets.</p>
                </section>
              )}
            </>
          ) : null}

          {activePage === "auto-contribute" ? (
            <AutoContributePage
              selectedIssue={selectedIssue}
              mode={contributionMode}
              selectedRun={selectedRun}
              runs={contributionRuns}
              forkOwner={forkOwner}
              approvalReason={approvalReason}
              autoContributeEnabled={autoContributeEnabled}
              entitlements={entitlements}
              isLoading={isLoading}
              onModeChange={setContributionMode}
              onForkOwnerChange={setForkOwner}
              onApprovalReasonChange={setApprovalReason}
              onPrepare={prepareContributionRun}
              onApproveComment={approveComment}
              onApproveBranch={approveBranch}
              onApproveDraftPr={approveDraftPrFromRun}
              onCancelRun={cancelRun}
              onSelectRun={(run) => {
                setSelectedRunId(run.id);
                setDraftProposal(run.proposal);
              }}
            />
          ) : null}

          {activePage === "proof-of-work" ? (
            <ProofOfWorkPage
              billing={billing}
              entitlements={entitlements}
              portfolio={portfolio}
              selectedPortfolioEntry={selectedPortfolioEntry}
              githubResumeMarkdown={githubResumeMarkdown}
              recruiterShareUrl={recruiterShareUrl}
              exportBundle={exportBundle}
              profileAuditUsername={profileAuditUsername}
              profileAudit={profileAudit}
              isLoading={isLoading}
              onCreateShare={createRecruiterShare}
              onExportResume={exportResume}
              onExportCenter={exportCareerAssets}
              onCopy={copyToClipboard}
              onPlaceholderPdf={exportPdfPlaceholder}
              onRunProfileAudit={runGithubProfileAudit}
              onProfileAuditUsernameChange={setProfileAuditUsername}
              onBillingProfileChange={setBilling}
              onPortfolioChange={updatePortfolioEntry}
            />
          ) : null}

          {activePage === "pricing" ? (
            <PricingPage
              billing={billing}
              entitlements={entitlements}
              pricing={pricing}
              usage={usage}
              isLoading={isLoading}
              onSelectPlan={selectPlan}
            />
          ) : null}

          {activePage === "team-radar" ? (
            <TeamRadarPage
              entitlements={entitlements}
              radar={teamRadar}
              isLoading={isLoading}
              onRefresh={refreshTeamRadar}
            />
          ) : null}

          {activePage === "developer-setup" ? (
            <DeveloperSetupPage
              selectedSection={developerSetupSection}
              onSelectSection={setDeveloperSetupSection}
            />
          ) : null}
        </main>
      </div>
    </div>
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
