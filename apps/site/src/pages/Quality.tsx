import { CheckCircle2, ExternalLink, Gauge, GitBranch, LockKeyhole, SearchCheck, ShieldCheck } from "lucide-react";

const REPO_URL = "https://github.com/AnkitParekh007/contributorOps";

const ENFORCED_GATES = [
	{
		icon: <GitBranch size={20} />,
		title: "Build integrity",
		detail: "API, product Web, and public Site builds must all complete successfully before merge.",
	},
	{
		icon: <SearchCheck size={20} />,
		title: "TypeScript integrity",
		detail: "API, Web, and Site each run an independent no-emit TypeScript check in CI.",
	},
	{
		icon: <LockKeyhole size={20} />,
		title: "Secret-pattern scan",
		detail: "CI rejects common committed secret patterns across TypeScript, JavaScript, and JSON source files.",
	},
	{
		icon: <ShieldCheck size={20} />,
		title: "Route + metadata integrity",
		detail: "A repository script verifies public routes, internal links, route metadata coverage, and required document metadata.",
	},
	{
		icon: <Gauge size={20} />,
		title: "Lighthouse budgets",
		detail: "The public site is checked against minimum accessibility, performance, best-practices, and SEO category thresholds.",
	},
];

const LIGHTHOUSE_BUDGETS = [
	["Accessibility", "≥ 90"],
	["Performance", "≥ 80"],
	["Best practices", "≥ 90"],
	["SEO", "≥ 90"],
];

export function Quality() {
	return (
		<div className="page quality-page">
			<section className="quality-hero">
				<div>
					<span className="section-eyebrow">Engineering quality</span>
					<h1>Quality claims should map to gates that actually fail CI.</h1>
					<p>
						ContributorOps exposes the checks it relies on before merge. This page is intentionally limited to enforced repository and site gates rather than invented uptime, customer, or production-SLA claims.
					</p>
					<div className="quality-actions">
						<a className="button-primary" href={`${REPO_URL}/actions/workflows/ci.yml`} target="_blank" rel="noreferrer">
							View CI <ExternalLink size={15} />
						</a>
						<a className="button-secondary" href={`${REPO_URL}/blob/main/docs/quality-gates.md`} target="_blank" rel="noreferrer">
							Quality policy
						</a>
					</div>
				</div>
				<aside className="quality-summary-card">
					<CheckCircle2 size={24} />
					<h2>Merge standard</h2>
					<p>Builds, TypeScript, secret scanning, route/metadata integrity, and Lighthouse budgets must remain green.</p>
				</aside>
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Enforced now</span>
					<h2>Five layers of verifiable quality proof.</h2>
					<p>Each layer points to a repository check or policy that can be inspected independently.</p>
				</div>
				<div className="quality-grid">
					{ENFORCED_GATES.map((gate) => (
						<article className="quality-card" key={gate.title}>
							<div className="quality-card-icon">{gate.icon}</div>
							<h3>{gate.title}</h3>
							<p>{gate.detail}</p>
						</article>
					))}
				</div>
			</section>

			<section className="site-section quality-budget-section">
				<div className="section-heading">
					<span className="section-eyebrow">Lighthouse policy</span>
					<h2>Minimum budgets, not vanity scores.</h2>
					<p>The intent is to prevent meaningful regressions while leaving room for realistic iteration on a visual React application.</p>
				</div>
				<div className="quality-budget-grid">
					{LIGHTHOUSE_BUDGETS.map(([label, value]) => (
						<div className="quality-budget" key={label}>
							<strong>{value}</strong>
							<span>{label}</span>
						</div>
					))}
				</div>
			</section>

			<section className="site-section">
				<div className="quality-boundary-panel">
					<div>
						<span className="section-eyebrow">Quality boundary</span>
						<h2>What these checks do not prove.</h2>
					</div>
					<ul>
						<li>They do not prove production uptime or hosted SaaS reliability.</li>
						<li>They do not replace manual keyboard, screen-reader, or device testing.</li>
						<li>The secret-pattern scan does not prove the dependency graph is vulnerability-free; dependency-audit remediation is tracked separately.</li>
						<li>They do not prove every external integration path works without configured credentials.</li>
						<li>They do not turn a passing Lighthouse score into a customer or adoption claim.</li>
					</ul>
				</div>
			</section>
		</div>
	);
}
