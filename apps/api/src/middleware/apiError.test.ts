import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, toPublicApiError } from "./apiError.js";

test("known plan entitlements are 403, not generic API failures", () => {
  const denied = new ApiError(403, "FEATURE_NOT_INCLUDED", "Your plan does not include this feature.");
  assert.deepEqual(toPublicApiError(denied), {
    statusCode: 403,
    code: "FEATURE_NOT_INCLUDED",
    message: "Your plan does not include this feature.",
  });
});

test("usage limits are 429 with a stable client error code", () => {
  assert.equal(toPublicApiError(new ApiError(429, "WEEKLY_PLAN_LIMIT", "Weekly limit reached.")).statusCode, 429);
  assert.equal(toPublicApiError(new ApiError(429, "WEEKLY_PLAN_LIMIT", "Weekly limit reached.")).code, "WEEKLY_PLAN_LIMIT");
});

test("unexpected database/provider exceptions are redacted from public responses", () => {
  const unsafe = new Error("service_role: unexpected database connection secret in logs");
  assert.deepEqual(toPublicApiError(unsafe), {
    statusCode: 500,
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  });
  assert.equal(toPublicApiError({ token: "private" }).message, "Internal server error");
});

test("invalid custom error definitions cannot accidentally report successful or 500 responses", () => {
  assert.throws(() => new ApiError(200, "INVALID", "no"), /4xx/);
  assert.throws(() => new ApiError(500, "INVALID", "no"), /4xx/);
  assert.throws(() => new ApiError(403, "lowercase", "no"), /uppercase/);
});
