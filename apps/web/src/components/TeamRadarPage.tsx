import { Activity, Users } from "lucide-react";
import type { FeatureFlags, TeamRadarItem } from "../types";

interface TeamRadarPageProps {
  entitlements: FeatureFlags;
  radar: TeamRadarItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function TeamRadarPage({ entitlements, radar, isLoading, onRefresh }: TeamRadarPageProps) {
  if (!entitlements.features["team-dashboard"]) {
    return (
      <section className="panel empty-panel">
        <h2>Team dashboard</h2>
        <p>The Team plan unlocks shared repo radar and team-level OSS sourcing signals.</p>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="panel hero-panel">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow">Team radar</span>
            <span className="mode-pill">team plan</span>
          </div>
          <h1>Shared repo radar for contribution sourcing.</h1>
          <p>
            Surface which repos have the best current opportunity density so a hiring-facing team
            can coordinate contributions instead of duplicating work.
          </p>
        </div>
        <div className="mission-card">
          <div className="mission-title">
            <Users size={18} />
            <strong>Shared repo radar</strong>
          </div>
          <p>{radar.length} repos ranked for contribution intent.</p>
          <div className="mission-meta">
            <span>Shared sourcing view</span>
            <button type="button" className="secondary-button" disabled={isLoading} onClick={onRefresh}>
              <Activity size={14} />
              Refresh radar
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Repo radar</p>
            <h2>Where the team should contribute next.</h2>
          </div>
        </div>
        <div className="candidate-stack">
          {radar.map((item) => (
            <article key={item.repoFullName} className="candidate-card selected">
              <div className="candidate-card-top">
                <div>
                  <h3>{item.repoFullName}</h3>
                  <p>{item.whyNow}</p>
                </div>
                <span className="score-badge">{item.averageScore}/100</span>
              </div>
              <div className="candidate-card-bottom">
                <span>{item.openOpportunities} open opportunities</span>
                <span>{item.topLabels.join(", ")}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
