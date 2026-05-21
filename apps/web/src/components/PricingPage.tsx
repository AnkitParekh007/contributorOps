import { BadgeDollarSign, Check, Lock } from "lucide-react";
import type { BillingState, FeatureFlags, PricingTier, UsageSnapshot } from "../types";

interface PricingPageProps {
  billing: BillingState;
  entitlements: FeatureFlags;
  pricing: PricingTier[];
  usage: UsageSnapshot;
  isLoading: boolean;
  onSelectPlan: (plan: BillingState["plan"]) => void;
}

export function PricingPage({
  billing,
  entitlements,
  pricing,
  usage,
  isLoading,
  onSelectPlan
}: PricingPageProps) {
  return (
    <div className="page-stack">
      <section className="panel hero-panel">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow">Pricing</span>
            <span className="mode-pill">mock billing</span>
          </div>
          <h1>ContributorOps helps developers turn open-source contributions into job-ready proof of work.</h1>
          <p>
            Upgrade plans, test entitlements locally, and keep the code ready for Stripe or Lemon
            Squeezy later without wiring real payments yet.
          </p>
        </div>
        <div className="mission-card">
          <div className="mission-title">
            <BadgeDollarSign size={18} />
            <strong>Current subscription</strong>
          </div>
          <p>
            {billing.plan.toUpperCase()} plan · {billing.status} · provider: {billing.provider}
          </p>
          <div className="mission-meta">
            <span>Generated plans this week: {usage.generatedPlans}</span>
            <span>{entitlements.weeklyPlanLimit === null ? "Unlimited plan generation" : `${entitlements.weeklyPlanLimit} plans per week`}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Plans</p>
            <h2>Mock billing and entitlement testing.</h2>
          </div>
        </div>
        <div className="pricing-grid">
          {pricing.map((tier) => {
            const active = tier.plan === billing.plan;
            return (
              <article key={tier.plan} className={`pricing-card ${active ? "pricing-card-active" : ""}`}>
                <div className="pricing-card-head">
                  <div>
                    <strong>{tier.name}</strong>
                    <p>{tier.tagline}</p>
                  </div>
                  <span className="price-label">{tier.priceLabel}</span>
                </div>
                <ul className="feature-list">
                  {tier.features.map((feature) => (
                    <li key={feature}>
                      <Check size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pricing-meta">
                  <span>{tier.limits.weeklyPlans === null ? "Unlimited plans" : `${tier.limits.weeklyPlans} plans/week`}</span>
                  <span>{tier.limits.sharedSeats} seat{tier.limits.sharedSeats > 1 ? "s" : ""}</span>
                </div>
                <button
                  type="button"
                  className={active ? "secondary-button full-width" : "primary-button full-width"}
                  disabled={active || isLoading}
                  onClick={() => onSelectPlan(tier.plan)}
                >
                  {active ? "Current plan" : `Switch to ${tier.name}`}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Feature flags</p>
            <h2>Premium capabilities are controlled by entitlements.</h2>
          </div>
        </div>
        <div className="feature-flag-grid">
          {Object.entries(entitlements.features).map(([feature, enabled]) => (
            <article key={feature} className="info-card">
              <div className="info-card-title">
                {enabled ? <Check size={16} /> : <Lock size={16} />}
                <strong>{feature}</strong>
              </div>
              <p>{enabled ? "Enabled on the current plan." : "Upgrade required."}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
