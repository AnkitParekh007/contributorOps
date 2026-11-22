import type { Request } from "express";

/** Path is relative to Express's /api mount. No prefix based public write access. */
export function isPublicApiRequest(method: string, path: string): boolean {
  if (method === "OPTIONS") return true;
  if (method === "GET") {
    if (["/health", "/pricing", "/meta", "/launch-offer", "/github/callback", "/waitlist/stats"].includes(path)) return true;
    return /^\/public\/(portfolio|user)\/[^/]+$/.test(path);
  }
  return method === "POST" && path === "/waitlist";
}

export function apiAccessMode(req: Pick<Request, "method" | "path">): "public" | "protected" {
  return isPublicApiRequest(req.method, req.path) ? "public" : "protected";
}
