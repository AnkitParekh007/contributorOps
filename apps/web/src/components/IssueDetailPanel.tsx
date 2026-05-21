import { FileText, FolderTree, FlaskConical, MessageSquareQuote, PencilLine, ShieldCheck } from "lucide-react";
import type { FeatureFlags, IssueCandidate } from "../types";

interface IssueDetailPanelProps {
  issue: IssueCandidate | null;
  onSaveToPortfolio: (issue: IssueCandidate) => void;
  entitlements: FeatureFlags;
}

export function IssueDetailPanel({ issue, onSaveToPortfolio, entitlements }: IssueDetailPanelProps) {
  if (!issue) {
    return (
      <section className="panel detail-panel empty-panel">
        <h2>Select a candidate issue</h2>
        <p>Pick an issue from the ranked list to see the contribution plan, test path, and job-mode drafts.</p>
      </section>
    );
  }

  return (
    <section className="panel detail-panel">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Detail panel</p>
          <h2>{issue.issueTitle}</h2>
          <p className="muted-copy">{issue.repoDescription}</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => onSaveToPortfolio(issue)}>
          Save to Portfolio
        </button>
      </div>

      <div className="detail-grid">
        <article className="info-card">
          <div className="info-card-title">
            <FileText size={16} />
            <strong>Issue summary</strong>
          </div>
          <p>{issue.summary}</p>
        </article>

        <article className="info-card">
          <div className="info-card-title">
            <PencilLine size={16} />
            <strong>Contribution plan</strong>
          </div>
          <ol>
            {issue.contributionPlan.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="info-card">
          <div className="info-card-title">
            <FolderTree size={16} />
            <strong>Files likely involved</strong>
          </div>
          <ul>
            {issue.likelyFiles.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </article>

        <article className="info-card">
          <div className="info-card-title">
            <FlaskConical size={16} />
            <strong>Testing strategy</strong>
          </div>
          <ul>
            {issue.testingStrategy.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>

        <article className="info-card">
          <div className="info-card-title">
            <ShieldCheck size={16} />
            <strong>Maintainer trust score</strong>
          </div>
          {entitlements.features["maintainer-trust-score"] ? (
            <>
              <p>
                {issue.maintainerTrust.score}/100 · {issue.maintainerTrust.band}
              </p>
              <ul>
                {issue.maintainerTrust.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Upgrade to Pro to unlock maintainer trust scoring.</p>
          )}
        </article>

        <article className="info-card">
          <div className="info-card-title">
            <ShieldCheck size={16} />
            <strong>Job-matched role fit</strong>
          </div>
          <p>
            {issue.roleMatch.targetRole}: {issue.roleMatch.score}/100
          </p>
          <ul>
            {issue.roleMatch.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="stack-section">
        <article className="copy-block">
          <div className="info-card-title">
            <MessageSquareQuote size={16} />
            <strong>Maintainer question draft</strong>
          </div>
          <p>{issue.maintainerQuestionDraft}</p>
        </article>
        <article className="copy-block">
          <div className="info-card-title">
            <FileText size={16} />
            <strong>PR description draft</strong>
          </div>
          <pre>{issue.prDescriptionDraft}</pre>
        </article>
        <article className="copy-block">
          <div className="info-card-title">
            <PencilLine size={16} />
            <strong>Resume bullet draft</strong>
          </div>
          <p>{issue.resumeBulletDraft}</p>
        </article>
      </div>
    </section>
  );
}
