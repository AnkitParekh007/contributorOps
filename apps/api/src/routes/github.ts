import { Router } from "express";
import { config } from "../config.js";
import { getUserId } from "../auth/session.js";
import { isSupabaseMode } from "../db/index.js";
import { deleteGithubToken, getGithubToken, saveGithubToken } from "../db/users.js";
import { createOAuthState, consumeOAuthState, OAUTH_COOKIE, OAUTH_STATE_TTL_MS, readOAuthCookie } from "../db/oauth-state.js";
import { logger } from "../logger.js";

const router = Router();

/** Return no process-level PAT status as a per-user connection. */
router.get("/github/status", async (req, res, next) => {
  try {
    if (!isSupabaseMode()) {
      res.json({ connected: false, scopes: [], demo: true });
      return;
    }
    const result = await getGithubToken(getUserId(req));
    res.json({ connected: !!result, scopes: result?.scopes ?? [] });
  } catch (error) {
    next(error);
  }
});

/**
 * Authenticated POST /api/github/connect returns an authorization URL.
 * Navigation via GET cannot present a Supabase Bearer token, so the browser
 * first requests this URL with its authenticated API client, then navigates.
 */
router.post("/github/connect", async (req, res, next) => {
  try {
    if (!isSupabaseMode()) {
      res.status(403).json({ message: "OAuth account connections require authenticated hosted mode." });
      return;
    }
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      res.status(501).json({ message: "GitHub OAuth is not configured on this server." });
      return;
    }
    const scope = req.body?.scope === "repo" ? "repo read:user" : "public_repo read:user";
    const { state, browserBinding } = await createOAuthState(getUserId(req), scope);
    const secure = new URL(config.publicAppUrl).protocol === "https:";
    res.cookie(OAUTH_COOKIE, browserBinding, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/api/github/callback",
      maxAge: OAUTH_STATE_TTL_MS,
    });
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${config.publicAppUrl.replace(/\/$/, "")}/api/github/callback`,
      scope,
      state,
    });
    res.json({ authorizationUrl: `https://github.com/login/oauth/authorize?${params.toString()}` });
  } catch (error) {
    next(error);
  }
});

/**
 * Public callback: CSRF state is random, one-use, short-lived, and tied
 * to the initiating logged-in user via an httpOnly browser-binding cookie.
 * No demo-user fallback is possible in this flow.
 */
router.get("/github/callback", async (req, res, next) => {
  const secure = new URL(config.publicAppUrl).protocol === "https:";
  try {
    if (!isSupabaseMode()) {
      res.status(403).json({ message: "GitHub callback is disabled in demo mode." });
      return;
    }
    const code = typeof req.query.code === "string" ? req.query.code : "";
    const state = typeof req.query.state === "string" ? req.query.state : "";
    const binding = readOAuthCookie(req.headers.cookie);
    if (!code || !state || !binding) {
      res.status(400).json({ message: "Missing OAuth code or verified state." });
      return;
    }

    const userId = await consumeOAuthState(state, binding);
    if (!userId) {
      res.status(400).json({ message: "OAuth state is invalid, expired, already used or belongs to another browser." });
      return;
    }
    res.clearCookie(OAUTH_COOKIE, { path: "/api/github/callback", httpOnly: true, secure, sameSite: "lax" });

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      res.status(501).json({ message: "GitHub OAuth is not configured on this server." });
      return;
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code,
        redirect_uri: `${config.publicAppUrl.replace(/\/$/, "")}/api/github/callback` }),
      signal: AbortSignal.timeout(10000),
    });
    if (!tokenRes.ok) {
      res.status(502).json({ message: "GitHub OAuth exchange unavailable." });
      return;
    }
    const tokenData = (await tokenRes.json()) as { access_token?: string; scope?: string; error?: string };
    if (tokenData.error || !tokenData.access_token) {
      res.status(400).json({ message: "GitHub OAuth token exchange failed." });
      return;
    }
    const identityRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28" },
      signal: AbortSignal.timeout(10000),
    });
    if (!identityRes.ok) {
      res.status(502).json({ message: "GitHub account identity could not be verified." });
      return;
    }
    const identity = (await identityRes.json()) as { id?: number; login?: string };
    if (!Number.isSafeInteger(identity.id) || !identity.login) {
      res.status(502).json({ message: "GitHub returned an invalid account identity." });
      return;
    }

    const scopes = (tokenData.scope || "").split(",").map((s) => s.trim()).filter(Boolean);
    await saveGithubToken(userId, tokenData.access_token, scopes, String(identity.id));

    // The return destination is server configuration, never a caller-provided URL.
    const origin = new URL(config.allowedOrigins[0] || config.publicAppUrl).origin;
    res.redirect(`${origin}/#/onboarding?github=connected`);
  } catch (error) {
    logger.error({ err: error instanceof Error ? error.message : String(error) }, "GitHub OAuth callback failed");
    next(error);
  }
});

router.delete("/github/disconnect", async (req, res, next) => {
  try {
    if (!isSupabaseMode()) {
      res.json({ message: "Demo mode has no stored account connection." });
      return;
    }
    await deleteGithubToken(getUserId(req));
    res.json({ message: "GitHub account disconnected." });
  } catch (error) {
    next(error);
  }
});

export default router;
