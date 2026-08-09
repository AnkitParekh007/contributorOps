import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Code2, GitPullRequest, ShieldCheck } from "lucide-react";

const EVIDENCE = [
	{
		label: "Problem framing",
		value: "A contribution is only useful hiring signal when the problem, scope, constraints, and impact are understandable.",
	},
	{
		label: "Engineering plan",
		value: "ContributorOps packages likely files, test strategy, maintainer questions, and PR narrative before submission.",
	},
	{
		label: "Quality signal",
		value: "Scope, tests, tone, and maintainer readiness are evaluated before an external action can be approved.",
	},
	{
		label: "Career proof",
		value: "Finished work can be translated into a portfolio summary, resume bullet, LinkedIn draft, and STAR interview story.",
	},
];

const SIGNALS = [
	"React 19 + TypeScript product UX",
	"Node.js + Express orchestration layer",
	"GitHub API integration through Octokit",
	"Human approval gates for external writes",
	"GitHub Actions CI and Pages deployment",
	"Product, safety, DX, and monetization architecture",
];

export function Showcase() {
	return (
		<div className="page growth-page">
			<section className="growth-hero">
				<div>
					<span className="section-eyebrow">Engineering showcase</span>
					<h1>See the signal behind the contribution.</h1>
					<p>
						ContributorOps is designed to make open-source work legible to developers, maintainers, and hiring teams.
						This page demonstrates the shape of that evidence without pretending example data is a production customer result.
					</p>
					<div className="growth-actions">
						<a className="button-primary" href="https://github.com/AnkitParekh007/contributorOps" target="_blank" rel="noreferrer">
							<Code2 size={16} /> Explore the source
						</a>
						<Link className="button-secondary" to="/contribute">Contribute to the project</Link>
					</div>
				</div>
				<div className="growth-proof-card">
					<div className="growth-proof-topline">
						<span><GitPullRequest size={16} /> Example contribution proof</span>
						<span className="growth-example-badge">Example data</span>
					</div>
					<h2>Improve strict TypeScript handling in a developer-tooling workflow</h2>
					<div className="growth-proof-meta">
						<span>Role match: Frontend / Platform</span>
						<span>Quality score: 92 / 100</span>
						<span>Risk: approval-gated</span>
					</div>
					<div className="growth-proof-checks">
						<span><BadgeCheck size={15} /> focused scope</span>
						<span><BadgeCheck size={15} /> test plan captured</span>
						<span><BadgeCheck size={15} /> maintainer context preserved</span>
					</div>
				</div>
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Proof model</span>
					<h2>From code change to explainable professional evidence.</h2>
					<p>Recruiters should not need to reverse-engineer a candidate's Git history to understand what they actually solved.</p>
				</div>
				<div className="growth-evidence-grid">
					{EVIDENCE.map((item, index) => (
						<article className="growth-evidence-card" key={item.label}>
							<span className="growth-index">0{index + 1}</span>
							<h3>{item.label}</h3>
							<p>{item.value}</p>
						</article>
					))}
				</div>
			</section>

			<section className="site-section growth-signal-section">
				<div className="growth-signal-copy">
					<span className="section-eyebrow">Recruiter lens</span>
					<h2>What this repository demonstrates.</h2>
					<p>
						The value is not only the feature set. The repository exposes architectural decisions around API integration,
						trust boundaries, automation safety, developer experience, and product packaging.
					</p>
					<a className="text-link" href="https://github.com/AnkitParekh007/contributorOps" target="_blank" rel="noreferrer">
						Review the repository <ArrowRight size={14} />
					</a>
				</div>
				<div className="growth-signal-list">
					{SIGNALS.map((signal) => <div key={signal}><ShieldCheck size={17} /> {signal}</div>)}
				</div>
			</section>

			<section className="site-section">
				<div className="cta-panel growth-cta-panel">
					<div>
						<BriefcaseBusiness size={22} />
						<h3>Hiring or evaluating engineering work?</h3>
						<p>Use the source, architecture, safety policy, and contribution model as the evidence—not inflated activity metrics.</p>
					</div>
					<Link className="button-primary" to="/docs">Read engineering docs</Link>
				</div>
			</section>
		</div>
	);
}
