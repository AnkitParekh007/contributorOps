import { Link } from "react-router-dom";
import { Github, BookOpen, Play } from "lucide-react";
import { trackEvent } from "../lib/analytics";

const ISSUES = [
	{
		score: 94,
		repo: "sample-org/agent-console",
		num: "#128",
		label: "Streaming cancellation guard",
		tag: "Frontend + AI",
		level: "high" as const,
	},
	{
		score: 91,
		repo: "sample-org/dev-platform",
		num: "#84",
		label: "Workspace path policy",
		tag: "Platform",
		level: "med" as const,
	},
	{
		score: 89,
		repo: "sample-org/api-runtime",
		num: "#57",
		label: "Idempotent retry jobs",
		tag: "Backend",
		level: "low" as const,
	},
];

const CHECKS = [
	{ label: "Scope focused", pass: true },
	{ label: "Tests included", pass: true },
	{ label: "Policy checked", pass: true },
	{ label: "Write not authorized", pass: false },
];

const PROOFS = [
	{ label: "Resume bullet", ready: true },
	{ label: "LinkedIn post", ready: true },
	{ label: "STAR story", ready: true },
	{ label: "Portfolio page", ready: false },
];

export function Hero() {
	return (
		<section className="hero reveal-section is-visible">
			<div className="hero-copy">
				<div className="hero-badges">
					<span className="hero-badge hero-badge-green">
						<span className="hero-badge-dot hero-badge-dot-green" />
						Open source
					</span>
					<span className="hero-badge">Explicitly authorized</span>
					<span className="hero-badge">Recruiter-readable proof</span>
				</div>

				<h1>
					Turn OSS Contributions
					<br />
					<span className="ai-gradient-text">Into Career Proof</span>
				</h1>

				<p>
					ContributorOps is an open-source contribution intelligence platform that helps developers discover
					higher-signal issues, prepare stronger pull requests, and turn completed work into verifiable evidence
					that recruiters and engineering teams can actually evaluate.
				</p>

				<div className="hero-actions">
					<Link to="/demo" className="button-primary" onClick={() => trackEvent("Hero CTA", { action: "browser_demo" })}>
						<Play size={15} />
						Try browser demo
					</Link>
					<a
						href="https://github.com/AnkitParekh007/contributorOps"
						target="_blank"
						rel="noreferrer"
						className="button-secondary"
						onClick={() => trackEvent("Hero CTA", { action: "open_repository" })}
					>
						<Github size={16} />
						Star on GitHub
					</a>
					<Link to="/docs/architecture" className="button-secondary">
						<BookOpen size={15} />
						Architecture
					</Link>
				</div>

				<div className="hero-trust-row">
					<span><strong>Discover</strong> better issues</span>
					<span className="trust-sep" />
					<span><strong>Validate</strong> PR quality</span>
					<span className="trust-sep" />
					<span><strong>Prove</strong> engineering impact</span>
				</div>
			</div>

			<div className="hero-preview">
				<div className="hero-dashboard">
					<div className="hd-topbar">
						<div className="hd-brand">
							<span className="hd-brand-dot" />
							<span className="hd-brand-name">ContributorOps</span>
						</div>
						<div className="hd-status">
							<span className="hd-live-dot" />
							<span>Example · browser demo</span>
						</div>
					</div>

					<div className="hd-body">
						<div className="hd-panel">
							<div className="hd-panel-label">Issue Radar · Example Scores</div>
							{ISSUES.map((item) => (
								<div key={item.num} className="hd-issue">
									<span className={`hd-score hd-score-${item.level}`}>{item.score}</span>
									<div className="hd-issue-info">
										<span className="hd-issue-repo">
											{item.repo} <span className="hd-issue-num">{item.num}</span>
										</span>
										<span className="hd-issue-label">{item.label}</span>
									</div>
									<span className="hd-tag">{item.tag}</span>
								</div>
							))}
						</div>

						<div className="hd-panel">
							<div className="hd-panel-label">PR Quality</div>
							<div className="hd-quality-score">
								<span className="hd-score-big">92</span>
								<span className="hd-score-denom">/100</span>
							</div>
							<div className="hd-checks">
								{CHECKS.map((check) => (
									<div key={check.label} className={`hd-check ${check.pass ? "hd-check-pass" : "hd-check-warn"}`}>
										<span className="hd-check-icon">{check.pass ? "✓" : "!"}</span>
										{check.label}
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="hd-mission">
						<div className="hd-mission-label">Example Mission</div>
						<div className="hd-mission-text">Harden streamed agent responses against cancelled navigation</div>
						<div className="hd-mission-est">Frontend + AI role match · focused diff · deterministic test path</div>
					</div>

					<div className="hd-proof">
						<span className="hd-proof-label">Proof Export</span>
						<div className="hd-proof-items">
							{PROOFS.map((proof) => (
								<span key={proof.label} className={`hd-proof-item ${proof.ready ? "hd-proof-ready" : "hd-proof-pending"}`}>
									{proof.ready ? "✓" : "◌"} {proof.label}
								</span>
							))}
						</div>
					</div>

					<div className="hd-safety-bar">
						<span className="hd-safety-dot" />
						Safety: action-scoped interactive approval · bounded exact-patch standing authorization
					</div>
				</div>
			</div>
		</section>
	);
}
