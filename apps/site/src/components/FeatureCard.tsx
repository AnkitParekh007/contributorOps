import type { FeatureItem } from "../data/features";

interface FeatureCardProps {
  feature: FeatureItem;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className={`feature-card accent-${feature.accent}`}>
      <div className="feature-token" />
      <h3>{feature.title}</h3>
      <p>{feature.summary}</p>
    </article>
  );
}
