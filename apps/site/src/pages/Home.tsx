import { Link } from "react-router-dom";
import { FeatureCard } from "../components/FeatureCard";
import { Hero } from "../components/Hero";
import { AudienceProof } from "../components/AudienceProof";
import { PricingCard } from "../components/PricingCard";
import { Section } from "../components/Section";
import { features } from "../data/features";
import { pricingPlans } from "../data/pricing";
import { Search, FileCode2, BarChart3, Briefcase, ArrowRight } from "lucide-react";

const WORKFLOW = [
	{
		num: "01",
		icon: <Search size={20} />,
		title: "Discover",
		desc: "AI-scored issue radar surfaces the highest-signal opportunities matched to your target role and stack.",
		color: "feature-icon-discover",
	},
	{
		num: "02",
		icon: <FileCode2 size={20} />,
		title: "Prepare",
		desc: "Generate a contribution plan with scoped files, maintainer questions, PR body, and a test strategy.",
		color: "feature-icon-prepare",
	},
	{
		num: "03",
		icon: <BarChart3 size={20} />,
		title: "Validate",
		desc: "Run a PR quality check — scope, test coverage, tone, policy fit, and maintainer-readiness before submit.",
		color: "feature-icon-validate",
	},
	{
		num: "04",
		icon: <Briefcase size={20} />,
		title: "Prove",
		desc: "Package the finished work into resume bullets, LinkedIn posts, STAR stories, and a portfolio page.",
		color: "feature-icon-prove",
	},
];

export function Home() {
	return (
		<div className="page page-home">
			<Hero />
			<AudienceProof />

			<Section
				id="problem"
				eyebrow="Problem"
				title="Most developers have activity, but not enough visible proof."
				description="ContributorOps is built for developers who want real OSS contributions to become stronger hiring signal."
			>
				<div className="before-after-grid">
					<div className="before-card">
						<h3>Without ContributorOps</h3>
						{[
							"Find a random issue, lose context, abandon it",
							"Draft a weak PR with no test plan or maintainer context",
							"Contribution goes unnoticed in resume",
							"Struggle to explain the work in interviews",
							"No public proof beyond vague GitHub activity",
						].map((item) => (
							<div key={item} className="ba-item">
								<span className="ba-cross">✕</span>
								{item}
							</div>
						))}
					</div>

					<div className="before-after-divider">
						<span className="before-after-arrow">→</span>
						<span>vs</span>
					</div>

					<div className="after-card">
						<h3>With ContributorOps</h3>
						{[
							"Job-matched issue finder surfaces the right work",
							"AI plan scopes files and PR narrative up front",
							"PR quality and policy checks before submission",
							"STAR stories and resume bullets generated automatically",
							"Public portfolio page with verifiable contribution history",
						].map((item) => (
							<div key={item} className="ba-item">
								<span className="ba-check">✓</span>
								{item}
							</div>
						))}
					</div>
				</div>
			</Section>

			<Section
				id="how-it-works"
				eyebrow="How it works"
				title="Structured contribution loops without trust-destroying automation."
				description="ContributorOps follows a fixed intelligent path from discovery to career proof."
			>
				<div className="workflow-row">
					{WORKFLOW.map((step, i) => (
						<div key={step.num} className="workflow-step">
							<div className="workflow-step-header">
								<span className={`feature-icon-wrap ${step.color}`}>{step.icon}</span>
								<span className="workflow-node">{step.num}</span>
								{i < WORKFLOW.length - 1 && <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.3 }} />}
							</div>
							<h3>{step.title}</h3>
							<p>{step.desc}</p>
						</div>
					))}
				</div>
			</Section>

			<Section
				id="features"
				eyebrow="Core features"
				title="Intelligence modules for every stage of the contribution lifecycle."
				description="Every module is aligned around real contributions becoming visible career leverage."
			>
				<div className="feature-grid">
					{features.slice(0, 6).map((feature) => <FeatureCard key={feature.title} feature={feature} />)}
				</div>
				<div className="section-cta">
					<Link to="/features" className="button-secondary">Explore all features</Link>
				</div>
			</Section>

			<Section
				id="safety"
				eyebrow="Safety-first automation"
				title="Explicitly authorized by design."
				description="ContributorOps separates planning from authority and refuses mass-commenting, mass-PR opening, deceptive activity, or unconstrained generated changes."
			>
				<div className="safety-mode-grid">
					{[
						{
							num: "01",
							title: "Research Mode",
							body: "Discover issues, score opportunities, and generate plans with zero maintainer-facing writes.",
							active: false,
						},
						{
							num: "02",
							title: "Interactive Approval",
							body: "Prepare the exact action, inspect it, then use separate human approval capabilities for comments, branches, and draft PRs.",
							active: false,
						},
						{
							num: "03",
							title: "Standing Exact-Patch Authorization",
							body: "Operator-enabled queue execution is limited to pre-authored exact patches, live repository-policy checks, duplicate protection, daily caps, and draft PRs.",
							active: true,
						},
					].map((mode) => (
						<div key={mode.num} className={`safety-mode${mode.active ? " safety-mode-active" : ""}`}>
							<span className="safety-mode-num">{mode.num}</span>
							<h3>{mode.title}</h3>
							<p>{mode.body}</p>
						</div>
					))}
				</div>
				<div className="section-cta">
					<Link to="/safety" className="button-secondary">Read full safety policy</Link>
					<Link to="/demo" className="button-secondary">See authorization in the demo</Link>
				</div>
			</Section>

			<Section
				id="pricing-preview"
				eyebrow="Pricing preview"
				title="Monetization-ready without live billing."
				description="Free, Pro, Career, and Team tiers exist today as product packaging and feature-flag boundaries."
			>
				<div className="pricing-grid">
					{pricingPlans.map((plan) => <PricingCard key={plan.name} plan={plan} />)}
				</div>
				<div className="section-cta">
					<Link to="/pricing" className="button-secondary">View full pricing</Link>
				</div>
			</Section>

			<Section
				id="public-launch"
				eyebrow="Public OSS launch"
				title="Evaluate the product now. Hosted SaaS can come later."
				description="The browser walkthrough, source, documentation, Codespaces path, security gates, and contribution workflow are public today. Hosted production accounts and billing remain clearly labeled future work."
			>
				<div className="founder-preview-grid">
					<div className="founder-preview-card">
						<span className="founder-preview-num">01</span>
						<h3>Browser demo</h3>
						<p>Walk through Discover → Prepare → Validate → Authorize → Prove with fictional example data and no signup.</p>
					</div>
					<div className="founder-preview-card">
						<span className="founder-preview-num">02</span>
						<h3>Run the real workspace</h3>
						<p>Use Codespaces or the local quick start to inspect the actual React + Express product in demo-safe mode.</p>
					</div>
					<div className="founder-preview-card">
						<span className="founder-preview-num">03</span>
						<h3>Inspect the evidence</h3>
						<p>Architecture, ADRs, CI, CodeQL, dependency audits, Lighthouse budgets, and safety policy are public.</p>
					</div>
					<div className="founder-preview-card">
						<span className="founder-preview-num">04</span>
						<h3>Give useful feedback</h3>
						<p>Open a focused issue, contribute a starter task, or share the recruiter brief instead of joining an artificial launch funnel.</p>
					</div>
				</div>
				<div className="section-cta">
					<Link to="/demo" className="button-primary">Try Browser Demo</Link>
					<Link to="/launch" className="button-secondary">Open Launch Hub</Link>
					<Link to="/contribute" className="button-secondary">Contribute</Link>
				</div>
			</Section>

			<Section
				id="cta"
				eyebrow="Open-source project"
				title="Build with ContributorOps, fork the workflow, or use it as proof of architecture thinking."
				description="The repository is public, documented, safety-conscious, and designed to be extended by developers who care about better contribution workflows."
			>
				<div className="cta-panel">
					<a href="https://github.com/AnkitParekh007/contributorOps" target="_blank" rel="noreferrer" className="button-primary">Star & Explore on GitHub</a>
					<Link to="/docs" className="button-secondary">Read the Engineering Docs</Link>
				</div>
			</Section>
		</div>
	);
}
