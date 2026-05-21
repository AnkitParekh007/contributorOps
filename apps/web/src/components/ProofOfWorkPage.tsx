import {
  BriefcaseBusiness,
  ClipboardCopy,
  ExternalLink,
  FileOutput,
  Globe,
  Share2,
  Sparkles,
  UserSearch
} from "lucide-react";
import type {
  BillingState,
  ExportBundle,
  FeatureFlags,
  GithubProfileAudit,
  PortfolioEntry
} from "../types";

interface ProofOfWorkPageProps {
  billing: BillingState;
  entitlements: FeatureFlags;
  portfolio: PortfolioEntry[];
  selectedPortfolioEntry: PortfolioEntry | null;
  githubResumeMarkdown: string;
  recruiterShareUrl: string;
  exportBundle: ExportBundle | null;
  profileAuditUsername: string;
  profileAudit: GithubProfileAudit | null;
  isLoading: boolean;
  onCreateShare: () => void;
  onExportResume: () => void;
  onExportCenter: () => void;
  onCopy: (value: string) => void;
  onPlaceholderPdf: () => void;
  onRunProfileAudit: () => void;
  onProfileAuditUsernameChange: (value: string) => void;
  onBillingProfileChange: (billing: BillingState) => void;
  onPortfolioChange: (entry: PortfolioEntry) => void;
}

export function ProofOfWorkPage({
  billing,
  entitlements,
  portfolio,
  selectedPortfolioEntry,
  githubResumeMarkdown,
  recruiterShareUrl,
  exportBundle,
  profileAuditUsername,
  profileAudit,
  isLoading,
  onCreateShare,
  onExportResume,
  onExportCenter,
  onCopy,
  onPlaceholderPdf,
  onRunProfileAudit,
  onProfileAuditUsernameChange,
  onBillingProfileChange,
  onPortfolioChange
}: ProofOfWorkPageProps) {
  const lockedCareer = !entitlements.features["github-resume-export"];
  const lockedPublic = !entitlements.features["public-portfolio"];
  const lockedAudit = !entitlements.features["github-profile-audit"];

  return (
    <div className="page-stack">
      <section className="panel hero-panel">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow">Proof of work</span>
            <span className="mode-pill">{billing.plan} plan</span>
          </div>
          <h1>Package contributions into a recruiter-ready operating system.</h1>
          <p>
            Publish a public proof-of-work portfolio, export a GitHub resume, and keep every
            LinkedIn post, STAR story, and recruiter message editable locally.
          </p>
        </div>
        <div className="mission-card">
          <div className="mission-title">
            <BriefcaseBusiness size={18} />
            <strong>Career asset status</strong>
          </div>
          <p>
            {portfolio.length} tracked contributions · {lockedCareer ? "Upgrade to Career for exports" : "Career tools unlocked"}
          </p>
          <div className="mission-meta">
            <span>{billing.publicPortfolioEnabled ? "Public portfolio enabled" : "Private by default"}</span>
            <span className="safety-pill">{recruiterShareUrl || "No recruiter share link yet"}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Public proof page</p>
            <h2>Control the public story recruiters can see.</h2>
          </div>
        </div>
        <div className="editor-grid">
          <label>
            <span>Public headline</span>
            <input
              value={billing.profileHeadline}
              disabled={lockedPublic}
              onChange={(event) => onBillingProfileChange({ ...billing, profileHeadline: event.target.value })}
            />
          </label>
          <label>
            <span>Public slug</span>
            <input
              value={billing.publicPortfolioSlug}
              disabled={lockedPublic}
              onChange={(event) => onBillingProfileChange({ ...billing, publicPortfolioSlug: event.target.value })}
            />
          </label>
          <label className="editor-full">
            <span>Public summary</span>
            <textarea
              rows={4}
              value={billing.profileSummary}
              disabled={lockedPublic}
              onChange={(event) => onBillingProfileChange({ ...billing, profileSummary: event.target.value })}
            />
          </label>
          <label>
            <span>Premium public theme</span>
            <select
              value={billing.premiumThemeEnabled ? "enabled" : "disabled"}
              disabled={!entitlements.features["premium-public-theme"]}
              onChange={(event) =>
                onBillingProfileChange({ ...billing, premiumThemeEnabled: event.target.value === "enabled" })
              }
            >
              <option value="disabled">Standard</option>
              <option value="enabled">Premium</option>
            </select>
          </label>
        </div>
        <div className="button-row">
          <button
            type="button"
            className="primary-button"
            disabled={lockedPublic || isLoading}
            onClick={onCreateShare}
          >
            <Share2 size={16} />
            Enable recruiter share link
          </button>
          <button
            type="button"
            className="secondary-button"
            disabled={lockedCareer || isLoading}
            onClick={onExportResume}
          >
            <FileOutput size={16} />
            Export GitHub resume
          </button>
        </div>
        {lockedPublic ? <p className="muted-copy">Career or Team unlock the public portfolio and recruiter share flow.</p> : null}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Export center</p>
            <h2>Copy or export the full job-search asset bundle.</h2>
          </div>
        </div>
        <div className="button-row export-toolbar">
          <button type="button" className="primary-button" disabled={!entitlements.features["export-center"] || isLoading} onClick={onExportCenter}>
            <FileOutput size={16} />
            Refresh export center
          </button>
          <button type="button" className="secondary-button" disabled={!githubResumeMarkdown} onClick={() => onCopy(githubResumeMarkdown)}>
            <ClipboardCopy size={16} />
            Copy resume markdown
          </button>
          <button type="button" className="secondary-button" disabled={!entitlements.features["export-center"]} onClick={onPlaceholderPdf}>
            <FileOutput size={16} />
            PDF export placeholder
          </button>
        </div>
        <div className="feature-flag-grid">
          {[
            ["Resume bullets", exportBundle?.resumeBullets || ""],
            ["LinkedIn posts", exportBundle?.linkedInPosts || ""],
            ["Portfolio markdown", exportBundle?.portfolioMarkdown || ""],
            ["Recruiter pitch", exportBundle?.recruiterPitch || ""],
            ["GitHub README snippet", exportBundle?.githubReadmeSnippet || ""]
          ].map(([label, value]) => (
            <article key={label} className="copy-block">
              <div className="info-card-title">
                <ClipboardCopy size={16} />
                <strong>{label}</strong>
              </div>
              <pre>{value || "Upgrade to Career and refresh the export center to generate this asset."}</pre>
              <button type="button" className="secondary-button" disabled={!value} onClick={() => onCopy(value)}>
                Copy
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Recruiter share</p>
            <h2>Public proof-of-work URL</h2>
          </div>
        </div>
        <div className="copy-block">
          <div className="info-card-title">
            <Globe size={16} />
            <strong>Share link</strong>
          </div>
          <p>{recruiterShareUrl || "Enable recruiter sharing to generate a public link."}</p>
          {recruiterShareUrl ? (
            <a href={recruiterShareUrl} target="_blank" rel="noreferrer">
              Open public portfolio <ExternalLink size={14} />
            </a>
          ) : null}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">GitHub profile audit</p>
            <h2>Audit a profile and surface a README improvement checklist.</h2>
          </div>
        </div>
        <div className="editor-grid">
          <label>
            <span>GitHub username</span>
            <input
              value={profileAuditUsername}
              disabled={lockedAudit}
              onChange={(event) => onProfileAuditUsernameChange(event.target.value)}
            />
          </label>
          <div className="button-row">
            <button type="button" className="primary-button" disabled={lockedAudit || isLoading} onClick={onRunProfileAudit}>
              <UserSearch size={16} />
              Run profile audit
            </button>
          </div>
        </div>
        {profileAudit ? (
          <div className="detail-grid">
            <article className="info-card">
              <div className="info-card-title">
                <UserSearch size={16} />
                <strong>Profile score</strong>
              </div>
              <p>{profileAudit.score}/100 for {profileAudit.username}</p>
              <ul>{profileAudit.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="info-card">
              <div className="info-card-title">
                <Sparkles size={16} />
                <strong>Improvement checklist</strong>
              </div>
              <ul>{profileAudit.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="copy-block job-card-full">
              <div className="info-card-title">
                <BriefcaseBusiness size={16} />
                <strong>README suggestions</strong>
              </div>
              <ul>{profileAudit.readmeSuggestions.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
        ) : (
          <p className="muted-copy">Pro and above unlock profile audits and README suggestions.</p>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Per-contribution assets</p>
            <h2>Editable job-search content from your portfolio tracker.</h2>
          </div>
        </div>
        {selectedPortfolioEntry ? (
          <div className="job-mode-grid">
            <label className="job-card">
              <div className="info-card-title">
                <Sparkles size={16} />
                <strong>LinkedIn short</strong>
              </div>
              <textarea
                rows={4}
                value={selectedPortfolioEntry.linkedInShort}
                disabled={!entitlements.features["linkedin-generator"]}
                onChange={(event) => onPortfolioChange({ ...selectedPortfolioEntry, linkedInShort: event.target.value })}
              />
            </label>
            <label className="job-card">
              <div className="info-card-title">
                <Sparkles size={16} />
                <strong>LinkedIn medium</strong>
              </div>
              <textarea
                rows={5}
                value={selectedPortfolioEntry.linkedInMedium}
                disabled={!entitlements.features["linkedin-generator"]}
                onChange={(event) => onPortfolioChange({ ...selectedPortfolioEntry, linkedInMedium: event.target.value, linkedInPost: event.target.value })}
              />
            </label>
            <label className="job-card job-card-full">
              <div className="info-card-title">
                <Sparkles size={16} />
                <strong>LinkedIn detailed</strong>
              </div>
              <textarea
                rows={6}
                value={selectedPortfolioEntry.linkedInDetailed}
                disabled={!entitlements.features["linkedin-generator"]}
                onChange={(event) => onPortfolioChange({ ...selectedPortfolioEntry, linkedInDetailed: event.target.value })}
              />
            </label>
            <label className="job-card">
              <div className="info-card-title">
                <BriefcaseBusiness size={16} />
                <strong>Situation</strong>
              </div>
              <textarea
                rows={3}
                value={selectedPortfolioEntry.interviewSituation}
                disabled={!entitlements.features["interview-star-generator"]}
                onChange={(event) => onPortfolioChange({ ...selectedPortfolioEntry, interviewSituation: event.target.value })}
              />
            </label>
            <label className="job-card">
              <div className="info-card-title">
                <BriefcaseBusiness size={16} />
                <strong>Task</strong>
              </div>
              <textarea
                rows={3}
                value={selectedPortfolioEntry.interviewTask}
                disabled={!entitlements.features["interview-star-generator"]}
                onChange={(event) => onPortfolioChange({ ...selectedPortfolioEntry, interviewTask: event.target.value })}
              />
            </label>
            <label className="job-card">
              <div className="info-card-title">
                <BriefcaseBusiness size={16} />
                <strong>Action</strong>
              </div>
              <textarea
                rows={4}
                value={selectedPortfolioEntry.interviewAction}
                disabled={!entitlements.features["interview-star-generator"]}
                onChange={(event) => onPortfolioChange({ ...selectedPortfolioEntry, interviewAction: event.target.value })}
              />
            </label>
            <label className="job-card">
              <div className="info-card-title">
                <BriefcaseBusiness size={16} />
                <strong>Result</strong>
              </div>
              <textarea
                rows={4}
                value={selectedPortfolioEntry.interviewResult}
                disabled={!entitlements.features["interview-star-generator"]}
                onChange={(event) =>
                  onPortfolioChange({
                    ...selectedPortfolioEntry,
                    interviewResult: event.target.value,
                    interviewStarStory: `Situation: ${selectedPortfolioEntry.interviewSituation} Task: ${selectedPortfolioEntry.interviewTask} Action: ${selectedPortfolioEntry.interviewAction} Result: ${event.target.value}`
                  })
                }
              />
            </label>
            <label className="job-card job-card-full">
              <div className="info-card-title">
                <Share2 size={16} />
                <strong>Recruiter message</strong>
              </div>
              <textarea
                rows={4}
                value={selectedPortfolioEntry.recruiterOutreach}
                disabled={!entitlements.features["recruiter-share-link"]}
                onChange={(event) =>
                  onPortfolioChange({ ...selectedPortfolioEntry, recruiterOutreach: event.target.value })
                }
              />
            </label>
          </div>
        ) : (
          <p className="muted-copy">Save an issue to the portfolio tracker to build proof-of-work assets around it.</p>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Exportable GitHub resume</p>
            <h2>Markdown built from your tracked contributions.</h2>
          </div>
        </div>
        <article className="copy-block">
          <pre>{githubResumeMarkdown || "Export a GitHub resume to preview the generated markdown here."}</pre>
        </article>
      </section>
    </div>
  );
}
