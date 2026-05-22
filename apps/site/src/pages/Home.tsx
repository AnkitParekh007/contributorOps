import { Link } from "react-router-dom";
import { FeatureCard } from "../components/FeatureCard";
import { Hero } from "../components/Hero";
import { PricingCard } from "../components/PricingCard";
import { Section } from "../components/Section";
import { features } from "../data/features";
import { pricingPlans } from "../data/pricing";
import { Search, FileCode2, BarChart3, Briefcase, ArrowRight } from "lucide-react";

const WORKFLOW = [
  {
    num: "01",
    icon: <Search size={20} />,
    title: "Discover",
    desc: "AI-scored issue radar surfaces the highest-signal opportunities matched to your target role and stack.",
    color: "feature-icon-discover",
  },
  {
    num: "02",
    icon: <FileCode2 size={20} />,
    title: "Prepare",
    desc: "Generate a contribution plan with scoped files, maintainer questions, PR body, and a test strategy.",
    color: "feature-icon-prepare",
  },
  {
    num: "03",
    icon: <BarChart3 size={20} />,
    title: "Validate",
    desc: "Run a PR quality check — scope, test coverage, tone, and maintainer-readiness scored before submit.",
    color: "feature-icon-validate",
  },
  {
    num: "04",
    icon: <Briefcase size={20} />,
    title: "Prove",
    desc: "Package the finished work into resume bullets, LinkedIn posts, STAR stories, and a portfolio page.",
    color: "feature-icon-prove",
  },
];

export function Home() {
  return (
    <div className="page page-home">
      <Hero />

      {/* ── Before / After ─────────────────────────────────── */}
      <Section
        id="problem"
        eyebrow="Problem"
        title="Most developers have activity, but not enough visible proof."
        description="ContributorOps is built for developers who want real OSS contributions to become stronger hiring signal."
      >
        <div className="before-after-grid">
          <div className="before-card">
            <h3>Without ContributorOps</h3>
            {[
              "Find a random issue, lose context, abandon it",
              "Draft a weak PR with no test plan or maintainer context",
              "Contribution goes unnoticed in resume",
              "Struggle to explain the work in interviews",
              "No public proof beyond vague GitHub activity",
            ].map((item) => (
              <div key={item} className="ba-item">
                <span className="ba-cross">✕</span>
                {item}
              </div>
            ))}
          </div>

          <div className="before-after-divider">
            <span className="before-after-arrow">→</span>
            <span>vs</span>
          </div>

          <div className="after-card">
            <h3>With ContributorOps</h3>
            {[
              "Job-matched issue finder surfaces the right work",
              "AI plan scopes files and PR narrative up front",
              "PR quality check before submission",
              "STAR stories and resume bullets generated automatically",
              "Public portfolio page with verifiable contribution history",
            ].map((item) => (
              <div key={item} className="ba-item">
                <span className="ba-check">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 4-step workflow ─────────────────────────────────── */}
      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="Structured contribution loops without trust-destroying automation."
        description="ContributorOps follows a fixed intelligent path from discovery to career proof."
      >
        <div className="workflow-row">
          {WORKFLOW.map((step, i) => (
            <div key={step.num} className="workflow-step">
              <div className="workflow-step-header">
                <span className={`feature-icon-wrap ${step.color}`}>{step.icon}</span>
                <span className="workflow-node">{step.num}</span>
                {i < WORKFLOW.length - 1 && (
                  <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.3 }} />
                )}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Core features ───────────────────────────────────── */}
      <Section
        id="features"
        eyebrow="Core features"
        title="Intelligence modules for every stage of the contribution lifecycle."
        description="Every module is aligned around real contributions becoming visible career leverage."
      >
        <div className="feature-grid">
          {features.slice(0, 6).map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
        <div className="section-cta">
          <Link to="/features" className="button-secondary">
            Explore all features
          </Link>
        </div>
      </Section>

      {/* ── Safety preview ──────────────────────────────────── */}
      <Section
        id="safety"
        eyebrow="Safety-first automation"
        title="Human-approved by design."
        description="ContributorOps does not market mass-commenting, mass-PR opening, or deceptive contribution behavior."
      >
        <div className="safety-mode-grid">
          {[
            {
              num: "01",
              title: "Research Mode",
              body: "Discover issues, score opportunities, and generate plans with zero external writes.",
              active: false,
            },
            {
              num: "02",
              title: "Draft Mode",
              body: "Draft local changes, PR copy, and test paths. User review is mandatory before any submission.",
              active: false,
            },
            {
              num: "03",
              title: "Approved Auto-Contribute",
              body: "Explicit approvals gate all comments, branches, and draft PRs. Scheduled jobs never write to external repos.",
              active: true,
            },
          ].map((mode) => (
            <div key={mode.num} className={`safety-mode${mode.active ? " safety-mode-active" : ""}`}>
              <span className="safety-mode-num">{mode.num}</span>
              <h3>{mode.title}</h3>
              <p>{mode.body}</p>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <Link to="/safety" className="button-secondary">Read full safety policy</Link>
        </div>
      </Section>

      {/* ── Pricing preview ─────────────────────────────────── */}
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
          <Link to="/pricing" className="button-secondary">View full pricing</Link>
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <Section
        id="cta"
        eyebrow="Get started"
        title="Start building a public contribution record that hiring teams can verify."
        description="Use the docs to understand the workflow, the safety model, and the GitHub Pages deployment."
      >
        <div className="cta-panel">
          <Link to="/docs" className="button-primary">Start Building Your Portfolio</Link>
          <Link to="/safety" className="button-secondary">Read the Safety Policy</Link>
        </div>
      </Section>
    </div>
  );
}
