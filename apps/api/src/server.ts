import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { config } from "./config.js";
import { logger } from "./logger.js";
import { authMiddleware } from "./auth/middleware.js";
import { isPublicApiRequest } from "./auth/public-routes.js";
import { withUserContext } from "./auth/request-context.js";
import { hostedExternalWriteGate } from "./auth/hosted-policy.js";
import { verifyApiStartupPolicy } from "./auth/startup-policy.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestId } from "./middleware/requestId.js";
import { standardLimiter } from "./middleware/rateLimiter.js";

import healthRouter from "./routes/health.js";
import pricingRouter from "./routes/pricing.js";
import waitlistRouter from "./routes/waitlist.js";
import billingRouter from "./routes/billing.js";
import usageRouter from "./routes/usage.js";
import portfolioRouter from "./routes/portfolio.js";
import discoveryRouter from "./routes/discovery.js";
import controlModeRouter from "./routes/controlMode.js";
import contributeRouter from "./routes/contribute.js";
import githubRouter from "./routes/github.js";
import onboardingRouter from "./routes/onboarding.js";

const app = express();

// ── Security + observability ────────────────────────────────────────────────
app.use(helmet());
app.use(requestId);
app.use(pinoHttp({ logger }));

// ── CORS + body parsing ──────────────────────────────────────────────────────
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));

// ── Rate limiting ────────────────────────────────────────────────────────────
app.use("/api", standardLimiter);

// ── Auth middleware ──────────────────────────────────────────────────────────
app.use("/api", (req, res, next) => {
  if (isPublicApiRequest(req.method, req.path)) return next();
  void authMiddleware(req, res, () => {
    if (config.storageMode === "supabase") {
      withUserContext(req.userId, next);
    } else {
      next();
    }
  });
});

// Hosted GitHub writes are unavailable until they use user-owned credentials.
// All other protected routes still require verified Supabase JWTs.
const HOSTED_GITHUB_WRITE_PATHS = new Set([
  "/create-planning-issue",
  "/run-daily",
  "/contribute/prepare",
  "/contribute/approve-comment",
  "/contribute/approve-branch",
  "/contribute/approve-draft-pr",
]);
app.use("/api", (req, res, next) => {
  if (HOSTED_GITHUB_WRITE_PATHS.has(req.path)) {
    return hostedExternalWriteGate(req, res, next);
  }
  next();
});

// ── Route modules ────────────────────────────────────────────────────────────
app.use("/api", healthRouter);
app.use("/api", pricingRouter);
app.use("/api", waitlistRouter);
app.use("/api", billingRouter);
app.use("/api", usageRouter);
app.use("/api", portfolioRouter);
app.use("/api", discoveryRouter);
app.use("/api", controlModeRouter);
app.use("/api", contributeRouter);
app.use("/api", githubRouter);
app.use("/api", onboardingRouter);

// ── Static web app ───────────────────────────────────────────────────────────
if (fs.existsSync(config.webDistPath)) {
  app.use(express.static(config.webDistPath));
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(config.webDistPath, "index.html"));
  });
}

// ── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// Demo mode must not be remotely reachable with a fixed unauthenticated identity.
// Explicitly configure API_HOST only for an authenticated Supabase deployment.
const host = process.env.API_HOST || (config.storageMode === "demo" ? "127.0.0.1" : "0.0.0.0");
verifyApiStartupPolicy({
  storageMode: config.storageMode,
  nodeEnv: process.env.NODE_ENV || "development",
  host,
  publicAppUrl: config.publicAppUrl,
  allowedOrigins: config.allowedOrigins,
  supabaseUrl: config.supabaseUrl,
  supabaseServiceKey: config.supabaseServiceKey,
  tokenEncryptionKey: config.tokenEncryptionKey,
  githubToken: config.githubToken,
  githubClientId: process.env.GITHUB_CLIENT_ID || "",
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  createDailyIssue: config.createDailyIssue,
  autoContributeEnabled: config.autoContributeEnabled,
  autoWorkspaceEnabled: config.autoWorkspaceEnabled,
});
app.listen(config.port, host, () => {
  logger.info(`ContributorOps API listening on http://${host}:${config.port}`);
});
