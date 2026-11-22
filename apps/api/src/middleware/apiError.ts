/** Expected client errors have an explicitly safe public message.
 * Unexpected exceptions never leak SQL, provider, or internal error details.
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    if (!Number.isInteger(statusCode) || statusCode < 400 || statusCode >= 500) {
      throw new RangeError("An API client error must use a 4xx status");
    }
    if (!/^[A-Z][A-Z0-9_]{2,63}$/.test(code)) {
      throw new TypeError("API error code must be a stable uppercase identifier");
    }
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function toPublicApiError(error: unknown): {
  statusCode: number;
  code: string;
  message: string;
} {
  if (error instanceof ApiError) {
    return { statusCode: error.statusCode, code: error.code, message: error.message };
  }
  return {
    statusCode: 500,
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  };
}
