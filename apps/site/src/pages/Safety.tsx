import { Link } from "react-router-dom";
import { Section } from "../components/Section";
import { XCircle, AlertTriangle, Bot, Eye, CheckCircle2, Zap, ChevronRight } from "lucide-react";

const GUARDRAILS_DANGER = [
	{
		title: "No mass commenting",
		body: "ContributorOps does not bulk-post maintainer comments across repositories. Interactive comments remain action-scoped and human-approved.",
	},
	{
		title: "No mass PR opening",
		body: "Standing execution is bounded by exact patch plans, one-repo-per-day protection, a daily PR cap, live duplicate checks, and draft-only submissions.",
	},
	{
		title: "No deceptive contribution farming",
		body: "The product is explicitly positioned against fake activity, metric gaming, hidden automation, and reputation manipulation.",
	},
	{
		title: "No unconstrained scheduled generation",
		body: "A scheduled job cannot invent and submit arbitrary changes. Standing execution requires an already-authored exact patch queue item and fail-closed validation.",
	},
];

const APPROVAL_STEPS = [
	{
		icon: <Bot size={22} />,
		iconClass: "approval-step-ai",
		label: "Recommendation",
		sub: "Issue scored, plan drafted, exact action prepared",
	},
	{
		icon: <Eye size={22} />,
		iconClass: "approval-step-review",
		label: "Authorization Boundary",
		sub: "Human per-action approval or operator-enabled exact patch plan",
	},
	{
		icon: <CheckCircle2 size={22} />,
		iconClass: "approval-step-approve",
		label: "Deterministic Checks",
		sub: "Policy, duplicate, scope, rate-limit, and exact-match gates",
	},
	{
		icon: <Zap size={22} />,
		iconClass: "approval-step-action",
		label: "Scoped Action",
		sub: "Traceable write; standing PR submissions remain drafts",
	},
];

const MODES = [
	{
		num: "01",
		title: "Research Mode",
		body: "Discover repos and issues, score opportunities, and generate contribution plans. Zero maintainer-facing GitHub writes at this level.",
		active: false,
	},
	{
		num: "02",
		title: "Interactive Approval",
		body: "Prepare and inspect the exact action. Separate capabilities authorize comments, branches, and draft PRs, and cross-action token reuse fails closed.",
		active: false,
	},
	{
		num: "03",
		title: "Standing Exact-Patch Authorization",
		body: "Operator-enabled queue execution may submit only the pre-authored exact patch after live policy, duplicate, rate-limit, scope, and exact-match checks pass.",
		active: true,
	},
];

export function Safety() {
	return (
		<div className="page">
			<Section
				eyebrow="Safety & Trust"
				title={(
					<span>
						Explicit authorization for <span className="ai-gradient-text">real open-source work</span>
					</span>
				) as unknown as string}
				description="ContributorOps treats maintainer trust as a product constraint. A generated plan is never authority by itself: interactive writes require action-scoped approval, while standing automation is limited to bounded exact patch plans that fail closed when reality drifts."
			>
				<div className="approval-gate">
					{APPROVAL_STEPS.map((step, i) => (
						<div key={step.label} style={{ display: "flex", alignItems: "center" }}>
							<div className="approval-step">
								<div className={`approval-step-icon ${step.iconClass}`}>{step.icon}</div>
								<span className="approval-step-label">{step.label}</span>
								<span className="approval-step-sub">{step.sub}</span>
							</div>
							{i < APPROVAL_STEPS.length - 1 && <div className="approval-arrow"><ChevronRight size={18} /></div>}
						</div>
					))}
				</div>
			</Section>

			<Section
				eyebrow="Hard limits"
				title="What ContributorOps will not turn into."
				description="The automation envelope is deliberately narrow. Expanding it requires an explicit architecture and safety decision."
			>
				<div className="guardrail-grid">
					{GUARDRAILS_DANGER.map((g) => (
						<div key={g.title} className="guardrail-card guardrail-card-danger">
							<XCircle size={18} className="guardrail-icon guardrail-icon-danger" />
							<div><h4>{g.title}</h4><p>{g.body}</p></div>
						</div>
					))}
				</div>

				<div className="guardrail-grid" style={{ marginTop: 14 }}>
					{[
						{
							title: "Rate-limited by default",
							body: "Contribution actions are capped per repo and per day to reduce spam risk and preserve maintainer attention.",
						},
						{
							title: "Repository policy wins",
							body: "Standing execution checks contribution-policy files and blocks when detected rules prohibit AI-assisted contributions.",
						},
					].map((g) => (
						<div key={g.title} className="guardrail-card guardrail-card-warn">
							<AlertTriangle size={18} className="guardrail-icon guardrail-icon-warn" />
							<div><h4>{g.title}</h4><p>{g.body}</p></div>
						</div>
					))}
				</div>
			</Section>

			<Section
				eyebrow="Authorization modes"
				title="Three levels, two explicit write-authority paths."
				description="Research stays non-writing. Interactive work uses per-action approval. Standing execution is a separate, tightly bounded exact-patch capability."
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

			<Section
				eyebrow="Read more"
				title="Inspect the policy and the working demo."
				description="The detailed safety policy documents the authorization envelope, rate limits, exact-patch constraints, and maintainer trust principles."
			>
				<div className="cta-panel">
					<Link to="/docs/safety-policy" className="button-primary">Read Safety Policy Docs</Link>
					<Link to="/demo" className="button-secondary">See Authorization Demo</Link>
					<Link to="/docs" className="button-secondary">Browse All Docs</Link>
				</div>
			</Section>
		</div>
	);
}
