import assert from "node:assert/strict";
import test from "node:test";
import { resolveHostedPlan } from "./billing.js";

test("hosted paid entitlements require an active trusted subscription", () => {
  assert.equal(resolveHostedPlan(null), "free");
  for (const status of ["trialing", "cancelled", "past_due", "pending"]) {
    assert.equal(resolveHostedPlan({ plan: "team", status }), "free");
  }
  for (const plan of ["free", "pro", "career", "team"] as const) {
    assert.equal(resolveHostedPlan({ plan, status: "active" }), plan);
  }
  assert.equal(resolveHostedPlan({ plan: "founder", status: "active" }), "free");
  assert.equal(resolveHostedPlan({ plan: "unexpected", status: "active" }), "free");
});
