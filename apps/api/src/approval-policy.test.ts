import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  ApprovalDeniedError,
  createActionScopedApprovalTokens,
  createContributionApprovalEvent,
  validateRunApproval
} from "./approval-policy.js";
import type {
  ContributionApprovalAction,
  ContributionApprovalRequest,
  ContributionRun
} from "./types.js";

const TOKENS: Record<ContributionApprovalAction, string> = {
  "approve-comment": "11111111-1111-4111-8111-111111111111",
  "approve-branch": "22222222-2222-4222-8222-222222222222",
  "approve-draft-pr": "33333333-3333-4333-8333-333333333333"
};

function buildRun(overrides: Partial<ContributionRun> = {}): ContributionRun {
  return {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    createdAt: "2026-08-09T00:00:00.000Z",
    mode: "approved-auto-contribute",
    targetRepo: "owner/repo",
    issueNumber: 42,
    issueUrl: "https://github.com/owner/repo/issues/42",
    status: "prepared",
    plannedFiles: [],
    generatedDiffSummary: "Focused diff",
    commentDraft: "Comment draft",
    prTitle: "Draft PR",
    prBody: "Body",
    branchName: "contributorops/issue-42",
    forkRepo: "",
    prUrl: "",
    safetyChecks: [],
    approvalEvents: [],
    errors: [],
    approvalTokens: { ...TOKENS },
    riskScore: 15,
    dryRun: false,
    proposal: {} as ContributionRun["proposal"],
    issue: {} as ContributionRun["issue"],
    testPlan: [],
    prQuality: {} as ContributionRun["prQuality"],
    ...overrides
  };
}

function buildRequest(
  action: ContributionApprovalAction,
  overrides: Partial<ContributionApprovalRequest> = {}
): ContributionApprovalRequest {
  return {
    runId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    approvalToken: TOKENS[action],
    approvalReason: "I inspected this exact action and approve it.",
    explicitApproval: true,
    ...overrides
  };
}

test("action-scoped approval tokens are distinct capabilities", () => {
  const tokens = createActionScopedApprovalTokens();
  assert.match(tokens["approve-comment"], /^[0-9a-f-]{36}$/i);
  assert.match(tokens["approve-branch"], /^[0-9a-f-]{36}$/i);
  assert.match(tokens["approve-draft-pr"], /^[0-9a-f-]{36}$/i);
  assert.equal(new Set(Object.values(tokens)).size, 3);
});

test("valid approval returns the prepared run", () => {
  const run = buildRun();
  const validated = validateRunApproval(
    run,
    buildRequest("approve-comment"),
    "prepared",
    "approve-comment"
  );
  assert.equal(validated, run);
});

test("a token for one action cannot authorize another action", () => {
  const run = buildRun();
  assert.throws(
    () =>
      validateRunApproval(
        run,
        buildRequest("approve-comment"),
        "prepared",
        "approve-draft-pr"
      ),
    (error: unknown) =>
      error instanceof ApprovalDeniedError &&
      error.action === "approve-draft-pr" &&
      /Invalid approval token/.test(error.message)
  );
});

test("legacy generic approval tokens cannot authorize external writes", () => {
  const run = buildRun({
    approvalTokens: undefined,
    userApprovalToken: "legacy-run-token"
  });
  assert.throws(
    () =>
      validateRunApproval(
        run,
        buildRequest("approve-comment", { approvalToken: "legacy-run-token" }),
        "prepared",
        "approve-comment"
      ),
    /predates action-scoped approvals/
  );
});

test("explicit approval and a written reason are mandatory", () => {
  const run = buildRun();
  assert.throws(
    () =>
      validateRunApproval(
        run,
        buildRequest("approve-branch", { explicitApproval: false }),
        "prepared",
        "approve-branch"
      ),
    /Explicit approval/
  );
  assert.throws(
    () =>
      validateRunApproval(
        run,
        buildRequest("approve-branch", { approvalReason: "   " }),
        "prepared",
        "approve-branch"
      ),
    /written approval reason/
  );
});

test("cancelled and incorrectly staged runs cannot execute", () => {
  assert.throws(
    () =>
      validateRunApproval(
        buildRun({ status: "cancelled" }),
        buildRequest("approve-draft-pr"),
        ["prepared", "branch approved"],
        "approve-draft-pr"
      ),
    /already been cancelled/
  );
  assert.throws(
    () =>
      validateRunApproval(
        buildRun({ status: "comment approved" }),
        buildRequest("approve-draft-pr"),
        ["prepared", "branch approved"],
        "approve-draft-pr"
      ),
    /not in the correct state/
  );
});

test("denied approval events are explicitly auditable", () => {
  const event = createContributionApprovalEvent(
    "approve-draft-pr",
    false,
    "Cross-action token replay rejected.",
    "security-test",
    "2026-08-09T00:00:00.000Z"
  );
  assert.deepEqual(event, {
    action: "approve-draft-pr",
    approved: false,
    actor: "security-test",
    reason: "Cross-action token replay rejected.",
    createdAt: "2026-08-09T00:00:00.000Z"
  });
});

test("the API has no legacy direct approved-PR write endpoint", async () => {
  const source = await readFile(new URL("./routes/contribute.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /router\.post\(["']\/approved-pr["']/);
  assert.doesNotMatch(source, /createApprovedDraftPullRequest/);
});

test("daily planning cannot import third-party write primitives", async () => {
  const source = await readFile(new URL("./daily.ts", import.meta.url), "utf8");
  for (const forbidden of [
    "approveContributionComment",
    "approveContributionBranch",
    "approveContributionDraftPr",
    "createApprovedDraftPullRequest",
    "createApprovedForkBranch",
    "postApprovedIssueComment"
  ]) {
    assert.equal(source.includes(forbidden), false, `daily.ts must not reference ${forbidden}`);
  }
});
