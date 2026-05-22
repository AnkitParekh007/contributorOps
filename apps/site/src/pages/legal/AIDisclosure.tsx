import { LegalPage } from "../../components/LegalPage";

export function AIDisclosure() {
	return (
		<LegalPage
			eyebrow="Legal"
			title="AI Usage Disclosure"
			description="How ContributorOps uses AI and what it means for you."
			lastUpdated="May 2026"
		>
			<h2>How ContributorOps Uses AI</h2>
			<p>
				ContributorOps uses large language model (LLM) APIs to assist with the following tasks:
			</p>
			<ul>
				<li>
					<strong>Issue scoring:</strong> Evaluating how well a GitHub issue matches your target role and
					skill set
				</li>
				<li>
					<strong>Contribution planning:</strong> Generating structured plans including likely files to
					change, approach suggestions, and test strategies
				</li>
				<li>
					<strong>PR copy drafting:</strong> Drafting pull request titles, descriptions, and maintainer
					messages
				</li>
				<li>
					<strong>Career asset generation:</strong> Generating resume bullets, LinkedIn post drafts, and
					interview STAR stories from completed contributions
				</li>
				<li>
					<strong>PR quality checking:</strong> Evaluating draft PR content against maintainer-readiness
					criteria
				</li>
			</ul>

			<h2>What AI Does NOT Do</h2>
			<p>
				These constraints are enforced in code, not just policy:
			</p>
			<ul>
				<li>
					<strong>AI does not submit anything externally.</strong> Every external GitHub action (comment,
					branch, draft PR) requires explicit human approval via the Approval Center.
				</li>
				<li>
					<strong>AI does not write code for you to submit as your own.</strong> Contribution plans suggest
					an approach — you write the actual implementation.
				</li>
				<li>
					<strong>AI does not operate on a schedule.</strong> Scheduled jobs run discovery and planning only.
					No AI-triggered external writes are scheduled.
				</li>
			</ul>

			<h2>AI Output Should Be Treated as a Draft</h2>
			<p>
				All AI-generated content — plans, PR copy, resume bullets, STAR stories — is a starting point. You
				should review, edit, and take responsibility for anything submitted or published under your name.
				ContributorOps is designed to accelerate your workflow, not to replace your judgment.
			</p>

			<h2>Data Sent to AI APIs</h2>
			<p>
				When generating plans or scoring issues, ContributorOps may send the following to the AI API:
			</p>
			<ul>
				<li>Public GitHub issue title, body, and labels</li>
				<li>Repository description and topics</li>
				<li>Your stated target role and contribution constraints</li>
				<li>PR draft content you are checking</li>
			</ul>
			<p>
				ContributorOps does not send private repository content, credentials, or personal identifiable
				information beyond what is necessary for the task.
			</p>

			<h2>Model Providers</h2>
			<p>
				ContributorOps uses AI APIs from third-party providers. The current provider and applicable data
				processing terms will be listed here when the product enters public beta.
			</p>

			<h2>Questions</h2>
			<p>
				For questions about AI usage, open a{" "}
				<a
					href="https://github.com/AnkitParekh007/contributorOps/discussions"
					target="_blank"
					rel="noreferrer"
					style={{ color: "var(--accent)" }}
				>
					GitHub Discussion
				</a>
				.
			</p>
		</LegalPage>
	);
}
