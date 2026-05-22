import { Router } from "express";
import { getUsageSnapshot } from "../billing.js";
import { isSupabaseMode } from "../db/index.js";
import { getUsageForUser } from "../db/usage.js";
import { getUserId } from "../auth/session.js";

const router = Router();

router.get("/usage", async (req, res, next) => {
  try {
    if (isSupabaseMode()) {
      const userId = getUserId(req);
      const metrics = await getUsageForUser(userId);
      res.json({
        weekKey: new Date().toISOString().slice(0, 10),
        generatedPlans: metrics["generatedPlans"] ?? 0,
        recruiterShares: metrics["recruiterShares"] ?? 0,
        resumeExports: metrics["resumeExports"] ?? 0,
        publicPortfolioViews: metrics["publicPortfolioViews"] ?? 0,
      });
      return;
    }
    res.json(await getUsageSnapshot());
  } catch (error) {
    next(error);
  }
});

export default router;
