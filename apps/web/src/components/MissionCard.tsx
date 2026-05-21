import { Crosshair, ShieldCheck } from "lucide-react";
import type { DailyPlan } from "../types";

interface MissionCardProps {
  plan: DailyPlan | null;
  modeLabel: string;
}

export function MissionCard({ plan, modeLabel }: MissionCardProps) {
  return (
    <section className="panel hero-panel">
      <div className="hero-copy">
        <div className="eyebrow-row">
          <span className="eyebrow">ContributorOps</span>
          <span className="mode-pill">{modeLabel}</span>
        </div>
        <h1>Daily contribution ops for backend and developer-tooling OSS.</h1>
        <p>
          Discover real issues, score them transparently, generate a deterministic plan, and turn
          each contribution into job-search proof without automating spam.
        </p>
      </div>
      <div className="mission-card">
        <div className="mission-title">
          <Crosshair size={18} />
          <strong>Daily contribution mission</strong>
        </div>
        <p>{plan?.mission || "Generate a mission to prioritize today's best contribution path."}</p>
        <div className="mission-meta">
          <span>{plan?.generatedAt ? new Date(plan.generatedAt).toLocaleString() : "No plan yet"}</span>
          <span className="safety-pill">
            <ShieldCheck size={14} />
            human approval required
          </span>
        </div>
      </div>
    </section>
  );
}
