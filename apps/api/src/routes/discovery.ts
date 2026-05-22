import { Router } from "express";
import { ensurePlanGenerationAllowed, incrementUsage } from "../billing.js";
import { discoverIssues } from "../github.js";
import { buildDailyPlan, buildIssueCandidate } from "../planner.js";
import { readDailyPlan, writeDailyPlan } from "../storage.js";
import { validate } from "../middleware/validate.js";
import { DiscoveryFiltersSchema } from "../schemas/discovery.js";
import { isSupabaseMode } from "../db/index.js";
import { saveDiscoveredIssues } from "../db/discovery.js";
import { getUserId } from "../auth/session.js";

const router = Router();

router.post("/discover", validate(DiscoveryFiltersSchema), async (req, res, next) => {
  try {
    await ensurePlanGenerationAllowed();
    const filters = req.body;
    const discovery = await discoverIssues(filters);
    const issues = discovery.candidates
      .map((candidate) => buildIssueCandidate(candidate, { targetRole: filters.targetRole }))
      .sort((a, b) => b.score - a.score);
    const dailyPlan = buildDailyPlan(issues);
    await writeDailyPlan(dailyPlan);
    await incrementUsage("generatedPlans");
    if (isSupabaseMode()) {
      const userId = getUserId(req);
      try {
        await saveDiscoveredIssues(
          userId,
          issues.map((i) => ({
            id: i.id,
            repo: i.repoFullName,
            number: i.issueNumber,
            title: i.issueTitle,
            htmlUrl: i.issueUrl,
            score: i.score,
            labels: i.labels,
          }))
        );
      } catch {
        // non-fatal
      }
    }
    res.json({ mode: discovery.mode, issues, dailyPlan });
  } catch (error) {
    next(error);
  }
});

router.get("/daily-plan", async (_req, res, next) => {
  try {
    res.json(await readDailyPlan());
  } catch (error) {
    next(error);
  }
});

export default router;
