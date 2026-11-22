import type { NextFunction, Request, Response } from "express";
import { logger } from "../logger.js";
import { toPublicApiError } from "./apiError.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.headers["x-request-id"] as string | undefined;
  const publicError = toPublicApiError(error);
  const logFields = {
    requestId,
    method: req.method,
    path: req.path,
    statusCode: publicError.statusCode,
    err: error instanceof Error ? { message: error.message, name: error.name } : error,
  };

  if (publicError.statusCode >= 500) logger.error(logFields);
  else logger.warn(logFields);

  if (res.headersSent) {
    next(error);
    return;
  }
  res.status(publicError.statusCode).json({
    code: publicError.code,
    message: publicError.message,
    requestId,
  });
}
