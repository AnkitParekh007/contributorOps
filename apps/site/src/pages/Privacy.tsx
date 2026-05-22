import { LegalPage } from "../components/LegalPage";

export function Privacy() {
	return (
		<LegalPage
			eyebrow="Legal"
			title="Privacy Policy"
			description="How ContributorOps handles your data during Founder Preview."
			lastUpdated="May 2026"
		>
			<h2>Overview</h2>
			<p>
				ContributorOps is currently in <strong>Founder Preview</strong>. This privacy policy describes how
				data is handled in the current state. It will be updated before billing and user accounts go live.
			</p>

			<h2>What We Collect</h2>
			<p>When you join the waitlist, we collect:</p>
			<ul>
				<li>Name</li>
				<li>Email address</li>
				<li>GitHub username (optional)</li>
				<li>Target role</li>
				<li>Plan interest</li>
				<li>Problem description (optional)</li>
			</ul>
			<p>
				This data is stored in a local JSON file on the server that processes your submission. It is not
				shared with third parties.
			</p>

			<h2>GitHub Data</h2>
			<p>
				When you use ContributorOps in demo mode or with your own GitHub token, the product accesses public
				GitHub data — issue titles, labels, PR metadata, and public profile information. This data is used
				only for contribution intelligence and is not stored beyond your session.
			</p>
			<p>
				ContributorOps does not access private repositories. It does not store GitHub credentials in any
				external database in the current preview phase.
			</p>

			<h2>Analytics and Tracking</h2>
			<p>
				The public site does not currently use analytics cookies or third-party tracking. Theme preferences
				are stored in your browser's localStorage only.
			</p>

			<h2>Data Retention</h2>
			<p>
				Waitlist data is retained until you request deletion or until beta launch, at which point you will be
				given the option to migrate to a real account or have your data deleted.
			</p>

			<h2>Your Rights</h2>
			<p>
				You can request deletion of your waitlist entry at any time by opening a{" "}
				<a
					href="https://github.com/AnkitParekh007/contributorOps/issues"
					target="_blank"
					rel="noreferrer"
					style={{ color: "var(--accent)" }}
				>
					GitHub Issue
				</a>{" "}
				with your email address.
			</p>

			<h2>Changes to This Policy</h2>
			<p>
				This policy will be updated when billing, user accounts, and GitHub OAuth are implemented. Material
				changes will be announced via the waitlist email.
			</p>

			<h2>Contact</h2>
			<p>
				For privacy questions, open an issue on{" "}
				<a
					href="https://github.com/AnkitParekh007/contributorOps"
					target="_blank"
					rel="noreferrer"
					style={{ color: "var(--accent)" }}
				>
					GitHub
				</a>
				.
			</p>
		</LegalPage>
	);
}
