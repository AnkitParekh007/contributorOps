import { BriefcaseBusiness, Code2, GitFork, Github, ShieldCheck, Sparkles } from "lucide-react";

const REPO_URL = "https://github.com/AnkitParekh007/contributorOps";

const AUDIENCES = [
	{
		icon: <Code2 size={21} />,
		eyebrow: "For developers",
		title: "Find better work. Ship better PRs. Keep the proof.",
		body: "Use a structured contribution loop instead of hunting random issues. ContributorOps connects discovery, planning, quality checks, and career packaging in one workflow.",
		points: ["Role-matched opportunity radar", "PR readiness and test thinking", "Reusable portfolio evidence"],
	},
	{
		icon: <BriefcaseBusiness size={21} />,
		eyebrow: "For recruiters",
		title: "See engineering signal beyond commit counts.",
		body: "ContributorOps is designed to make contribution context legible: what changed, why it mattered, how it was tested, and what engineering judgment the developer demonstrated.",
		points: ["Verifiable contribution history", "Impact and reasoning summaries", "Interview-ready project narratives"],
	},
	{
		icon: <ShieldCheck size={21} />,
		eyebrow: "For maintainers",
		title: "Automation that respects repository trust.",
		body: "The project deliberately keeps external writes approval-gated. Scheduled jobs can research and plan, but they do not mass-comment or mass-open pull requests.",
		points: ["Human approval gates", "No mass external writes", "Audit-friendly action model"],
	},
];

export function AudienceProof() {
	return (
		<section className="audience-proof" aria-labelledby="audience-proof-title">
			<div className="audience-proof-heading">
				<div>
					<span className="audience-proof-kicker">
						<Sparkles size={14} /> Open-source engineering signal
					</span>
					<h2 id="audience-proof-title">Built for the people who create, review, and evaluate engineering work.</h2>
				</div>
				<div className="audience-proof-actions">
					<a className="button-primary" href={REPO_URL} target="_blank" rel="noreferrer">
						<Github size={16} /> Star on GitHub
					</a>
					<a className="button-secondary" href={`${REPO_URL}/fork`} target="_blank" rel="noreferrer">
						<GitFork size={16} /> Fork the project
					</a>
				</div>
			</div>

			<div className="audience-proof-grid">
				{AUDIENCES.map((audience) => (
					<article key={audience.eyebrow} className="audience-card">
						<div className="audience-card-icon">{audience.icon}</div>
						<span className="audience-card-eyebrow">{audience.eyebrow}</span>
						<h3>{audience.title}</h3>
						<p>{audience.body}</p>
						<ul>
							{audience.points.map((point) => (
								<li key={point}>{point}</li>
							))}
						</ul>
					</article>
				))}
			</div>

			<div className="repo-signal-strip" aria-label="Repository engineering signals">
				<span><strong>React 19</strong> product surfaces</span>
				<span><strong>TypeScript</strong> across the workspace</span>
				<span><strong>Node + Express</strong> orchestration API</span>
				<span><strong>Octokit</strong> GitHub integration</span>
				<span><strong>GitHub Actions</strong> CI + Pages</span>
			</div>
		</section>
	);
}
