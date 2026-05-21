import { ExternalLink, Github, Sparkles } from "lucide-react";
import type { PublicPortfolioProfile } from "../types";

interface PublicPortfolioPageProps {
  profile: PublicPortfolioProfile | null;
  error?: string;
}

export function PublicPortfolioPage({ profile, error }: PublicPortfolioPageProps) {
  if (error) {
    return (
      <main className="public-portfolio-shell">
        <section className="public-portfolio-card">
          <h1>Public portfolio unavailable</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="public-portfolio-shell">
        <section className="public-portfolio-card">
          <h1>Loading public portfolio</h1>
          <p>Fetching open-source proof of work.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="public-portfolio-shell">
      <section className="public-portfolio-card">
        <p className="eyebrow">ContributorOps Public Portfolio</p>
        <h1>{profile.owner}</h1>
        <p className="public-headline">{profile.headline}</p>
        <p className="muted-copy">{profile.summary}</p>
        <div className="button-row">
          <a className="primary-button" href={profile.recruiterShareUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            Recruiter share link
          </a>
        </div>
      </section>

      <section className="public-portfolio-grid">
        <article className="public-portfolio-card">
          <div className="info-card-title">
            <Github size={16} />
            <strong>GitHub resume snapshot</strong>
          </div>
          <pre>{profile.githubResumeMarkdown}</pre>
        </article>

        <article className="public-portfolio-card">
          <div className="info-card-title">
            <Sparkles size={16} />
            <strong>Contribution highlights</strong>
          </div>
          <div className="public-entry-stack">
            {profile.entries.map((entry) => (
              <article key={`${entry.selectedRepo}-${entry.issueUrl}`} className="public-entry-card">
                <strong>{entry.selectedRepo}</strong>
                <p>{entry.resumeBullet}</p>
                <div className="button-row">
                  {entry.issueUrl ? (
                    <a href={entry.issueUrl} target="_blank" rel="noreferrer">
                      Issue <ExternalLink size={14} />
                    </a>
                  ) : null}
                  {entry.prUrl ? (
                    <a href={entry.prUrl} target="_blank" rel="noreferrer">
                      PR <ExternalLink size={14} />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
