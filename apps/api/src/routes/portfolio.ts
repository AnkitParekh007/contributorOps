import crypto from "node:crypto";
import { Router } from "express";
import {
  buildEntitlements,
  buildPublicPortfolioProfile,
  ensureFeature,
  getBillingState,
  getPublicPortfolioProfileBySlug,
  incrementUsage,
  updatePublicProfile,
} from "../billing.js";
import { validate } from "../middleware/validate.js";
import { PortfolioEntrySchema, PortfolioUpdateSchema } from "../schemas/portfolio.js";
import { readPortfolio, writePortfolio, toExportPortfolioEntry, toHostedPortfolioWrite } from "../storage.js";
import { isSupabaseMode } from "../db/index.js";
import {
  createPortfolioEntry,
  deletePortfolioEntry,
  getPortfolioEntryById,
  updatePortfolioEntry,
} from "../db/portfolio.js";
import { getUserId } from "../auth/session.js";
import { getPublishedPortfolio, publishPublicPortfolio } from "../db/public-portfolio.js";
import type { PortfolioEntry } from "../types.js";

const router = Router();

router.get("/portfolio", async (_req, res, next) => {
  try {
    // The storage adapter returns the same editor contract in both modes,
    // with Supabase reads scoped to the verified user context.
    res.json(await readPortfolio());
  } catch (error) {
    next(error);
  }
});

router.post("/portfolio", validate(PortfolioEntrySchema), async (req, res, next) => {
  try {
    await ensureFeature("portfolio-tracker");
    if (isSupabaseMode()) {
      const userId = getUserId(req);
      const payload = req.body as Partial<PortfolioEntry>;
      const entry = await createPortfolioEntry(userId, {
        ...toHostedPortfolioWrite(payload),
        isPublic: false,
      });
      res.status(201).json(toExportPortfolioEntry(entry));
      return;
    }
    const payload = req.body as Partial<PortfolioEntry>;
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
      updatedAt: now,
    };
    entries.unshift(entry);
    await writePortfolio(entries);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

router.patch("/portfolio/:id", validate(PortfolioUpdateSchema), async (req, res, next) => {
  try {
    await ensureFeature("portfolio-tracker");
    if (isSupabaseMode()) {
      const userId = getUserId(req);
      const id = String(req.params.id);
      const existing = await getPortfolioEntryById(userId, id);
      if (!existing) {
        res.status(404).json({ message: "Portfolio entry not found." });
        return;
      }
      // Merge partial editor updates with existing proof data; never accept
      // a caller-supplied user ID or a public-publication flag.
      const entry = await updatePortfolioEntry(userId, id, {
        ...toHostedPortfolioWrite(req.body as Partial<PortfolioEntry>, existing),
        isPublic: false,
      });
      res.json(toExportPortfolioEntry(entry));
      return;
    }
    const entries = await readPortfolio();
    const id = String(req.params.id);
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) {
      res.status(404).json({ message: "Portfolio entry not found." });
      return;
    }
    entries[index] = { ...entries[index], ...req.body, id: entries[index].id, createdAt: entries[index].createdAt, updatedAt: new Date().toISOString() };
    await writePortfolio(entries);
    res.json(entries[index]);
  } catch (error) {
    next(error);
  }
});

router.delete("/portfolio/:id", async (req, res, next) => {
  try {
    await ensureFeature("portfolio-tracker");
    if (isSupabaseMode()) {
      const userId = getUserId(req);
      await deletePortfolioEntry(userId, String(req.params.id));
      res.status(204).send();
      return;
    }
    const id = String(req.params.id);
    const entries = await readPortfolio();
    await writePortfolio(entries.filter((e) => e.id !== id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/portfolio/share", async (req, res, next) => {
  try {
    await ensureFeature("recruiter-share-link");
    const billing = await updatePublicProfile({ publicPortfolioEnabled: true });
    if (isSupabaseMode()) {
      await publishPublicPortfolio(getUserId(req), billing);
      await incrementUsage("recruiterShares");
      res.json({ slug: billing.publicPortfolioSlug,
        recruiterShareUrl: `/u/${encodeURIComponent(billing.publicPortfolioSlug)}` });
      return;
    }
    await incrementUsage("recruiterShares");
    const profile = await buildPublicPortfolioProfile();
    res.json({ slug: billing.publicPortfolioSlug, recruiterShareUrl: profile.recruiterShareUrl });
  } catch (error) {
    next(error);
  }
});

router.get("/public/portfolio/:slug", async (req, res, next) => {
  try {
    if (isSupabaseMode()) {
      const profile = await getPublishedPortfolio(String(req.params.slug));
      if (!profile) {
        res.status(404).json({ message: "Public portfolio not found." });
        return;
      }
      res.json(profile);
      return;
    }
    const requested = String(req.params.slug);
    if (!/^[a-z0-9_-]{1,100}$/i.test(requested)) {
      res.status(404).json({ message: "Public portfolio not found." });
      return;
    }
    const profile = await getPublicPortfolioProfileBySlug(requested);
    const billing = await getBillingState();
    if (!billing.publicPortfolioEnabled) {
      res.status(404).json({ message: "Public portfolio is disabled." });
      return;
    }
    await incrementUsage("publicPortfolioViews");
    res.json(profile);
  } catch (error) {
    if (error instanceof Error && error.message === "Public portfolio not found.") {
      res.status(404).json({ message: "Public portfolio not found." });
      return;
    }
    next(error);
  }
});

router.get("/public/user/:username", async (req, res, next) => {
  try {
    if (isSupabaseMode()) {
      const profile = await getPublishedPortfolio(String(req.params.username));
      if (!profile) {
        res.status(404).json({ message: "Public portfolio not found." });
        return;
      }
      res.json(profile);
      return;
    }
    const requested = String(req.params.username);
    if (!/^[a-z0-9_-]{1,100}$/i.test(requested)) {
      res.status(404).json({ message: "Public portfolio not found." });
      return;
    }
    const profile = await getPublicPortfolioProfileBySlug(requested);
    const billing = await getBillingState();
    if (!billing.publicPortfolioEnabled) {
      res.status(404).json({ message: "Public portfolio is disabled." });
      return;
    }
    await incrementUsage("publicPortfolioViews");
    res.json(profile);
  } catch (error) {
    if (error instanceof Error && error.message === "Public portfolio not found.") {
      res.status(404).json({ message: "Public portfolio not found." });
      return;
    }
    next(error);
  }
});

export default router;
