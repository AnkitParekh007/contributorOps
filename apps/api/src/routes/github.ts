import { Router } from "express";
import { config } from "../config.js";
import { getUserId } from "../auth/session.js";
import { isSupabaseMode } from "../db/index.js";
import { deleteGithubToken, getGithubToken, saveGithubToken } from "../db/users.js";
import { createOAuthState, inspectOAuthState, consumeOAuthState, OAUTH_COOKIE, OAUTH_STATE_TTL_MS, readOAuthCookie } from "../db/oauth-state.js";
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
    // Identity-only OAuth until a separate user-owned GitHub write adapter is implemented.
    // Never request repository-write scopes for a read-only hosted connection.
    const scope = "read:user";
    const { state, browserBinding } = await createOAuthState(getUserId(req), scope);
    const secure = new URL(config.publicAppUrl).protocol === "https:";
    // Intentional browser-bound double-submit value, NOT a GitHub access token.
    // The DB stores only a SHA-256 verifier; this independent 256-bit nonce is
    // readable by the browser's cookie transport but not by JavaScript
    // (httpOnly), is origin-restricted and short-lived, and cannot finalize
    // OAuth without the matching one-use state and initiating user's JWT.
    // Hosted deployments must use HTTPS for the Secure attribute.
    res.cookie(OAUTH_COOKIE, browserBinding, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/api/github",
      maxAge: OAUTH_STATE_TTL_MS,
    });
    // Never allow an authenticated OAuth authorization URL to be cached.
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Referrer-Policy", "no-referrer");
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
 * GitHub redirects the browser here without a Supabase bearer token. We validate
 * the browser-bound state but DO NOT exchange the code or store a token here.
 * The first-party app must finish using its currently authenticated JWT.
 */
router.get("/github/callback", async (req, res, next) => {
  try {
    if (!isSupabaseMode()) {
      res.status(403).json({ message: "GitHub callback is disabled in demo mode." });
      return;
    }
    const code = typeof req.query.code === "string" ? req.query.code : "";
    const state = typeof req.query.state === "string" ? req.query.state : "";
    const binding = readOAuthCookie(req.headers.cookie);
    if (!code || code.length > 2048 || !state || !binding ||
        !(await inspectOAuthState(state, binding))) {
      res.status(400).json({ message: "OAuth response has a missing, invalid or expired browser-bound state." });
      return;
    }
    // Only a configured first-party origin may receive this short-lived code.
    const origin = new URL(config.allowedOrigins[0] || config.publicAppUrl).origin;
    const params = new URLSearchParams({ github_code: code, github_state: state });
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.redirect(303, `${origin}/#/onboarding?${params.toString()}`);
  } catch (error) {
    next(error);
  }
});

/**
 * Authenticated completion enforces the SAME Supabase user as initiation.
 * A different account signed into the same browser cannot consume A's nonce.
 */
router.post("/github/complete", async (req, res, next) => {
  try {
    if (!isSupabaseMode()) {
      res.status(403).json({ message: "GitHub OAuth is disabled in demo mode." });
      return;
    }
    const userId = getUserId(req);
    const code = typeof req.body?.code === "string" ? req.body.code : "";
    const state = typeof req.body?.state === "string" ? req.body.state : "";
    const binding = readOAuthCookie(req.headers.cookie);
    if (!code || code.length > 2048 || !state || !binding) {
      res.status(400).json({ message: "OAuth completion requires verified code, state and browser." });
      return;
    }
    const initiator = await consumeOAuthState(state, binding, userId);
    if (!initiator) {
      res.status(400).json({ message: "OAuth authorization belongs to a different account or is expired or already used." });
      return;
    }
    const secure = new URL(config.publicAppUrl).protocol === "https:";
    res.clearCookie(OAUTH_COOKIE, { path: "/api/github", httpOnly: true, secure, sameSite: "lax" });

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      res.status(501).json({ message: "GitHub OAuth is not configured." });
      return;
    }
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId, client_secret: clientSecret, code,
        redirect_uri: `${config.publicAppUrl.replace(/\/$/, "")}/api/github/callback`,
      }),
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
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
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
    const scopes = (tokenData.scope || "").split(",").map(s => s.trim()).filter(Boolean);
    await saveGithubToken(userId, tokenData.access_token, scopes, String(identity.id));
    res.json({ connected: true });
  } catch (error) {
    logger.error({ err: error instanceof Error ? error.message : String(error) }, "GitHub OAuth completion failed");
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
