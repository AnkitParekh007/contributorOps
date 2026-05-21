import { AlertTriangle, CheckCircle2, FileDiff, MessageSquareText, ShieldCheck } from "lucide-react";
import type {
  ContributionExecutionMode,
  ContributionRun,
  ContributionRunStatus,
  FeatureFlags,
  IssueCandidate
} from "../types";

interface AutoContributePageProps {
  selectedIssue: IssueCandidate | null;
  mode: ContributionExecutionMode;
  selectedRun: ContributionRun | null;
  runs: ContributionRun[];
  forkOwner: string;
  approvalReason: string;
  autoContributeEnabled: boolean;
  entitlements: FeatureFlags;
  isLoading: boolean;
  onModeChange: (mode: ContributionExecutionMode) => void;
  onForkOwnerChange: (value: string) => void;
  onApprovalReasonChange: (value: string) => void;
  onPrepare: () => void;
  onApproveComment: () => void;
  onApproveBranch: () => void;
  onApproveDraftPr: () => void;
  onCancelRun: () => void;
  onSelectRun: (run: ContributionRun) => void;
}

function statusTone(status: ContributionRunStatus) {
  if (status === "completed") return "tone-success";
  if (status === "cancelled" || status === "error" || status === "blocked") return "tone-danger";
  if (status === "dry-run") return "tone-warning";
  return "tone-info";
}

export function AutoContributePage({
  selectedIssue,
  mode,
  selectedRun,
  runs,
  forkOwner,
  approvalReason,
  autoContributeEnabled,
  entitlements,
  isLoading,
  onModeChange,
  onForkOwnerChange,
  onApprovalReasonChange,
  onPrepare,
  onApproveComment,
  onApproveBranch,
  onApproveDraftPr,
  onCancelRun,
  onSelectRun
}: AutoContributePageProps) {
  const locked = !entitlements.features["approved-auto-contribute"];

  return (
    <div className="auto-page-grid">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Auto-Contribute</p>
            <h2>Approval-gated contribution execution</h2>
            <p className="muted-copy">
              Dry-run is the default. External writes require explicit per-action approval and are logged.
            </p>
            {locked ? <p className="muted-copy">Upgrade to Pro to unlock approval-gated auto-contribute flows.</p> : null}
          </div>
          <span className={`mode-pill ${autoContributeEnabled ? "" : "pill-warning"}`}>
            {autoContributeEnabled ? "external writes enabled" : "dry run only"}
          </span>
        </div>

        <div className="mode-selector-grid">
          {[
            ["research", "Research Mode"],
            ["draft", "Draft Mode"],
            ["approved-auto-contribute", "Approved Auto-Contribute Mode"]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`mode-card ${mode === value ? "active" : ""}`}
              onClick={() => onModeChange(value as ContributionExecutionMode)}
            >
              <strong>{label}</strong>
            </button>
          ))}
        </div>

        <div className="auto-summary-grid">
          <article className="info-card">
            <div className="info-card-title">
              <ShieldCheck size={16} />
              <strong>Selected issue</strong>
            </div>
            {selectedIssue ? (
              <>
                <p>{selectedIssue.repoFullName}</p>
                <p className="muted-copy">
                  #{selectedIssue.issueNumber} {selectedIssue.issueTitle}
                </p>
                <a href={selectedIssue.issueUrl} target="_blank" rel="noreferrer">
                  Open issue
                </a>
              </>
            ) : (
              <p className="muted-copy">Pick an issue from the dashboard before preparing a run.</p>
            )}
          </article>

          <article className="info-card">
            <div className="info-card-title">
              <AlertTriangle size={16} />
              <strong>Approval gate</strong>
            </div>
            <label>
              Approval reason
              <textarea
                rows={4}
                value={approvalReason}
                onChange={(event) => onApprovalReasonChange(event.target.value)}
                placeholder="Why this exact action is relevant and safe."
              />
            </label>
            <label>
              Fork owner
              <input
                value={forkOwner}
                onChange={(event) => onForkOwnerChange(event.target.value)}
                placeholder="GitHub username for the fork"
              />
            </label>
          </article>
        </div>

        <div className="contribution-actions">
          <button type="button" className="primary-button" disabled={!selectedIssue || isLoading || locked} onClick={onPrepare}>
            Prepare final confirmation
          </button>
          <button
            type="button"
            className="secondary-button"
            disabled={!selectedRun || isLoading || locked}
            onClick={onApproveComment}
          >
            Approve Comment
          </button>
          <button
            type="button"
            className="secondary-button"
            disabled={!selectedRun || isLoading || locked}
            onClick={onApproveBranch}
          >
            Approve Fork Branch
          </button>
          <button
            type="button"
            className="secondary-button"
            disabled={!selectedRun || isLoading || locked}
            onClick={onApproveDraftPr}
          >
            Approve Draft PR
          </button>
          <button
            type="button"
            className="ghost-button"
            disabled={!selectedRun || isLoading || locked}
            onClick={onCancelRun}
          >
            Cancel Run
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Final confirmation</p>
            <h2>Exact action preview</h2>
          </div>
          {selectedRun ? <span className={`mode-pill ${statusTone(selectedRun.status)}`}>{selectedRun.status}</span> : null}
        </div>

        {!selectedRun ? (
          <div className="padded-note">Prepare a run to inspect the exact diff, test plan, comment draft, and PR body.</div>
        ) : (
          <div className="run-detail-grid">
            <article className="info-card">
              <div className="info-card-title">
                <CheckCircle2 size={16} />
                <strong>Safety checklist</strong>
              </div>
              <ul className="check-list">
                {selectedRun.safetyChecks.map((check) => (
                  <li key={check.key} className={`check-item ${check.passed ? "passed" : "failed"} ${check.severity}`}>
                    <strong>{check.key}</strong>
                    <span>{check.detail}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="info-card">
              <div className="info-card-title">
                <FileDiff size={16} />
                <strong>Generated diff summary</strong>
              </div>
              <pre>{selectedRun.generatedDiffSummary}</pre>
            </article>

            <article className="copy-block">
              <div className="info-card-title">
                <FileDiff size={16} />
                <strong>Generated diff viewer</strong>
              </div>
              {selectedRun.proposal.suggestedChanges.map((change) => (
                <div key={change.path} className="diff-block">
                  <strong>{change.path}</strong>
                  <pre>{change.content}</pre>
                </div>
              ))}
            </article>

            <article className="copy-block">
              <div className="info-card-title">
                <MessageSquareText size={16} />
                <strong>Comment preview</strong>
              </div>
              <pre>{selectedRun.commentDraft}</pre>
            </article>

            <article className="copy-block">
              <div className="info-card-title">
                <ShieldCheck size={16} />
                <strong>PR preview</strong>
              </div>
              <p className="muted-copy">{selectedRun.prTitle}</p>
              <pre>{selectedRun.prBody}</pre>
            </article>

            <article className="copy-block">
              <div className="info-card-title">
                <ShieldCheck size={16} />
                <strong>PR quality checker</strong>
              </div>
              {entitlements.features["pr-quality-checker"] ? (
                <>
                  <p className="muted-copy">
                    {selectedRun.prQuality.score}/100 · {selectedRun.prQuality.verdict}
                  </p>
                  <ul>
                    {selectedRun.prQuality.checks.map((check) => (
                      <li key={check.label}>
                        <strong>{check.label}:</strong> {check.detail}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="muted-copy">Career plan unlocks deterministic PR quality checking.</p>
              )}
            </article>

            <article className="copy-block">
              <div className="info-card-title">
                <CheckCircle2 size={16} />
                <strong>Test plan</strong>
              </div>
              <ul>
                {selectedRun.testPlan.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>

            <article className="copy-block">
              <div className="info-card-title">
                <FileDiff size={16} />
                <strong>Planned files</strong>
              </div>
              <ul>
                {selectedRun.plannedFiles.map((filePath) => (
                  <li key={filePath}>{filePath}</li>
                ))}
              </ul>
              <p className="muted-copy">Risk score: {selectedRun.riskScore}/100</p>
              <p className="muted-copy">Approval token: {selectedRun.userApprovalToken}</p>
              {selectedRun.prUrl ? (
                <a href={selectedRun.prUrl} target="_blank" rel="noreferrer">
                  Open created draft PR
                </a>
              ) : null}
              {selectedRun.commentUrl ? (
                <a href={selectedRun.commentUrl} target="_blank" rel="noreferrer">
                  Open approved comment
                </a>
              ) : null}
            </article>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Run history</p>
            <h2>Traceable write history</h2>
          </div>
        </div>
        <div className="run-history-list">
          {runs.length === 0 ? (
            <div className="padded-note">No contribution runs yet.</div>
          ) : (
            runs.map((run) => (
              <button key={run.id} type="button" className="run-history-item" onClick={() => onSelectRun(run)}>
                <strong>{run.targetRepo}</strong>
                <span>#{run.issueNumber}</span>
                <small>{run.status}</small>
                <small>{new Date(run.createdAt).toLocaleString()}</small>
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
