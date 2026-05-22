import { PricingCard } from "../components/PricingCard";
import { Section } from "../components/Section";
import { pricingPlans } from "../data/pricing";
import { AlertCircle, Check, Minus } from "lucide-react";

const comparisonRows = [
	{ feature: "Issue discovery", free: "Basic", pro: "Daily", career: "Daily", team: "Daily" },
	{ feature: "Contribution plan limit", free: "3 / week", pro: "Unlimited", career: "Unlimited", team: "Unlimited" },
	{ feature: "Job-matched scoring", free: null, pro: true, career: true, team: true },
	{ feature: "PR quality checker", free: null, pro: true, career: true, team: true },
	{ feature: "Portfolio page", free: "Manual", pro: "Hosted", career: "Hosted", team: "Hosted" },
	{ feature: "Resume bullets", free: null, pro: true, career: true, team: true },
	{ feature: "LinkedIn drafts", free: null, pro: true, career: true, team: true },
	{ feature: "Interview STAR stories", free: null, pro: null, career: true, team: true },
	{ feature: "Recruiter tools", free: null, pro: null, career: true, team: true },
	{ feature: "GitHub profile audit", free: null, pro: null, career: true, team: true },
	{ feature: "Team dashboard", free: null, pro: null, career: null, team: true },
	{ feature: "Shared repo radar", free: null, pro: null, career: null, team: true },
];

const faqs = [
	{
		q: "Are payments live?",
		a: "No. This pricing page is mock billing only. It exists to show packaging, upgrade prompts, and future monetization structure.",
	},
	{
		q: "Can I self-host for free?",
		a: "Yes. The repo is open-source and the static site deploys to GitHub Pages without any paid service.",
	},
	{
		q: "What happens when billing launches?",
		a: "The current plan and feature-flag structure is already in place, so Stripe or Lemon Squeezy can be added later without changing the product packaging.",
	},
	{
		q: "What is the difference between Pro and Career?",
		a: "Pro covers contribution execution. Career adds the hiring layer: resume, LinkedIn, interview stories, recruiter tools, and GitHub profile audit surfaces.",
	},
	{
		q: "Why is Team separate?",
		a: "Team is designed for bootcamps, cohorts, and engineering teams that need shared repo radar, contribution visibility, and team-level reporting.",
	},
];

function CellValue({ val, planColor }: { val: string | boolean | null; planColor: string }) {
	if (val === null) return <Minus size={14} style={{ color: "var(--muted)", opacity: 0.4 }} />;
	if (val === true) return <Check size={14} style={{ color: planColor }} />;
	return <span style={{ fontSize: "0.83rem", color: "var(--muted)" }}>{val}</span>;
}

export function Pricing() {
	return (
		<div className="page">
			<Section
				eyebrow="Pricing"
				title="Simple plans for contribution intelligence and career packaging."
				description="No real payments yet. These tiers exist to show packaging, feature flags, and future upgrade paths."
			>
				{/* Mock billing callout */}
				<div className="billing-callout">
					<AlertCircle size={18} className="billing-callout-icon" />
					<span>
						<strong>Payments are not live.</strong> This page shows product packaging and feature boundaries
						only. Stripe or Lemon Squeezy can be wired in later without changing the plan structure.
					</span>
				</div>

				<div className="pricing-grid">
					{pricingPlans.map((plan) => (
						<PricingCard key={plan.name} plan={plan} />
					))}
				</div>
			</Section>

			<Section
				eyebrow="Compare"
				title="Feature comparison"
				description="Every plan starts with the same human-approved safety model."
			>
				<div style={{ overflowX: "auto", borderRadius: "var(--radius-lg)", border: "1px solid var(--line)" }}>
					<table className="comparison-table" style={{ border: "none" }}>
						<thead>
							<tr>
								<th style={{ minWidth: 200 }}>Feature</th>
								<th>Free</th>
								<th style={{ color: "#60a5fa" }}>Pro</th>
								<th style={{ color: "var(--accent)" }}>Career</th>
								<th className="col-accent" style={{ color: "var(--accent-3)" }}>
									Team
								</th>
							</tr>
						</thead>
						<tbody>
							{comparisonRows.map((row) => (
								<tr key={row.feature}>
									<td style={{ fontWeight: 500, fontSize: "0.875rem" }}>{row.feature}</td>
									<td>
										<CellValue val={row.free} planColor="var(--muted)" />
									</td>
									<td>
										<CellValue val={row.pro} planColor="#60a5fa" />
									</td>
									<td>
										<CellValue val={row.career} planColor="var(--accent)" />
									</td>
									<td className="col-accent">
										<CellValue val={row.team} planColor="var(--accent-3)" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section
				eyebrow="FAQ"
				title="Common questions"
				description="Everything about pricing, payments, and the current static business site."
			>
				<div className="pricing-faq">
					{faqs.map((faq) => (
						<div key={faq.q} className="faq-item">
							<h4>{faq.q}</h4>
							<p>{faq.a}</p>
						</div>
					))}
				</div>
			</Section>
		</div>
	);
}
