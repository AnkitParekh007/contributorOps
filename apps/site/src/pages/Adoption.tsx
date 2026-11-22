import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
	Activity,
	ArrowRight,
	BarChart3,
	Clock3,
	ExternalLink,
	GitFork,
	Github,
	GitPullRequest,
	MessageSquareText,
	RefreshCw,
	Star,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import { analyticsConfigured, trackEvent } from "../lib/analytics";
import { CAMPAIGN_CHANNELS, CAMPAIGN_ID, channelUrl } from "../lib/campaigns";

const REPO = "AnkitParekh007/contributorOps";
const REPO_URL = `https://github.com/${REPO}`;
const API_URL = `https://api.github.com/repos/${REPO}`;

interface RepoMetrics {
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	subscribers_count: number;
	updated_at: string;
}

interface Contributor {
	login?: string;
	type?: string;
}

function compact(value: number): string {
	return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function Adoption() {
	const [repo, setRepo] = useState<RepoMetrics | null>(null);
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function loadMetrics(signal?: AbortSignal) {
		setLoading(true);
		setError(null);
		try {
			const headers = { Accept: "application/vnd.github+json" };
			const [repoResponse, contributorsResponse] = await Promise.all([
				fetch(API_URL, { headers, signal }),
				fetch(`${API_URL}/contributors?per_page=100&anon=1`, { headers, signal }),
			]);

			if (!repoResponse.ok || !contributorsResponse.ok) throw new Error("GitHub API request failed");
			setRepo((await repoResponse.json()) as RepoMetrics);
			setContributors((await contributorsResponse.json()) as Contributor[]);
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			setError("Live GitHub metrics are temporarily unavailable. The repository links below still work.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		const controller = new AbortController();
		void loadMetrics(controller.signal);
		return () => controller.abort();
	}, []);

	const humanContributors = useMemo(
		() => contributors.filter((contributor) => contributor.type !== "Bot").length,
		[contributors],
	);

	const metrics = [
		{ label: "Stars", value: repo?.stargazers_count, icon: <Star size={19} />, href: `${REPO_URL}/stargazers` },
		{ label: "Forks", value: repo?.forks_count, icon: <GitFork size={19} />, href: `${REPO_URL}/forks` },
		{ label: "Open issues + PRs", value: repo?.open_issues_count, icon: <GitPullRequest size={19} />, href: `${REPO_URL}/issues` },
		{ label: "Listed contributors", value: humanContributors, icon: <Users size={19} />, href: `${REPO_URL}/graphs/contributors` },
	];

	function record(action: string, channel?: string) {
		trackEvent("Growth CTA", { action, ...(channel ? { channel } : {}) });
	}

	return (
		<div className="page adoption-page">
			<section className="adoption-hero">
				<div>
					<span className="section-eyebrow">Phase 9 · growth operating system</span>
					<h1>Turn launch attention into measurable participation.</h1>
					<p>
						ContributorOps now treats distribution as an engineering loop: attributed visit → demo evaluation → source inspection → contribution → repeat contributor.
						Public GitHub signals stay separate from private traffic analytics, and no conversion rate is fabricated when data is unavailable.
					</p>
					<div className="adoption-actions">
						<Link className="button-primary" to="/launch" onClick={() => record("open_launch_hub")}>
							<TrendingUp size={16} /> Open launch hub
						</Link>
						<Link className="button-secondary" to="/demo" onClick={() => record("open_demo")}>
							Try browser demo
						</Link>
						<a className="button-secondary" href={`${REPO_URL}/issues/new?template=workflow_feedback.yml`} target="_blank" rel="noreferrer" onClick={() => record("open_feedback")}>
							<MessageSquareText size={16} /> Give workflow feedback
						</a>
					</div>
			</div>
			<aside className="adoption-status-card">
				<Activity size={22} />
				<h2>Measurement posture</h2>
				<ul>
					<li>Campaign registry: <strong>{CAMPAIGN_ID}</strong>.</li>
					<li>Public GitHub metrics load directly from GitHub.</li>
					<li>GitHub Insights remains the maintainer source for views, clones, referrers, and popular content.</li>
					<li>Optional site analytics is currently <strong>{analyticsConfigured() ? "configured" : "disabled"}</strong>.</li>
				</ul>
			</aside>
			</section>

			<section className="site-section">
				<div className="section-heading adoption-heading-row">
					<div>
						<span className="section-eyebrow">Live public signal</span>
						<h2>Repository participation, directly from GitHub.</h2>
						<p>These are public repository signals, not product-user or customer claims.</p>
					</div>
					<button className="button-secondary adoption-refresh" type="button" onClick={() => void loadMetrics()} disabled={loading}>
						<RefreshCw size={15} /> {loading ? "Refreshing" : "Refresh"}
					</button>
				</div>
				{error && <div className="adoption-error" role="status">{error}</div>}
				<div className="adoption-metric-grid" aria-live="polite">
					{metrics.map((metric) => (
						<a key={metric.label} className="adoption-metric-card" href={metric.href} target="_blank" rel="noreferrer">
							<span className="adoption-metric-icon">{metric.icon}</span>
							<strong>{loading && metric.value === undefined ? "—" : compact(metric.value ?? 0)}</strong>
							<span>{metric.label}</span>
						</a>
					))}
				</div>
				{repo && <p className="adoption-updated">GitHub repository metadata last updated {new Date(repo.updated_at).toLocaleString()}.</p>}
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Canonical campaign registry</span>
					<h2>Every launch channel gets one attributed destination and one concrete goal.</h2>
					<p>Links use low-cardinality UTM values from a single source of truth so launch measurement does not drift across docs and UI.</p>
				</div>
				<div className="adoption-campaign-grid">
					{CAMPAIGN_CHANNELS.map((channel) => (
						<article className="adoption-campaign-card" key={channel.id}>
							<div className="adoption-campaign-head">
								<Target size={18} />
								<span>{channel.medium}</span>
							</div>
							<h3>{channel.label}</h3>
							<p><strong>{channel.audience}</strong></p>
							<p>{channel.goal}</p>
							<a className="text-link" href={channelUrl(channel)} target="_blank" rel="noreferrer" onClick={() => record("open_campaign_destination", channel.id)}>
								Open attributed path <ExternalLink size={14} />
							</a>
						</article>
					))}
				</div>
			</section>

			<section className="site-section adoption-layer-grid">
				<article className="adoption-layer-card">
					<BarChart3 size={21} />
					<h3>1. Public repository signal</h3>
					<p>Stars and forks indicate interest; issues, PRs, and repeat contributors indicate increasingly stronger participation.</p>
					<a className="text-link" href={`${REPO_URL}/pulse`} target="_blank" rel="noreferrer">Open repository activity <ExternalLink size={14} /></a>
				</article>
				<article className="adoption-layer-card">
					<Activity size={21} />
					<h3>2. Maintainer traffic signal</h3>
					<p>GitHub Insights → Traffic remains the private source for views, unique visitors, clones, referrers, and popular content.</p>
					<a className="text-link" href={`${REPO_URL}/graphs/traffic`} target="_blank" rel="noreferrer">Open GitHub Traffic <ExternalLink size={14} /></a>
				</article>
				<article className="adoption-layer-card">
					<TrendingUp size={21} />
					<h3>3. Optional conversion signal</h3>
					<p>When Plausible is configured, selected events automatically receive allowlisted campaign attribution. Nothing loads when the analytics environment variable is absent.</p>
					<a className="text-link" href={`${REPO_URL}/blob/main/docs/phase-9-growth-operating-system.md`} target="_blank" rel="noreferrer">Read growth measurement policy <ExternalLink size={14} /></a>
				</article>
			</section>

			<section className="site-section">
				<div className="adoption-funnel-panel">
					<div>
						<span className="section-eyebrow">Phase 9 funnel</span>
						<h2>Measure stronger intent at every step.</h2>
						<p>Do not optimize for the easiest vanity metric. The objective is to learn which channel produces evaluation, contribution, and eventual repeat participation.</p>
					</div>
					<div className="adoption-funnel-steps">
						<span>Attributed visit</span><ArrowRight size={16} />
						<span>Demo completed</span><ArrowRight size={16} />
						<span>Source / Codespaces</span><ArrowRight size={16} />
						<span>Issue / PR</span><ArrowRight size={16} />
						<span>Repeat contributor</span>
					</div>
				</div>
			</section>

			<section className="site-section adoption-review-grid">
				<article className="adoption-review-card">
					<Clock3 size={20} />
					<h3>48-hour review</h3>
					<p>Compare channel traffic, demo completion, repository actions, substantive feedback, and contribution starts against the launch baseline.</p>
				</article>
				<article className="adoption-review-card">
					<TrendingUp size={20} />
					<h3>7-day review</h3>
					<p>Keep channels that produce meaningful evaluation or participation, change the artifact where drop-off is visible, and stop low-signal repetition.</p>
				</article>
			</section>
		</div>
	);
}
