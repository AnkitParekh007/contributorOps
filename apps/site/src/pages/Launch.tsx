import { Link } from "react-router-dom";
import {
	ArrowRight,
	BadgeCheck,
	BriefcaseBusiness,
	Code2,
	ExternalLink,
	Github,
	Megaphone,
	Rocket,
	ShieldCheck,
	Users,
} from "lucide-react";
import { trackEvent } from "../lib/analytics";

const REPO_URL = "https://github.com/AnkitParekh007/contributorOps";
const CODESPACES_URL = "https://codespaces.new/AnkitParekh007/contributorOps?quickstart=1";

const AUDIENCES = [
	{
		icon: <Code2 size={21} />,
		title: "Developer",
		body: "Try the browser walkthrough, run the real workspace, then inspect starter issues and contribution paths.",
		to: "/demo",
		cta: "Try the workflow",
	},
	{
		icon: <BriefcaseBusiness size={21} />,
		title: "Recruiter / hiring manager",
		body: "Jump directly to architecture, trust boundaries, CI proof, and recruiter-readable engineering evidence.",
		to: "/recruiter",
		cta: "Read the 2-minute brief",
	},
	{
		icon: <Users size={21} />,
		title: "OSS maintainer",
		body: "Review anti-spam constraints, approval semantics, exact-patch safeguards, rate limits, and AI disclosure posture.",
		to: "/safety",
		cta: "Inspect safety boundaries",
	},
];

export function Launch() {
	function record(action: string) {
		trackEvent("Launch Hub CTA", { action });
	}

	return (
		<div className="page launch-page">
			<section className="launch-hero">
				<div>
					<span className="section-eyebrow">Phase 8 · public launch</span>
					<h1>One launch surface. Three evaluation paths. Zero signup gate.</h1>
					<p>
						ContributorOps is launching as an inspectable open-source engineering product first: browser demo for instant evaluation, Codespaces for the real workspace, and source-level proof for developers, maintainers, and hiring teams.
					</p>
					<div className="launch-actions">
						<Link className="button-primary" to="/demo" onClick={() => record("browser_demo")}><Rocket size={16} /> Try browser demo</Link>
						<a className="button-secondary" href={CODESPACES_URL} target="_blank" rel="noreferrer" onClick={() => record("codespaces")}><Code2 size={16} /> Run real app</a>
						<a className="button-secondary" href={REPO_URL} target="_blank" rel="noreferrer" onClick={() => record("repository")}><Github size={16} /> Source</a>
					</div>
				</div>
				<aside className="launch-status-card">
					<BadgeCheck size={23} />
					<h2>Launch posture</h2>
					<ul>
						<li>Public source and documentation</li>
						<li>Browser-only demo with fictional example data</li>
						<li>Real local/Codespaces evaluation path</li>
						<li>CI, CodeQL, dependency audit, and Lighthouse gates</li>
					</ul>
				</aside>
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Choose the shortest proof path</span>
					<h2>Don’t make every visitor read the same pitch.</h2>
					<p>Phase 8 routes each audience to the evidence they can actually evaluate.</p>
				</div>
				<div className="launch-audience-grid">
					{AUDIENCES.map((audience) => (
						<article className="launch-audience-card" key={audience.title}>
							<span className="launch-card-icon">{audience.icon}</span>
							<h3>{audience.title}</h3>
							<p>{audience.body}</p>
							<Link className="text-link" to={audience.to}>{audience.cta} <ArrowRight size={14} /></Link>
						</article>
					))}
				</div>
			</section>

			<section className="site-section launch-proof-section">
				<div className="section-heading">
					<span className="section-eyebrow">Evidence before promotion</span>
					<h2>The launch claim is inspectability, not manufactured traction.</h2>
				</div>
				<div className="launch-proof-grid">
					<article><Github size={20} /><strong>Public implementation</strong><p>Source, issues, pull requests, releases, architecture decisions, and CI history remain directly inspectable.</p></article>
					<article><ShieldCheck size={20} /><strong>Trust boundaries</strong><p>Interactive actions are action-scoped; standing automation is bounded to exact patch plans with fail-closed validation.</p></article>
					<article><Rocket size={20} /><strong>Tryability</strong><p>The browser demo has no login or email barrier, while Codespaces exposes the actual monorepo application.</p></article>
					<article><Megaphone size={20} /><strong>Organic distribution</strong><p>Launch copy asks for technical feedback and contribution—not coordinated votes, fake users, or inflated metrics.</p></article>
				</div>
			</section>

			<section className="site-section">
				<div className="launch-channel-panel">
					<div>
						<span className="section-eyebrow">Launch execution</span>
						<h2>Ship to communities with the right artifact.</h2>
						<p>The repository includes channel-specific launch copy and a release checklist. The browser demo is the default destination for communities that expect something immediately usable.</p>
					</div>
					<div className="launch-channel-list">
						<div><strong>Show HN</strong><span>Browser demo + technical explanation + no signup gate</span></div>
						<div><strong>Product Hunt</strong><span>Direct product URL + transparent preview status + maker-led conversation</span></div>
						<div><strong>Developer communities</strong><span>Problem-first engineering write-up + source + contribution path</span></div>
						<div><strong>Recruiter sharing</strong><span>Two-minute engineering brief + showcase + CI/security proof</span></div>
					</div>
					<a className="text-link" href={`${REPO_URL}/blob/main/docs/phase-8-launch-execution.md`} target="_blank" rel="noreferrer">Open Phase 8 execution guide <ExternalLink size={14} /></a>
				</div>
			</section>
		</div>
	);
}
