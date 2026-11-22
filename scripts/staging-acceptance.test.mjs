import assert from "node:assert/strict";
import test from "node:test";
import { validateStagingConfig, runStagingAcceptance } from "./staging-acceptance.mjs";

const safe = {
  STAGING_ATTESTATION: "I_CONFIRM_ISOLATED_CONTRIBUTOROPS_STAGING",
  STAGING_API_URL: "https://api.staging.contributorops.example",
  STAGING_WEB_URL: "https://app.staging.contributorops.example",
  STAGING_SUPABASE_PROJECT_REF: "a".repeat(20),
  STAGING_MODE: "public",
};

test("never contact a production, local, HTTP or unspecified destination", () => {
  for (const change of [
    { STAGING_ATTESTATION: "" },
    { STAGING_API_URL: "https://api.contributorops.example" },
    { STAGING_WEB_URL: "https://app.contributorops.example" },
    { STAGING_API_URL: "http://api.staging.contributorops.example" },
    { STAGING_API_URL: "https://api.staging.contributorops.example:8080" },
    { STAGING_API_URL: "https://api.staging.contributorops.example/wrong" },
    { STAGING_WEB_URL: "https://attacker@web.staging.contributorops.example" },
    { STAGING_SUPABASE_PROJECT_REF: "" },
    { STAGING_MODE: "unknown" },
  ]) {
    assert.throws(() => validateStagingConfig({ ...safe, ...change }), /./);
  }
  assert.equal(validateStagingConfig(safe).mode, "public");
});

test("two-user mode is blocked without both distinct user tokens and explicit mutation consent", () => {
  assert.throws(() => validateStagingConfig({ ...safe, STAGING_MODE: "two-user" }), /approval/);
  const approved = { ...safe, STAGING_MODE: "two-user",
    STAGING_MUTATION_APPROVAL: "ALLOW_TEMPORARY_TEST_CONTROL_MODE_ONLY" };
  assert.throws(() => validateStagingConfig(approved), /two different/i);
  assert.throws(() => validateStagingConfig({
    ...approved, STAGING_USER_A_TOKEN: "same", STAGING_USER_B_TOKEN: "same",
  }), /two different/i);
});

function mockStagingFetch({ leak = false, escalate = false, denyCleanup = false } = {}) {
  const states = {
    A: { safetyLevel: "research", approvalRequired: false, lastUpdatedAt: "baseline-a" },
    B: { safetyLevel: "research", approvalRequired: false, lastUpdatedAt: "baseline-b" },
  };
  const calls = [];
  async function fetcher(input, opts = {}) {
    const url = new URL(input), path = url.pathname, method = opts.method || "GET";
    const token = String(opts.headers?.Authorization || "").replace("Bearer ", "");
    const user = token === "jwt-a" ? "A" : token === "jwt-b" ? "B" : null;
    calls.push({ path, method, user });
    const json = (status, body = {}) => new Response(JSON.stringify(body), {
      status, headers: { "content-type": "application/json" },
    });
    if (url.hostname === "app.staging.contributorops.example") {
      return new Response('<html><div id="root"></div></html>', {
        status: 200, headers: { "content-type": "text/html" },
      });
    }
    if (path === "/api/health") return json(200, { status: "ok" });
    if (path === "/api/pricing") return json(200, []);
    if (path.startsWith("/api/public/")) return json(404, { message: "Not found" });
    if (path === "/api/github/callback") return json(400, { message: "Bad state" });
    if (path === "/api/waitlist") return json(400, { message: "Required fields" });
    if (!user) return json(401, { message: "Unauthorized" });
    if (path === "/api/billing") return json(200, {
      billing: { plan: escalate ? "team" : "free" },
    });
    if (path === "/api/billing/mock-select-plan") return json(403);
    if (path === "/api/contribute/approve-comment" || path === "/api/create-planning-issue") {
      return json(403);
    }
    if (path === "/api/portfolio" && method === "GET") return json(200, []);
    if (path === "/api/control-mode" && method === "GET") {
      return json(200, user === "B" && leak ? states.A : states[user]);
    }
    if (path === "/api/control-mode" && method === "POST") {
      const level = JSON.parse(opts.body).safetyLevel;
      if (denyCleanup && level === "research") return json(500);
      states[user] = { safetyLevel: level, approvalRequired: false, lastUpdatedAt: level + "-time" };
      return json(200, states[user]);
    }
    throw new Error(`Mock route not implemented: ${method} ${path}`);
  }
  return { fetcher, calls, getState: (user) => states[user] };
}

test("public acceptance never mutates real data or fetches user tokens", async () => {
  const mock = mockStagingFetch();
  const result = await runStagingAcceptance(safe, mock.fetcher);
  assert.equal(result.mode, "public");
  assert.equal(result.passed, 12);
  assert.ok(result.notVerified.some(x => x.includes("OAuth")));
  assert.ok(mock.calls.every(x => x.method === "GET" ||
    x.path === "/api/waitlist" || x.path === "/api/github/complete" ||
    x.path === "/api/billing/mock-select-plan"));
  assert.ok(mock.calls.every(x => x.user === null));
});

test("two-user staging acceptance detects independent control state and restores A", async () => {
  const mock = mockStagingFetch();
  const env = { ...safe, STAGING_MODE: "two-user",
    STAGING_MUTATION_APPROVAL: "ALLOW_TEMPORARY_TEST_CONTROL_MODE_ONLY",
    STAGING_USER_A_TOKEN: "jwt-a", STAGING_USER_B_TOKEN: "jwt-b" };
  const result = await runStagingAcceptance(env, mock.fetcher);
  assert.equal(result.mode, "two-user");
  assert.ok(result.passed > 20);
  assert.equal(mock.getState("A").safetyLevel, "research");
  assert.equal(mock.getState("B").safetyLevel, "research");
  assert.ok(mock.calls.some(x => x.path === "/api/control-mode" && x.method === "POST" && x.user === "A"));
  assert.ok(mock.calls.every(x => x.method !== "DELETE"));
});

test("a cross-user control-state leak causes a failure, not a false green report", async () => {
  const mock = mockStagingFetch({ leak: true });
  const env = { ...safe, STAGING_MODE: "two-user",
    STAGING_MUTATION_APPROVAL: "ALLOW_TEMPORARY_TEST_CONTROL_MODE_ONLY",
    STAGING_USER_A_TOKEN: "jwt-a", STAGING_USER_B_TOKEN: "jwt-b" };
  await assert.rejects(() => runStagingAcceptance(env, mock.fetcher), /Cross-user state leak/);
  assert.equal(mock.getState("A").safetyLevel, "research", "restore runs after a failed isolation check");
});

test("unexpected paid entitlement escalation aborts staging acceptance", async () => {
  const mock = mockStagingFetch({ escalate: true });
  const env = { ...safe, STAGING_MODE: "two-user",
    STAGING_MUTATION_APPROVAL: "ALLOW_TEMPORARY_TEST_CONTROL_MODE_ONLY",
    STAGING_USER_A_TOKEN: "jwt-a", STAGING_USER_B_TOKEN: "jwt-b" };
  await assert.rejects(() => runStagingAcceptance(env, mock.fetcher), /must have a free subscription/);
});
