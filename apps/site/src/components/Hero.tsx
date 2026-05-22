import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const ISSUES = [
	{
		score: 97,
		repo: "angular/core",
		num: "#48291",
		label: "TypeScript strict mode",
		tag: "Backend",
		level: "high" as const,
	},
	{
		score: 84,
		repo: "expressjs/express",
		num: "#3946",
		label: "Error middleware types",
		tag: "API",
		level: "med" as const,
	},
	{
		score: 71,
		repo: "nestjs/nest",
		num: "#12847",
		label: "Guard decorator edge",
		tag: "Platform",
		level: "low" as const,
	},
];

const CHECKS = [
	{ label: "Scope focused", pass: true },
	{ label: "Tests included", pass: true },
	{ label: "Tone respectful", pass: true },
	{ label: "Changelog missing", pass: false },
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
      {/* ── Left: copy ─────────────────────────────────────── */}
      <div className="hero-copy">
        <div className="hero-badges">
          <span className="hero-badge hero-badge-green">
            <span className="hero-badge-dot hero-badge-dot-green" />
            Human-approved
          </span>
          <span className="hero-badge">No spam automation</span>
          <span className="hero-badge">Proof-of-work focused</span>
        </div>

				<h1>
					Turn OSS Contributions
					<br />
					<span className="ai-gradient-text">Into Career Proof</span>
				</h1>

				<p>
					AI-powered contribution intelligence. Discover quality issues, prepare better PRs, build a
					proof-of-work portfolio, and convert real open-source work into resume bullets, LinkedIn posts, and
					interview stories.
				</p>

				<div className="hero-actions">
					<Link to="/docs" className="button-primary">
						<Zap size={14} />
						Start Building
					</Link>
					<Link to="/safety" className="button-secondary">
						Read Safety Model
					</Link>
				</div>

				<div className="hero-trust-row">
					<span>
						<strong>100%</strong> human-approved
					</span>
					<span className="trust-sep" />
					<span>
						<strong>Zero</strong> mass automation
					</span>
					<span className="trust-sep" />
					<span>
						<strong>Real</strong> proof-of-work
					</span>
				</div>
			</div>

			{/* ── Right: AI command-center dashboard ─────────────── */}
			<div className="hero-preview">
				<div className="hero-dashboard">
					{/* Top bar */}
					<div className="hd-topbar">
						<div className="hd-brand">
							<span className="hd-brand-dot" />
							<span className="hd-brand-name">ContributorOps</span>
						</div>
						<div className="hd-status">
							<span className="hd-live-dot" />
							<span>Live · Daily plan active</span>
						</div>
					</div>

					{/* Radar + Quality */}
					<div className="hd-body">
						<div className="hd-panel">
							<div className="hd-panel-label">Issue Radar · AI Scored</div>
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
								<span className="hd-score-big">88</span>
								<span className="hd-score-denom">/100</span>
							</div>
							<div className="hd-checks">
								{CHECKS.map((c) => (
									<div
										key={c.label}
										className={`hd-check ${c.pass ? "hd-check-pass" : "hd-check-warn"}`}
									>
										<span className="hd-check-icon">{c.pass ? "✓" : "!"}</span>
										{c.label}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Mission */}
					<div className="hd-mission">
						<div className="hd-mission-label">Today's Mission</div>
						<div className="hd-mission-text">
							Fix TypeScript strict mode violations · angular/core #48291
						</div>
						<div className="hd-mission-est">~2h estimate · Backend role match · High maintainer fit</div>
					</div>

					{/* Proof export */}
					<div className="hd-proof">
						<span className="hd-proof-label">Proof Export</span>
						<div className="hd-proof-items">
							{PROOFS.map((p) => (
								<span
									key={p.label}
									className={`hd-proof-item ${p.ready ? "hd-proof-ready" : "hd-proof-pending"}`}
								>
									{p.ready ? "✓" : "◌"} {p.label}
								</span>
							))}
						</div>
					</div>

					{/* Safety bar */}
					<div className="hd-safety-bar">
						<span className="hd-safety-dot" />
						Safety: Human-approved · No external writes · Approval required for all actions
					</div>
				</div>
			</div>
		</section>
	);
}
