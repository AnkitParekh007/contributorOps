import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Turn Open Source Contributions Into Job-Ready Proof of Work</h1>
        <p>
          ContributorOps helps developers discover high-quality issues, prepare better PRs, build
          public portfolios, and convert real contributions into resume bullets, LinkedIn posts,
          and interview stories.
        </p>
        <div className="hero-actions">
          <Link to="/docs" className="button-primary">
            Start Building Your Portfolio
          </Link>
          <Link to="/docs" className="button-secondary">
            Read the Docs
          </Link>
        </div>
      </div>
      <div className="hero-preview">
        <div className="preview-shell">
          <div className="preview-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-grid">
            <article>
              <h3>Daily plan</h3>
              <p>Target one tractable maintainer-friendly issue and prepare the smallest credible change.</p>
            </article>
            <article>
              <h3>PR quality</h3>
              <p>Score: 88/100. Strong issue alignment, explicit validation, focused scope.</p>
            </article>
            <article>
              <h3>Proof of work</h3>
              <p>Resume bullet, LinkedIn post, recruiter note, and STAR story generated from one real contribution.</p>
            </article>
            <article>
              <h3>Safety model</h3>
              <p>Human approval required. No mass-commenting. No mass PR creation. No deceptive contribution loops.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
