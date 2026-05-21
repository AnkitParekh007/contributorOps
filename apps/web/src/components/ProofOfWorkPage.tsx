import { BriefcaseBusiness, ExternalLink, FileOutput, Globe, Share2, Sparkles } from "lucide-react";
import type { BillingState, FeatureFlags, PortfolioEntry } from "../types";

interface ProofOfWorkPageProps {
  billing: BillingState;
  entitlements: FeatureFlags;
  portfolio: PortfolioEntry[];
  selectedPortfolioEntry: PortfolioEntry | null;
  githubResumeMarkdown: string;
  recruiterShareUrl: string;
  isLoading: boolean;
  onCreateShare: () => void;
  onExportResume: () => void;
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
  isLoading,
  onCreateShare,
  onExportResume,
  onBillingProfileChange,
  onPortfolioChange
}: ProofOfWorkPageProps) {
  const lockedCareer = !entitlements.features["github-resume-export"];
  const lockedPublic = !entitlements.features["public-portfolio"];

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
            <p className="section-kicker">Exportable GitHub resume</p>
            <h2>Markdown built from your tracked contributions.</h2>
          </div>
        </div>
        <article className="copy-block">
          <pre>{githubResumeMarkdown || "Export a GitHub resume to preview the generated markdown here."}</pre>
        </article>
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
                <strong>LinkedIn post</strong>
              </div>
              <textarea
                rows={5}
                value={selectedPortfolioEntry.linkedInPost}
                disabled={!entitlements.features["linkedin-generator"]}
                onChange={(event) =>
                  onPortfolioChange({ ...selectedPortfolioEntry, linkedInPost: event.target.value })
                }
              />
            </label>
            <label className="job-card">
              <div className="info-card-title">
                <BriefcaseBusiness size={16} />
                <strong>Interview STAR story</strong>
              </div>
              <textarea
                rows={6}
                value={selectedPortfolioEntry.interviewStarStory}
                disabled={!entitlements.features["interview-star-generator"]}
                onChange={(event) =>
                  onPortfolioChange({ ...selectedPortfolioEntry, interviewStarStory: event.target.value })
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
    </div>
  );
}
