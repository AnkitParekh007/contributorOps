import type { RequestHandler } from "express";
import { config } from "../config.js";

/**
 * Hosted contribution writes require a user-bound GitHub execution adapter.
 * The current runner still uses a process-wide PAT, so fail closed in hosted mode.
 * Never silently turn a global token into per-user authorization.
 */
export const hostedExternalWriteGate: RequestHandler = (req, res, next) => {
  if (config.storageMode === "supabase") {
    res.status(403).json({
      message: "Hosted GitHub writes are disabled until per-user credential binding and run ownership are verified."
    });
    return;
  }
  next();
};
