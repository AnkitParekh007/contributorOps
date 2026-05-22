import { LegalPage } from "../../components/LegalPage";

export function GitHubDataUsage() {
	return (
		<LegalPage
			eyebrow="Legal"
			title="GitHub Data Usage"
			description="What GitHub data ContributorOps accesses and how it is used."
			lastUpdated="May 2026"
		>
			<h2>What GitHub Data Is Accessed</h2>
			<p>ContributorOps accesses the following GitHub data via the GitHub REST API:</p>
			<ul>
				<li>
					<strong>Public issues:</strong> Title, body, labels, assignees, comment count, and creation date
					from public repositories
				</li>
				<li>
					<strong>Repository metadata:</strong> Name, description, topics, language, star count, and open
					issue count
				</li>
				<li>
					<strong>Public user profile:</strong> GitHub username, display name, avatar URL, and public
					contribution history (when GitHub account is connected)
				</li>
				<li>
					<strong>Pull request metadata:</strong> Title, status, merge status, and labels (for portfolio
					tracking)
				</li>
			</ul>

			<h2>What Is NOT Accessed</h2>
			<ul>
				<li>Private repositories (unless explicitly granted via OAuth)</li>
				<li>Private issues or internal repository data</li>
				<li>GitHub organization private data</li>
				<li>Email addresses from GitHub profiles</li>
				<li>OAuth tokens belonging to other users</li>
			</ul>

			<h2>How GitHub Data Is Used</h2>
			<p>GitHub data is used exclusively for:</p>
			<ul>
				<li>Scoring issue relevance to your target role</li>
				<li>Generating contribution plans</li>
				<li>Populating your portfolio with completed contributions</li>
				<li>Building your public proof-of-work profile</li>
			</ul>
			<p>
				GitHub data is <strong>not</strong> used for advertising, sold to third parties, or shared beyond
				what is necessary to provide the ContributorOps service.
			</p>

			<h2>Rate Limit Compliance</h2>
			<p>
				ContributorOps uses authenticated GitHub API requests and respects all GitHub rate limits. It does
				not scrape GitHub pages or use undocumented endpoints.
			</p>

			<h2>GitHub's Terms of Service</h2>
			<p>
				ContributorOps operates in compliance with{" "}
				<a
					href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service"
					target="_blank"
					rel="noreferrer"
					style={{ color: "var(--accent)" }}
				>
					GitHub's Terms of Service
				</a>{" "}
				and{" "}
				<a
					href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
					target="_blank"
					rel="noreferrer"
					style={{ color: "var(--accent)" }}
				>
					GitHub's Privacy Statement
				</a>
				.
			</p>

			<h2>Data Storage</h2>
			<p>
				In the current preview phase, GitHub data is held in memory during your session and stored in local
				JSON files. It is not persisted to a remote database. When Supabase integration ships (Phase 3),
				this policy will be updated with database retention details.
			</p>

			<h2>Questions</h2>
			<p>
				For questions about GitHub data usage, open an issue on{" "}
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
