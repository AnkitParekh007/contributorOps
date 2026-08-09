import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://ankitparekh007.github.io/contributorOps/";

interface RouteMetaDefinition {
	title: string;
	description: string;
}

export const ROUTE_META: Record<string, RouteMetaDefinition> = {
	"/": {
		title: "ContributorOps — Open-Source Contribution Intelligence",
		description: "Discover better OSS work, prepare stronger pull requests, and turn real contributions into recruiter-readable proof of work.",
	},
	"/features": {
		title: "Features — ContributorOps",
		description: "Explore issue discovery, contribution planning, PR-quality checks, human approval, and proof-of-work packaging in ContributorOps.",
	},
	"/showcase": {
		title: "Engineering Showcase — ContributorOps",
		description: "Inspect the architecture, safety boundaries, technical stack, and engineering evidence behind ContributorOps.",
	},
	"/try": {
		title: "Try ContributorOps Without Signup",
		description: "Run ContributorOps in demo-safe mode locally or in GitHub Codespaces without creating an account or providing a GitHub token.",
	},
	"/recruiter": {
		title: "Recruiter Brief — ContributorOps",
		description: "A two-minute engineering brief connecting ContributorOps product claims to architecture decisions, source evidence, CI, and trust boundaries.",
	},
	"/share": {
		title: "Share ContributorOps",
		description: "Choose audience-specific ContributorOps links and messages for developers, recruiters, maintainers, and engineering communities.",
	},
	"/adoption": {
		title: "Adoption Signals — ContributorOps",
		description: "View public GitHub engagement signals for ContributorOps and understand how repository activity is measured without overstating product adoption.",
	},
	"/quality": {
		title: "Quality Gates — ContributorOps",
		description: "See the CI, metadata, route-integrity, Lighthouse, TypeScript, build, and secret-scanning gates ContributorOps enforces before merge.",
	},
	"/contribute": {
		title: "Contribute — ContributorOps",
		description: "Find approachable ContributorOps issues, understand the repository surfaces, and make a focused contribution with clear safety expectations.",
	},
	"/pricing": {
		title: "Pricing Architecture — ContributorOps",
		description: "Review the planned ContributorOps packaging model and current preview boundaries before billing or hosted SaaS operations are live.",
	},
	"/docs": {
		title: "Documentation — ContributorOps",
		description: "Read ContributorOps product, architecture, developer setup, safety, deployment, roadmap, and business documentation.",
	},
	"/safety": {
		title: "Safety Model — ContributorOps",
		description: "Understand ContributorOps human-approval requirements, anti-spam rules, rate limits, and external GitHub write boundaries.",
	},
	"/roadmap": {
		title: "Roadmap — ContributorOps",
		description: "Review the ContributorOps product, architecture, SaaS, contributor-experience, and trust roadmap.",
	},
	"/waitlist": {
		title: "Early Access — ContributorOps",
		description: "Register interest in future hosted ContributorOps capabilities while the open-source product remains directly inspectable and runnable.",
	},
	"/contact": {
		title: "Contact — ContributorOps",
		description: "Contact ContributorOps through the project channels for product, contributor, recruiter, or engineering questions.",
	},
	"/privacy": {
		title: "Privacy Policy — ContributorOps",
		description: "Read how ContributorOps handles preview data, public GitHub information, optional analytics, and local browser preferences.",
	},
	"/terms": {
		title: "Terms of Service — ContributorOps",
		description: "Read the ContributorOps preview terms and current service boundaries.",
	},
	"/acceptable-use": {
		title: "Acceptable Use — ContributorOps",
		description: "Review the acceptable-use rules protecting maintainers, contributors, and GitHub communities from abusive automation.",
	},
	"/ai-disclosure": {
		title: "AI Disclosure — ContributorOps",
		description: "Understand where ContributorOps uses AI-assisted workflows and where deterministic or human controls remain required.",
	},
	"/github-data-usage": {
		title: "GitHub Data Usage — ContributorOps",
		description: "Review how ContributorOps accesses and uses GitHub data in demo, discovery, and approved contribution workflows.",
	},
};

function upsertMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
	let element = document.head.querySelector<HTMLMetaElement>(selector);
	if (!element) {
		element = document.createElement("meta");
		element.setAttribute(attribute, key);
		document.head.appendChild(element);
	}
	element.content = content;
}

function humanizeDocSlug(pathname: string) {
	const slug = pathname.replace(/^\/docs\//, "");
	if (!slug) return "Documentation";
	return slug
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function getRouteMeta(pathname: string): RouteMetaDefinition {
	if (pathname.startsWith("/docs/")) {
		const docTitle = humanizeDocSlug(pathname);
		return {
			title: `${docTitle} — ContributorOps Docs`,
			description: `Read the ContributorOps documentation for ${docTitle.toLowerCase()}.`,
		};
	}

	return ROUTE_META[pathname] ?? {
		title: "ContributorOps — Open-Source Contribution Intelligence",
		description: "Open-source contribution intelligence for stronger OSS work, human-approved automation, and recruiter-readable engineering proof.",
	};
}

export function RouteMeta() {
	const location = useLocation();

	useEffect(() => {
		const meta = getRouteMeta(location.pathname);
		const routeUrl = `${SITE_URL}#${location.pathname}`;

		document.title = meta.title;
		upsertMeta('meta[name="description"]', "name", "description", meta.description);
		upsertMeta('meta[property="og:title"]', "property", "og:title", meta.title);
		upsertMeta('meta[property="og:description"]', "property", "og:description", meta.description);
		upsertMeta('meta[property="og:url"]', "property", "og:url", routeUrl);
		upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
		upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", meta.description);
	}, [location.pathname]);

	return null;
}
