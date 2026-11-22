import type { Request } from "express";
import { config } from "../config.js";

/** Extract the authenticated user ID from a request. Always returns a string. */
export function getUserId(req: Request): string {
  if (req.userId) return req.userId;
  if (config.storageMode === "demo") return "demo-user";
  throw new Error("Authenticated user identity missing.");
}

/** Returns true if the request is from a real authenticated user (not demo). */
export function isAuthenticated(req: Request): boolean {
  return !!req.userId && req.userId !== "demo-user";
}
