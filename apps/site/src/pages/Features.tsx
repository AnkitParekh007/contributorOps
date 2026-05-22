import { Link } from "react-router-dom";
import { FeatureCard } from "../components/FeatureCard";
import { Section } from "../components/Section";
import { features } from "../data/features";
import { Search, FileCode2, ShieldCheck, BookOpen, ChevronRight } from "lucide-react";

const PIPELINE = [
	{ label: "GitHub Signals", sub: "Issues, PRs, activity", iconClass: "pipeline-icon-1", icon: <Search size={20} /> },
	{
		label: "AI Scoring",
		sub: "Role match, maintainer fit",
		iconClass: "pipeline-icon-2",
		icon: <ShieldCheck size={20} />,
	},
	{
		label: "Contribution Plan",
		sub: "Files, tests, PR narrative",
		iconClass: "pipeline-icon-3",
		icon: <FileCode2 size={20} />,
	},
	{
		label: "PR Package",
		sub: "Quality-checked draft",
		iconClass: "pipeline-icon-4",
		icon: <ShieldCheck size={20} />,
	},
	{
		label: "Portfolio Proof",
		sub: "Resume, LinkedIn, STAR",
		iconClass: "pipeline-icon-5",
		icon: <BookOpen size={20} />,
	},
];

const CATEGORIES = ["Discover", "Prepare", "Validate", "Prove", "Career", "Safety"] as const;

const CAT_ICON_CLASS: Record<string, string> = {
	Discover: "feature-icon-discover",
	Prepare: "feature-icon-prepare",
	Validate: "feature-icon-validate",
	Prove: "feature-icon-prove",
	Career: "feature-icon-career",
	Safety: "feature-icon-safety",
};

export function Features() {
	return (
		<div className="page">
			<Section
				eyebrow="Features"
				title={
					(
						<span>
							Contribution intelligence — <span className="ai-gradient-text">end to end</span>
						</span>
					) as unknown as string
				}
				description="ContributorOps is a contribution intelligence layer first, and a career packaging layer second. Every module is designed to produce verifiable, human-approved output."
			>
				{/* Intelligence pipeline visualization */}
				<div className="pipeline-row">
					{PIPELINE.map((node, i) => (
						<div key={node.label} style={{ display: "flex", alignItems: "center" }}>
							<div className="pipeline-node">
								<div className={`pipeline-icon ${node.iconClass}`}>{node.icon}</div>
								<span className="pipeline-label">{node.label}</span>
								<span className="pipeline-sub">{node.sub}</span>
							</div>
							{i < PIPELINE.length - 1 && <div className="pipeline-arrow" />}
						</div>
					))}
				</div>
			</Section>

			{/* Feature cards grouped by category */}
			{CATEGORIES.map((cat) => {
				const catFeatures = features.filter((f) => f.category === cat);
				if (!catFeatures.length) return null;
				return (
					<section key={cat} className="site-section">
						<div className="feature-category-header">
							<span
								className={`feature-icon-wrap ${CAT_ICON_CLASS[cat]}`}
								style={{ width: 32, height: 32 }}
							>
								<ChevronRight size={14} />
							</span>
							<h3 className="feature-category-title">{cat}</h3>
							<span className="feature-category-count">{catFeatures.length} features</span>
						</div>
						<div className="feature-grid">
							{catFeatures.map((feature) => (
								<FeatureCard key={feature.title} feature={feature} />
							))}
						</div>
					</section>
				);
			})}

			<Section
				id="features-cta"
				eyebrow="Next step"
				title="Read the docs, then decide which plan fits."
				description="The business site is documentation-first. Product execution happens in the ContributorOps application."
			>
				<div className="cta-panel">
					<Link to="/docs" className="button-primary">
						Read the Docs
					</Link>
					<Link to="/pricing" className="button-secondary">
						See Pricing
					</Link>
				</div>
			</Section>
		</div>
	);
}
