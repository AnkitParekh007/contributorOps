import productOverviewMd from "../content/docs/product-overview.md?raw";
import architectureMd from "../content/docs/architecture.md?raw";
import localDevMd from "../content/docs/local-development.md?raw";
import envSetupMd from "../content/docs/environment-setup.md?raw";
import ghDeployMd from "../content/docs/github-pages-deployment.md?raw";
import safetyMd from "../content/docs/safety-policy.md?raw";
import monetizationMd from "../content/docs/monetization-plan.md?raw";
import roadmapMd from "../content/docs/roadmap.md?raw";

export interface DocEntry {
	slug: string;
	title: string;
	summary: string;
	category: string;
	content: string;
	githubUrl: string;
}

export const docs: DocEntry[] = [
	{
		slug: "product-overview",
		title: "Product Overview",
		summary: "Vision, target users, core workflows, and why proof-of-work matters for job seekers.",
		category: "Product",
		content: productOverviewMd,
		githubUrl: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/product-overview.md",
	},
	{
		slug: "architecture",
		title: "Architecture",
		summary: "System surfaces, trust boundaries, CI, persistence strategy, and the ADRs behind key decisions.",
		category: "Architecture",
		content: architectureMd,
		githubUrl: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/architecture.md",
	},
	{
		slug: "local-development",
		title: "Local Development",
		summary: "Run the static business site locally with the workspace scripts.",
		category: "Developer Setup",
		content: localDevMd,
		githubUrl: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/local-development.md",
	},
	{
		slug: "environment-setup",
		title: "Environment Setup",
		summary: "Detailed .env setup for the API, web app, site workspace, GitHub OAuth, Supabase, and Actions secrets.",
		category: "Developer Setup",
		content: envSetupMd,
		githubUrl: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/environment-setup.md",
	},
	{
		slug: "github-pages-deployment",
		title: "GitHub Pages Deployment",
		summary: "Deploy the site from apps/site/dist with GitHub Actions and Vite base path safety.",
		category: "Developer Setup",
		content: ghDeployMd,
		githubUrl: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/github-pages-deployment.md",
	},
	{
		slug: "safety-policy",
		title: "Safety Policy",
		summary: "Human approval model, anti-spam rules, and external repo write restrictions.",
		category: "Trust & Safety",
		content: safetyMd,
		githubUrl: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/safety-policy.md",
	},
	{
		slug: "monetization-plan",
		title: "Monetization Plan",
		summary: "Free, Pro, Career, and Team packaging — without real payments yet.",
		category: "Business",
		content: monetizationMd,
		githubUrl: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/monetization-plan.md",
	},
	{
		slug: "roadmap",
		title: "Roadmap",
		summary: "MVP, SaaS roadmap, career tooling, team surfaces, and maintainer analytics.",
		category: "Product",
		content: roadmapMd,
		githubUrl: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/roadmap.md",
	},
];

export function getDocBySlug(slug: string): DocEntry | undefined {
	return docs.find((d) => d.slug === slug);
}

/** Extract h1–h3 headings from raw markdown for the right-side TOC. */
export function extractHeadings(md: string): { level: number; text: string; id: string }[] {
	return [...md.matchAll(/^(#{1,3})\s+(.+)/gm)].map(([, hashes, rawText]) => {
		const text = rawText.trim();
		const id = headingId(text);
		return { level: hashes.length, text, id };
	});
}

/** Convert heading text to a stable slug — must match what heading components emit. */
export function headingId(text: string): string {
	return text
		.toLowerCase()
		.replace(/[`*_[\]()]/g, "")
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-{2,}/g, "-")
		.replace(/^-|-$/g, "");
}
