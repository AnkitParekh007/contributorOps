import { useEffect, useState } from "react";
import { Section } from "../components/Section";

const TARGET_ROLES = [
	"Backend Engineer",
	"API Developer",
	"Fullstack Engineer",
	"Frontend Engineer",
	"Platform / DevOps Engineer",
	"Developer Advocate",
	"Open Source Maintainer",
	"Angular Developer",
	"ML / AI Engineer",
	"Other",
];

const PLAN_OPTIONS = [
	"Free",
	"Pro",
	"Career",
	"Team",
	"Founder Lifetime (one-time)",
];

const STORAGE_KEY = "contributorops_waitlist_entry";

interface WaitlistEntry {
	name: string;
	email: string;
	githubUsername: string;
	targetRole: string;
	planInterest: string;
	problemStatement: string;
	submittedAt: string;
}

export function Waitlist() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [githubUsername, setGithubUsername] = useState("");
	const [targetRole, setTargetRole] = useState("");
	const [planInterest, setPlanInterest] = useState("");
	const [problemStatement, setProblemStatement] = useState("");
	const [submitted, setSubmitted] = useState<WaitlistEntry | null>(null);
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				setSubmitted(JSON.parse(stored) as WaitlistEntry);
			}
		} catch {
			// ignore parse errors
		}
	}, []);

	const validate = (): string[] => {
		const errs: string[] = [];
		if (!name.trim()) errs.push("Name is required.");
		if (!email.trim()) errs.push("Email is required.");
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.push("Enter a valid email address.");
		if (!targetRole) errs.push("Please select a target role.");
		return errs;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const errs = validate();
		if (errs.length > 0) {
			setErrors(errs);
			return;
		}
		const entry: WaitlistEntry = {
			name: name.trim(),
			email: email.trim(),
			githubUsername: githubUsername.trim(),
			targetRole,
			planInterest: planInterest || "Free",
			problemStatement: problemStatement.trim(),
			submittedAt: new Date().toISOString(),
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
		setSubmitted(entry);
		setErrors([]);

		// Fire-and-forget API submit — success state shows regardless
		const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
		if (API_BASE) {
			fetch(`${API_BASE}/api/waitlist`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: entry.name,
					email: entry.email,
					targetRole: entry.targetRole,
					planInterest: entry.planInterest,
				}),
			}).catch(() => {
				// silent — localStorage success state is shown regardless
			});
		}
	};

	return (
		<div className="page">
			<Section
				eyebrow="Founder Waitlist"
				title="Join the ContributorOps founder waitlist."
				description="Be first when beta opens. Lock in founder pricing. No payment required to join."
			>
				<p className="waitlist-note">
					ⓘ Payments and accounts are not live yet. We'll email you when we launch. No credit card required.
					No spam.
				</p>

				{submitted ? (
					<div className="waitlist-success">
						<div style={{ fontSize: "2.4rem" }}>✓</div>
						<h3 style={{ margin: 0 }}>You're on the list, {submitted.name}!</h3>
						<p style={{ margin: 0 }}>
							We've saved your spot for <strong>{submitted.planInterest}</strong>. We'll reach out when
							ContributorOps launches.
						</p>
						<p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
							Target role: {submitted.targetRole} · Joined{" "}
							{new Date(submitted.submittedAt).toLocaleDateString()}
						</p>
					</div>
				) : (
					<form className="waitlist-form" onSubmit={handleSubmit} noValidate>
						{errors.length > 0 && (
							<div className="waitlist-errors" role="alert">
								{errors.map((err) => (
									<p
										key={err}
										style={{ margin: "0 0 4px", color: "var(--danger)", fontSize: "0.85rem" }}
									>
										• {err}
									</p>
								))}
							</div>
						)}

						<div className="form-field">
							<label htmlFor="wl-name">Name</label>
							<input
								id="wl-name"
								type="text"
								className="form-input"
								placeholder="Your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								autoComplete="name"
							/>
						</div>

						<div className="form-field">
							<label htmlFor="wl-email">Email</label>
							<input
								id="wl-email"
								type="email"
								className="form-input"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								autoComplete="email"
							/>
						</div>

						<div className="form-field">
							<label htmlFor="wl-role">Target Role</label>
							<select
								id="wl-role"
								className="form-select"
								value={targetRole}
								onChange={(e) => setTargetRole(e.target.value)}
								required
							>
								<option value="">Select your target role…</option>
								{TARGET_ROLES.map((role) => (
									<option key={role} value={role}>
										{role}
									</option>
								))}
							</select>
						</div>

						<div className="form-field">
							<label htmlFor="wl-plan">Plan Interest</label>
							<select
								id="wl-plan"
								className="form-select"
								value={planInterest}
								onChange={(e) => setPlanInterest(e.target.value)}
							>
								<option value="">Select a plan…</option>
								{PLAN_OPTIONS.map((plan) => (
									<option key={plan} value={plan}>
										{plan}
									</option>
								))}
							</select>
						</div>

						<div className="form-field">
							<label htmlFor="wl-github">GitHub Username <span className="form-optional">(optional)</span></label>
							<input
								id="wl-github"
								type="text"
								className="form-input"
								placeholder="your-github-username"
								value={githubUsername}
								onChange={(e) => setGithubUsername(e.target.value)}
								autoComplete="username"
							/>
						</div>

						<div className="form-field">
							<label htmlFor="wl-problem">What's the biggest challenge in your OSS contribution workflow? <span className="form-optional">(optional)</span></label>
							<textarea
								id="wl-problem"
								className="form-input form-textarea"
								placeholder="e.g. I struggle to find relevant issues, or my PRs don't get reviewed..."
								value={problemStatement}
								onChange={(e) => setProblemStatement(e.target.value)}
								rows={3}
								maxLength={400}
							/>
						</div>

						<p className="form-consent">
							By joining, you agree to our{" "}
							<a href="#/privacy" style={{ color: "var(--accent)" }}>Privacy Policy</a>{" "}
							and{" "}
							<a href="#/terms" style={{ color: "var(--accent)" }}>Terms of Service</a>.
							We'll only email you when beta launches. No spam.
						</p>

						<button
							type="submit"
							className="button-primary"
							style={{ width: "100%", justifyContent: "center" }}
						>
							Join Founder Waitlist
						</button>
					</form>
				)}
			</Section>
		</div>
	);
}
