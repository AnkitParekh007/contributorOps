import type { Request } from "express";

/** Extract the authenticated user ID from a request. Always returns a string. */
export function getUserId(req: Request): string {
  return req.userId ?? "demo-user";
}

/** Returns true if the request is from a real authenticated user (not demo). */
export function isAuthenticated(req: Request): boolean {
  return !!req.userId && req.userId !== "demo-user";
}
