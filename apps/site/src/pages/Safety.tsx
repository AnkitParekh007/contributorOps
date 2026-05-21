import { Section } from "../components/Section";

export function Safety() {
  return (
    <div className="page">
      <Section
        eyebrow="Safety"
        title="Human-approved contribution intelligence."
        description="ContributorOps is designed to build maintainer trust, not to game contribution metrics."
      >
        <div className="safety-grid">
          <article className="content-card">
            <h3>What it does not do</h3>
            <ul>
              <li>It does not mass-comment.</li>
              <li>It does not mass-open PRs.</li>
              <li>Scheduled jobs cannot write to external repos.</li>
            </ul>
          </article>
          <article className="content-card">
            <h3>Approval model</h3>
            <ul>
              <li>External comments require approval.</li>
              <li>External draft PRs require approval.</li>
              <li>Guardrails are designed to preserve maintainer trust.</li>
            </ul>
          </article>
        </div>

        <div className="timeline">
          <article className="timeline-step">
            <span>01</span>
            <h3>Research Mode</h3>
            <p>Discover repos and issues, score opportunities, and generate plans with no external GitHub writes.</p>
          </article>
          <article className="timeline-step">
            <span>02</span>
            <h3>Draft Mode</h3>
            <p>Generate local code suggestions, PR copy, and test instructions while keeping the user in control.</p>
          </article>
          <article className="timeline-step">
            <span>03</span>
            <h3>Approved Auto-Contribute Mode</h3>
            <p>Use explicit approvals for exact actions such as comments, fork branches, and draft PRs.</p>
          </article>
        </div>
      </Section>
    </div>
  );
}
