import {
  BookOpen,
  CalendarDays,
  FileText,
  GitBranch,
  Globe,
  Linkedin,
  MessageSquarePlus,
  Shield,
  ShieldCheck,
  Target,
} from "lucide-react";
import type { FeatureItem } from "../data/features";

const ICON_MAP: Record<string, React.ReactNode> = {
  Target:            <Target size={18} />,
  CalendarDays:      <CalendarDays size={18} />,
  ShieldCheck:       <ShieldCheck size={18} />,
  MessageSquarePlus: <MessageSquarePlus size={18} />,
  Globe:             <Globe size={18} />,
  FileText:          <FileText size={18} />,
  Linkedin:          <Linkedin size={18} />,
  BookOpen:          <BookOpen size={18} />,
  Shield:            <Shield size={18} />,
  GitBranch:         <GitBranch size={18} />,
};

const CAT_ICON_CLASS: Record<string, string> = {
  Discover: "feature-icon-discover",
  Prepare:  "feature-icon-prepare",
  Validate: "feature-icon-validate",
  Prove:    "feature-icon-prove",
  Career:   "feature-icon-career",
  Safety:   "feature-icon-safety",
};

const CAT_PILL_CLASS: Record<string, string> = {
  Discover: "cat-discover",
  Prepare:  "cat-prepare",
  Validate: "cat-validate",
  Prove:    "cat-prove",
  Career:   "cat-career",
  Safety:   "cat-safety",
};

const PLAN_PILL_CLASS: Record<string, string> = {
  Free:   "plan-free",
  Pro:    "plan-pro",
  Career: "plan-career",
  Team:   "plan-team",
};

interface FeatureCardProps {
  feature: FeatureItem;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const icon      = ICON_MAP[feature.icon];
  const iconClass = CAT_ICON_CLASS[feature.category] ?? "feature-icon-discover";
  const catClass  = CAT_PILL_CLASS[feature.category] ?? "cat-discover";
  const planClass = PLAN_PILL_CLASS[feature.plan]     ?? "plan-free";

  return (
    <article className="feature-card-v2">
      <div className="feature-card-row">
        <span className={`feature-icon-wrap ${iconClass}`}>{icon}</span>
        <span className={`cat-pill ${catClass}`}>{feature.category}</span>
        <span className={`plan-badge ${planClass}`} style={{ marginLeft: "auto" }}>
          {feature.plan}
        </span>
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.summary}</p>
    </article>
  );
}
