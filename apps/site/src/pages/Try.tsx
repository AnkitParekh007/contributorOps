import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Clipboard, Cloud, Code2, Github, Play, ShieldCheck, SquareTerminal } from "lucide-react";
import { trackEvent } from "../lib/analytics";

const REPO_URL = "https://github.com/AnkitParekh007/contributorOps";
const CODESPACES_URL = "https://codespaces.new/AnkitParekh007/contributorOps?quickstart=1";
const CLONE_COMMAND = "git clone https://github.com/AnkitParekh007/contributorOps.git && cd contributorOps && npm ci && npm run dev";

const NO_SECRET_CAPABILITIES = [
	"Run the React product UI and Express API locally",
	"Use mock issue discovery when no GitHub token is configured",
	"Inspect contribution planning, portfolio, proof-of-work, and safety UX",
	"Read/write local demo state without a hosted account",
	"Keep external GitHub write automation disabled by default",
];

export function Try() {
	const [copied, setCopied] = useState(false);

	async function copyCommand() {
		try {
			await navigator.clipboard.writeText(CLONE_COMMAND);
			setCopied(true);
			trackEvent("Try CTA", { action: "copy_quickstart" });
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			setCopied(false);
		}
	}

	return (
		<div className="page try-page">
			<section className="try-hero">
				<div>
					<span className="section-eyebrow">Try ContributorOps</span>
					<h1>Run the real project without creating an account.</h1>
					<p>
						The fastest evaluation path is demo mode. No GitHub token, hosted account, billing setup, or production database is required to inspect the local product workflow.
					</p>
					<div className="try-actions">
						<a className="button-primary" href={CODESPACES_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("Try CTA", { action: "open_codespaces" })}>
							<Cloud size={16} /> Open in Codespaces
						</a>
						<a className="button-secondary" href={REPO_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("Try CTA", { action: "open_repository" })}>
							<Github size={16} /> Review source first
						</a>
					</div>
			</div>
			<aside className="try-safety-card">
				<ShieldCheck size={23} />
				<h2>Safe demo defaults</h2>
				<p>No GitHub token means live authenticated GitHub write actions cannot run. The dev container also explicitly keeps auto-contribute and daily issue creation disabled.</p>
				<Link className="text-link" to="/safety">Review the safety model</Link>
			</aside>
			</section>

			<section className="site-section">
				<div className="section-heading">
					<span className="section-eyebrow">Local quick start</span>
					<h2>One command after Node.js 20+.</h2>
					<p>This installs the workspace and starts the API plus product UI.</p>
				</div>
				<div className="try-command-card">
					<div className="try-command-title"><SquareTerminal size={18} /> Local terminal</div>
					<code>{CLONE_COMMAND}</code>
					<button type="button" className="button-secondary" onClick={copyCommand}>
						{copied ? <Check size={15} /> : <Clipboard size={15} />} {copied ? "Copied" : "Copy command"}
					</button>
				</div>
			</section>

			<section className="site-section try-grid">
				<article className="try-card">
					<Play size={21} />
					<h3>What works without secrets</h3>
					<ul>
						{NO_SECRET_CAPABILITIES.map((item) => <li key={item}><Check size={15} /> {item}</li>)}
					</ul>
				</article>
				<article className="try-card">
					<Code2 size={21} />
					<h3>Local surfaces</h3>
					<div className="try-port-list">
						<span><strong>5173</strong> Product UI</span>
						<span><strong>8787</strong> Express API</span>
						<span><strong>4174</strong> Public site when running <code>npm run site:dev</code></span>
					</div>
				</article>
				<article className="try-card">
					<Github size={21} />
					<h3>When you want live GitHub discovery</h3>
					<p>Add your own GitHub token only after you have reviewed the environment and safety docs. External writes remain separately gated.</p>
					<a className="text-link" href={`${REPO_URL}/blob/main/docs/environment-setup.md`} target="_blank" rel="noreferrer">Environment setup</a>
				</article>
			</section>

			<section className="site-section">
				<div className="try-next-panel">
					<div>
						<span className="section-eyebrow">After you run it</span>
						<h2>Turn evaluation into useful feedback.</h2>
						<p>If the workflow is confusing or valuable, say exactly where. The feedback form is structured for developers, maintainers, recruiters, and engineering evaluators.</p>
					</div>
					<div className="try-actions">
						<a className="button-primary" href={`${REPO_URL}/issues/new?template=workflow_feedback.yml`} target="_blank" rel="noreferrer" onClick={() => trackEvent("Try CTA", { action: "open_feedback" })}>Give workflow feedback</a>
						<Link className="button-secondary" to="/contribute">Pick a contribution</Link>
						<Link className="button-secondary" to="/adoption">View adoption</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
