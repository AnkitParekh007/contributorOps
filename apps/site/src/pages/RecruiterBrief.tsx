import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Code2, ExternalLink, GitBranch, Share2, ShieldCheck } from "lucide-react";

const STACK = ["React 19", "TypeScript", "Vite", "Node.js", "Express", "Octokit", "GitHub Actions"];

const EVALUATION_AREAS = [
	{
		title: "Product engineering",
		body: "A multi-surface monorepo that connects issue discovery, contribution planning, quality checks, controlled GitHub actions, and proof-of-work packaging.",
	},
	{
		title: "Trust architecture",
		body: "External GitHub writes are treated as a trust boundary: research can be automated, while higher-risk actions remain explicitly human-approved.",
	},
	{
		title: "Developer experience",
		body: "Workspace scripts, CI, contributor docs, issue forms, good-first-issue work, public architecture, and ADRs make the project easier to inspect and extend.",
	},
	{
		title: "Product judgment",
		body: "The repository distinguishes implemented MVP behavior from future production SaaS capabilities instead of hiding tradeoffs behind polished marketing copy.",
	},
];

const EVIDENCE = [
	{
		label: "System architecture",
		detail: "Surfaces, data flow, trust boundaries, CI, deployment, and production evolution.",
		href: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/architecture.md",
	},
	{
		label: "ADR-0001: Human-approved writes",
		detail: "Why unattended third-party GitHub writes are rejected by design.",
		href: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/adr/0001-human-approved-external-writes.md",
	},
	{
		label: "Safety policy",
		detail: "Research, Draft, and Approved Auto-Contribute operating boundaries.",
		href: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/safety-policy.md",
	},
	{
		label: "Continuous integration",
		detail: "API/Web/Site builds, TypeScript checks, and common secret-pattern scanning.",
		href: "https://github.com/AnkitParekh007/contributorOps/blob/main/.github/workflows/ci.yml",
	},
];

export function RecruiterBrief() {
	const pageUrl = "https://ankitparekh007.github.io/contributorOps/#/recruiter";
	const encodedUrl = encodeURIComponent(pageUrl);
	const encodedText = encodeURIComponent(
		"ContributorOps — a public engineering case study in human-approved OSS contribution intelligence, TypeScript, React, Node/Express, GitHub integration, and developer experience.",
	);

	return (
		<div className="page authority-page">
			<section className="authority-hero">
				<div className="authority-hero-copy">
					<span className="section-eyebrow">Two-minute recruiter brief</span>
					<h1>Evaluate the engineering decisions, not just the activity graph.</h1>
					<p>
						ContributorOps is an open-source product and architecture case study built around a simple idea:
						real contribution work should be understandable from its problem framing, constraints, tests, trust boundaries, and impact.
					</p>
					<div className="authority-actions">
						<a className="button-primary" href="https://github.com/AnkitParekh007/contributorOps" target="_blank" rel="noreferrer">
							<Code2 size={16} /> Review source
						</a>
						<a className="button-secondary" href="https://github.com/AnkitParekh007/contributorOps/blob/main/docs/architecture.md" target="_blank" rel="noreferrer">
							<GitBranch size={16} /> Read architecture
						</a>
					</div>
					<div className="authority-stack" aria-label="Technology stack">
						{STACK.map((item) => <span key={item}>{item}</span>)}
					</div>
				</div>

				<aside className="authority-summary-card">
					<div className="authority-summary-label"><BriefcaseBusiness size={17} /> Evaluation summary</div>
					<h2>What should stand out?</h2>
					<ul>
						<li><BadgeCheck size={16} /> product + platform thinking across three app surfaces</li>
						<li><BadgeCheck size={16} /> explicit human-approval trust boundary</li>
						<li><BadgeCheck size={16} /> public architecture decisions and tradeoffs</li>
						<li><BadgeCheck size={16} /> contributor onboarding and CI discipline</li>
					</ul>
					<div className="authority-boundary-note">
						<strong>Current boundary:</strong> working open-source product foundation; production auth, multi-user persistence, and real billing are still planned.
					</div>
				</aside>
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">What to evaluate</span>
					<h2>Four kinds of signal in one repository.</h2>
					<p>The strongest evidence is in the decisions and boundaries that are visible in code and documentation.</p>
				</div>
				<div className="authority-grid">
					{EVALUATION_AREAS.map((area, index) => (
						<article className="authority-card" key={area.title}>
							<span className="authority-card-index">0{index + 1}</span>
							<h3>{area.title}</h3>
							<p>{area.body}</p>
						</article>
					))}
				</div>
			</section>

			<section className="site-section authority-evidence-section">
				<div className="authority-evidence-copy">
					<span className="section-eyebrow">Evidence map</span>
					<h2>Jump directly to the decisions.</h2>
					<p>No need to infer the architecture from a screenshot. These links point to the public evidence behind the product story.</p>
					<Link className="text-link" to="/showcase">See example contribution proof <ArrowRight size={14} /></Link>
				</div>
				<div className="authority-evidence-list">
					{EVIDENCE.map((item) => (
						<a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="authority-evidence-item">
							<div>
								<strong>{item.label}</strong>
								<span>{item.detail}</span>
							</div>
							<ExternalLink size={16} />
						</a>
					))}
				</div>
			</section>

			<section className="site-section">
				<div className="authority-share-panel">
					<div>
						<ShieldCheck size={22} />
						<h3>Share the engineering brief, not a generic homepage.</h3>
						<p>This route is intentionally concise enough to send directly to a recruiter, hiring manager, or engineering interviewer.</p>
					</div>
					<div className="authority-share-actions">
						<a className="button-secondary" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">Share on LinkedIn</a>
						<a className="button-secondary" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noreferrer">Share on X</a>
						<Link className="button-secondary" to="/share"><Share2 size={15} /> Open share hub</Link>
						<Link className="button-primary" to="/contribute">Explore contribution paths</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
