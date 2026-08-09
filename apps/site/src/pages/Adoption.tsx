import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, BarChart3, ExternalLink, GitFork, Github, GitPullRequest, RefreshCw, Star, Users } from "lucide-react";
import { analyticsConfigured, trackEvent } from "../lib/analytics";

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

	function record(action: string) {
		trackEvent("Adoption CTA", { action });
	}

	return (
		<div className="page adoption-page">
			<section className="adoption-hero">
				<div>
					<span className="section-eyebrow">Phase 5 · measurable adoption</span>
					<h1>Measure whether attention becomes participation.</h1>
					<p>
						ContributorOps treats growth as an engineering funnel: useful visit → repository action → contribution → repeat advocate.
						This page exposes public GitHub signals without inventing user counts or silently tracking individual visitors.
					</p>
					<div className="adoption-actions">
						<a className="button-primary" href={REPO_URL} target="_blank" rel="noreferrer" onClick={() => record("open_repository")}>
							<Github size={16} /> Open repository
						</a>
						<Link className="button-secondary" to="/contribute" onClick={() => record("open_contribute")}>
							Find a contribution
						</Link>
					</div>
			</div>
			<aside className="adoption-status-card">
				<Activity size={22} />
				<h2>Measurement posture</h2>
				<ul>
					<li>Public GitHub metrics load directly from GitHub.</li>
					<li>GitHub Insights remains the private source for views, clones, referrers, and popular content.</li>
					<li>Site analytics is optional and currently <strong>{analyticsConfigured() ? "configured" : "disabled"}</strong>.</li>
				</ul>
			</aside>
			</section>

			<section className="site-section">
				<div className="section-heading adoption-heading-row">
					<div>
						<span className="section-eyebrow">Live public signal</span>
						<h2>Repository adoption, directly from GitHub.</h2>
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

			<section className="site-section adoption-layer-grid">
				<article className="adoption-layer-card">
					<BarChart3 size={21} />
					<h3>1. GitHub public signal</h3>
					<p>Stars, forks, open work, and contributor history show whether visitors are choosing to engage with the project.</p>
					<a className="text-link" href={`${REPO_URL}/pulse`} target="_blank" rel="noreferrer">Open repository activity <ExternalLink size={14} /></a>
				</article>
				<article className="adoption-layer-card">
					<Activity size={21} />
					<h3>2. Maintainer traffic signal</h3>
					<p>GitHub Insights → Traffic provides the owner with views, unique visitors, clones, referrers, and popular content for the recent traffic window.</p>
					<a className="text-link" href={`${REPO_URL}/graphs/traffic`} target="_blank" rel="noreferrer">Open GitHub Traffic <ExternalLink size={14} /></a>
				</article>
				<article className="adoption-layer-card">
					<BarChart3 size={21} />
					<h3>3. Optional site conversion signal</h3>
					<p>When configured, the site can use a Plausible per-site script with hash-route tracking, outbound-link measurement, UTMs, and selected conversion events. Nothing loads when the environment variable is absent.</p>
					<a className="text-link" href={`${REPO_URL}/blob/main/docs/adoption-scorecard.md`} target="_blank" rel="noreferrer">Read measurement setup <ExternalLink size={14} /></a>
				</article>
			</section>

			<section className="site-section">
				<div className="adoption-funnel-panel">
					<div>
						<span className="section-eyebrow">Adoption funnel</span>
						<h2>Optimize for meaningful next actions.</h2>
						<p>A star is useful intent. A fork is stronger intent. An issue or PR is participation. A second contribution is retention.</p>
					</div>
					<div className="adoption-funnel-steps">
						<span>Useful visit</span><ArrowRight size={16} />
						<span>Star / fork</span><ArrowRight size={16} />
						<span>Issue / PR</span><ArrowRight size={16} />
						<span>Repeat contributor</span>
					</div>
				</div>
			</section>
		</div>
	);
}
