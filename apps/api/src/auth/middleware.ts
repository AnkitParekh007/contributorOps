import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

// Augment Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId: string;
      userEmail?: string;
    }
  }
}

/**
 * Validates Supabase JWT from Authorization: Bearer <token>.
 * Sets req.userId and req.userEmail on success.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    // Import dynamically to avoid circular deps with db/client
    const { getSupabaseAdmin } = await import("../db/client.js");
    const supabase = getSupabaseAdmin();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    req.userId = user.id;
    req.userEmail = user.email ?? undefined;
    next();
  } catch (err) {
    res.status(401).json({ error: "Authentication failed" });
  }
}

/**
 * Demo mode auth — injects a fixed demo user ID.
 * Used when STORAGE_MODE=demo (default).
 * All routes work without a real token.
 */
export function demoAuth(req: Request, _res: Response, next: NextFunction): void {
  req.userId = "demo-user";
  req.userEmail = "demo@contributorops.dev";
  next();
}

/**
 * Auth middleware that auto-selects based on STORAGE_MODE.
 * Import and use this in server.ts.
 */
export const authMiddleware =
  config.storageMode === "supabase" ? requireAuth : demoAuth;
