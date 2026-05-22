export interface PricingPlan {
	name: string;
	price: string;
	tagline: string;
	features: string[];
	cta: string;
	featured?: boolean;
}

export const pricingPlans: PricingPlan[] = [
	{
		name: "Free",
		price: "$0",
		tagline: "Start with basic discovery and proof-of-work fundamentals.",
		features: ["Basic issue discovery", "3 contribution plans per week", "Manual portfolio tracker", "Basic docs"],
		cta: "Coming Soon",
	},
	{
		name: "Pro",
		price: "$19/month",
		tagline: "Daily planning and stronger contribution execution quality.",
		features: [
			"Daily contribution plans",
			"Job-matched issue finder",
			"PR quality checker",
			"Portfolio page",
			"Resume bullets",
			"LinkedIn drafts",
		],
		cta: "Join Waitlist",
		featured: true,
	},
	{
		name: "Career",
		price: "$49/month",
		tagline: "Turn contributions into recruiting and interview assets.",
		features: [
			"Everything in Pro",
			"Interview story generator",
			"Recruiter outreach drafts",
			"GitHub profile audit",
			"Advanced proof-of-work exports",
			"Weekly career report",
		],
		cta: "Join Waitlist",
	},
	{
		name: "Team",
		price: "$199/month",
		tagline: "Coordinate open-source career building across cohorts or teams.",
		features: [
			"Team contribution dashboard",
			"Bootcamp/team tracking",
			"Shared repo radar",
			"Team portfolio reports",
			"Admin controls",
			"Priority roadmap input",
		],
		cta: "Join Waitlist",
	},
];
