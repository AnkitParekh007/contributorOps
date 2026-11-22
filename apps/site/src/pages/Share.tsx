import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Check, Clipboard, Code2, ExternalLink, Github, MessageCircle, Share2, ShieldCheck } from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { campaignUrl } from "../lib/campaigns";

const REPO_URL = "https://github.com/AnkitParekh007/contributorOps";

const SHARE_PATHS = [
	{
		id: "developer",
		icon: <Code2 size={20} />,
		title: "Developer / contributor",
		description: "Share something immediately usable before asking someone to inspect the full repository.",
		route: "/demo",
		copy: "ContributorOps helps you find worthwhile OSS issues, prepare focused PRs, and turn real merged work into career proof. An upstream Floating UI fix prepared with ContributorOps assistance was merged (floating-ui/floating-ui#3494). The no-signup browser demo uses clearly labeled fictional scenarios.",
	},
	{
		id: "recruiter",
		icon: <BriefcaseBusiness size={20} />,
		title: "Recruiter / hiring manager",
		description: "Send the concise engineering brief rather than asking someone to reverse-engineer the repository.",
		route: "/recruiter",
		copy: "ContributorOps is an open-source React/TypeScript and Node.js system that demonstrates governed GitHub actions, bounded exact-patch automation, and public security gates. Its real upstream Floating UI PR #3494 was merged on October 26, 2026, with automation disclosed. This engineering brief links to the implementation and evidence.",
	},
	{
		id: "maintainer",
		icon: <ShieldCheck size={20} />,
		title: "Open-source maintainer",
		description: "Lead with the trust boundary and ask for critique of the contribution model.",
		route: "/safety",
		copy: "ContributorOps explores contribution automation with two explicit authority paths: action-scoped human approval for interactive writes, and a separately enabled exact-patch queue bounded by repository policy, duplicate checks, daily limits, exact replacements, draft PRs, and automation disclosure. Maintainer feedback on those boundaries is especially useful.",
	},
	{
		id: "community",
		icon: <MessageCircle size={20} />,
		title: "Developer community",
		description: "Use a problem-first message and link to something people can try immediately.",
		route: "/launch",
		copy: "I built ContributorOps to help developers find useful issues, prepare reviewable pull requests, and capture verified contribution history. One disclosed ContributorOps-assisted fix was merged upstream in Floating UI (PR #3494). I'd welcome a critique of the workflow and the distinction between action-scoped approval and the separate bounded draft-PR queue. The browser demo uses example data, without signup.",
	},
];

type ShareFeedback = { key: string; kind: "success" | "error"; message: string };

export function Share() {
	const [feedback, setFeedback] = useState<ShareFeedback | null>(null);
	const feedbackTimeout = useRef<number | null>(null);
	const canNativeShare = useMemo(() => typeof navigator !== "undefined" && typeof navigator.share === "function", []);

	useEffect(() => () => {
		if (feedbackTimeout.current !== null) window.clearTimeout(feedbackTimeout.current);
	}, []);

	function announce(key: string, kind: ShareFeedback["kind"], message: string) {
		if (feedbackTimeout.current !== null) window.clearTimeout(feedbackTimeout.current);
		setFeedback({ key, kind, message });
		feedbackTimeout.current = window.setTimeout(() => {
			setFeedback((current) => current?.key === key ? null : current);
			feedbackTimeout.current = null;
		}, 3500);
	}

	async function copyText(key: string, audience: string, text: string) {
		try {
			await navigator.clipboard.writeText(text);
			announce(key, "success", `Copied message for ${audience} to clipboard.`);
			trackEvent("Share Action", { action: "copy", audience });
		} catch {
			announce(key, "error", `Couldn't copy the ${audience} message. Check clipboard permissions or select the text manually.`);
		}
	}

	async function nativeShare(audience: string, title: string, text: string, url: string) {
		if (!canNativeShare) return;
		try {
			await navigator.share({ title, text, url });
			announce(audience, "success", `Shared the ${audience} message.`);
			trackEvent("Share Action", { action: "native_share", audience });
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") return;
			announce(audience, "error", `Unable to share the ${audience} message. Try copying it instead.`);
		}
	}

	return (
		<div className="page distribution-page">
			<div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{feedback?.message ?? ""}</div>
			<section className="distribution-hero">
				<div>
					<span className="section-eyebrow">Share ContributorOps</span>
					<h1>Send the right proof to the right audience.</h1>
					<p>
						Growth should come from useful context, not copy-pasting the same promotion everywhere. Choose the audience,
						copy a tailored message, and link directly to the surface that answers their question fastest.
					</p>
					<div className="distribution-actions">
						<Link className="button-primary" to="/demo">Try browser demo</Link>
						<a className="button-secondary" href={REPO_URL} target="_blank" rel="noreferrer"><Github size={16} /> Open GitHub</a>
						<Link className="button-secondary" to="/adoption">View growth signals</Link>
						<a className="button-secondary" href="https://github.com/floating-ui/floating-ui/pull/3494" target="_blank" rel="noreferrer">Verified merged PR <ExternalLink size={14}/></a>
					</div>
				</div>
				<aside className="distribution-principle-card">
					<Share2 size={22} />
					<h2>One rule for distribution</h2>
					<p>Lead with a concrete problem or engineering decision. Ask for feedback, contribution, or evaluation—not coordinated stars or artificial engagement.</p>
					<div className="distribution-principle-list">
						<span><Check size={15} /> audience-specific link</span>
						<span><Check size={15} /> canonical campaign attribution</span>
						<span><Check size={15} /> one concrete ask</span>
					</div>
				</aside>
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Audience paths</span>
					<h2>Four useful ways to share the project.</h2>
					<p>Each card pairs a Phase 9 tagged destination with copy you can adapt rather than mass-post verbatim.</p>
				</div>
				<div className="distribution-grid">
					{SHARE_PATHS.map((path) => {
						const key = path.id;
						const url = campaignUrl(path.route, {
							source: "share-hub",
							medium: "referral",
							content: path.id,
						});
						const fullText = `${path.copy}\n\n${url}`;
						return (
							<article className="distribution-card" key={path.title}>
								<div className="distribution-card-icon">{path.icon}</div>
								<h3>{path.title}</h3>
								<p>{path.description}</p>
								<div className="distribution-copy-box">{path.copy}</div>
								<div className="distribution-card-actions">
									<button className="button-secondary" type="button" aria-label={`Copy message for ${path.title}`} onClick={() => copyText(key, path.id, fullText)}>
										{feedback?.key === key && feedback.kind === "success" ? <Check size={15} aria-hidden="true" /> : <Clipboard size={15} aria-hidden="true" />} {feedback?.key === key && feedback.kind === "success" ? "Copied" : "Copy message"}
									</button>
									{canNativeShare && (
										<button className="button-secondary" type="button" aria-label={`Share ContributorOps with ${path.title}`} onClick={() => nativeShare(path.id, "ContributorOps", path.copy, url)}>
											<Share2 size={15} /> Share
										</button>
									)}
									<a className="text-link" href={url} target="_blank" rel="noreferrer" onClick={() => trackEvent("Share Action", { action: "open_destination", audience: path.id })}>
										Open destination <ExternalLink size={14} />
									</a>
								</div>
								<p className={`share-feedback${feedback?.key === key && feedback.kind === "error" ? " is-error" : ""}`} aria-hidden="true">
									{feedback?.key === key ? feedback.message : "\u00a0"}
								</p>
							</article>
						);
					})}
				</div>
			</section>

			<section className="site-section">
				<div className="distribution-launch-panel">
					<div>
						<span className="section-eyebrow">Launch discipline</span>
						<h2>Do not treat every community as an announcement channel.</h2>
						<p>Use the Phase 9 growth operating system and distribution playbook to tailor the artifact, measure outcomes, and preserve community trust.</p>
					</div>
					<div className="distribution-launch-actions">
						<a className="button-primary" href={`${REPO_URL}/blob/main/docs/phase-9-growth-operating-system.md`} target="_blank" rel="noreferrer">Phase 9 growth system</a>
						<a className="button-secondary" href={`${REPO_URL}/blob/main/docs/phase-8-launch-execution.md`} target="_blank" rel="noreferrer">Launch packet</a>
						<a className="button-secondary" href={`${REPO_URL}/blob/main/docs/distribution-playbook.md`} target="_blank" rel="noreferrer">Distribution playbook</a>
					</div>
				</div>
			</section>
		</div>
	);
}
