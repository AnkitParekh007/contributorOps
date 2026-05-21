import type {
  DailyPlan,
  DailyPlanOpportunity,
  IssueCandidate,
  JobModeDrafts,
  RawIssueCandidate
} from "./types.js";
import { scoreIssue } from "./scorer.js";

function summarizeBody(body: string): string {
  const normalized = body.replace(/\s+/g, " ").trim();
  return normalized.length > 260 ? `${normalized.slice(0, 257)}...` : normalized;
}

function inferLikelyFiles(candidate: RawIssueCandidate): string[] {
  const files = new Set<string>();

  if (candidate.labels.some((label) => /docs|documentation/i.test(label))) {
    files.add("README.md");
    files.add("docs/");
  }

  if (candidate.labels.some((label) => /\bbug\b/i.test(label))) {
    files.add("src/");
    files.add("tests/");
  }

  if (candidate.repoTopics.some((topic) => /sdk|api|graphql|rest-api|openapi/i.test(topic))) {
    files.add("src/");
    files.add("api/");
    files.add("schema/");
  }

  if (files.size === 0) {
    files.add("src/");
    files.add("tests/");
    files.add("CONTRIBUTING.md");
  }

  return [...files];
}

function buildContributionPlan(candidate: RawIssueCandidate): string[] {
  return [
    `Read the repo README, CONTRIBUTING guide, and the full context for issue #${candidate.issueNumber}.`,
    "Reproduce or clarify the current behavior locally before changing code.",
    "Trace the smallest code path that touches the reported area and identify one minimal fix.",
    "Update tests or add a focused regression check for the changed behavior.",
    "Prepare a concise draft PR that explains the bug, fix, and validation."
  ];
}

function buildTestingStrategy(candidate: RawIssueCandidate): string[] {
  const plans = [
    "Run the repo's documented test suite for the touched package or module.",
    "Add or update one narrow regression test for the issue.",
    "Validate linting and type checks for the edited area."
  ];

  if (candidate.labels.some((label) => /docs|documentation/i.test(label))) {
    plans.unshift("Preview documentation locally and validate all edited links or examples.");
  }

  return plans;
}

function buildJobMode(candidate: RawIssueCandidate, firstAction: string): JobModeDrafts {
  return {
    resumeBullet: `Targeted ${candidate.repoFullName} issue #${candidate.issueNumber}, scoped a minimal contribution path, and translated backend or developer-tooling context into a test-backed open-source plan.`,
    linkedInPost: `Today I used ContributorOps to break down ${candidate.repoFullName} issue #${candidate.issueNumber}. The value was not "finding any issue" but identifying one tractable backend or developer-tooling problem, mapping the likely files, and writing the smallest test-backed contribution plan before coding.`,
    interviewStarStory: `Situation: I wanted stronger OSS signal in API and backend tooling. Task: Find a realistic issue with maintainable scope. Action: I evaluated ${candidate.repoFullName} issue #${candidate.issueNumber}, wrote a deterministic plan, identified likely files, and defined a test strategy before touching code. Result: I created a contribution path I could execute with less thrash and a clearer story for interviews.`,
    recruiterOutreach: `Hi, I've been building ContributorOps to help me make higher-signal open-source contributions in API and developer-tooling repos. One recent example is ${candidate.repoFullName} issue #${candidate.issueNumber}, where I mapped the fix path, test strategy, and PR narrative before implementation. I'd value the chance to bring that same structured execution to a backend or platform role.`,
    githubProfileSnippet: `- Planned a contribution for [${candidate.repoFullName}#${candidate.issueNumber}](${candidate.issueUrl}) with a concrete first action: ${firstAction}`
  };
}

export function buildIssueCandidate(candidate: RawIssueCandidate): IssueCandidate {
  const { score, difficulty, reasons } = scoreIssue(candidate);
  const summary = summarizeBody(candidate.issueBody);
  const contributionPlan = buildContributionPlan(candidate);
  const likelyFiles = inferLikelyFiles(candidate);
  const testingStrategy = buildTestingStrategy(candidate);
  const firstAction = contributionPlan[0];
  const prDescriptionDraft = [
    `## What`,
    `Fixes or advances ${candidate.repoFullName}#${candidate.issueNumber} by addressing the smallest viable scope first.`,
    "",
    "## Why",
    summary,
    "",
    "## Validation",
    ...testingStrategy.map((item) => `- ${item}`)
  ].join("\n");

  return {
    id: `${candidate.repoFullName}#${candidate.issueNumber}`,
    repoName: candidate.repoName,
    repoFullName: candidate.repoFullName,
    repoUrl: candidate.repoUrl,
    repoDescription: candidate.repoDescription,
    issueTitle: candidate.issueTitle,
    issueNumber: candidate.issueNumber,
    issueUrl: candidate.issueUrl,
    labels: candidate.labels,
    score,
    difficulty,
    reasonForRecommendation:
      reasons[0] || "Strong overlap with backend, API, or developer-tooling contribution goals.",
    scoreExplanation: reasons,
    summary,
    contributionPlan,
    likelyFiles,
    testingStrategy,
    maintainerQuestionDraft: `Hi maintainers, I plan to investigate ${candidate.issueTitle}. Before I start, is there an expected fix direction or specific package area I should validate first?`,
    prDescriptionDraft,
    resumeBulletDraft: `Planned a focused contribution for ${candidate.repoFullName} issue #${candidate.issueNumber} with clear scope, likely files, and a regression-oriented test plan.`,
    jobMode: buildJobMode(candidate, firstAction),
    updatedAt: candidate.updatedAt,
    comments: candidate.comments
  };
}

export function buildDailyPlan(candidates: IssueCandidate[]): DailyPlan {
  const generatedAt = new Date().toISOString();
  const topCandidates = candidates.slice(0, 5);
  const mission =
    topCandidates[0]?.repoFullName
      ? `Pick one tractable issue from ${topCandidates[0].repoFullName} and move it from discovery to a manual draft PR path.`
      : "Discover one tractable backend or developer-tooling issue and prepare a minimal plan.";

  const topOpportunities: DailyPlanOpportunity[] = topCandidates.map((candidate) => ({
    repo: candidate.repoFullName,
    issue: `#${candidate.issueNumber} ${candidate.issueTitle}`,
    score: candidate.score,
    labels: candidate.labels,
    whyUseful: candidate.reasonForRecommendation,
    firstAction: candidate.contributionPlan[0],
    contributionPlan: candidate.contributionPlan,
    testPlan: candidate.testingStrategy,
    prDraft: candidate.prDescriptionDraft,
    resumeBullet: candidate.jobMode.resumeBullet,
    issueUrl: candidate.issueUrl
  }));

  const markdown = [
    `# ContributorOps Daily Plan`,
    ``,
    `- Date: ${generatedAt}`,
    `- Mission: ${mission}`,
    ``,
    `## Rules`,
    `- No automated comments on third-party repositories`,
    `- No automated PRs to third-party repositories`,
    `- Use ContributorOps for discovery, planning, and local tracking`,
    `- Open a draft PR manually after understanding the repo and running tests`,
    ``,
    `## Top 5 opportunities`,
    ...topOpportunities.flatMap((opportunity, index) => [
      ``,
      `### ${index + 1}. ${opportunity.repo}`,
      `- Issue: ${opportunity.issue}`,
      `- Score: ${opportunity.score}/100`,
      `- Labels: ${opportunity.labels.join(", ") || "none"}`,
      `- Why it is useful: ${opportunity.whyUseful}`,
      `- First action: ${opportunity.firstAction}`,
      `- Contribution plan:`,
      ...opportunity.contributionPlan.map((item) => `  - ${item}`),
      `- Test plan:`,
      ...opportunity.testPlan.map((item) => `  - ${item}`),
      `- PR draft:`,
      `  ${opportunity.prDraft.replace(/\n/g, "\n  ")}`,
      `- Resume bullet: ${opportunity.resumeBullet}`,
      `- Issue link: ${opportunity.issueUrl}`
    ]),
    ``,
    `## Checklist`,
    `- [ ] read README`,
    `- [ ] read CONTRIBUTING`,
    `- [ ] reproduce or understand issue`,
    `- [ ] make minimal change`,
    `- [ ] run tests`,
    `- [ ] open draft PR manually`
  ].join("\n");

  return { generatedAt, mission, markdown, topOpportunities };
}
