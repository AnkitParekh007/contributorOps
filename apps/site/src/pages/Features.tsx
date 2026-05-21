import { Link } from "react-router-dom";
import { FeatureCard } from "../components/FeatureCard";
import { Section } from "../components/Section";
import { features } from "../data/features";

export function Features() {
  return (
    <div className="page">
      <Section
        eyebrow="Features"
        title="Everything the product needs to turn contributions into proof."
        description="ContributorOps is designed as a contribution intelligence layer first, and a career packaging layer second."
      >
        <div className="feature-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Core workflows"
        title="How the modules fit together."
        description="The platform follows a fixed path: find work, scope it, validate it, and package the result into public proof."
      >
        <div className="timeline">
          <article className="timeline-step">
            <span>01</span>
            <h3>Discover the right issue</h3>
            <p>Job-matched filters surface issues that align with the role you are targeting next.</p>
          </article>
          <article className="timeline-step">
            <span>02</span>
            <h3>Prepare a better contribution</h3>
            <p>Contribution plans, maintainer-friendly drafts, and PR quality checks reduce noise before submission.</p>
          </article>
          <article className="timeline-step">
            <span>03</span>
            <h3>Convert the work into career proof</h3>
            <p>Portfolio pages, resume bullets, LinkedIn posts, and STAR stories come from the same real contribution.</p>
          </article>
        </div>
      </Section>

      <Section
        id="features-cta"
        eyebrow="Next step"
        title="Read the docs, then decide which plan fits."
        description="The business site is documentation-first. Product execution happens in the ContributorOps application."
      >
        <div className="cta-panel">
          <Link to="/docs" className="button-primary">
            Read the docs
          </Link>
          <Link to="/pricing" className="button-secondary">
            See pricing
          </Link>
        </div>
      </Section>
    </div>
  );
}
