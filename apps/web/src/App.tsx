import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, GitBranchPlus } from "lucide-react";
import { apiClient } from "./api/client";
import { CandidateList } from "./components/CandidateList";
import { ControlModePanel } from "./components/ControlModePanel";
import { ContributionModePanel } from "./components/ContributionModePanel";
import { DiscoveryControls } from "./components/DiscoveryControls";
import { IssueDetailPanel } from "./components/IssueDetailPanel";
import { JobModePanel } from "./components/JobModePanel";
import { MissionCard } from "./components/MissionCard";
import { PortfolioTracker } from "./components/PortfolioTracker";
import type {
  ControlModeState,
  DailyPlan,
  DiscoveryFilters,
  DraftProposal,
  IssueCandidate,
  PortfolioEntry
} from "./types";

const defaultFilters: DiscoveryFilters = {
  topics: ["openapi", "sdk", "api-client", "graphql", "rest-api", "developer-tools"],
  languages: ["typescript", "javascript", "node", "python"],
  labels: ["good first issue", "help wanted", "documentation", "bug"]
};

function App() {
  const [modeLabel, setModeLabel] = useState("demo mode");
  const [filters, setFilters] = useState<DiscoveryFilters>(defaultFilters);
  const [controlMode, setControlMode] = useState<ControlModeState>({
    safetyLevel: "research",
    approvalRequired: true,
    approvalGrantedAt: null,
    approvalReason: "",
    lastUpdatedAt: ""
  });
  const [issues, setIssues] = useState<IssueCandidate[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [planningIssueMessage, setPlanningIssueMessage] = useState<string>("");
  const [approvalReason, setApprovalReason] = useState("");
  const [draftProposal, setDraftProposal] = useState<DraftProposal | null>(null);
  const [forkOwner, setForkOwner] = useState("");
  const [prResultMessage, setPrResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId) || null;
  const selectedPortfolioEntry =
    portfolio.find((entry) => entry.id === selectedPortfolioId) || portfolio[0] || null;

  useEffect(() => {
    Promise.all([apiClient.health(), apiClient.getDailyPlan(), apiClient.getPortfolio()])
      .then(([health, plan, entries]) => {
        setModeLabel(health.mode === "github" ? "live GitHub mode" : "demo mode");
        setControlMode(health.controlMode);
        setApprovalReason(health.controlMode.approvalReason);
        setDailyPlan(plan.generatedAt ? plan : null);
        setPortfolio(entries);
        setSelectedPortfolioId(entries[0]?.id ?? null);
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Failed to load app.");
      });
  }, []);

  const refreshPortfolio = async () => {
    const entries = await apiClient.getPortfolio();
    setPortfolio(entries);
    setSelectedPortfolioId(entries[0]?.id ?? null);
  };

  const generateDailyPlan = async () => {
    setError("");
    setIsLoading(true);
    try {
      const result = await apiClient.discover(filters);
      setModeLabel(result.mode === "github" ? "live GitHub mode" : "demo mode");
      setIssues(result.issues);
      setSelectedIssueId(result.issues[0]?.id ?? null);
      setDailyPlan(result.dailyPlan);
      setPlanningIssueMessage("");
      setDraftProposal(null);
      setPrResultMessage("");
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
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to update safety mode.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveIssueToPortfolio = async (issue: IssueCandidate) => {
    const entry = await apiClient.createPortfolio({
      selectedRepo: issue.repoFullName,
      issueUrl: issue.issueUrl,
      prUrl: "",
      status: "planned",
      notes: issue.reasonForRecommendation,
      interviewStarStory: issue.jobMode.interviewStarStory,
      resumeBullet: issue.jobMode.resumeBullet,
      linkedInPost: issue.jobMode.linkedInPost,
      recruiterOutreach: issue.jobMode.recruiterOutreach,
      githubProfileSnippet: issue.jobMode.githubProfileSnippet
    });
    setPortfolio((current) => [entry, ...current]);
    setSelectedPortfolioId(entry.id);
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

  const topOpportunityCount = useMemo(() => dailyPlan?.topOpportunities.length ?? 0, [dailyPlan]);

  return (
    <div className="app-shell">
      <div className="app-grid">
        <aside className="sidebar">
          <div>
            <p className="eyebrow">Career engine</p>
            <h2>ContributorOps</h2>
            <p className="sidebar-copy">
              Discover quality open-source issues in API, backend, and developer-tooling repos and
              turn every contribution into interview-ready proof.
            </p>
          </div>

          <div className="sidebar-card">
            <span>Workflow rules</span>
            <ul>
              <li>No auto-comments on third-party repos</li>
              <li>No auto-PRs without human approval</li>
              <li>Planning issues only inside contributorOps</li>
            </ul>
          </div>

          <div className="sidebar-card">
            <span>Today</span>
            <strong>{topOpportunityCount}</strong>
            <p>top opportunities in the latest plan</p>
          </div>
        </aside>

        <main className="main-content">
          <MissionCard plan={dailyPlan} modeLabel={modeLabel} />

          {error ? (
            <section className="alert-banner">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </section>
          ) : null}

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
              <IssueDetailPanel issue={selectedIssue} onSaveToPortfolio={saveIssueToPortfolio} />
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
              />
            </div>
          </div>

          <PortfolioTracker
            entries={portfolio}
            selectedEntryId={selectedPortfolioId}
            onSelect={(entry) => setSelectedPortfolioId(entry.id)}
            onDelete={deletePortfolioEntry}
            onChange={updatePortfolioEntry}
            onSave={persistPortfolioEntry}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
