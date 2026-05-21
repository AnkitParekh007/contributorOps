import { PricingCard } from "../components/PricingCard";
import { Section } from "../components/Section";
import { pricingPlans } from "../data/pricing";

export function Pricing() {
  return (
    <div className="page">
      <Section
        eyebrow="Pricing"
        title="Simple plans for contribution intelligence and career packaging."
        description="No payments are implemented in this site yet. Buttons are mock waitlist and coming-soon states only."
      >
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </Section>
    </div>
  );
}
