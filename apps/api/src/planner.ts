import type {
  DailyPlan,
  DailyPlanOpportunity,
  DraftProposal,
  DiscoveryFilters,
  GithubProfileAudit,
  IssueCandidate,
  JobModeDrafts,
  MaintainerTrustReport,
  PrQualityReport,
  QualityCheck,
  RoleMatchReport,
  RawIssueCandidate,
  SuggestedFileChange
} from "./types.js";
import { scoreIssue, scoreRoleFit } from "./scorer.js";

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
  const situation = `I wanted stronger OSS signal in API and developer-tooling work through ${candidate.repoFullName}.`;
  const task = `Find a realistic issue with maintainable scope around issue #${candidate.issueNumber}.`;
  const action = `I mapped the likely files, shaped a minimal test-backed plan, and drafted reviewer-friendly contribution notes before coding.`;
  const result = `I created a credible contribution path that could become portfolio proof, a resume bullet, and an interview story.`;
  return {
    resumeBullet: `Targeted ${candidate.repoFullName} issue #${candidate.issueNumber}, scoped a minimal contribution path, and translated backend or developer-tooling context into a test-backed open-source plan.`,
    linkedInPost: `Today I used ContributorOps to break down ${candidate.repoFullName} issue #${candidate.issueNumber}. The value was not "finding any issue" but identifying one tractable backend or developer-tooling problem, mapping the likely files, and writing the smallest test-backed contribution plan before coding.`,
    linkedInShort: `Scoped ${candidate.repoFullName} issue #${candidate.issueNumber} into a minimal, test-backed open-source contribution plan.`,
    linkedInMedium: `I used ContributorOps to evaluate ${candidate.repoFullName} issue #${candidate.issueNumber}, map the likely files, and define the smallest credible contribution path before touching code.`,
    linkedInDetailed: `Today I turned ${candidate.repoFullName} issue #${candidate.issueNumber} into job-search proof. I scored the issue, outlined the likely files, drafted the maintainer question, and defined the validation path so the eventual contribution can be specific, reviewable, and interview-ready.`,
    interviewStarStory: `Situation: ${situation} Task: ${task} Action: ${action} Result: ${result}`,
    interviewSituation: situation,
    interviewTask: task,
    interviewAction: action,
    interviewResult: result,
    recruiterOutreach: `Hi, I've been building ContributorOps to help me make higher-signal open-source contributions in API and developer-tooling repos. One recent example is ${candidate.repoFullName} issue #${candidate.issueNumber}, where I mapped the fix path, test strategy, and PR narrative before implementation. I'd value the chance to bring that same structured execution to a backend or platform role.`,
    githubProfileSnippet: `- Planned a contribution for [${candidate.repoFullName}#${candidate.issueNumber}](${candidate.issueUrl}) with a concrete first action: ${firstAction}`
  };
}

function buildMaintainerTrust(candidate: RawIssueCandidate): MaintainerTrustReport {
  let score = 40;
  const reasons: string[] = [];

  if (candidate.labels.some((label) => /good first issue|help wanted/i.test(label))) {
    score += 20;
    reasons.push("Maintainers explicitly labeled the issue as contribution-friendly.");
  }

  if (candidate.comments > 0 && candidate.comments < 10) {
    score += 10;
    reasons.push("The discussion is active but still tractable.");
  }

  if (new Date(candidate.updatedAt).getTime() > Date.now() - 30 * 86_400_000) {
    score += 15;
    reasons.push("The issue was updated recently, which is a strong sign of maintainer attention.");
  }

  if (!candidate.issueBody.trim()) {
    score -= 20;
    reasons.push("The issue body is sparse, which raises the risk of unclear expectations.");
  }

  if (candidate.comments > 20) {
    score -= 10;
    reasons.push("Long discussion threads can hide historical context and competing fixes.");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    band: score >= 75 ? "trusted" : score >= 55 ? "promising" : "guarded",
    reasons
  };
}

function buildRoleMatch(candidate: RawIssueCandidate, targetRole?: DiscoveryFilters["targetRole"]): RoleMatchReport {
  const role = targetRole || "Backend Engineer";
  const roleFit = scoreRoleFit(candidate, role);
  return {
    targetRole: role,
    score: roleFit.score,
    reasons: roleFit.reasons
  };
}

export function buildIssueCandidate(
  candidate: RawIssueCandidate,
  options?: { targetRole?: DiscoveryFilters["targetRole"] }
): IssueCandidate {
  const { score, difficulty, reasons } = scoreIssue(candidate);
  const roleMatch = buildRoleMatch(candidate, options?.targetRole);
  const adjustedScore = Math.max(0, Math.min(100, Math.round(score * 0.7 + roleMatch.score * 0.3)));
  const summary = summarizeBody(candidate.issueBody);
  const contributionPlan = buildContributionPlan(candidate);
  const likelyFiles = inferLikelyFiles(candidate);
  const testingStrategy = buildTestingStrategy(candidate);
  const firstAction = contributionPlan[0];
  const maintainerTrust = buildMaintainerTrust(candidate);
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
    score: adjustedScore,
    difficulty,
    reasonForRecommendation:
      roleMatch.reasons[0] || reasons[0] || "Strong overlap with backend, API, or developer-tooling contribution goals.",
    scoreExplanation: [...reasons, ...roleMatch.reasons],
    summary,
    contributionPlan,
    likelyFiles,
    testingStrategy,
    maintainerQuestionDraft: `Hi maintainers, I plan to investigate ${candidate.issueTitle}. Before I start, is there an expected fix direction or specific package area I should validate first?`,
    prDescriptionDraft,
    resumeBulletDraft: `Planned a focused contribution for ${candidate.repoFullName} issue #${candidate.issueNumber} with clear scope, likely files, and a regression-oriented test plan.`,
    jobMode: buildJobMode(candidate, firstAction),
    maintainerTrust,
    roleMatch,
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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function normalizeSuggestedPath(rawPath: string): string {
  if (rawPath.endsWith("/")) {
    return `${rawPath}TODO.md`;
  }

  if (rawPath.includes(".")) {
    return rawPath;
  }

  return `${rawPath}/TODO.md`;
}

function buildSuggestedChanges(issue: IssueCandidate): SuggestedFileChange[] {
  return issue.likelyFiles.slice(0, 3).map((filePath, index) => {
    const normalizedPath = normalizeSuggestedPath(filePath);
    const content = [
      `# ContributorOps draft proposal for ${issue.repoFullName}`,
      ``,
      `Issue: ${issue.issueUrl}`,
      `Target area: ${filePath}`,
      ``,
      `Planned change ${index + 1}:`,
      `- ${issue.contributionPlan[Math.min(index, issue.contributionPlan.length - 1)]}`,
      ``,
      `Validation notes:`,
      ...issue.testingStrategy.map((step) => `- ${step}`)
    ].join("\n");

    return {
      path: normalizedPath,
      content,
      rationale: `ContributorOps suggests touching ${filePath} based on the issue labels, topic match, and likely contribution surface.`
    };
  });
}

export function buildPrQualityReport(issue: IssueCandidate, suggestedChanges: SuggestedFileChange[]): PrQualityReport {
  const checks: QualityCheck[] = [
    {
      label: "Issue alignment",
      passed: issue.summary.length > 40,
      detail: "The PR should stay tightly aligned to a clearly described issue."
    },
    {
      label: "Focused diff size",
      passed: suggestedChanges.length <= 3,
      detail: "Smaller focused diffs are easier for maintainers to review."
    },
    {
      label: "Test evidence present",
      passed: issue.testingStrategy.length >= 2,
      detail: "Each draft should include concrete validation steps."
    },
    {
      label: "Maintainer question included",
      passed: issue.maintainerQuestionDraft.trim().length > 20,
      detail: "A respectful maintainer question reduces wasted implementation effort."
    },
    {
      label: "Human-readable PR summary",
      passed: issue.prDescriptionDraft.includes("## Validation"),
      detail: "The draft should explain what changed and how it was checked."
    }
  ];

  const passedCount = checks.filter((check) => check.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const suggestions = checks
    .filter((check) => !check.passed)
    .map((check) => `Improve ${check.label.toLowerCase()} before opening the draft PR.`);

  return {
    score,
    verdict: score >= 85 ? "strong" : score >= 60 ? "solid" : "needs-review",
    riskLevel: score >= 85 ? "low" : score >= 60 ? "medium" : "high",
    checks,
    suggestions
  };
}

export function buildGithubProfileAudit(username: string): GithubProfileAudit {
  const normalized = username.trim() || "unknown";
  const baseScore = normalized.length >= 4 ? 72 : 55;
  return {
    username: normalized,
    score: baseScore,
    strengths: [
      "The username is presentable and easy to share.",
      "ContributorOps can turn contributions into reusable GitHub README proof."
    ],
    checklist: [
      "Add a GitHub profile README with a clear backend or platform positioning statement.",
      "Pin 3 to 6 repositories that show real implementation depth, not only forks.",
      "Link merged PRs or contribution writeups directly from the profile README.",
      "Keep one section for OSS proof, one for core stack, and one for current focus."
    ],
    readmeSuggestions: [
      "Open with the role you want next and the systems you build.",
      "Add a short proof-of-work section with merged PR links.",
      "Include one sentence on what kinds of OSS issues you contribute to."
    ]
  };
}

export function buildDraftProposal(issue: IssueCandidate): DraftProposal {
  const repoSlug = slugify(issue.repoFullName.replace("/", "-"));
  const issueSlug = slugify(issue.issueTitle);
  const branchName = `contributorops/${repoSlug}-issue-${issue.issueNumber}-${issueSlug}`.slice(0, 110);
  const commitMessage = `chore: prepare draft contribution for ${issue.repoFullName}#${issue.issueNumber}`;
  const prTitle = `[ContributorOps draft] ${issue.issueTitle}`;
  const prBody = [
    `## Summary`,
    issue.summary,
    ``,
    `## Why this draft exists`,
    `This draft PR was prepared through ContributorOps in Approved PR Mode after explicit human approval.`,
    `It is intentionally opened as a draft and will not be marked ready for review automatically.`,
    ``,
    `## Proposed approach`,
    ...issue.contributionPlan.map((step) => `- ${step}`),
    ``,
    `## Testing evidence`,
    ...issue.testingStrategy.map((step) => `- ${step}`),
    ``,
    `## Maintainer question`,
    issue.maintainerQuestionDraft
  ].join("\n");
  const suggestedChanges = buildSuggestedChanges(issue);
  const prQuality = buildPrQualityReport(issue, suggestedChanges);

  return {
    proposalId: issue.id,
    issueId: issue.id,
    upstreamRepoFullName: issue.repoFullName,
    upstreamIssueUrl: issue.issueUrl,
    branchName,
    commitMessage,
    prTitle,
    prBody,
    testEvidence: issue.testingStrategy.join("\n"),
    suggestedChanges,
    generatedAt: new Date().toISOString(),
    mode: "draft",
    prQuality,
    ...issue.jobMode
  };
}
