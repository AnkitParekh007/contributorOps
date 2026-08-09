import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Check, Clipboard, Code2, ExternalLink, Github, MessageCircle, Share2, ShieldCheck } from "lucide-react";

const REPO_URL = "https://github.com/AnkitParekh007/contributorOps";
const SITE_URL = "https://ankitparekh007.github.io/contributorOps/";

const SHARE_PATHS = [
	{
		icon: <Code2 size={20} />,
		title: "Developer / contributor",
		description: "Share the open-source workflow and invite feedback or a focused contribution.",
		url: `${SITE_URL}#/contribute`,
		copy: "ContributorOps is a human-approved OSS contribution intelligence project for finding higher-signal issues, preparing stronger PRs, and preserving proof of the engineering work. Contributions and architecture feedback are welcome.",
	},
	{
		icon: <BriefcaseBusiness size={20} />,
		title: "Recruiter / hiring manager",
		description: "Send the concise engineering brief rather than asking someone to reverse-engineer the repository.",
		url: `${SITE_URL}#/recruiter`,
		copy: "ContributorOps is a public engineering case study spanning React, TypeScript, Node/Express, Octokit, GitHub Actions, approval-gated automation, architecture decisions, and contributor experience. This two-minute brief links directly to the evidence.",
	},
	{
		icon: <ShieldCheck size={20} />,
		title: "Open-source maintainer",
		description: "Lead with the trust boundary and ask for critique of the contribution model.",
		url: `${SITE_URL}#/safety`,
		copy: "ContributorOps explores how contribution tooling can automate research and planning without turning into mass-comment or mass-PR automation. External writes remain explicitly human-approved. Maintainer feedback on that boundary is especially useful.",
	},
	{
		icon: <MessageCircle size={20} />,
		title: "Developer community",
		description: "Use a problem-first message and link to something people can inspect immediately.",
		url: `${SITE_URL}#/showcase`,
		copy: "I am looking for feedback on ContributorOps, an open-source workflow for choosing worthwhile OSS work, preparing it well, validating PR quality, keeping external writes human-approved, and turning finished contributions into explainable proof of work.",
	},
];

export function Share() {
	const [copied, setCopied] = useState<string | null>(null);
	const canNativeShare = useMemo(() => typeof navigator !== "undefined" && typeof navigator.share === "function", []);

	async function copyText(key: string, text: string) {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(key);
			window.setTimeout(() => setCopied(null), 1600);
		} catch {
			setCopied(null);
		}
	}

	async function nativeShare(title: string, text: string, url: string) {
		if (!canNativeShare) return;
		try {
			await navigator.share({ title, text, url });
		} catch {
			// User cancellation is expected and should not create an error state.
		}
	}

	return (
		<div className="page distribution-page">
			<section className="distribution-hero">
				<div>
					<span className="section-eyebrow">Share ContributorOps</span>
					<h1>Send the right evidence to the right audience.</h1>
					<p>
						Growth should come from useful context, not copy-pasting the same promotion everywhere. Choose the audience,
						copy a tailored message, and link directly to the surface that answers their question fastest.
					</p>
					<div className="distribution-actions">
						<a className="button-primary" href={REPO_URL} target="_blank" rel="noreferrer"><Github size={16} /> Open GitHub</a>
						<Link className="button-secondary" to="/contribute">Find a contribution</Link>
					</div>
				</div>
				<aside className="distribution-principle-card">
					<Share2 size={22} />
					<h2>One rule for distribution</h2>
					<p>Lead with a concrete problem or engineering decision. Ask for feedback, contribution, or evaluation—not coordinated stars or artificial engagement.</p>
					<div className="distribution-principle-list">
						<span><Check size={15} /> audience-specific link</span>
						<span><Check size={15} /> verifiable claims only</span>
						<span><Check size={15} /> one concrete ask</span>
					</div>
				</aside>
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Audience paths</span>
					<h2>Four useful ways to share the project.</h2>
					<p>Each card pairs a canonical destination with copy you can adapt rather than mass-post verbatim.</p>
				</div>
				<div className="distribution-grid">
					{SHARE_PATHS.map((path) => {
						const key = path.title;
						const fullText = `${path.copy}\n\n${path.url}`;
						return (
							<article className="distribution-card" key={path.title}>
								<div className="distribution-card-icon">{path.icon}</div>
								<h3>{path.title}</h3>
								<p>{path.description}</p>
								<div className="distribution-copy-box">{path.copy}</div>
								<div className="distribution-card-actions">
									<button className="button-secondary" type="button" onClick={() => copyText(key, fullText)}>
										{copied === key ? <Check size={15} /> : <Clipboard size={15} />} {copied === key ? "Copied" : "Copy message"}
									</button>
									{canNativeShare && (
										<button className="button-secondary" type="button" onClick={() => nativeShare("ContributorOps", path.copy, path.url)}>
											<Share2 size={15} /> Share
										</button>
									)}
									<a className="text-link" href={path.url} target="_blank" rel="noreferrer">Open destination <ExternalLink size={14} /></a>
								</div>
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
						<p>Use the repository share kit and distribution playbook to sequence launches, tailor the message, and preserve community trust.</p>
					</div>
					<div className="distribution-launch-actions">
						<a className="button-primary" href={`${REPO_URL}/blob/main/docs/distribution-playbook.md`} target="_blank" rel="noreferrer">Distribution playbook</a>
						<a className="button-secondary" href={`${REPO_URL}/blob/main/docs/share-kit.md`} target="_blank" rel="noreferrer">Share kit</a>
					</div>
				</div>
			</section>
		</div>
	);
}
