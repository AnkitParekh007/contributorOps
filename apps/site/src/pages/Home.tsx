import { Link } from "react-router-dom";
import { FeatureCard } from "../components/FeatureCard";
import { Hero } from "../components/Hero";
import { PricingCard } from "../components/PricingCard";
import { Section } from "../components/Section";
import { features } from "../data/features";
import { pricingPlans } from "../data/pricing";

const outcomes = [
  "Build a public proof-of-work trail instead of relying on generic side-project claims.",
  "Translate one real contribution into resume bullets, LinkedIn posts, and interview stories.",
  "Improve maintainer trust by showing preparation, validation, and honest contribution intent.",
];

export function Home() {
  return (
    <div className="page">
      <Hero />

      <Section
        id="problem"
        eyebrow="Problem"
        title="Most developers have activity, but not enough visible proof."
        description="ContributorOps is built for developers who want real OSS contributions to become stronger hiring signal."
      >
        <div className="two-column">
          <article className="content-card">
            <h3>What goes wrong today</h3>
            <p>
              Developers find random issues, lose context, draft weak PRs, and fail to convert the
              work into durable career assets.
            </p>
          </article>
          <article className="content-card">
            <h3>What ContributorOps fixes</h3>
            <p>
              It turns open-source contribution discovery, planning, PR drafting, and proof-of-work
              packaging into one clear workflow.
            </p>
          </article>
        </div>
      </Section>

      <Section
        id="solution"
        eyebrow="Solution"
        title="A human-approved contribution intelligence platform."
        description="Not a spam bot. Not fake contribution farming. Just structured OSS execution and career packaging."
      >
        <div className="solution-grid">
          <article className="content-card">
            <h3>Discover</h3>
            <p>Find high-quality issues across API, backend, Angular, platform, and developer-tooling ecosystems.</p>
          </article>
          <article className="content-card">
            <h3>Prepare</h3>
            <p>Build contribution plans, maintainer-friendly drafts, validation steps, and PR quality signals.</p>
          </article>
          <article className="content-card">
            <h3>Prove</h3>
            <p>Publish public portfolio pages and export job-search assets that come from real work.</p>
          </article>
        </div>
      </Section>

      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="Structured contribution loops without trust-destroying automation."
        description="ContributorOps is designed around quality, traceability, and maintainer trust."
      >
        <div className="timeline">
          <article className="timeline-step">
            <span>01</span>
            <h3>Match issues to career goals</h3>
            <p>Use job-targeted issue discovery instead of browsing random open-source noise.</p>
          </article>
          <article className="timeline-step">
            <span>02</span>
            <h3>Generate a contribution plan</h3>
            <p>Scope the likely files, validation path, maintainer question, and PR narrative before coding.</p>
          </article>
          <article className="timeline-step">
            <span>03</span>
            <h3>Turn the work into proof</h3>
            <p>Package the output into portfolio pages, resume bullets, LinkedIn drafts, and interview stories.</p>
          </article>
        </div>
      </Section>

      <Section
        id="features"
        eyebrow="Core features"
        title="Core product modules"
        description="Everything is aligned around real contributions becoming visible career leverage."
      >
        <div className="feature-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
        <div className="section-cta">
          <Link to="/features" className="button-secondary">
            Explore all features
          </Link>
        </div>
      </Section>

      <Section
        id="career-outcomes"
        eyebrow="Career outcomes"
        title="Convert contributions into hiring signal."
        description="The platform is opinionated about packaging work into recruiter-friendly evidence."
      >
        <div className="outcomes-grid">
          {outcomes.map((item) => (
            <article key={item} className="content-card">
              <p>{item}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="safety"
        eyebrow="Safety-first automation"
        title="Human-approved by design."
        description="ContributorOps does not market mass-commenting, mass-PR opening, or deceptive contribution behavior."
      >
        <div className="safety-grid">
          <article className="content-card">
            <h3>Level 1: Research Mode</h3>
            <p>Discover issues, score opportunities, and generate contribution plans with no external writes.</p>
          </article>
          <article className="content-card">
            <h3>Level 2: Draft Mode</h3>
            <p>Draft local changes, PR copy, and test paths. User review remains mandatory.</p>
          </article>
          <article className="content-card">
            <h3>Level 3: Approved Auto-Contribute Mode</h3>
            <p>Explicit approvals gate comments, branches, and draft PRs. Scheduled jobs never write to external repos.</p>
          </article>
        </div>
      </Section>

      <Section
        id="product-preview"
        eyebrow="Product preview"
        title="Preview the contribution workflow."
        description="The product turns one real contribution into a plan, a reviewable PR package, and job-search-ready proof."
      >
        <div className="solution-grid">
          <article className="content-card">
            <h3>Job-matched discovery</h3>
            <p>Filter and score issues by target role so the work aligns with the jobs you want next.</p>
          </article>
          <article className="content-card">
            <h3>Contribution planning</h3>
            <p>Surface likely files, testing strategy, maintainer question drafts, and PR body suggestions up front.</p>
          </article>
          <article className="content-card">
            <h3>Proof-of-work exports</h3>
            <p>Generate resume bullets, LinkedIn posts, interview STAR stories, and public portfolio assets from the same contribution.</p>
          </article>
        </div>
      </Section>

      <Section
        id="pricing-preview"
        eyebrow="Pricing preview"
        title="Monetization-ready without live billing."
        description="Free, Pro, Career, and Team tiers exist today as product packaging and feature-flag boundaries."
      >
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
        <div className="section-cta">
          <Link to="/pricing" className="button-secondary">
            View full pricing
          </Link>
        </div>
      </Section>

      <Section
        id="cta"
        eyebrow="Call to action"
        title="Start building a public contribution record that hiring teams can verify."
        description="Use the docs to understand the workflow, the safety model, and the GitHub Pages deployment setup."
      >
        <div className="cta-panel">
          <Link to="/docs" className="button-primary">
            Start Building Your Portfolio
          </Link>
          <Link to="/safety" className="button-secondary">
            Read the Safety Policy
          </Link>
        </div>
      </Section>
    </div>
  );
}
