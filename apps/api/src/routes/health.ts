import { Router } from "express";
import { buildEntitlements, getBillingState, getUsageSnapshot } from "../billing.js";
import { config } from "../config.js";
import { readControlMode } from "../storage.js";

const router = Router();

router.get("/health", async (_req, res, next) => {
  try {
    const [controlMode, billing, usage] = await Promise.all([
      readControlMode(),
      getBillingState(),
      getUsageSnapshot(),
    ]);
    res.json({
      ok: true,
      mode: config.githubToken ? "github" : "demo",
      createDailyIssue: config.createDailyIssue,
      autoContributeEnabled: config.autoContributeEnabled,
      controlMode,
      billing,
      usage,
      entitlements: buildEntitlements(billing),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/meta", (_req, res) => {
  res.json({
    appName: "ContributorOps",
    version: "0.1.0",
    repo: "https://github.com/AnkitParekh007/contributorOps",
    mode: config.githubToken ? "github" : "demo",
    publicAppUrl: "https://ankitparekh007.github.io/contributorOps/",
    enabledFeatures: [
      "issue-discovery",
      "daily-plan",
      "portfolio-tracker",
      "pr-quality-checker",
      "resume-export",
      "linkedin-generator",
      "interview-star-generator",
      "safe-auto-contribute",
      "public-portfolio",
      "team-radar",
    ],
  });
});

router.get("/launch-offer", (_req, res) => {
  res.json({
    name: "Founder Lifetime",
    price: 99,
    currency: "USD",
    billing: "one-time",
    status: "waitlist",
    tagline: "Lifetime access for early supporters",
    benefits: [
      "Everything in Career plan",
      "Lifetime access — no recurring charges",
      "Priority feature requests",
      "Founder Discord channel access",
      "Direct input on product roadmap",
      "Grandfathered pricing forever",
    ],
    note: "Payments are not live yet. Join the waitlist to be notified at launch.",
  });
});

export default router;
