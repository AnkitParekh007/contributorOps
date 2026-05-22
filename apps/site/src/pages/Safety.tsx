import { Link } from "react-router-dom";
import { Section } from "../components/Section";
import {
  XCircle,
  AlertTriangle,
  Bot,
  Eye,
  CheckCircle2,
  Zap,
  ChevronRight,
} from "lucide-react";

const GUARDRAILS_DANGER = [
  {
    title: "No mass commenting",
    body: "ContributorOps never posts bulk comments across repositories. Every comment is user-authored and approval-gated.",
  },
  {
    title: "No mass PR opening",
    body: "No automated bulk pull request creation. Draft PRs are always prepared for user review before any submission.",
  },
  {
    title: "No deceptive contribution farming",
    body: "The product is explicitly positioned against fake activity, metric gaming, and reputation manipulation.",
  },
  {
    title: "No scheduled external writes",
    body: "Scheduled jobs may run discovery and planning. They cannot write to any external repository.",
  },
];

const APPROVAL_STEPS = [
  {
    icon: <Bot size={22} />,
    iconClass: "approval-step-ai",
    label: "AI Recommendation",
    sub: "Issue scored, plan drafted, PR copy prepared",
  },
  {
    icon: <Eye size={22} />,
    iconClass: "approval-step-review",
    label: "User Review",
    sub: "Full preview of exact action before execution",
  },
  {
    icon: <CheckCircle2 size={22} />,
    iconClass: "approval-step-approve",
    label: "Explicit Approval",
    sub: "User confirms the specific action",
  },
  {
    icon: <Zap size={22} />,
    iconClass: "approval-step-action",
    label: "External Action",
    sub: "Single, traceable, scoped write",
  },
];

const MODES = [
  {
    num: "01",
    title: "Research Mode",
    body: "Discover repos and issues, score opportunities, and generate contribution plans. Zero external GitHub writes at this level.",
    active: false,
  },
  {
    num: "02",
    title: "Draft Mode",
    body: "Generate local code suggestions, PR copy, and test instructions. All output stays local. The user controls every step.",
    active: false,
  },
  {
    num: "03",
    title: "Approved Auto-Contribute Mode",
    body: "Use explicit, per-action approvals for comments, fork branches, and draft PRs. Guardrails enforce one action at a time.",
    active: true,
  },
];

export function Safety() {
  return (
    <div className="page">
      {/* ── Safety hero ─────────────────────────────────────── */}
      <Section
        eyebrow="Safety & Trust"
        title={<span>Human-approved AI for <span className="ai-gradient-text">real open-source work</span></span> as unknown as string}
        description="ContributorOps is built to make maintainer trust a first-class product constraint — not an afterthought. Every action that touches an external repository requires explicit, per-action human approval."
      >
        {/* Approval gate visualization */}
        <div className="approval-gate">
          {APPROVAL_STEPS.map((step, i) => (
            <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
              <div className="approval-step">
                <div className={`approval-step-icon ${step.iconClass}`}>{step.icon}</div>
                <span className="approval-step-label">{step.label}</span>
                <span className="approval-step-sub">{step.sub}</span>
              </div>
              {i < APPROVAL_STEPS.length - 1 && (
                <div className="approval-arrow">
                  <ChevronRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── What we don't do ─────────────────────────────────── */}
      <Section
        eyebrow="Hard limits"
        title="What ContributorOps will never do."
        description="These are not configurable settings. They are design constraints built into every level of the product."
      >
        <div className="guardrail-grid">
          {GUARDRAILS_DANGER.map((g) => (
            <div key={g.title} className="guardrail-card guardrail-card-danger">
              <XCircle size={18} className="guardrail-icon guardrail-icon-danger" />
              <div>
                <h4>{g.title}</h4>
                <p>{g.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="guardrail-grid" style={{ marginTop: 14 }}>
          {[
            {
              title: "Rate-limited by default",
              body: "Contribution actions are capped per repo and per day to prevent any perception of spam behavior.",
            },
            {
              title: "Relevance required",
              body: "Every action must tie back to a real, tracked issue. No off-topic, promotional, or speculative submissions.",
            },
          ].map((g) => (
            <div key={g.title} className="guardrail-card guardrail-card-warn">
              <AlertTriangle size={18} className="guardrail-icon guardrail-icon-warn" />
              <div>
                <h4>{g.title}</h4>
                <p>{g.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Safety modes ─────────────────────────────────────── */}
      <Section
        eyebrow="Contribution modes"
        title="Three permission levels, one safety model."
        description="ContributorOps graduates from fully local research to explicit per-action auto-contribute. You control which level you use."
      >
        <div className="safety-mode-grid">
          {MODES.map((mode) => (
            <div key={mode.num} className={`safety-mode${mode.active ? " safety-mode-active" : ""}`}>
              <span className="safety-mode-num">{mode.num}</span>
              <h3>{mode.title}</h3>
              <p>{mode.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <Section
        eyebrow="Read more"
        title="Review the full safety policy documentation."
        description="The detailed safety policy, rate limits, approval model, and maintainer trust principles are documented in the docs."
      >
        <div className="cta-panel">
          <Link to="/docs/safety-policy" className="button-primary">Read Safety Policy Docs</Link>
          <Link to="/docs" className="button-secondary">Browse All Docs</Link>
        </div>
      </Section>
    </div>
  );
}
