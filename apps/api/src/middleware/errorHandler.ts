import type { NextFunction, Request, Response } from "express";
import { logger } from "../logger.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.headers["x-request-id"] as string | undefined;
  const message = error instanceof Error ? error.message : "Unexpected server error.";

  logger.error({
    requestId,
    method: req.method,
    path: req.path,
    err: error instanceof Error ? { message: error.message, name: error.name } : error,
  });

  // Never leak stack traces
  res.status(500).json({ message, requestId });
}
