import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import {
  buildEntitlements,
  buildPublicPortfolioProfile,
  ensureFeature,
  ensurePlanGenerationAllowed,
  exportGithubResume,
  exportAllCareerAssets,
  getBillingState,
  getPublicPortfolioProfileBySlug,
  getUsageSnapshot,
  incrementUsage,
  pricingTiers,
  updateBillingPlan,
  updatePublicProfile
} from "./billing.js";
import { config } from "./config.js";
import {
  approveContributionBranch,
  approveContributionComment,
  approveContributionDraftPr,
  cancelContributionRun,
  markContributionRunError,
  prepareContributionRun
} from "./contribute.js";
import { runDailyPlan } from "./daily.js";
import { createApprovedDraftPullRequest, createPlanningIssue, discoverIssues } from "./github.js";
import { buildDailyPlan, buildDraftProposal, buildGithubProfileAudit, buildIssueCandidate } from "./planner.js";
import {
  readControlMode,
  readContributionRuns,
  readDailyPlan,
  readPortfolio,
  readPullRequestActivity,
  writeControlMode,
  writeDailyPlan,
  writePortfolio,
  writePullRequestActivity
} from "./storage.js";
import type {
  ApprovedPullRequestRequest,
  ContributionApprovalRequest,
  ControlModeUpdateRequest,
  DailyPlan,
  DraftProposalRequest,
  DiscoveryFilters,
  PrepareContributionRequest,
  PlanningIssueRequest,
  PortfolioEntry
} from "./types.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_request, response, next) => {
  try {
    const [controlMode, billing, usage] = await Promise.all([
      readControlMode(),
      getBillingState(),
      getUsageSnapshot()
    ]);
    response.json({
      ok: true,
      mode: config.githubToken ? "github" : "demo",
      createDailyIssue: config.createDailyIssue,
      autoContributeEnabled: config.autoContributeEnabled,
      controlMode,
      billing,
      usage,
      entitlements: buildEntitlements(billing)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/pricing", async (_request, response) => {
  response.json(pricingTiers);
});

app.get("/api/billing", async (_request, response, next) => {
  try {
    const billing = await getBillingState();
    response.json({
      billing,
      entitlements: buildEntitlements(billing)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/billing/mock-select-plan", async (request, response, next) => {
  try {
    const billing = await updateBillingPlan(request.body?.plan);
    response.json({
      billing,
      entitlements: buildEntitlements(billing)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/billing/profile", async (request, response, next) => {
  try {
    await ensureFeature("public-portfolio");
    const billing = await updatePublicProfile(request.body || {});
    response.json({
      billing,
      entitlements: buildEntitlements(billing)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/usage", async (_request, response, next) => {
  try {
    response.json(await getUsageSnapshot());
  } catch (error) {
    next(error);
  }
});

app.get("/api/control-mode", async (_request, response, next) => {
  try {
    response.json(await readControlMode());
  } catch (error) {
    next(error);
  }
});

app.post("/api/control-mode", async (request, response, next) => {
  try {
    const body = request.body as ControlModeUpdateRequest;
    const now = new Date().toISOString();
    const nextState = {
      safetyLevel: body.safetyLevel,
      approvalRequired: body.safetyLevel === "approved-pr",
      approvalGrantedAt:
        body.safetyLevel === "approved-pr" && body.explicitApproval ? now : null,
      approvalReason:
        body.safetyLevel === "approved-pr" ? body.approvalReason?.trim() || "" : "",
      lastUpdatedAt: now
    };
    response.json(await writeControlMode(nextState));
  } catch (error) {
    next(error);
  }
});

app.post("/api/discover", async (request, response, next) => {
  try {
    await ensurePlanGenerationAllowed();
    const filters = request.body as Partial<DiscoveryFilters>;
    const discovery = await discoverIssues(filters);
    const issues = discovery.candidates
      .map((candidate) => buildIssueCandidate(candidate, { targetRole: filters.targetRole }))
      .sort((left, right) => right.score - left.score);
    const dailyPlan = buildDailyPlan(issues);
    await writeDailyPlan(dailyPlan);
    await incrementUsage("generatedPlans");
    response.json({ mode: discovery.mode, issues, dailyPlan });
  } catch (error) {
    next(error);
  }
});

app.get("/api/daily-plan", async (_request, response, next) => {
  try {
    const plan = await readDailyPlan();
    response.json(plan);
  } catch (error) {
    next(error);
  }
});

app.get("/api/portfolio", async (_request, response, next) => {
  try {
    response.json(await readPortfolio());
  } catch (error) {
    next(error);
  }
});

app.post("/api/portfolio", async (request, response, next) => {
  try {
    await ensureFeature("portfolio-tracker");
    const payload = request.body as Partial<PortfolioEntry>;
    const entries = await readPortfolio();
    const now = new Date().toISOString();
    const entry: PortfolioEntry = {
      id: crypto.randomUUID(),
      selectedRepo: payload.selectedRepo || "",
      issueUrl: payload.issueUrl || "",
      prUrl: payload.prUrl || "",
      status: payload.status || "discovered",
      notes: payload.notes || "",
      interviewStarStory: payload.interviewStarStory || "",
      interviewSituation: payload.interviewSituation || "",
      interviewTask: payload.interviewTask || "",
      interviewAction: payload.interviewAction || "",
      interviewResult: payload.interviewResult || "",
      resumeBullet: payload.resumeBullet || "",
      linkedInPost: payload.linkedInPost || "",
      linkedInShort: payload.linkedInShort || payload.linkedInPost || "",
      linkedInMedium: payload.linkedInMedium || payload.linkedInPost || "",
      linkedInDetailed: payload.linkedInDetailed || payload.linkedInPost || "",
      recruiterOutreach: payload.recruiterOutreach || "",
      githubProfileSnippet: payload.githubProfileSnippet || "",
      createdAt: now,
      updatedAt: now
    };
    entries.unshift(entry);
    await writePortfolio(entries);
    response.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

app.patch("/api/portfolio/:id", async (request, response, next) => {
  try {
    await ensureFeature("portfolio-tracker");
    const entries = await readPortfolio();
    const index = entries.findIndex((entry) => entry.id === request.params.id);
    if (index === -1) {
      response.status(404).json({ message: "Portfolio entry not found." });
      return;
    }

    entries[index] = {
      ...entries[index],
      ...request.body,
      id: entries[index].id,
      createdAt: entries[index].createdAt,
      updatedAt: new Date().toISOString()
    };

    await writePortfolio(entries);
    response.json(entries[index]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/portfolio/:id", async (request, response, next) => {
  try {
    await ensureFeature("portfolio-tracker");
    const entries = await readPortfolio();
    const filtered = entries.filter((entry) => entry.id !== request.params.id);
    await writePortfolio(filtered);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post("/api/create-planning-issue", async (request, response, next) => {
  try {
    const controlMode = await readControlMode();
    if (controlMode.safetyLevel === "research") {
      response.status(403).json({
        message: "Planning issues are disabled in Research Mode."
      });
      return;
    }

    const body = request.body as PlanningIssueRequest;
    const plan: DailyPlan = await readDailyPlan();
    const title = body.title || `ContributorOps daily plan ${new Date().toISOString().slice(0, 10)}`;
    const issueBody = body.body || plan.markdown;
    const result = await createPlanningIssue(title, issueBody);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

app.post("/api/draft-proposal", async (request, response, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    const controlMode = await readControlMode();
    if (controlMode.safetyLevel === "research") {
      response.status(403).json({
        message: "Draft proposal generation requires Draft Mode or Approved PR Mode."
      });
      return;
    }

    const body = request.body as DraftProposalRequest;
    response.json(buildDraftProposal(body.issue));
  } catch (error) {
    next(error);
  }
});

app.post("/api/contribute/prepare", async (request, response, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    const body = request.body as PrepareContributionRequest;
    response.json(await prepareContributionRun(body));
  } catch (error) {
    next(error);
  }
});

app.post("/api/contribute/approve-comment", async (request, response, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    response.json(await approveContributionComment(request.body as ContributionApprovalRequest));
  } catch (error) {
    const body = request.body as Partial<ContributionApprovalRequest>;
    if (body.runId) {
      await markContributionRunError(body.runId, error instanceof Error ? error.message : "Unknown comment approval error.");
    }
    next(error);
  }
});

app.post("/api/contribute/approve-branch", async (request, response, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    response.json(
      await approveContributionBranch(
        request.body as ContributionApprovalRequest & { forkOwner: string }
      )
    );
  } catch (error) {
    const body = request.body as Partial<ContributionApprovalRequest>;
    if (body.runId) {
      await markContributionRunError(body.runId, error instanceof Error ? error.message : "Unknown branch approval error.");
    }
    next(error);
  }
});

app.post("/api/contribute/approve-draft-pr", async (request, response, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    response.json(
      await approveContributionDraftPr(
        request.body as ContributionApprovalRequest & { forkOwner: string }
      )
    );
  } catch (error) {
    const body = request.body as Partial<ContributionApprovalRequest>;
    if (body.runId) {
      await markContributionRunError(body.runId, error instanceof Error ? error.message : "Unknown draft PR approval error.");
    }
    next(error);
  }
});

app.get("/api/contribute/runs", async (_request, response, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    response.json(await readContributionRuns());
  } catch (error) {
    next(error);
  }
});

app.get("/api/contribute/runs/:id", async (request, response, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    const run = (await readContributionRuns()).find((entry) => entry.id === request.params.id);
    if (!run) {
      response.status(404).json({ message: "Contribution run not found." });
      return;
    }
    response.json(run);
  } catch (error) {
    next(error);
  }
});

app.post("/api/contribute/runs/:id/cancel", async (request, response, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    response.json(await cancelContributionRun(request.params.id, request.body?.reason || "Cancelled by user."));
  } catch (error) {
    next(error);
  }
});

app.post("/api/portfolio/share", async (_request, response, next) => {
  try {
    await ensureFeature("recruiter-share-link");
    const billing = await updatePublicProfile({ publicPortfolioEnabled: true });
    await incrementUsage("recruiterShares");
    const profile = await buildPublicPortfolioProfile();
    response.json({
      slug: billing.publicPortfolioSlug,
      recruiterShareUrl: profile.recruiterShareUrl
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/portfolio/:slug", async (request, response, next) => {
  try {
    const profile = await getPublicPortfolioProfileBySlug(request.params.slug);
    const billing = await getBillingState();
    if (!billing.publicPortfolioEnabled) {
      response.status(404).json({ message: "Public portfolio is disabled." });
      return;
    }
    await incrementUsage("publicPortfolioViews");
    response.json(profile);
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/user/:username", async (request, response, next) => {
  try {
    const profile = await getPublicPortfolioProfileBySlug(request.params.username);
    const billing = await getBillingState();
    if (!billing.publicPortfolioEnabled) {
      response.status(404).json({ message: "Public portfolio is disabled." });
      return;
    }
    await incrementUsage("publicPortfolioViews");
    response.json(profile);
  } catch (error) {
    next(error);
  }
});

app.get("/api/export/github-resume", async (_request, response, next) => {
  try {
    response.json(await exportGithubResume());
  } catch (error) {
    next(error);
  }
});

app.get("/api/export-center", async (_request, response, next) => {
  try {
    response.json(await exportAllCareerAssets());
  } catch (error) {
    next(error);
  }
});

app.post("/api/pr-quality-check", async (request, response, next) => {
  try {
    await ensureFeature("pr-quality-checker");
    const issue = request.body?.issue as DraftProposalRequest["issue"] | undefined;
    if (!issue) {
      response.status(400).json({ message: "Issue is required for PR quality analysis." });
      return;
    }
    const proposal = buildDraftProposal(issue);
    response.json(proposal.prQuality);
  } catch (error) {
    next(error);
  }
});

app.get("/api/github-profile-audit", async (request, response, next) => {
  try {
    await ensureFeature("github-profile-audit");
    const username = String(request.query.username || "").trim();
    if (!username) {
      response.status(400).json({ message: "GitHub username is required." });
      return;
    }
    response.json(buildGithubProfileAudit(username));
  } catch (error) {
    next(error);
  }
});

app.get("/api/team/radar", async (_request, response, next) => {
  try {
    await ensureFeature("shared-repo-radar");
    const discovery = await discoverIssues({});
    const issues = discovery.candidates.map((candidate) => buildIssueCandidate(candidate, { targetRole: "Platform Engineer" }));
    const grouped = new Map<string, { scores: number[]; labels: string[] }>();

    for (const issue of issues) {
      const current = grouped.get(issue.repoFullName) || { scores: [], labels: [] };
      current.scores.push(issue.score);
      current.labels.push(...issue.labels);
      grouped.set(issue.repoFullName, current);
    }

    response.json(
      [...grouped.entries()].map(([repoFullName, value]) => ({
        repoFullName,
        openOpportunities: value.scores.length,
        averageScore: Math.round(value.scores.reduce((sum, score) => sum + score, 0) / value.scores.length),
        topLabels: [...new Set(value.labels)].slice(0, 3),
        whyNow: "High-signal repos with recent issues are easier to turn into visible proof of work."
      }))
    );
  } catch (error) {
    next(error);
  }
});

app.post("/api/approved-pr", async (request, response, next) => {
  try {
    await ensureFeature("approved-auto-contribute");
    const controlMode = await readControlMode();
    const activity = await readPullRequestActivity();
    const body = request.body as ApprovedPullRequestRequest;
    const result = await createApprovedDraftPullRequest(body, controlMode, activity);
    const updatedActivity = [
      {
        upstreamRepoFullName: body.issue.repoFullName,
        draftPullRequestUrl: result.draftPullRequestUrl,
        createdAt: new Date().toISOString()
      },
      ...activity
    ];
    await writePullRequestActivity(updatedActivity);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

app.post("/api/run-daily", async (_request, response, next) => {
  try {
    response.json(await runDailyPlan());
  } catch (error) {
    next(error);
  }
});

if (fs.existsSync(config.webDistPath)) {
  app.use(express.static(config.webDistPath));
  app.get("/{*path}", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      next();
      return;
    }

    response.sendFile(path.join(config.webDistPath, "index.html"));
  });
}

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({
    message: error instanceof Error ? error.message : "Unexpected server error."
  });
});

app.listen(config.port, () => {
  console.log(`ContributorOps API listening on http://localhost:${config.port}`);
});
