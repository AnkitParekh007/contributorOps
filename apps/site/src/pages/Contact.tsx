import { Section } from "../components/Section";

export function Contact() {
  return (
    <div className="page">
      <Section
        eyebrow="Contact"
        title="Get in touch."
        description="ContributorOps is a solo-founded product in pre-launch. The best way to reach us is GitHub."
      >
        <div className="two-column">
          <article className="content-card">
            <h3>Open a GitHub Issue</h3>
            <p>
              For bugs, feature requests, or product feedback — open an issue on GitHub. Issues are
              triaged weekly.
            </p>
            <a
              href="https://github.com/AnkitParekh007/contributorOps/issues"
              target="_blank"
              rel="noreferrer"
              className="button-primary"
              style={{ marginTop: 16, display: "inline-flex" }}
            >
              Open an Issue
            </a>
          </article>

          <article className="content-card">
            <h3>Start a Discussion</h3>
            <p>
              For use case questions, integrations, or general product conversation — GitHub
              Discussions is the right place.
            </p>
            <a
              href="https://github.com/AnkitParekh007/contributorOps/discussions"
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
              style={{ marginTop: 16, display: "inline-flex" }}
            >
              Start a Discussion
            </a>
          </article>
        </div>

        <article className="docs-section-card" style={{ marginTop: 28 }}>
          <h2>Founder Notes</h2>
          <p>
            ContributorOps is built by a solo founder who believes that real open-source contributions
            are one of the strongest signals a developer can show — but the workflow to create and
            package that proof is too scattered to be useful.
          </p>
          <p>
            If you're a developer, bootcamp, or recruiter with a specific use case — please reach out
            via GitHub. Early feedback directly shapes the product roadmap.
          </p>
          <p>
            If you're a maintainer who is concerned about how the platform interacts with your
            project, see the{" "}
            <a href="#/safety" style={{ color: "var(--accent)" }}>Safety Policy</a>. The platform is
            designed explicitly around maintainer trust.
          </p>
        </article>
      </Section>
    </div>
  );
}
