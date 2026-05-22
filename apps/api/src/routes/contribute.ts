import { Router } from "express";
import { ensureFeature } from "../billing.js";
import {
  approveContributionBranch,
  approveContributionComment,
  approveContributionDraftPr,
  cancelContributionRun,
  markContributionRunError,
  prepareContributionRun,
} from "../contribute.js";
import { createApprovedDraftPullRequest, createPlanningIssue, discoverIssues } from "../github.js";
import { buildDraftProposal, buildGithubProfileAudit, buildIssueCandidate } from "../planner.js";
import { readContributionRuns, readControlMode, readDailyPlan, readPullRequestActivity, writePullRequestActivity } from "../storage.js";
import { validate } from "../middleware/validate.js";
import { strictLimiter } from "../middleware/rateLimiter.js";
import {
  ApproveCommentSchema,
  ApproveBranchSchema,
  ApproveDraftPrSchema,
  ApprovedPrSchema,
  CancelRunSchema,
  DraftProposalSchema,
  PlanningIssueSchema,
  PrepareRunSchema,
  PrQualityCheckSchema,
} from "../schemas/contribute.js";
import type { ApprovedPullRequestRequest, ContributionApprovalRequest, DailyPlan } from "../types.js";

const router = Router();

router.post("/create-planning-issue", validate(PlanningIssueSchema), async (req, res, next) => {
  try {
    const controlMode = await readControlMode();
    if (controlMode.safetyLevel === "research") {
      res.status(403).json({ message: "Planning issues are disabled in Research Mode." });
      return;
    }
    const plan: DailyPlan = await readDailyPlan();
    const title = req.body.title || `ContributorOps daily plan ${new Date().toISOString().slice(0, 10)}`;
    const issueBody = req.body.body || plan.markdown;
    res.json(await createPlanningIssue(title, issueBody));
  } catch (error) {
    next(error);
  }
});

router.post("/draft-proposal", validate(DraftProposalSchema), async (req, res, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    const controlMode = await readControlMode();
    if (controlMode.safetyLevel === "research") {
      res.status(403).json({ message: "Draft proposal generation requires Draft Mode or Approved PR Mode." });
      return;
    }
    res.json(buildDraftProposal(req.body.issue));
  } catch (error) {
    next(error);
  }
});

router.post("/approved-pr", strictLimiter, validate(ApprovedPrSchema), async (req, res, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    const controlMode = await readControlMode();
    const activity = await readPullRequestActivity();
    const body = req.body as ApprovedPullRequestRequest;
    const result = await createApprovedDraftPullRequest(body, controlMode, activity);
    await writePullRequestActivity([
      { upstreamRepoFullName: body.issue.repoFullName, draftPullRequestUrl: result.draftPullRequestUrl, createdAt: new Date().toISOString() },
      ...activity,
    ]);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/contribute/prepare", validate(PrepareRunSchema), async (req, res, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    res.json(await prepareContributionRun(req.body));
  } catch (error) {
    next(error);
  }
});

router.post("/contribute/approve-comment", strictLimiter, validate(ApproveCommentSchema), async (req, res, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    res.json(await approveContributionComment(req.body as ContributionApprovalRequest));
  } catch (error) {
    if (req.body?.runId) {
      await markContributionRunError(req.body.runId, error instanceof Error ? error.message : "Unknown comment approval error.");
    }
    next(error);
  }
});

router.post("/contribute/approve-branch", strictLimiter, validate(ApproveBranchSchema), async (req, res, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    res.json(await approveContributionBranch(req.body as ContributionApprovalRequest & { forkOwner: string }));
  } catch (error) {
    if (req.body?.runId) {
      await markContributionRunError(req.body.runId, error instanceof Error ? error.message : "Unknown branch approval error.");
    }
    next(error);
  }
});

router.post("/contribute/approve-draft-pr", strictLimiter, validate(ApproveDraftPrSchema), async (req, res, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    res.json(await approveContributionDraftPr(req.body as ContributionApprovalRequest & { forkOwner: string }));
  } catch (error) {
    if (req.body?.runId) {
      await markContributionRunError(req.body.runId, error instanceof Error ? error.message : "Unknown draft PR approval error.");
    }
    next(error);
  }
});

router.get("/contribute/runs", async (_req, res, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    res.json(await readContributionRuns());
  } catch (error) {
    next(error);
  }
});

router.get("/contribute/runs/:id", async (req, res, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    const run = (await readContributionRuns()).find((r) => r.id === String(req.params.id));
    if (!run) {
      res.status(404).json({ message: "Contribution run not found." });
      return;
    }
    res.json(run);
  } catch (error) {
    next(error);
  }
});

router.post("/contribute/runs/:id/cancel", validate(CancelRunSchema), async (req, res, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    res.json(await cancelContributionRun(String(req.params.id), req.body?.reason || "Cancelled by user."));
  } catch (error) {
    next(error);
  }
});

router.post("/pr-quality-check", validate(PrQualityCheckSchema), async (req, res, next) => {
  try {
    await ensureFeature("pr-quality-checker");
    const proposal = buildDraftProposal(req.body.issue);
    res.json(proposal.prQuality);
  } catch (error) {
    next(error);
  }
});

router.get("/github-profile-audit", async (req, res, next) => {
  try {
    await ensureFeature("github-profile-audit");
    const rawUsername = req.query.username;
    const username = (typeof rawUsername === "string" ? rawUsername : "").trim();
    if (!username) {
      res.status(400).json({ message: "GitHub username is required." });
      return;
    }
    res.json(buildGithubProfileAudit(username));
  } catch (error) {
    next(error);
  }
});

router.get("/team/radar", async (_req, res, next) => {
  try {
    await ensureFeature("shared-repo-radar");
    const discovery = await discoverIssues({});
    const issues = discovery.candidates.map((c) => buildIssueCandidate(c, { targetRole: "Platform Engineer" }));
    const grouped = new Map<string, { scores: number[]; labels: string[] }>();
    for (const issue of issues) {
      const current = grouped.get(issue.repoFullName) || { scores: [], labels: [] };
      current.scores.push(issue.score);
      current.labels.push(...issue.labels);
      grouped.set(issue.repoFullName, current);
    }
    res.json(
      [...grouped.entries()].map(([repoFullName, value]) => ({
        repoFullName,
        openOpportunities: value.scores.length,
        averageScore: Math.round(value.scores.reduce((s, v) => s + v, 0) / value.scores.length),
        topLabels: [...new Set(value.labels)].slice(0, 3),
        whyNow: "High-signal repos with recent issues are easier to turn into visible proof of work.",
      }))
    );
  } catch (error) {
    next(error);
  }
});

router.get("/export/github-resume", async (_req, res, next) => {
  try {
    const { exportGithubResume } = await import("../billing.js");
    res.json(await exportGithubResume());
  } catch (error) {
    next(error);
  }
});

router.get("/export-center", async (_req, res, next) => {
  try {
    const { exportAllCareerAssets } = await import("../billing.js");
    res.json(await exportAllCareerAssets());
  } catch (error) {
    next(error);
  }
});

router.post("/run-daily", async (_req, res, next) => {
  try {
    const { runDailyPlan } = await import("../daily.js");
    res.json(await runDailyPlan());
  } catch (error) {
    next(error);
  }
});

export default router;
