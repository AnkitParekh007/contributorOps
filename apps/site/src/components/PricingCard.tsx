import { Check } from "lucide-react";
import type { PricingPlan } from "../data/pricing";

const PLAN_CARD_CLASS: Record<string, string> = {
  Free:   "pricing-card pricing-card-free",
  Pro:    "pricing-card pricing-card-pro",
  Career: "pricing-card pricing-card-career pricing-card-featured",
  Team:   "pricing-card pricing-card-team",
};

const PLAN_HEADER_CLASS: Record<string, string> = {
  Free:   "plan-header-free",
  Pro:    "plan-header-pro",
  Career: "plan-header-career",
  Team:   "plan-header-team",
};

const PLAN_CTA_CLASS: Record<string, string> = {
  Free:   "button-secondary",
  Pro:    "button-primary pricing-cta-pro",
  Career: "button-primary pricing-cta-career",
  Team:   "button-primary pricing-cta-team",
};

const BEST_FOR: Record<string, string> = {
  Free:   "Individual exploration & open-source learning",
  Pro:    "Developers building an active contribution practice",
  Career: "Job seekers turning contributions into hiring signal",
  Team:   "Bootcamps, cohorts, and engineering teams",
};

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const cardClass   = PLAN_CARD_CLASS[plan.name]   ?? "pricing-card";
  const headerClass = PLAN_HEADER_CLASS[plan.name] ?? "";
  const ctaClass    = PLAN_CTA_CLASS[plan.name]    ?? "button-secondary";
  const bestFor     = BEST_FOR[plan.name]          ?? "";

  return (
    <article className={cardClass}>
      <div className="pricing-card-header">
        <div>
          <h3 className={headerClass}>{plan.name}</h3>
          {bestFor && <p className="pricing-card-best-for">Best for: {bestFor}</p>}
          <p style={{ marginTop: 8, marginBottom: 0, fontSize: "0.875rem" }}>{plan.tagline}</p>
        </div>
        <span className="pricing-price">{plan.price}</span>
      </div>

      <ul className="pricing-list" style={{ listStyle: "none", paddingLeft: 0 }}>
        {plan.features.map((feature) => (
          <li key={feature} className="pricing-list-item">
            <Check size={14} className="pricing-list-check" />
            {feature}
          </li>
        ))}
      </ul>

      <button type="button" className={ctaClass} style={{ width: "100%", justifyContent: "center" }}>
        {plan.cta}
      </button>
    </article>
  );
}
