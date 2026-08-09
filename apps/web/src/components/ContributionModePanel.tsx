import { FileCode2, GitPullRequestDraft, Save } from "lucide-react";
import type { ControlModeState, DraftProposal, IssueCandidate } from "../types";

interface ContributionModePanelProps {
  controlMode: ControlModeState;
  issue: IssueCandidate | null;
  proposal: DraftProposal | null;
  isLoading: boolean;
  forkOwner: string;
  approvalReason: string;
  prResultMessage: string;
  onForkOwnerChange: (value: string) => void;
  onProposalChange: (proposal: DraftProposal) => void;
  onGenerateDraft: () => void;
  onCreatePlanningIssue: () => void;
  onOpenDraftPullRequest: () => void;
}

export function ContributionModePanel({
  controlMode,
  issue,
  proposal,
  isLoading,
  forkOwner,
  approvalReason,
  prResultMessage,
  onForkOwnerChange,
  onProposalChange,
  onGenerateDraft,
  onCreatePlanningIssue,
  onOpenDraftPullRequest
}: ContributionModePanelProps) {
  const canDraft = controlMode.safetyLevel !== "research" && Boolean(issue);
  const canPrepareApproval =
    controlMode.safetyLevel === "approved-pr" &&
    Boolean(issue) &&
    Boolean(proposal) &&
    Boolean(forkOwner.trim()) &&
    Boolean(approvalReason.trim());

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Controlled contribution flow</p>
          <h2>Freeze the reviewed draft, then approve the exact external action.</h2>
        </div>
      </div>

      <div className="contribution-actions">
        <button type="button" className="secondary-button" disabled={!canDraft || isLoading} onClick={onGenerateDraft}>
          <FileCode2 size={16} />
          Generate local draft package
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={controlMode.safetyLevel === "research" || isLoading}
          onClick={onCreatePlanningIssue}
        >
          <Save size={16} />
          Create planning issue in contributorOps
        </button>
      </div>

      {!proposal ? (
        <div className="empty-note padded-note">
          Draft Mode generates branch naming, commit message, PR copy, and suggested local file changes.
        </div>
      ) : (
        <div className="draft-layout">
          <label>
            Branch name
            <input
              value={proposal.branchName}
              onChange={(event) => onProposalChange({ ...proposal, branchName: event.target.value })}
            />
          </label>
          <label>
            Commit message
            <input
              value={proposal.commitMessage}
              onChange={(event) => onProposalChange({ ...proposal, commitMessage: event.target.value })}
            />
          </label>
          <label>
            PR title
            <input
              value={proposal.prTitle}
              onChange={(event) => onProposalChange({ ...proposal, prTitle: event.target.value })}
            />
          </label>
          <label className="full-span">
            Human-written PR body
            <textarea
              rows={10}
              value={proposal.prBody}
              onChange={(event) => onProposalChange({ ...proposal, prBody: event.target.value })}
            />
          </label>
          <label className="full-span">
            Test evidence
            <textarea
              rows={5}
              value={proposal.testEvidence}
              onChange={(event) => onProposalChange({ ...proposal, testEvidence: event.target.value })}
            />
          </label>

          <div className="full-span suggested-change-stack">
            {proposal.suggestedChanges.map((change, index) => (
              <article key={`${change.path}-${index}`} className="copy-block">
                <div className="info-card-title">
                  <FileCode2 size={16} />
                  <strong>{change.path}</strong>
                </div>
                <p>{change.rationale}</p>
                <textarea
                  rows={10}
                  value={change.content}
                  onChange={(event) => {
                    const nextChanges = proposal.suggestedChanges.map((entry, changeIndex) =>
                      changeIndex === index ? { ...entry, content: event.target.value } : entry
                    );
                    onProposalChange({ ...proposal, suggestedChanges: nextChanges });
                  }}
                />
              </article>
            ))}
          </div>

          <label>
            Fork owner
            <input
              value={forkOwner}
              onChange={(event) => onForkOwnerChange(event.target.value)}
              placeholder="Your GitHub username or fork owner"
            />
          </label>

          <div className="editor-actions full-span">
            <button
              type="button"
              className="primary-button"
              disabled={!canPrepareApproval || isLoading}
              onClick={onOpenDraftPullRequest}
            >
              <GitPullRequestDraft size={16} />
              Continue to approval gate
            </button>
            <span className="muted-copy">
              {prResultMessage ||
                "This step only prepares the reviewed payload. It cannot write to a third-party repository; the exact draft-PR action must be approved separately."}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
