import { roadmapPhases } from "../data/roadmap";

export function Roadmap() {
  return (
    <div className="page">
      <section className="site-section">
        <div className="section-heading">
          <span className="section-eyebrow">Roadmap</span>
          <h2>What ships first, and what expands next.</h2>
          <p>ContributorOps starts with proof-of-work infrastructure and expands into career and team intelligence.</p>
        </div>
        <div className="roadmap-grid">
          {roadmapPhases.map((phase) => (
            <article key={phase.title} className="roadmap-card">
              <h3>{phase.title}</h3>
              <ul>
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
