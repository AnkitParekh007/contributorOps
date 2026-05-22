import { Section } from "../components/Section";

export function Privacy() {
	return (
		<div className="page">
			<Section eyebrow="Legal" title="Privacy Policy" description="ContributorOps is currently in pre-launch.">
				<article className="docs-section-card">
					<h2>Privacy Policy</h2>
					<p>
						ContributorOps is currently in pre-launch. A full privacy policy will be published before
						payments and accounts go live.
					</p>
					<p>
						At present, the product is self-hosted and open-source. No personal data is collected by any
						hosted service — all data stays on your machine in the <code>/data</code> directory.
					</p>
					<p>
						The waitlist collects name, email, target role, and plan interest. This data is stored locally
						in <code>data/waitlist.json</code> on your own deployment.
					</p>
					<p>
						For questions, open an issue on{" "}
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
					<p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Last updated: May 2026</p>
				</article>
			</Section>
		</div>
	);
}
