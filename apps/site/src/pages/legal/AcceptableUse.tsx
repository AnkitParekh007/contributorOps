import { LegalPage } from "../../components/LegalPage";

export function AcceptableUse() {
	return (
		<LegalPage
			eyebrow="Legal"
			title="Acceptable Use Policy"
			description="What ContributorOps is and is not designed for."
			lastUpdated="May 2026"
		>
			<h2>Purpose</h2>
			<p>
				ContributorOps is built to help developers make <em>genuine</em> open-source contributions and turn
				that real work into career proof. This policy defines the boundary between legitimate use and
				abuse that undermines maintainer trust and the open-source ecosystem.
			</p>

			<h2>Permitted Uses</h2>
			<ul>
				<li>Discovering issues relevant to your skill set and target role</li>
				<li>Generating contribution plans for issues you genuinely intend to work on</li>
				<li>Drafting pull request copy for real code changes you have written</li>
				<li>Checking PR quality before submission</li>
				<li>Building a portfolio of contributions you have actually made</li>
				<li>Generating career assets (resume bullets, interview stories) from your real contributions</li>
				<li>Self-hosting the platform for personal or team use under the open-source license</li>
			</ul>

			<h2>Prohibited Uses</h2>
			<p>The following are prohibited regardless of technical capability:</p>

			<h3>Mass Automation</h3>
			<ul>
				<li>Bulk commenting across repositories</li>
				<li>Automated pull request creation without human review</li>
				<li>Bypassing the approval gate to execute external writes</li>
			</ul>

			<h3>Deception</h3>
			<ul>
				<li>Submitting AI-generated content as entirely your own work without disclosure</li>
				<li>Gaming contribution metrics or GitHub activity graphs</li>
				<li>Creating fake issues, stars, or forks to inflate social proof</li>
				<li>Misrepresenting the scope or authorship of a contribution</li>
			</ul>

			<h3>Spam</h3>
			<ul>
				<li>Using PR or issue comments to promote products or services</li>
				<li>Submitting off-topic contributions to drive traffic or attention</li>
				<li>Targeting maintainers with unsolicited outreach</li>
			</ul>

			<h3>Circumventing Safety Controls</h3>
			<ul>
				<li>Modifying the API to remove approval gates</li>
				<li>Using the platform to enable behaviors explicitly listed as prohibited</li>
				<li>Sharing API access tokens to enable third-party automated writes</li>
			</ul>

			<h2>Enforcement</h2>
			<p>
				Violations of this policy may result in account suspension and removal from the waitlist. Serious
				violations that harm open-source maintainers will be reported to GitHub.
			</p>

			<h2>Questions</h2>
			<p>
				If you are unsure whether a use case is permitted, open a{" "}
				<a
					href="https://github.com/AnkitParekh007/contributorOps/discussions"
					target="_blank"
					rel="noreferrer"
					style={{ color: "var(--accent)" }}
				>
					GitHub Discussion
				</a>{" "}
				before proceeding.
			</p>
		</LegalPage>
	);
}
