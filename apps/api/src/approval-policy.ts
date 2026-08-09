import crypto from "node:crypto";
import type {
  ContributionApprovalAction,
  ContributionApprovalRequest,
  ContributionRun,
  ContributionRunApprovalEvent,
  ContributionRunStatus
} from "./types.js";

export class ApprovalDeniedError extends Error {
  readonly action: ContributionApprovalAction;

  constructor(action: ContributionApprovalAction, message: string) {
    super(message);
    this.name = "ApprovalDeniedError";
    this.action = action;
  }
}

export function createActionScopedApprovalTokens(): Record<ContributionApprovalAction, string> {
  return {
    "approve-comment": crypto.randomUUID(),
    "approve-branch": crypto.randomUUID(),
    "approve-draft-pr": crypto.randomUUID()
  };
}

export function createContributionApprovalEvent(
  action: ContributionRunApprovalEvent["action"],
  approved: boolean,
  reason: string,
  actor: string,
  createdAt = new Date().toISOString()
): ContributionRunApprovalEvent {
  return {
    action,
    approved,
    actor,
    reason,
    createdAt
  };
}

export function validateRunApproval(
  run: ContributionRun | undefined,
  request: ContributionApprovalRequest,
  requiredStatus: ContributionRunStatus | ContributionRunStatus[],
  expectedAction: ContributionApprovalAction
): ContributionRun {
  if (!run) {
    throw new ApprovalDeniedError(expectedAction, "Contribution run not found.");
  }

  if (run.status === "cancelled") {
    throw new ApprovalDeniedError(expectedAction, "This contribution run has already been cancelled.");
  }

  const allowedStatuses = Array.isArray(requiredStatus) ? requiredStatus : [requiredStatus];
  const allowsDryRun = allowedStatuses.includes("prepared") && run.status === "dry-run";
  if (!allowedStatuses.includes(run.status) && !allowsDryRun) {
    throw new ApprovalDeniedError(
      expectedAction,
      `Run is not in the correct state for ${expectedAction}. Current status: ${run.status}`
    );
  }

  const expectedToken = run.approvalTokens?.[expectedAction];
  if (!expectedToken) {
    throw new ApprovalDeniedError(
      expectedAction,
      "This run predates action-scoped approvals. Prepare a new run before any external write."
    );
  }

  if (expectedToken !== request.approvalToken) {
    throw new ApprovalDeniedError(expectedAction, `Invalid approval token for ${expectedAction}.`);
  }

  if (!request.explicitApproval || !request.approvalReason.trim()) {
    throw new ApprovalDeniedError(
      expectedAction,
      "Explicit approval and a written approval reason are required."
    );
  }

  return run;
}
