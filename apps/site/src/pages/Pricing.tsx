import { useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "../components/Section";

interface Plan {
  name: string;
  monthly: number | null;
  tagline: string;
  bestFor: string;
  features: string[];
  featured?: boolean;
  isLifetime?: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    tagline: "Start with basic discovery and proof-of-work fundamentals.",
    bestFor: "Developers exploring the platform",
    features: [
      "Basic issue discovery",
      "3 contribution plans per week",
      "Manual portfolio tracker",
      "Basic docs",
    ],
  },
  {
    name: "Pro",
    monthly: 19,
    tagline: "Daily planning and stronger contribution execution quality.",
    bestFor: "Developers building visible OSS history",
    features: [
      "Daily contribution plans",
      "Job-matched issue finder",
      "PR quality checker",
      "Portfolio page",
      "Resume bullets",
      "LinkedIn drafts",
      "Safe auto-contribute guardrails",
    ],
    featured: true,
  },
  {
    name: "Career",
    monthly: 49,
    tagline: "Turn contributions into recruiting and interview assets.",
    bestFor: "Developers actively job searching",
    features: [
      "Everything in Pro",
      "Interview STAR story generator",
      "Recruiter outreach drafts",
      "GitHub profile audit",
      "Advanced proof-of-work exports",
      "Weekly career report",
    ],
  },
  {
    name: "Team",
    monthly: 199,
    tagline: "Coordinate open-source career building across cohorts or teams.",
    bestFor: "Bootcamps and engineering teams",
    features: [
      "Everything in Career (per seat)",
      "Team contribution dashboard",
      "Shared repo radar",
      "Team portfolio reports",
      "Admin controls",
      "Priority roadmap input",
    ],
  },
];

const founderPlan = {
  name: "Founder Lifetime",
  price: "$99",
  tagline: "Lifetime access for early supporters. No recurring charges.",
  bestFor: "Early supporters who want lifetime access",
  features: [
    "Everything in Career plan",
    "Lifetime access — one payment",
    "Priority feature requests",
    "Founder Discord channel access",
    "Direct input on product roadmap",
    "Grandfathered pricing forever",
  ],
};

const comparisonRows = [
  { feature: "Issue discovery", free: "3/week", pro: "Unlimited", career: "Unlimited", team: "Unlimited" },
  { feature: "Daily contribution plan", free: "—", pro: "✓", career: "✓", team: "✓" },
  { feature: "Job-matched scoring", free: "—", pro: "✓", career: "✓", team: "✓" },
  { feature: "PR quality checker", free: "—", pro: "✓", career: "✓", team: "✓" },
  { feature: "Portfolio page", free: "—", pro: "✓", career: "✓", team: "✓" },
  { feature: "Resume bullets", free: "—", pro: "✓", career: "✓", team: "✓" },
  { feature: "LinkedIn post generator", free: "—", pro: "✓", career: "✓", team: "✓" },
  { feature: "Interview STAR stories", free: "—", pro: "—", career: "✓", team: "✓" },
  { feature: "Recruiter outreach drafts", free: "—", pro: "—", career: "✓", team: "✓" },
  { feature: "GitHub profile audit", free: "—", pro: "—", career: "✓", team: "✓" },
  { feature: "Team radar", free: "—", pro: "—", career: "—", team: "✓" },
  { feature: "Admin controls", free: "—", pro: "—", career: "—", team: "✓" },
];

const faqs = [
  {
    q: "Are payments live?",
    a: "Not yet. All buttons currently join the waitlist. We'll notify you when billing launches.",
  },
  {
    q: "Can I self-host for free?",
    a: "Yes. The repo is open-source. Run it on your own infrastructure at no cost.",
  },
  {
    q: "What happens when billing launches?",
    a: "Waitlist members get early pricing and an extended free trial.",
  },
  {
    q: "Is there a refund policy?",
    a: "We'll publish a full refund policy before billing goes live. We intend to offer a 30-day refund window.",
  },
  {
    q: "What's the difference between Pro and Career?",
    a: "Pro covers contribution execution (finding issues, PR quality, portfolio). Career adds the hiring layer: interview stories, recruiter outreach, and profile audits.",
  },
];

function formatPrice(monthly: number | null, yearly: boolean): string {
  if (monthly === null) return "Contact";
  if (monthly === 0) return "$0";
  if (yearly) return `$${Math.round(monthly * 0.8)}/mo`;
  return `$${monthly}/mo`;
}

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="page">
      <Section
        eyebrow="Pricing"
        title="Simple plans for contribution intelligence and career packaging."
        description="No payments are implemented yet. All buttons join the waitlist."
      >
        <div className="pricing-toggle-row">
          <span className={yearly ? "" : "toggle-label-active"}>Monthly</span>
          <button
            type="button"
            className={`toggle-btn${yearly ? " active" : ""}`}
            aria-label="Toggle yearly billing"
            onClick={() => setYearly((y) => !y)}
          >
            <span className="toggle-knob" />
          </button>
          <span className={yearly ? "toggle-label-active" : ""}>
            Yearly <span className="yearly-tag">20% off</span>
          </span>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <article key={plan.name} className={`pricing-card${plan.featured ? " pricing-card-featured" : ""}`}>
              <div className="pricing-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>{plan.name}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: "0.82rem" }}>{plan.bestFor}</p>
                </div>
                <div>
                  <div className="pricing-price">{formatPrice(plan.monthly, yearly)}</div>
                  {yearly && plan.monthly !== null && plan.monthly > 0 && (
                    <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "var(--muted)", textAlign: "right" }}>
                      billed ${Math.round(plan.monthly * 0.8 * 12)}/yr
                    </p>
                  )}
                </div>
              </div>
              <p style={{ margin: 0 }}>{plan.tagline}</p>
              <ul className="pricing-list">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link to="/waitlist" className={plan.featured ? "button-primary" : "button-secondary"} style={{ textAlign: "center", justifyContent: "center" }}>
                Join Waitlist
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* Founder Lifetime */}
      <Section
        eyebrow="Limited Offer"
        title="Founder Lifetime Deal"
        description="One payment. Lifetime access. For early supporters who want to lock in now."
      >
        <article className="pricing-card pricing-card-featured" style={{ maxWidth: 560 }}>
          <div className="pricing-card-header">
            <div>
              <h3 style={{ margin: 0 }}>{founderPlan.name}</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.82rem" }}>{founderPlan.bestFor}</p>
            </div>
            <div className="pricing-price">{founderPlan.price} <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--muted)" }}>one-time</span></div>
          </div>
          <p style={{ margin: 0 }}>{founderPlan.tagline}</p>
          <ul className="pricing-list">
            {founderPlan.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Link to="/waitlist" className="button-primary" style={{ textAlign: "center", justifyContent: "center" }}>
            Join Waitlist for Lifetime Deal
          </Link>
          <p className="waitlist-note">Payments are not live yet. Join to be notified at launch.</p>
        </article>
      </Section>

      {/* Plan comparison table */}
      <Section
        eyebrow="Compare"
        title="Feature comparison"
        description="Every plan starts with the same safety model."
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
                  <td style={{ color: row.free === "—" ? "var(--muted)" : "var(--text)" }}>{row.free}</td>
                  <td style={{ color: row.pro === "—" ? "var(--muted)" : "var(--accent-2)" }}>{row.pro}</td>
                  <td style={{ color: row.career === "—" ? "var(--muted)" : "var(--accent)" }}>{row.career}</td>
                  <td className="col-accent" style={{ color: row.team === "—" ? "var(--muted)" : "var(--accent-3)" }}>{row.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* FAQ */}
      <Section
        eyebrow="FAQ"
        title="Common questions"
        description="Everything about pricing, payments, and the platform."
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
