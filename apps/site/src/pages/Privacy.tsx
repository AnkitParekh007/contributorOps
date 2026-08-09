import { LegalPage } from "../components/LegalPage";

export function Privacy() {
	return (
		<LegalPage
			eyebrow="Legal"
			title="Privacy Policy"
			description="How ContributorOps handles data during the current open-source preview."
			lastUpdated="August 2026"
		>
			<h2>Overview</h2>
			<p>
				ContributorOps is currently an <strong>open-source preview</strong>. This privacy policy describes how
				data is handled in the current state. It will be updated before production billing and hosted user accounts go live.
			</p>

			<h2>What We Collect</h2>
			<p>When you join the waitlist, the preview flow may collect:</p>
			<ul>
				<li>Name</li>
				<li>Email address</li>
				<li>GitHub username (optional)</li>
				<li>Target role</li>
				<li>Plan interest</li>
				<li>Problem description (optional)</li>
			</ul>
			<p>
				Current preview persistence is local-first rather than a production multi-user customer database.
				Do not submit secrets, access tokens, or sensitive personal information through public project surfaces.
			</p>

			<h2>GitHub Data</h2>
			<p>
				When you use ContributorOps in demo mode or with your own GitHub token, the product can access GitHub
				data such as issue titles, labels, pull-request metadata, and public profile information for contribution intelligence.
			</p>
			<p>
				The public Adoption page reads public ContributorOps repository metadata directly from GitHub's public API
				to display repository-level signals such as stars, forks, open work, and contributor history.
			</p>

			<h2>Analytics and Tracking</h2>
			<p>
				ContributorOps ships with site analytics <strong>disabled by default</strong>. If no analytics environment variable
				is configured at build time, the public site does not inject the optional analytics script.
			</p>
			<p>
				Maintainers may optionally configure a Plausible per-site script for aggregate page, referral, UTM, outbound-link,
				and selected conversion-event measurement. The ContributorOps integration is configured for hash-based routes and
				does not intentionally send names, usernames, email addresses, GitHub tokens, or other user identifiers as custom event properties.
			</p>
			<p>
				Theme preferences are stored in your browser's localStorage. The Share Hub can add standard UTM campaign parameters
				to copied links so aggregate launch sources can be distinguished when analytics is configured.
			</p>

			<h2>Repository Traffic</h2>
			<p>
				GitHub separately provides repository maintainers with repository traffic analytics through GitHub Insights.
				That data is governed by GitHub's platform and privacy terms rather than ContributorOps' optional site analytics integration.
			</p>

			<h2>Data Retention</h2>
			<p>
				Current preview data should be treated as development/MVP data. Production retention rules will be defined before
				hosted accounts, billing, or a production multi-user database are launched.
			</p>

			<h2>Your Rights</h2>
			<p>
				For a privacy or data-removal request related to ContributorOps preview data, open a repository issue without
				posting the sensitive value itself, and request a private contact path for the specific data involved.
			</p>

			<h2>Changes to This Policy</h2>
			<p>
				This policy will be updated when production billing, hosted user accounts, analytics configuration, or GitHub OAuth behavior changes materially.
			</p>

			<h2>Contact</h2>
			<p>
				For privacy questions, open an issue on{" "}
				<a href="https://github.com/AnkitParekh007/contributorOps" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
					GitHub
				</a>
				.
			</p>
		</LegalPage>
	);
}
