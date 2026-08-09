import crypto from "node:crypto";
import { Octokit } from "@octokit/rest";
import {
  createActionScopedApprovalTokens,
  createContributionApprovalEvent,
  validateRunApproval
} from "./approval-policy.js";
import { config } from "./config.js";
import {
  createApprovedDraftPullRequest,
  createApprovedForkBranch,
  fetchIssueSafetyContext,
  postApprovedIssueComment
} from "./github.js";
import { prepareManagedContributionWorkspace } from "./github/fork-manager.js";
import { recordManagedWorkspace } from "./github/fork-registry.js";
import { buildDraftProposal } from "./planner.js";
import {
  readContributionRuns,
  readControlMode,
  readPullRequestActivity,
  writeContributionRuns,
  writePullRequestActivity
} from "./storage.js";
import type {
  ContributionApprovalAction,
  ContributionApprovalRequest,
  ContributionRun,
  ContributionRunApprovalEvent,
  IssueCandidate,
  PrepareContributionRequest,
  SafetyCheckResult
} from "./types.js";

function createApprovalEvent(
  action: ContributionRunApprovalEvent["action"],
  approved: boolean,
  reason: string
): ContributionRunApprovalEvent {
  return createContributionApprovalEvent(
    action,
    approved,
    reason,
    config.githubUsername || "local-user"
  );
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

function hasBlockingSafetyChecks(safetyChecks: SafetyCheckResult[]): boolean {
  return safetyChecks.some((check) => check.severity === "error" && !check.passed);
}

function validatePreparedProposal(request: PrepareContributionRequest) {
  if (!request.proposal) {
    return buildDraftProposal(request.issue);
  }

  if (
    request.proposal.issueId !== request.issue.id ||
    request.proposal.upstreamRepoFullName !== request.issue.repoFullName ||
    request.proposal.upstreamIssueUrl !== request.issue.issueUrl
  ) {
    throw new Error("Prepared proposal does not match the selected issue. Generate a new proposal before approval.");
  }

  return request.proposal;
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
  const proposal = validatePreparedProposal(request);
  const safetyContext = await fetchIssueSafetyContext(request.issue, controlMode);
  let workspaceError = "";
  let workspaceForkRepo = "";

  const shouldPrepareWorkspace =
    config.autoWorkspaceEnabled &&
    request.mode !== "research" &&
    controlMode.safetyLevel !== "research" &&
    Boolean(config.githubToken) &&
    Boolean(config.githubUsername) &&
    !hasBlockingSafetyChecks(safetyContext.safetyChecks);

  if (shouldPrepareWorkspace) {
    try {
      const workspace = await prepareManagedContributionWorkspace(
        new Octokit({ auth: config.githubToken }),
        {
          upstreamRepoFullName: request.issue.repoFullName,
          forkOwner: config.githubUsername,
          branchName: proposal.branchName
        },
        {
          pollIntervalMs: config.forkPollIntervalMs,
          readyTimeoutMs: config.forkReadyTimeoutMs
        }
      );

      await recordManagedWorkspace(workspace);
      proposal.branchName = workspace.branchName;
      workspaceForkRepo = workspace.forkRepoFullName;
      safetyContext.safetyChecks.push({
        key: "workspace-prepared",
        passed: true,
        detail: `Managed fork synced and branch ready at ${workspace.forkRepoFullName}:${workspace.branchName}.`,
        severity: "info"
      });
    } catch (error) {
      workspaceError = error instanceof Error ? error.message : "Unknown managed workspace error.";
      safetyContext.safetyChecks.push({
        key: "workspace-prepared",
        passed: false,
        detail: `Managed workspace provisioning failed: ${workspaceError}`,
        severity: "warning"
      });
    }
  }

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
    forkRepo: workspaceForkRepo || (config.githubUsername ? `${config.githubUsername}/${request.issue.repoName}` : ""),
    prUrl: "",
    safetyChecks: safetyContext.safetyChecks,
    approvalEvents: [createApprovalEvent("prepare", true, "Prepared immutable run for user review.")],
    errors: workspaceError ? [workspaceError] : [],
    approvalTokens: createActionScopedApprovalTokens(),
    riskScore: computeRiskScore(safetyContext.safetyChecks),
    dryRun: !config.autoContributeEnabled,
    proposal,
    issue: request.issue,
    testPlan: request.issue.testingStrategy,
    prQuality: proposal.prQuality
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

export async function recordContributionApprovalDenial(
  runId: string,
  action: ContributionApprovalAction,
  reason: string
): Promise<void> {
  const runs = await readContributionRuns();
  const run = runs.find((entry) => entry.id === runId);

  if (!run) {
    return;
  }

  run.approvalEvents.push(createApprovalEvent(action, false, reason));
  run.errors.push(`Denied ${action}: ${reason}`);
  await updateRun(run);
}

export async function approveContributionComment(request: ContributionApprovalRequest): Promise<ContributionRun> {
  const runs = await readContributionRuns();
  const run = validateRunApproval(
    runs.find((entry) => entry.id === request.runId),
    request,
    "prepared",
    "approve-comment"
  );

  if (hasBlockingSafetyChecks(run.safetyChecks)) {
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
  const run = validateRunApproval(
    runs.find((entry) => entry.id === request.runId),
    request,
    "prepared",
    "approve-branch"
  );

  if (!config.autoContributeEnabled) {
    run.status = "dry-run";
  } else if (run.safetyChecks.some((check) => check.key === "workspace-prepared" && check.passed)) {
    run.status = "branch approved";
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
  const run = validateRunApproval(
    runs.find((entry) => entry.id === request.runId),
    request,
    ["prepared", "branch approved"],
    "approve-draft-pr"
  );

  if (hasBlockingSafetyChecks(run.safetyChecks)) {
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
