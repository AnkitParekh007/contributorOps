export const CAMPAIGN_ID = "phase9-growth";
export const SITE_URL = "https://ankitparekh007.github.io/contributorOps/";

export interface CampaignChannel {
	id: string;
	label: string;
	audience: string;
	source: string;
	medium: string;
	content: string;
	route: string;
	goal: string;
}

export const CAMPAIGN_CHANNELS: CampaignChannel[] = [
	{
		id: "show-hn",
		label: "Show HN",
		audience: "Developers and technical founders",
		source: "hacker-news",
		medium: "community",
		content: "browser-demo",
		route: "/demo",
		goal: "Technical feedback after a zero-signup product walkthrough.",
	},
	{
		id: "product-hunt",
		label: "Product Hunt",
		audience: "Product builders and early adopters",
		source: "product-hunt",
		medium: "launch",
		content: "launch-hub",
		route: "/launch",
		goal: "Product evaluation without implying hosted SaaS readiness.",
	},
	{
		id: "developer-community",
		label: "Developer communities",
		audience: "Frontend, AI, platform, and OSS developers",
		source: "developer-community",
		medium: "community",
		content: "technical-demo",
		route: "/demo",
		goal: "Useful technical discussion, source inspection, and contributor interest.",
	},
	{
		id: "recruiter",
		label: "Recruiter outreach",
		audience: "Recruiters and engineering leaders",
		source: "recruiter-outreach",
		medium: "referral",
		content: "engineering-brief",
		route: "/recruiter",
		goal: "Route hiring evaluation directly to architecture and proof.",
	},
	{
		id: "maintainer",
		label: "Maintainer outreach",
		audience: "Open-source maintainers",
		source: "maintainer-outreach",
		medium: "referral",
		content: "safety-boundaries",
		route: "/safety",
		goal: "Invite critique of authorization, anti-spam, and exact-patch safeguards.",
	},
	{
		id: "github-readme",
		label: "GitHub repository",
		audience: "Repository visitors",
		source: "github",
		medium: "repository",
		content: "readme-demo",
		route: "/demo",
		goal: "Convert repository discovery into an immediate product evaluation.",
	},
];

interface CampaignUrlOptions {
	source: string;
	medium: string;
	content: string;
}

function safeCampaignValue(value: string | null): string | undefined {
	if (!value) return undefined;
	const normalized = value.trim();
	if (!/^[a-z0-9][a-z0-9._-]{0,63}$/i.test(normalized)) return undefined;
	return normalized;
}

export function campaignUrl(route: string, options: CampaignUrlOptions): string {
	const params = new URLSearchParams();
	params.set("utm_source", options.source);
	params.set("utm_medium", options.medium);
	params.set("utm_campaign", CAMPAIGN_ID);
	params.set("utm_content", options.content);
	return `${SITE_URL}?${params.toString()}#${route}`;
}

export function channelUrl(channel: CampaignChannel): string {
	return campaignUrl(channel.route, {
		source: channel.source,
		medium: channel.medium,
		content: channel.content,
	});
}

export function campaignAttribution(): Record<string, string> {
	if (typeof window === "undefined") return {};

	const searchParams = new URLSearchParams(window.location.search);
	const hashQuery = window.location.hash.includes("?") ? window.location.hash.split("?")[1] : "";
	const hashParams = new URLSearchParams(hashQuery);
	const read = (key: string) => safeCampaignValue(searchParams.get(key) ?? hashParams.get(key));

	const attribution: Record<string, string> = {};
	for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const) {
		const value = read(key);
		if (value) attribution[key] = value;
	}
	return attribution;
}
