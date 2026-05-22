import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { config } from "./config.js";
import { logger } from "./logger.js";
import { authMiddleware } from "./auth/middleware.js";
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
const PUBLIC_PATHS = new Set(["/api/health", "/api/pricing", "/api/meta", "/api/launch-offer"]);
// /api/github/callback must be public — GitHub redirects here before the user has a session
const PUBLIC_PREFIXES = ["/api/public/", "/api/waitlist", "/api/github/callback", "/api/github/connect"];

app.use("/api", (req, res, next) => {
  const isPublic =
    PUBLIC_PATHS.has(req.path) ||
    PUBLIC_PREFIXES.some((prefix) => req.path.startsWith(prefix)) ||
    req.method === "OPTIONS";
  if (isPublic) return next();
  return authMiddleware(req, res, next);
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

app.listen(config.port, () => {
  logger.info(`ContributorOps API listening on http://localhost:${config.port}`);
});
