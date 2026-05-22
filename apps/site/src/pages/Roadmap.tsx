import { Link } from "react-router-dom";
import { roadmapPhases } from "../data/roadmap";
import { Rocket, Sparkles, Briefcase, Users, Check, Circle } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
	Rocket: <Rocket size={20} />,
	Sparkles: <Sparkles size={20} />,
	Briefcase: <Briefcase size={20} />,
	Users: <Users size={20} />,
};

const DOT_CLASS: Record<string, string> = {
	current: "roadmap-phase-dot-current",
	next: "roadmap-phase-dot-next",
	planned: "roadmap-phase-dot-planned",
	later: "roadmap-phase-dot-later",
};

const CONTENT_CLASS: Record<string, string> = {
	current: "roadmap-phase-content-current",
	next: "roadmap-phase-content-next",
	planned: "",
	later: "",
};

export function Roadmap() {
	return (
		<div className="page">
			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Roadmap</span>
					<h2>
						From proof-of-work infrastructure{" "}
						<span className="ai-gradient-text">to career intelligence.</span>
					</h2>
					<p>
						ContributorOps starts with the tools developers need to produce real, verifiable open-source
						work — then expands into career packaging, team collaboration, and maintainer-quality analytics.
					</p>
				</div>

				<div className="roadmap-timeline">
					{roadmapPhases.map((phase) => {
						const icon = ICON_MAP[phase.icon] ?? <Rocket size={20} />;
						const dotClass = DOT_CLASS[phase.status];
						const cntClass = CONTENT_CLASS[phase.status];
						const isActive = phase.status === "current";

						return (
							<div key={phase.title} className="roadmap-phase">
								{/* Left marker */}
								<div className="roadmap-phase-marker">
									<div className={`roadmap-phase-dot ${dotClass}`}>{icon}</div>
									<div className="roadmap-phase-line" />
								</div>

								{/* Content */}
								<div className={`roadmap-phase-content ${cntClass}`}>
									<div className="roadmap-phase-header">
										<h3 className="roadmap-phase-title">{phase.title}</h3>
										<span className={`status-badge status-${phase.status}`}>
											{phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
										</span>
									</div>

									<p className="roadmap-phase-desc">{phase.description}</p>

									<div className="roadmap-phase-items">
										{phase.items.map((item) => (
											<div key={item} className="roadmap-phase-item">
												{isActive ? (
													<Check size={13} className="roadmap-item-check" />
												) : (
													<Circle
														size={7}
														className="roadmap-item-dot"
														style={{ color: "var(--muted)", opacity: 0.5 }}
													/>
												)}
												{item}
											</div>
										))}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* CTA */}
			<section className="site-section">
				<div className="cta-panel">
					<Link to="/docs" className="button-primary">
						Read the Docs
					</Link>
					<Link to="/pricing" className="button-secondary">
						View Pricing
					</Link>
				</div>
			</section>
		</div>
	);
}
