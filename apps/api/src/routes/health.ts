import { Router } from "express";
import { buildEntitlements, getBillingState, getUsageSnapshot } from "../billing.js";
import { config } from "../config.js";
import { readControlMode } from "../storage.js";

const router = Router();

/**
 * Report the configured Supabase project reference, derived only from the
 * canonical host. This public project identifier is not a secret or API key.
 * A custom/noncanonical endpoint remains unverified (null) so staging tests
 * fail closed rather than trusting a user-provided project label.
 */
export function configuredSupabaseProjectRef(value: string): string | null {
  try {
    const hostname = new URL(value).hostname;
    return /^([a-z0-9]{20})\.supabase\.co$/i.exec(hostname)?.[1].toLowerCase() ?? null;
  } catch {
    return null;
  }
}

router.get("/health", async (_req, res, next) => {
  try {
    if (config.storageMode === "supabase") {
      // Public readiness must never return tenant billing, controls or usage.
      res.json({ ok: true, mode: "hosted", createDailyIssue: false, autoContributeEnabled: false });
      return;
    }
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
  const hosted = config.storageMode === "supabase";
  const rawCommit = process.env.CONTRIBUTOROPS_BUILD_SHA || "";
  const releaseCommit = /^[a-f0-9]{40}$/i.test(rawCommit) ? rawCommit.toLowerCase() : null;
  res.setHeader("Cache-Control", "no-store");
  res.json({
    appName: "ContributorOps",
    version: "0.1.0",
    repo: "https://github.com/AnkitParekh007/contributorOps",
    mode: hosted ? "hosted" : config.githubToken ? "github" : "demo",
    releaseCommit,
    supabaseProjectRef: hosted ? configuredSupabaseProjectRef(config.supabaseUrl) : null,
    hostedWritesEnabled: false,
    publicAppUrl: "https://ankitparekh007.github.io/contributorOps/",
    enabledFeatures: [
      "issue-discovery",
      "daily-plan",
      "portfolio-tracker",
      "pr-quality-checker",
      "resume-export",
      "linkedin-generator",
      "interview-star-generator",
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
