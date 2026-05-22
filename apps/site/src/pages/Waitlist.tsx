import { useEffect, useState } from "react";
import { Section } from "../components/Section";

const TARGET_ROLES = [
	"API Developer",
	"Backend Engineer",
	"Angular Developer",
	"Platform Engineer",
	"Developer Advocate",
	"Open Source Engineer",
];

const PLAN_OPTIONS = [
	"Free",
	"Pro ($19/mo)",
	"Career ($49/mo)",
	"Team ($199/mo)",
	"Founder/Lifetime Deal ($99 one-time)",
];

const STORAGE_KEY = "contributorops_waitlist_entry";

interface WaitlistEntry {
	name: string;
	email: string;
	targetRole: string;
	planInterest: string;
	submittedAt: string;
}

export function Waitlist() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [targetRole, setTargetRole] = useState("");
	const [planInterest, setPlanInterest] = useState("");
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
			targetRole,
			planInterest: planInterest || "Free",
			submittedAt: new Date().toISOString(),
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
		setSubmitted(entry);
		setErrors([]);
	};

	return (
		<div className="page">
			<Section
				eyebrow="Early Access"
				title="Join the ContributorOps waitlist."
				description="Payments and accounts are not live yet. Join now to be notified at launch and lock in early pricing."
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

						<button
							type="submit"
							className="button-primary"
							style={{ width: "100%", justifyContent: "center" }}
						>
							Join Waitlist
						</button>
					</form>
				)}
			</Section>
		</div>
	);
}
