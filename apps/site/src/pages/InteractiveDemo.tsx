import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	ClipboardCheck,
	Code2,
	ExternalLink,
	Github,
	RefreshCw,
	Rocket,
	Search,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { trackEvent } from "../lib/analytics";

const REPO_URL = "https://github.com/AnkitParekh007/contributorOps";
const CODESPACES_URL = "https://codespaces.new/AnkitParekh007/contributorOps?quickstart=1";

type RoleKey = "frontend-ai" | "platform" | "backend";
type DemoStepKey = "discover" | "prepare" | "validate" | "authorize" | "prove";

interface DemoScenario {
	label: string;
	role: string;
	repo: string;
	issue: string;
	score: number;
	why: string;
	files: string[];
	tests: string[];
	resume: string;
}

const SCENARIOS: Record<RoleKey, DemoScenario> = {
	"frontend-ai": {
		label: "Frontend + AI",
		role: "Frontend / AI Architect",
		repo: "sample-org/agent-console",
		issue: "Make streamed agent responses resilient to cancelled navigation",
		score: 94,
		why: "High role fit, visible UX impact, bounded frontend surface, and a deterministic regression path.",
		files: ["src/chat/useAgentStream.ts", "src/chat/useAgentStream.test.ts"],
		tests: ["Cancel navigation during an active stream", "Verify stale chunks are ignored", "Verify the next session streams normally"],
		resume: "Hardened an AI chat streaming boundary against stale async updates, adding deterministic regression coverage and preserving session isolation.",
	},
	platform: {
		label: "Platform",
		role: "Platform Engineer",
		repo: "sample-org/dev-platform",
		issue: "Reject ambiguous workspace paths before artifact publishing",
		score: 91,
		why: "Small trust-boundary fix with strong platform signal, clear negative tests, and low maintainer review cost.",
		files: ["src/workspaces/path-policy.ts", "src/workspaces/path-policy.test.ts"],
		tests: ["Reject parent-directory traversal", "Accept canonical relative paths", "Preserve existing artifact publishing flow"],
		resume: "Added a fail-closed workspace path policy that blocks ambiguous artifact targets and protects CI publishing boundaries with focused tests.",
	},
	backend: {
		label: "Backend",
		role: "Backend Engineer",
		repo: "sample-org/api-runtime",
		issue: "Prevent duplicate retry jobs after idempotent completion",
		score: 89,
		why: "Concrete reliability problem, narrow data-flow change, and an easy-to-explain correctness invariant.",
		files: ["src/jobs/retry.ts", "src/jobs/retry.test.ts"],
		tests: ["Replay a completed job", "Verify no second retry is queued", "Verify failed jobs still retry"],
		resume: "Eliminated duplicate retry scheduling by enforcing idempotent completion checks and adding regression coverage for replayed job events.",
	},
};

const STEPS: Array<{ key: DemoStepKey; label: string; icon: typeof Search }> = [
	{ key: "discover", label: "Discover", icon: Search },
	{ key: "prepare", label: "Prepare", icon: Code2 },
	{ key: "validate", label: "Validate", icon: ClipboardCheck },
	{ key: "authorize", label: "Authorize", icon: ShieldCheck },
	{ key: "prove", label: "Prove", icon: Sparkles },
];

export function InteractiveDemo() {
	const [role, setRole] = useState<RoleKey>("frontend-ai");
	const [stepIndex, setStepIndex] = useState(0);
	const scenario = SCENARIOS[role];
	const active = STEPS[stepIndex];
	const progress = ((stepIndex + 1) / STEPS.length) * 100;

	const qualityChecks = useMemo(
		() => [
			["Issue still specific", true, "One observable failure mode, not a broad rewrite."],
			["Diff remains focused", true, `${scenario.files.length} planned files.`],
			["Regression path exists", true, `${scenario.tests.length} deterministic checks.`],
			["Maintainer-facing write", false, "Not executed in this browser demo."],
		] as const,
		[scenario],
	);

	function selectRole(nextRole: RoleKey) {
		setRole(nextRole);
		setStepIndex(0);
		trackEvent("Interactive Demo", { action: "select_role", role: nextRole });
	}

	function goTo(index: number) {
		setStepIndex(index);
		trackEvent("Interactive Demo", { action: "step", step: STEPS[index].key });
	}

	function renderStep() {
		switch (active.key) {
			case "discover":
				return (
					<div className="demo-stage-grid">
						<article className="demo-work-card demo-work-card-accent">
							<span className="demo-card-kicker">Candidate score</span>
							<strong className="demo-score">{scenario.score}</strong>
							<span>/100 role fit</span>
						</article>
						<article className="demo-work-card demo-work-card-wide">
							<span className="demo-card-kicker">Example opportunity</span>
							<h3>{scenario.issue}</h3>
							<p><strong>{scenario.repo}</strong> · {scenario.role}</p>
							<p>{scenario.why}</p>
						</article>
					</div>
				);
			case "prepare":
				return (
					<div className="demo-stage-grid">
						<article className="demo-work-card">
							<span className="demo-card-kicker">Planned files</span>
							<ul className="demo-list">{scenario.files.map((file) => <li key={file}><Code2 size={15} /> <code>{file}</code></li>)}</ul>
						</article>
						<article className="demo-work-card demo-work-card-wide">
							<span className="demo-card-kicker">Test strategy</span>
							<ol className="demo-numbered-list">{scenario.tests.map((test, index) => <li key={test}><span>{index + 1}</span>{test}</li>)}</ol>
						</article>
					</div>
				);
			case "validate":
				return (
					<div className="demo-check-grid">
						{qualityChecks.map(([label, passed, detail]) => (
							<article className="demo-check-card" key={label}>
								<span className={passed ? "demo-check-icon pass" : "demo-check-icon hold"}>{passed ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}</span>
								<div><strong>{label}</strong><p>{detail}</p></div>
							</article>
						))}
					</div>
				);
			case "authorize":
				return (
					<div className="demo-auth-grid">
						<article className="demo-auth-card">
							<span className="demo-card-kicker">Interactive path</span>
							<h3>Per-action human approval</h3>
							<p>A prepared run issues separate capabilities for comment, branch, and draft-PR actions. One capability cannot authorize another action.</p>
							<span className="demo-auth-pill">prepare → inspect → approve → execute</span>
						</article>
						<article className="demo-auth-card">
							<span className="demo-card-kicker">Standing path</span>
							<h3>Exact-patch authorization</h3>
							<p>Unattended execution is limited to a repository-owned exact patch plan, bounded scope, live policy checks, duplicate protection, daily limits, and single-match replacements.</p>
							<span className="demo-auth-pill">exact plan → validate → draft PR</span>
						</article>
					</div>
				);
			case "prove":
				return (
					<div className="demo-proof-grid">
						<article className="demo-work-card demo-work-card-wide">
							<span className="demo-card-kicker">Recruiter-readable output</span>
							<h3>Resume bullet</h3>
							<p className="demo-proof-copy">{scenario.resume}</p>
						</article>
						<article className="demo-work-card">
							<span className="demo-card-kicker">Evidence bundle</span>
							<ul className="demo-list">
								<li><CheckCircle2 size={15} /> Issue context</li>
								<li><CheckCircle2 size={15} /> Focused change plan</li>
								<li><CheckCircle2 size={15} /> Test evidence</li>
								<li><CheckCircle2 size={15} /> PR-quality narrative</li>
							</ul>
						</article>
					</div>
				);
		}
	}

	return (
		<div className="page interactive-demo-page">
			<section className="demo-hero">
				<div>
					<span className="section-eyebrow">Phase 8 · browser demo</span>
					<h1>Try the contribution loop before cloning anything.</h1>
					<p>
						This is a deterministic, browser-only walkthrough of the ContributorOps product model. It uses clearly labeled example data, requires no account or token, and never performs a GitHub write.
					</p>
					<div className="demo-hero-actions">
						<a className="button-primary" href={CODESPACES_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("Interactive Demo", { action: "open_codespaces" })}>
							<Rocket size={16} /> Run the real app
						</a>
						<a className="button-secondary" href={REPO_URL} target="_blank" rel="noreferrer"><Github size={16} /> Inspect source</a>
					</div>
			</div>
			<aside className="demo-disclosure-card">
				<ShieldCheck size={22} />
				<strong>Example, not live GitHub data</strong>
				<p>The scenarios below are intentionally fictional so a launch demo cannot misrepresent stale issues, maintainers, or contribution status.</p>
			</aside>
			</section>

			<section className="site-section demo-shell" aria-live="polite">
				<div className="demo-role-row" aria-label="Demo role">
					{(Object.keys(SCENARIOS) as RoleKey[]).map((key) => (
						<button key={key} type="button" className={`demo-role-button${role === key ? " active" : ""}`} onClick={() => selectRole(key)}>
							{SCENARIOS[key].label}
						</button>
					))}
				</div>

				<div className="demo-progress" aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`}>
					<div className="demo-progress-bar" style={{ width: `${progress}%` }} />
				</div>

				<div className="demo-step-nav" role="tablist" aria-label="Contribution workflow">
					{STEPS.map((step, index) => {
						const Icon = step.icon;
						return (
							<button key={step.key} type="button" role="tab" aria-selected={index === stepIndex} className={`demo-step-button${index === stepIndex ? " active" : ""}`} onClick={() => goTo(index)}>
								<Icon size={16} /><span>{index + 1}. {step.label}</span>
							</button>
						);
					})}
				</div>

				<div className="demo-stage">
					<div className="demo-stage-heading">
						<div><span className="demo-card-kicker">{active.label}</span><h2>{scenario.role}</h2></div>
						<span className="demo-example-pill">example snapshot</span>
					</div>
					{renderStep()}
				</div>

				<div className="demo-controls">
					<button type="button" className="button-secondary" disabled={stepIndex === 0} onClick={() => goTo(stepIndex - 1)}><ArrowLeft size={15} /> Back</button>
					<button type="button" className="button-secondary" onClick={() => { setStepIndex(0); trackEvent("Interactive Demo", { action: "restart" }); }}><RefreshCw size={15} /> Restart</button>
					{stepIndex < STEPS.length - 1 ? (
						<button type="button" className="button-primary" onClick={() => goTo(stepIndex + 1)}>Next: {STEPS[stepIndex + 1].label} <ArrowRight size={15} /></button>
					) : (
						<Link className="button-primary" to="/launch">Open launch hub <ArrowRight size={15} /></Link>
					)}
				</div>
			</section>

			<section className="site-section demo-next-panel">
				<div>
					<span className="section-eyebrow">Go deeper</span>
					<h2>The browser demo is the map; the repository is the evidence.</h2>
					<p>Run the actual workspace in Codespaces, inspect the architecture and CI, or review the safety model before enabling authenticated GitHub behavior.</p>
				</div>
				<div className="demo-hero-actions">
					<Link className="button-secondary" to="/showcase">Engineering showcase</Link>
					<Link className="button-secondary" to="/safety">Safety model</Link>
					<a className="text-link" href={`${REPO_URL}/actions`} target="_blank" rel="noreferrer">CI evidence <ExternalLink size={14} /></a>
				</div>
			</section>
		</div>
	);
}
