import type { PricingPlan } from "../data/pricing";

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <article className={`pricing-card ${plan.featured ? "pricing-card-featured" : ""}`}>
      <div className="pricing-card-header">
        <div>
          <h3>{plan.name}</h3>
          <p>{plan.tagline}</p>
        </div>
        <span className="pricing-price">{plan.price}</span>
      </div>
      <ul className="pricing-list">
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <button type="button" className={plan.featured ? "button-primary" : "button-secondary"}>
        {plan.cta}
      </button>
    </article>
  );
}
