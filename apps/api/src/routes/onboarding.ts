import { Router } from "express";
import { isSupabaseMode } from "../db/index.js";
import { getGithubToken } from "../db/users.js";
import { getUserId } from "../auth/session.js";
import { readControlMode, readPortfolio } from "../storage.js";
import { getPortfolioByUser } from "../db/portfolio.js";
import { config } from "../config.js";

const router = Router();

/**
 * GET /api/onboarding/status
 * Returns a lightweight checklist of whether the user has completed key setup steps.
 */
router.get("/onboarding/status", async (req, res, next) => {
  try {
    let githubConnected = false;
    let safetyModeSet = false;
    let firstRunComplete = false;

    if (isSupabaseMode()) {
      const userId = getUserId(req);
      const [token, controlMode, portfolio] = await Promise.all([
        getGithubToken(userId),
        readControlMode(),
        getPortfolioByUser(userId),
      ]);
      githubConnected = !!token;
      safetyModeSet = controlMode.safetyLevel !== "research";
      firstRunComplete = portfolio.length > 0;
    } else {
      // Demo mode: GitHub connected if token env var is set
      const [controlMode, portfolio] = await Promise.all([readControlMode(), readPortfolio()]);
      githubConnected = !!config.githubToken;
      safetyModeSet = controlMode.safetyLevel !== "research";
      firstRunComplete = portfolio.length > 0;
    }

    res.json({ githubConnected, safetyModeSet, firstRunComplete });
  } catch (error) {
    next(error);
  }
});

export default router;
