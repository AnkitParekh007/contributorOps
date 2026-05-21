import { BriefcaseBusiness, Github, MessageSquareMore, Sparkles } from "lucide-react";
import type { FeatureFlags, IssueCandidate, PortfolioEntry } from "../types";

interface JobModePanelProps {
  issue: IssueCandidate | null;
  portfolioEntry: PortfolioEntry | null;
  onPortfolioChange: (entry: PortfolioEntry) => void;
  entitlements: FeatureFlags;
}

export function JobModePanel({ issue, portfolioEntry, onPortfolioChange, entitlements }: JobModePanelProps) {
  const source = portfolioEntry
    ? {
        resumeBullet: portfolioEntry.resumeBullet,
        linkedInPost: portfolioEntry.linkedInPost,
        interviewStarStory: portfolioEntry.interviewStarStory,
        recruiterOutreach: portfolioEntry.recruiterOutreach,
        githubProfileSnippet: portfolioEntry.githubProfileSnippet
      }
    : issue?.jobMode;

  if (!source) {
    return (
      <section className="panel empty-panel">
        <h2>Job Mode</h2>
        <p>Pick an issue or portfolio entry to convert the work into recruiter-ready assets.</p>
      </section>
    );
  }

  const editable = Boolean(portfolioEntry);
  const locked = !entitlements.features["linkedin-generator"];

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Job Mode</p>
          <h2>Turn each contribution into career proof.</h2>
        </div>
      </div>
      {locked ? <p className="muted-copy">Career plan unlocks editable LinkedIn, interview, recruiter, and GitHub profile assets.</p> : null}

      <div className="job-mode-grid">
        <label className="job-card">
          <div className="info-card-title">
            <BriefcaseBusiness size={16} />
            <strong>Resume bullet</strong>
          </div>
          <textarea
            rows={4}
            value={source.resumeBullet}
            readOnly={!editable || locked}
            onChange={(event) =>
              portfolioEntry && onPortfolioChange({ ...portfolioEntry, resumeBullet: event.target.value })
            }
          />
        </label>

        <label className="job-card">
          <div className="info-card-title">
            <Sparkles size={16} />
            <strong>LinkedIn post draft</strong>
          </div>
          <textarea
            rows={5}
            value={source.linkedInPost}
            readOnly={!editable || locked}
            onChange={(event) =>
              portfolioEntry && onPortfolioChange({ ...portfolioEntry, linkedInPost: event.target.value })
            }
          />
        </label>

        <label className="job-card">
          <div className="info-card-title">
            <MessageSquareMore size={16} />
            <strong>Interview STAR story</strong>
          </div>
          <textarea
            rows={6}
            value={source.interviewStarStory}
            readOnly={!editable || locked}
            onChange={(event) =>
              portfolioEntry &&
              onPortfolioChange({ ...portfolioEntry, interviewStarStory: event.target.value })
            }
          />
        </label>

        <label className="job-card">
          <div className="info-card-title">
            <MessageSquareMore size={16} />
            <strong>Recruiter outreach message</strong>
          </div>
          <textarea
            rows={5}
            value={source.recruiterOutreach}
            readOnly={!editable || locked}
            onChange={(event) =>
              portfolioEntry && onPortfolioChange({ ...portfolioEntry, recruiterOutreach: event.target.value })
            }
          />
        </label>

        <label className="job-card job-card-full">
          <div className="info-card-title">
            <Github size={16} />
            <strong>GitHub profile README snippet</strong>
          </div>
          <textarea
            rows={4}
            value={source.githubProfileSnippet}
            readOnly={!editable || locked}
            onChange={(event) =>
              portfolioEntry && onPortfolioChange({ ...portfolioEntry, githubProfileSnippet: event.target.value })
            }
          />
        </label>
      </div>
    </section>
  );
}
