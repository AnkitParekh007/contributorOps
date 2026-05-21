import { PricingCard } from "../components/PricingCard";
import { Section } from "../components/Section";
import { pricingPlans } from "../data/pricing";

const comparisonRows = [
  { feature: "Issue discovery", free: "Basic", pro: "Daily", career: "Daily", team: "Daily" },
  { feature: "Contribution plan limit", free: "3 per week", pro: "Unlimited", career: "Unlimited", team: "Unlimited" },
  { feature: "Job-matched scoring", free: "-", pro: "Yes", career: "Yes", team: "Yes" },
  { feature: "PR quality checker", free: "-", pro: "Yes", career: "Yes", team: "Yes" },
  { feature: "Portfolio page", free: "Manual", pro: "Hosted", career: "Hosted", team: "Hosted" },
  { feature: "Resume bullets", free: "-", pro: "Yes", career: "Yes", team: "Yes" },
  { feature: "LinkedIn drafts", free: "-", pro: "Yes", career: "Yes", team: "Yes" },
  { feature: "Interview STAR stories", free: "-", pro: "-", career: "Yes", team: "Yes" },
  { feature: "Recruiter tools", free: "-", pro: "-", career: "Yes", team: "Yes" },
  { feature: "GitHub profile audit", free: "-", pro: "-", career: "Yes", team: "Yes" },
  { feature: "Team dashboard", free: "-", pro: "-", career: "-", team: "Yes" },
  { feature: "Shared repo radar", free: "-", pro: "-", career: "-", team: "Yes" },
];

const faqs = [
  {
    q: "Are payments live?",
    a: "No. This pricing page is mock billing only. It exists to show packaging, upgrade prompts, and future monetization structure.",
  },
  {
    q: "Can I self-host for free?",
    a: "Yes. The repo is open-source and the static site deploys to GitHub Pages without any paid service.",
  },
  {
    q: "What happens when billing launches?",
    a: "The current plan and feature-flag structure is already in place, so Stripe or Lemon Squeezy can be added later without changing the product packaging.",
  },
  {
    q: "What is the difference between Pro and Career?",
    a: "Pro covers contribution execution. Career adds the hiring layer: resume, LinkedIn, interview stories, recruiter tools, and GitHub profile audit surfaces.",
  },
  {
    q: "Why is Team separate?",
    a: "Team is designed for bootcamps, cohorts, and engineering teams that need shared repo radar, contribution visibility, and team-level reporting.",
  },
];

export function Pricing() {
  return (
    <div className="page">
      <Section
        eyebrow="Pricing"
        title="Simple plans for contribution intelligence and career packaging."
        description="No real payments yet. These tiers exist to show packaging, feature flags, and future upgrade paths."
      >
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Compare"
        title="Feature comparison"
        description="Every plan starts with the same human-approved safety model."
      >
        <div style={{ overflowX: "auto" }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Pro</th>
                <th>Career</th>
                <th className="col-accent">Team</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  <td style={{ color: row.free === "-" ? "var(--muted)" : "var(--text)" }}>{row.free}</td>
                  <td style={{ color: row.pro === "-" ? "var(--muted)" : "var(--accent-2)" }}>{row.pro}</td>
                  <td style={{ color: row.career === "-" ? "var(--muted)" : "var(--accent)" }}>{row.career}</td>
                  <td className="col-accent" style={{ color: row.team === "-" ? "var(--muted)" : "var(--accent-3)" }}>{row.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        eyebrow="FAQ"
        title="Common questions"
        description="Everything about pricing, payments, and the current static business site."
      >
        <div className="pricing-faq">
          {faqs.map((faq) => (
            <div key={faq.q} className="faq-item">
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
