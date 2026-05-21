import crypto from "node:crypto";
import { config } from "./config.js";
import {
  createApprovedDraftPullRequest,
  createApprovedForkBranch,
  fetchIssueSafetyContext,
  postApprovedIssueComment
} from "./github.js";
import { buildDraftProposal } from "./planner.js";
import {
  readContributionRuns,
  readControlMode,
  readPullRequestActivity,
  writeContributionRuns,
  writePullRequestActivity
} from "./storage.js";
import type {
  ContributionApprovalRequest,
  ContributionRun,
  ContributionRunApprovalEvent,
  ContributionRunStatus,
  ControlModeState,
  IssueCandidate,
  PrepareContributionRequest,
  SafetyCheckResult
} from "./types.js";

function createApprovalEvent(
  action: ContributionRunApprovalEvent["action"],
  approved: boolean,
  reason: string
): ContributionRunApprovalEvent {
  return {
    action,
    approved,
    actor: config.githubUsername || "local-user",
    reason,
    createdAt: new Date().toISOString()
  };
}

function computeDiffSummary(issue: IssueCandidate): string {
  return issue.likelyFiles
    .map((filePath, index) => `- ${filePath}: ${issue.contributionPlan[Math.min(index, issue.contributionPlan.length - 1)]}`)
    .join("\n");
}

function buildCommentDraft(issue: IssueCandidate): string {
  return [
    `I reviewed ${issue.issueTitle} and want to take a focused pass on it.`,
    ``,
    `My plan is to:`,
    ...issue.contributionPlan.slice(0, 3).map((step) => `- ${step}`),
    ``,
    `Before I start, is there a preferred file or test area I should validate first?`
  ].join("\n");
}

function computeRiskScore(safetyChecks: SafetyCheckResult[]): number {
  const penalties = safetyChecks.reduce((total, check) => {
    if (!check.passed && check.severity === "error") {
      return total + 20;
    }
    if (!check.passed && check.severity === "warning") {
      return total + 10;
    }
    return total;
  }, 0);

  return Math.min(100, 15 + penalties);
}

async function validateRunApproval(
  run: ContributionRun | undefined,
  request: ContributionApprovalRequest,
  requiredStatus: ContributionRunStatus
): Promise<ContributionRun> {
  if (!run) {
    throw new Error("Contribution run not found.");
  }

  if (run.status === "cancelled") {
    throw new Error("This contribution run has already been cancelled.");
  }

  if (run.status !== requiredStatus && !(requiredStatus === "prepared" && run.status === "dry-run")) {
    throw new Error(`Run is not in the correct state for this action. Current status: ${run.status}`);
  }

  if (run.userApprovalToken !== request.userApprovalToken) {
    throw new Error("Invalid approval token for this run.");
  }

  if (!request.explicitApproval || !request.approvalReason.trim()) {
    throw new Error("Explicit approval and a written approval reason are required.");
  }

  return run;
}

function countRunsToday(
  runs: ContributionRun[],
  predicate: (run: ContributionRun) => boolean
): number {
  const today = new Date().toISOString().slice(0, 10);
  return runs.filter((run) => run.createdAt.slice(0, 10) === today && predicate(run)).length;
}

export async function prepareContributionRun(request: PrepareContributionRequest): Promise<ContributionRun> {
  const controlMode = await readControlMode();
  const proposal = buildDraftProposal(request.issue);
  const safetyContext = await fetchIssueSafetyContext(request.issue, controlMode);
  const run: ContributionRun = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    mode: request.mode,
    targetRepo: request.issue.repoFullName,
    issueNumber: request.issue.issueNumber,
    issueUrl: request.issue.issueUrl,
    status: "prepared",
    plannedFiles: proposal.suggestedChanges.map((change) => change.path),
    generatedDiffSummary: computeDiffSummary(request.issue),
    commentDraft: buildCommentDraft(request.issue),
    prTitle: proposal.prTitle,
    prBody: proposal.prBody,
    branchName: proposal.branchName,
    forkRepo: config.githubUsername ? `${config.githubUsername}/${request.issue.repoName}` : "",
    prUrl: "",
    safetyChecks: safetyContext.safetyChecks,
    approvalEvents: [createApprovalEvent("prepare", true, "Prepared run for user review.")],
    errors: [],
    userApprovalToken: crypto.randomUUID(),
    riskScore: computeRiskScore(safetyContext.safetyChecks),
    dryRun: !config.autoContributeEnabled,
    proposal,
    issue: request.issue,
    testPlan: request.issue.testingStrategy
  };

  const runs = await readContributionRuns();
  runs.unshift(run);
  await writeContributionRuns(runs);
  return run;
}

async function updateRun(run: ContributionRun): Promise<ContributionRun> {
  const runs = await readContributionRuns();
  const updatedRuns = runs.map((entry) => (entry.id === run.id ? run : entry));
  await writeContributionRuns(updatedRuns);
  return run;
}

export async function markContributionRunError(runId: string, message: string): Promise<void> {
  const runs = await readContributionRuns();
  const run = runs.find((entry) => entry.id === runId);

  if (!run) {
    return;
  }

  run.errors.push(message);
  run.status = "error";
  await updateRun(run);
}

export async function approveContributionComment(request: ContributionApprovalRequest): Promise<ContributionRun> {
  const runs = await readContributionRuns();
  const run = await validateRunApproval(
    runs.find((entry) => entry.id === request.runId),
    request,
    "prepared"
  );

  if (run.safetyChecks.some((check) => check.severity === "error" && !check.passed)) {
    throw new Error("Safety checks failed. Resolve the blocked checks before commenting.");
  }

  const commentCountToday = countRunsToday(
    runs,
    (entry) => entry.approvalEvents.some((event) => event.action === "approve-comment" && event.approved)
  );

  if (commentCountToday >= config.autoCommentDailyLimit) {
    throw new Error(`ContributorOps reached the daily comment limit of ${config.autoCommentDailyLimit}.`);
  }

  if (config.autoContributeEnabled) {
    const commentResult = await postApprovedIssueComment(run, request.approvalReason);
    run.commentUrl = commentResult.commentUrl;
  }

  run.status = run.dryRun ? "dry-run" : "comment approved";
  run.approvalEvents.push(createApprovalEvent("approve-comment", true, request.approvalReason));
  return updateRun(run);
}

export async function approveContributionBranch(
  request: ContributionApprovalRequest & { forkOwner: string }
): Promise<ContributionRun> {
  const runs = await readContributionRuns();
  const run = await validateRunApproval(
    runs.find((entry) => entry.id === request.runId),
    request,
    "prepared"
  );

  if (!config.autoContributeEnabled) {
    run.status = "dry-run";
  } else {
    const result = await createApprovedForkBranch({
      issue: run.issue,
      proposal: run.proposal,
      forkOwner: request.forkOwner,
      approvalReason: request.approvalReason,
      explicitApproval: true
    });
    run.branchName = result.branchName;
    run.forkRepo = result.forkRepo;
    run.proposal.branchName = result.branchName;
    run.status = "branch approved";
  }
  run.approvalEvents.push(createApprovalEvent("approve-branch", true, request.approvalReason));
  return updateRun(run);
}

export async function approveContributionDraftPr(
  request: ContributionApprovalRequest & { forkOwner: string }
): Promise<ContributionRun> {
  const runs = await readContributionRuns();
  const run = await validateRunApproval(
    runs.find((entry) => entry.id === request.runId),
    request,
    "prepared"
  );

  if (run.safetyChecks.some((check) => check.severity === "error" && !check.passed)) {
    throw new Error("Safety checks failed. Resolve the blocked checks before opening a draft PR.");
  }

  const totalPrsToday = countRunsToday(
    runs,
    (entry) =>
      entry.approvalEvents.some((event) => event.action === "approve-draft-pr" && event.approved) &&
      entry.status === "completed"
  );

  if (totalPrsToday >= config.autoPrDailyLimit) {
    throw new Error(`ContributorOps reached the daily PR limit of ${config.autoPrDailyLimit}.`);
  }

  if (!config.autoContributeEnabled) {
    run.status = "dry-run";
    run.approvalEvents.push(createApprovalEvent("approve-draft-pr", true, `${request.approvalReason} (dry run)`));
    return updateRun(run);
  }

  const controlMode = await readControlMode();
  const activity = await readPullRequestActivity();
  const result = await createApprovedDraftPullRequest(
    {
      issue: run.issue,
      proposal: run.proposal,
      forkOwner: request.forkOwner,
      approvalReason: request.approvalReason,
      explicitApproval: true
    },
    controlMode,
    activity
  );

  run.prUrl = result.draftPullRequestUrl;
  run.branchName = result.branchName;
  run.forkRepo = `${request.forkOwner}/${run.issue.repoName}`;
  run.status = "completed";
  run.approvalEvents.push(createApprovalEvent("approve-draft-pr", true, request.approvalReason));

  const updatedActivity = [
    {
      upstreamRepoFullName: run.issue.repoFullName,
      draftPullRequestUrl: result.draftPullRequestUrl,
      createdAt: new Date().toISOString()
    },
    ...activity
  ];
  await writePullRequestActivity(updatedActivity);

  return updateRun(run);
}

export async function cancelContributionRun(runId: string, reason: string): Promise<ContributionRun> {
  const runs = await readContributionRuns();
  const run = runs.find((entry) => entry.id === runId);

  if (!run) {
    throw new Error("Contribution run not found.");
  }

  run.status = "cancelled";
  run.approvalEvents.push(createApprovalEvent("cancel", true, reason || "Cancelled by user."));
  return updateRun(run);
}
