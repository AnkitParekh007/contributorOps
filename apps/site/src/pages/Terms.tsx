import { LegalPage } from "../components/LegalPage";

export function Terms() {
	return (
		<LegalPage
			eyebrow="Legal"
			title="Terms of Service"
			description="Terms for using ContributorOps during Founder Preview."
			lastUpdated="May 2026"
		>
			<h2>Acceptance</h2>
			<p>
				By using ContributorOps or joining the waitlist, you agree to these terms. ContributorOps is
				currently in <strong>Founder Preview</strong> — it is a preview product, not a production service.
			</p>

			<h2>Preview Product Disclaimer</h2>
			<p>
				ContributorOps is provided as-is during Founder Preview. There is no warranty of uptime,
				data durability, or feature availability. The product may change significantly before launch.
				Do not use ContributorOps as your sole system of record for contribution data.
			</p>

			<h2>Permitted Use</h2>
			<p>ContributorOps may be used to:</p>
			<ul>
				<li>Discover and plan genuine open-source contributions</li>
				<li>Build a personal portfolio of real OSS work</li>
				<li>Generate career assets (resume bullets, LinkedIn posts, interview stories) from your actual contributions</li>
				<li>Self-host the open-source codebase under its license</li>
			</ul>

			<h2>Prohibited Use</h2>
			<p>
				The following uses are explicitly prohibited and may result in account suspension:
			</p>
			<ul>
				<li>
					<strong>Mass commenting:</strong> Using ContributorOps to post bulk comments across repositories
				</li>
				<li>
					<strong>Mass PR creation:</strong> Automated bulk pull request submission
				</li>
				<li>
					<strong>Metric gaming:</strong> Creating fake activity to inflate contribution counts or gaming
					GitHub statistics
				</li>
				<li>
					<strong>Deceptive contributions:</strong> Submitting work that misrepresents the author's actual
					contribution or capability
				</li>
				<li>
					<strong>Spam:</strong> Using contribution drafts to promote products, services, or off-topic content
					to maintainers
				</li>
			</ul>
			<p>
				These prohibitions exist to protect open-source maintainers. See the{" "}
				<a href="#/safety" style={{ color: "var(--accent)" }}>
					Safety Policy
				</a>{" "}
				for the full safety model.
			</p>

			<h2>Intellectual Property</h2>
			<p>
				You own your contribution content. ContributorOps does not claim ownership of your portfolio
				entries, PR drafts, resume bullets, or any other content you create using the platform.
			</p>
			<p>
				The ContributorOps codebase is open-source under its stated license. The ContributorOps brand,
				name, and visual design are not licensed for third-party use without permission.
			</p>

			<h2>Limitation of Liability</h2>
			<p>
				ContributorOps is not liable for: rejected pull requests, maintainer responses, GitHub account
				actions, career outcomes, or any indirect damages arising from use of the platform.
			</p>

			<h2>Changes</h2>
			<p>
				These terms will be updated before billing goes live. Continued use after updates constitutes
				acceptance of the new terms.
			</p>

			<h2>Contact</h2>
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
		</LegalPage>
	);
}
