import { Router } from "express";
import { config } from "../config.js";
import { getUserId } from "../auth/session.js";
import { isSupabaseMode } from "../db/index.js";
import { deleteGithubToken, getGithubToken, saveGithubToken } from "../db/users.js";
import { logger } from "../logger.js";

const router = Router();

/**
 * GET /api/github/status
 * Returns whether the user has a GitHub token stored and what scopes it has.
 */
router.get("/github/status", async (req, res, next) => {
  try {
    if (!isSupabaseMode()) {
      // Demo mode: report connected if GITHUB_TOKEN env var is set
      res.json({ connected: !!config.githubToken, scopes: config.githubToken ? ["public_repo"] : [], demo: true });
      return;
    }
    const userId = getUserId(req);
    const result = await getGithubToken(userId);
    res.json({ connected: !!result, scopes: result?.scopes ?? [] });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/github/connect
 * Redirects the browser to GitHub OAuth authorization.
 * Uses "public_repo" scope (read + fork + PR) unless safety level requires "repo".
 */
router.get("/github/connect", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(501).json({ message: "GitHub OAuth is not configured on this server." });
    return;
  }

  // Default scope: public_repo (sufficient for forking public repos and opening PRs)
  // If user explicitly wants private repo access they can request "repo" scope separately
  const scope = (req.query.scope === "repo" ? "repo" : "public_repo") + " read:user";
  const state = Buffer.from(JSON.stringify({ ts: Date.now() })).toString("base64url");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${config.publicAppUrl}/api/github/callback`,
    scope,
    state,
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

/**
 * GET /api/github/callback
 * GitHub redirects here after OAuth authorization.
 * Exchanges the code for a token, encrypts it, and stores it.
 */
router.get("/github/callback", async (req, res, next) => {
  try {
    const code = typeof req.query.code === "string" ? req.query.code : null;
    if (!code) {
      res.status(400).json({ message: "Missing OAuth code from GitHub." });
      return;
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      res.status(501).json({ message: "GitHub OAuth is not configured on this server." });
      return;
    }

    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const tokenData = (await tokenRes.json()) as { access_token?: string; scope?: string; error?: string };
    if (tokenData.error || !tokenData.access_token) {
      logger.error({ err: tokenData.error }, "GitHub token exchange failed");
      res.status(400).json({ message: "GitHub OAuth token exchange failed." });
      return;
    }

    const scopes = (tokenData.scope || "").split(",").map((s) => s.trim()).filter(Boolean);

    if (isSupabaseMode()) {
      const userId = getUserId(req);
      await saveGithubToken(userId, tokenData.access_token, scopes);
    }

    // Redirect back to the web app onboarding page
    const webOrigin = (config.allowedOrigins[0] || "").replace(/\/$/, "");
    res.redirect(`${webOrigin}/#/onboarding?github=connected`);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/github/disconnect
 * Removes the stored GitHub token for the current user.
 */
router.delete("/github/disconnect", async (req, res, next) => {
  try {
    if (!isSupabaseMode()) {
      res.json({ message: "Demo mode: no stored token to remove." });
      return;
    }
    const userId = getUserId(req);
    await deleteGithubToken(userId);
    res.json({ message: "GitHub account disconnected." });
  } catch (error) {
    next(error);
  }
});

export default router;
