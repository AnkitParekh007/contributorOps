import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { runDailyPlan } from "./daily.js";
import { createPlanningIssue, discoverIssues } from "./github.js";
import { buildDailyPlan, buildIssueCandidate } from "./planner.js";
import { readDailyPlan, readPortfolio, writeDailyPlan, writePortfolio } from "./storage.js";
import type { DailyPlan, DiscoveryFilters, PlanningIssueRequest, PortfolioEntry } from "./types.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    mode: config.githubToken ? "github" : "demo",
    createDailyIssue: config.createDailyIssue
  });
});

app.post("/api/discover", async (request, response, next) => {
  try {
    const filters = request.body as Partial<DiscoveryFilters>;
    const discovery = await discoverIssues(filters);
    const issues = discovery.candidates
      .map(buildIssueCandidate)
      .sort((left, right) => right.score - left.score);
    const dailyPlan = buildDailyPlan(issues);
    await writeDailyPlan(dailyPlan);
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
      resumeBullet: payload.resumeBullet || "",
      linkedInPost: payload.linkedInPost || "",
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
