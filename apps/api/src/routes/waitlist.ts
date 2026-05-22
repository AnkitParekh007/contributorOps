import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { WaitlistSchema } from "../schemas/waitlist.js";
import { isSupabaseMode } from "../db/index.js";
import { upsertWaitlistEntry } from "../db/waitlist.js";
import { logger } from "../logger.js";

const WAITLIST_PATH = path.join(process.cwd(), "data", "waitlist.json");

function readWaitlist(): Array<{
  id: string; name: string; email: string; targetRole: string;
  planInterest: string; source: string; createdAt: string;
}> {
  try {
    return JSON.parse(fs.readFileSync(WAITLIST_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeWaitlist(entries: ReturnType<typeof readWaitlist>): void {
  const dir = path.dirname(WAITLIST_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(WAITLIST_PATH, JSON.stringify(entries, null, 2));
}

const router = Router();

router.post("/waitlist", validate(WaitlistSchema), async (req, res, next) => {
  try {
    const { name, email, targetRole, planInterest, githubUsername, problemStatement, source } = req.body;

    const entries = readWaitlist();
    const existing = entries.find((e) => e.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(200).json({ message: "Already on the waitlist.", id: existing.id, alreadyRegistered: true });
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      name,
      email,
      targetRole,
      planInterest: planInterest || "Free",
      source: source || "site",
      createdAt: new Date().toISOString(),
    };
    entries.push(entry);
    writeWaitlist(entries);

    if (isSupabaseMode()) {
      try {
        await upsertWaitlistEntry({
          email,
          name,
          githubUsername: githubUsername || "",
          targetRole,
          planInterest: planInterest || "",
          problemStatement: problemStatement || "",
          source: "api",
        });
      } catch (dbErr) {
        logger.error({ err: dbErr }, "Supabase waitlist write failed");
      }
    }

    res.status(201).json({
      id: entry.id,
      name: entry.name,
      targetRole: entry.targetRole,
      planInterest: entry.planInterest,
      createdAt: entry.createdAt,
      message: "Successfully joined the waitlist.",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/waitlist/stats", (_req, res, next) => {
  try {
    const entries = readWaitlist();
    const byPlan: Record<string, number> = {};
    const byRole: Record<string, number> = {};
    for (const entry of entries) {
      byPlan[entry.planInterest] = (byPlan[entry.planInterest] || 0) + 1;
      byRole[entry.targetRole] = (byRole[entry.targetRole] || 0) + 1;
    }
    res.json({ total: entries.length, byPlan, byRole });
  } catch (error) {
    next(error);
  }
});

export default router;
