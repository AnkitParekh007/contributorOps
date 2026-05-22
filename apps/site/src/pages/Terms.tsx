import { Section } from "../components/Section";

export function Terms() {
	return (
		<div className="page">
			<Section eyebrow="Legal" title="Terms of Service" description="ContributorOps is currently in pre-launch.">
				<article className="docs-section-card">
					<h2>Terms of Service</h2>
					<p>
						ContributorOps is currently in pre-launch. Full terms of service will be published before the
						platform accepts payments.
					</p>
					<p>
						The product is open-source and self-hostable under its current license. You are free to run it
						on your own infrastructure.
					</p>
					<p>
						The product does not support, enable, or condone mass-commenting, mass-PR creation, or deceptive
						contribution automation. See the{" "}
						<a href="#/safety" style={{ color: "var(--accent)" }}>
							Safety Policy
						</a>{" "}
						for the full safety model.
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
