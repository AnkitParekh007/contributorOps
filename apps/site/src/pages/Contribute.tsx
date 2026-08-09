import { ExternalLink, FileText, GitFork, Github, HeartHandshake, TestTube2, Accessibility, ServerCog } from "lucide-react";

const TRACKS = [
	{
		icon: <Accessibility size={19} />,
		title: "Frontend & accessibility",
		body: "Improve responsive behavior, keyboard navigation, semantics, loading states, and the clarity of developer-facing product flows.",
	},
	{
		icon: <ServerCog size={19} />,
		title: "API & safety",
		body: "Strengthen discovery, scoring, validation, auditability, and approval-gated GitHub workflows without introducing mass automation.",
	},
	{
		icon: <TestTube2 size={19} />,
		title: "Testing & quality",
		body: "Add focused unit, integration, and regression coverage around high-value contribution and proof-of-work paths.",
	},
	{
		icon: <FileText size={19} />,
		title: "Docs & examples",
		body: "Make setup, architecture, safety decisions, contribution examples, and recruiter-facing evidence easier to understand.",
	},
];

export function Contribute() {
	return (
		<div className="page growth-page">
			<section className="growth-hero growth-hero-contribute">
				<div>
					<span className="section-eyebrow">Open source</span>
					<h1>Make your first ContributorOps contribution count.</h1>
					<p>
						Pick a focused issue, understand the safety model, improve one meaningful part of the workflow, and leave the codebase clearer than you found it.
					</p>
					<div className="growth-actions">
						<a className="button-primary" href="https://github.com/AnkitParekh007/contributorOps/contribute" target="_blank" rel="noreferrer">
							<HeartHandshake size={16} /> Find a good first issue
						</a>
						<a className="button-secondary" href="https://github.com/AnkitParekh007/contributorOps/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">
							Read CONTRIBUTING.md
						</a>
					</div>
				</div>
				<div className="growth-command-card">
					<div className="growth-command-title"><Github size={17} /> Local setup</div>
					<pre><code>{`git clone https://github.com/AnkitParekh007/contributorOps.git\ncd contributorOps\nnpm install\nnpm run dev`}</code></pre>
					<div className="growth-command-footer">Before PR: npm run typecheck && npm run build:all</div>
				</div>
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Contribution tracks</span>
					<h2>Choose work that matches how you want to grow.</h2>
					<p>Non-code contributions are welcome too. The best first PR is small enough to review and useful enough to matter.</p>
				</div>
				<div className="growth-evidence-grid">
					{TRACKS.map((track) => (
						<article className="growth-evidence-card" key={track.title}>
							<span className="growth-track-icon">{track.icon}</span>
							<h3>{track.title}</h3>
							<p>{track.body}</p>
						</article>
					))}
				</div>
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Contributor loop</span>
					<h2>A review-friendly path from issue to merge.</h2>
				</div>
				<div className="growth-steps">
					{[
						["01", "Pick", "Choose a good-first-issue/help-wanted task or open a focused proposal before large changes."],
						["02", "Understand", "Read CONTRIBUTING.md. If the change touches GitHub automation, read the safety policy first."],
						["03", "Build", "Keep the diff focused, preserve approval gates, and add tests or documentation where the behavior changes."],
						["04", "Validate", "Run TypeScript checks and builds, then explain user impact and safety implications in the PR."],
					].map(([num, title, body]) => (
						<div className="growth-step" key={num}>
							<span>{num}</span>
							<div><h3>{title}</h3><p>{body}</p></div>
						</div>
					))}
				</div>
			</section>

			<section className="site-section growth-contributor-links">
				<a href="https://github.com/AnkitParekh007/contributorOps/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22" target="_blank" rel="noreferrer">
					<HeartHandshake size={18} /> Good first issues <ExternalLink size={14} />
				</a>
				<a href="https://github.com/AnkitParekh007/contributorOps/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22" target="_blank" rel="noreferrer">
					<GitFork size={18} /> Help wanted <ExternalLink size={14} />
				</a>
				<a href="https://github.com/AnkitParekh007/contributorOps/blob/main/docs/safety-policy.md" target="_blank" rel="noreferrer">
					<FileText size={18} /> Safety policy <ExternalLink size={14} />
				</a>
			</section>
		</div>
	);
}
