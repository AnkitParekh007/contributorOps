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
        description="No spam bot positioning. No fake contribution farming. Just structured OSS execution and career packaging."
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
        eyebrow="Features"
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
            View all features →
          </Link>
        </div>
      </Section>

      <Section
        id="comparison"
        eyebrow="Why ContributorOps"
        title="Not all contribution tools are the same."
        description="ContributorOps is built around career proof, not activity metrics."
      >
        <div style={{ overflowX: "auto" }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Random GitHub Search</th>
                <th>Generic AI Coding Bot</th>
                <th className="col-accent">ContributorOps</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Issue targeting</td>
                <td>Scattered, random</td>
                <td>Not career-focused</td>
                <td className="col-accent">Job-matched by role</td>
              </tr>
              <tr>
                <td>Contribution planning</td>
                <td>None</td>
                <td>Generic suggestions</td>
                <td className="col-accent">Scoped daily plan</td>
              </tr>
              <tr>
                <td>PR quality feedback</td>
                <td>No feedback</td>
                <td>May look spammy</td>
                <td className="col-accent">Quality checker + audit</td>
              </tr>
              <tr>
                <td>Portfolio packaging</td>
                <td>None</td>
                <td>None</td>
                <td className="col-accent">Portfolio + resume export</td>
              </tr>
              <tr>
                <td>Safety model</td>
                <td>N/A</td>
                <td>Uncontrolled</td>
                <td className="col-accent">Human-approved only</td>
              </tr>
              <tr>
                <td>Hiring signal</td>
                <td>Weak</td>
                <td>Low-trust</td>
                <td className="col-accent">Strong, verifiable proof</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="trust"
        eyebrow="Built for trust"
        title="Not a spam bot. Not fake contribution farming."
        description="ContributorOps is the only contribution intelligence platform built explicitly around maintainer trust, human approval, and real career proof."
      >
        <div className="trust-grid">
          <article className="content-card">
            <h3>Human-approved only</h3>
            <p>Every external action — comments, branches, draft PRs — requires explicit human approval. Nothing is automated without your sign-off.</p>
          </article>
          <article className="content-card">
            <h3>Real contributions</h3>
            <p>ContributorOps helps you find, scope, and prepare real contributions. It does not fake activity, inflate stats, or generate low-quality noise.</p>
          </article>
          <article className="content-card">
            <h3>Maintainer-first design</h3>
            <p>Contribution plans include maintainer questions, validation steps, and scoped PRs — designed to respect maintainer time from the first message.</p>
          </article>
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
        id="pricing-preview"
        eyebrow="Pricing"
        title="Monetization-ready without real payments yet."
        description="Free, Pro, Career, and Team plans — billing coming soon."
      >
        <div className="pricing-grid">
          {pricingPlans.slice(0, 3).map((plan) => (
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
        id="waitlist-cta"
        eyebrow="Early Access"
        title="Get early access to ContributorOps."
        description="Payments and accounts are not live yet. Join the waitlist to be notified at launch."
      >
        <div className="cta-panel">
          <Link to="/waitlist" className="button-primary">
            Join the Waitlist
          </Link>
          <Link to="/demo" className="button-secondary">
            See the Demo
          </Link>
        </div>
      </Section>
    </div>
  );
}
