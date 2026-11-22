/**
 * ContributorOps real staging HTTP acceptance.
 * Fail closed: no discovery of credentials, no production host, no external GitHub writes.
 * "public" is strictly non-mutating; "two-user" requires explicit isolated test accounts
 * and only creates and deletes a temporary internal portfolio fixture.
 */
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const STAGING_HOST = /(^|[.-])(staging|stage|preview)([.-]|$)/i;
const STAGING_ACK = "I_CONFIRM_ISOLATED_CONTRIBUTOROPS_STAGING";
const MUTATION_ACK = "ALLOW_TEMPORARY_TEST_PORTFOLIO_ONLY";

function parseSecureOrigin(value, name) {
  if (!value) throw new Error(`Missing ${name}`);
  let url;
  try { url = new URL(value); } catch { throw new Error(`${name} must be an HTTPS origin`); }
  if (url.protocol !== "https:" || !url.hostname || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash || url.port) {
    throw new Error(`${name} must be a bare public HTTPS origin with no credentials, path, query or custom port`);
  }
  if (!STAGING_HOST.test(url.hostname)) {
    throw new Error(`${name} host must explicitly identify staging or preview (production domains are rejected)`);
  }
  return url.origin;
}

export function validateStagingConfig(env = process.env) {
  if (env.STAGING_ATTESTATION !== STAGING_ACK) {
    throw new Error("Owner staging attestation is required before any network request");
  }
  const api = parseSecureOrigin(env.STAGING_API_URL, "STAGING_API_URL");
  const web = parseSecureOrigin(env.STAGING_WEB_URL, "STAGING_WEB_URL");
  const ref = env.STAGING_SUPABASE_PROJECT_REF || "";
  if (!/^[a-z0-9]{20}$/.test(ref)) {
    throw new Error("An explicitly designated 20-character staging Supabase project reference is required");
  }
  const mode = env.STAGING_MODE || "public";
  if (!["public", "two-user"].includes(mode)) throw new Error("STAGING_MODE must be public or two-user");
  if (mode === "two-user") {
    if (env.STAGING_MUTATION_APPROVAL !== MUTATION_ACK) {
      throw new Error("Two-user isolation requires explicit temporary-portfolio mutation approval");
    }
    if (!env.STAGING_USER_A_TOKEN || !env.STAGING_USER_B_TOKEN ||
        env.STAGING_USER_A_TOKEN === env.STAGING_USER_B_TOKEN) {
      throw new Error("Two different staging-only authenticated test user access tokens are required");
    }
  }
  return { api, web, ref, mode, tokenA: env.STAGING_USER_A_TOKEN, tokenB: env.STAGING_USER_B_TOKEN };
}

async function check(fetcher, checks, base, path, expected, opts = {}) {
  const { method = "GET", token, body } = opts;
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetcher(base + path, {
    method, headers, redirect: "manual", signal: AbortSignal.timeout(12000),
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (response.status !== expected) {
    // Never echo response bodies, JWTs, Set-Cookie, or OAuth codes into CI logs.
    throw new Error(`${method} ${path}: expected HTTP ${expected}, received ${response.status}`);
  }
  checks.push({ method, path: path.split("?")[0], expected, passed: true });
  if (expected === 204) return null;
  const text = await response.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function runPublicChecks(config, fetcher = fetch) {
  const checks = [];
  const health = await check(fetcher, checks, config.api, "/api/health", 200);
  if (!health || typeof health !== "object") throw new Error("Health route did not return JSON");
  const pricing = await check(fetcher, checks, config.api, "/api/pricing", 200);
  if (!Array.isArray(pricing)) throw new Error("Pricing route did not return an array");
  await check(fetcher, checks, config.api, "/api/public/portfolio/staging-probe-absent-00001", 404);
  await check(fetcher, checks, config.api, "/api/public/user/staging-probe-absent-00001", 404);
  await check(fetcher, checks, config.api, "/api/github/callback?code=invalid&state=invalid", 400);
  await check(fetcher, checks, config.api, "/api/waitlist", 400, { method: "POST", body: {} });
  await check(fetcher, checks, config.api, "/api/portfolio", 401);
  await check(fetcher, checks, config.api, "/api/billing", 401);
  await check(fetcher, checks, config.api, "/api/github/status", 401);
  await check(fetcher, checks, config.api, "/api/github/complete", 401, {
    method: "POST", body: { code: "invalid", state: "invalid" },
  });
  await check(fetcher, checks, config.api, "/api/billing/mock-select-plan", 401, {
    method: "POST", body: { plan: "team" },
  });
  // The web app must load from its own HTTPS origin, not silently redirect elsewhere.
  const web = await fetcher(config.web + "/", {
    method: "GET", redirect: "manual", signal: AbortSignal.timeout(12000),
    headers: { Accept: "text/html" },
  });
  if (web.status !== 200) throw new Error(`GET web origin: expected 200, received ${web.status}`);
  const html = await web.text();
  if (!html.includes('id="root"')) throw new Error("React web root not present in the staging HTML");
  checks.push({ method: "GET", path: "web origin", expected: 200, passed: true });
  return checks;
}

async function portfolioList(config, fetcher, checks, token) {
  const result = await check(fetcher, checks, config.api, "/api/portfolio", 200, { token });
  if (!Array.isArray(result)) throw new Error("Hosted portfolio did not return an editor-record array");
  return result;
}

export async function runTwoUserChecks(config, fetcher = fetch) {
  if (config.mode !== "two-user" || !config.tokenA || !config.tokenB) {
    throw new Error("Two-user acceptance requires explicit staging setup");
  }
  const checks = [];
  const tokenA = config.tokenA, tokenB = config.tokenB;
  // Test tokens must be for free staging-only accounts, not paid or real users.
  for (const [label, token] of [["A", tokenA], ["B", tokenB]]) {
    const billing = await check(fetcher, checks, config.api, "/api/billing", 200, { token });
    if (billing?.billing?.plan !== "free") throw new Error(`Staging user ${label} must have a free subscription`);
    await portfolioList(config, fetcher, checks, token);
  }
  await check(fetcher, checks, config.api, "/api/billing/mock-select-plan", 403, {
    method: "POST", token: tokenA, body: { plan: "team" },
  });
  const afterBilling = await check(fetcher, checks, config.api, "/api/billing", 200, { token: tokenA });
  if (afterBilling?.billing?.plan !== "free") throw new Error("Mock plan request escalated free user A");
  // Even a valid test user cannot invoke GitHub writes from the hosted HTTP API.
  await check(fetcher, checks, config.api, "/api/contribute/approve-comment", 403, {
    method: "POST", token: tokenA, body: {},
  });
  await check(fetcher, checks, config.api, "/api/create-planning-issue", 403, {
    method: "POST", token: tokenB, body: {},
  });

  const marker = `staging-acceptance-${crypto.randomUUID()}`;
  let createdId;
  let failed = false;
  try {
    const created = await check(fetcher, checks, config.api, "/api/portfolio", 201, {
      method: "POST", token: tokenA,
      body: { selectedRepo: "contributorops/staging-fixture", status: "planned", notes: marker,
        resumeBullet: "Temporary staging acceptance fixture (deleted after test)" },
    });
    if (!created || typeof created.id !== "string") throw new Error("Staging portfolio creation did not return a record ID");
    createdId = created.id;
    const own = await portfolioList(config, fetcher, checks, tokenA);
    if (!own.some(x => x.id === createdId && x.notes === marker)) {
      throw new Error("Owner A cannot read its own created portfolio fixture");
    }
    const other = await portfolioList(config, fetcher, checks, tokenB);
    if (other.some(x => x.id === createdId || x.notes === marker)) {
      throw new Error("Cross-user data leak: B can read A's portfolio");
    }
    await check(fetcher, checks, config.api, `/api/portfolio/${encodeURIComponent(createdId)}`, 404, {
      method: "PATCH", token: tokenB, body: { notes: "unauthorized-cross-user-write" },
    });
    const verified = await portfolioList(config, fetcher, checks, tokenA);
    if (!verified.some(x => x.id === createdId && x.notes === marker)) {
      throw new Error("Cross-user mutation: A's record changed after B's rejected PATCH");
    }
  } catch (e) {
    failed = true;
    throw e;
  } finally {
    if (createdId) {
      // Always attempt owner cleanup even if a cross-user assertion failed.
      try {
        await check(fetcher, checks, config.api, `/api/portfolio/${encodeURIComponent(createdId)}`, 204, {
          method: "DELETE", token: tokenA,
        });
      } catch (cleanupError) {
        if (!failed) throw cleanupError;
        throw new Error("Staging check failed and fixture cleanup failed; inspect test database", { cause: cleanupError });
      }
    }
  }
  return checks;
}

export async function runStagingAcceptance(env = process.env, fetcher = fetch) {
  const config = validateStagingConfig(env);
  const checks = await runPublicChecks(config, fetcher);
  if (config.mode === "two-user") checks.push(...await runTwoUserChecks(config, fetcher));
  const result = {
    timestamp: new Date().toISOString(), mode: config.mode,
    apiOrigin: config.api, webOrigin: config.web,
    stagingProjectRef: config.ref, passed: checks.length, checks,
    // Explicitly NOT proving live OAuth, Supabase RLS or migration history.
    notVerified: [
      "real GitHub OAuth browser callback and same-account nonce binding",
      "Supabase migration history and security advisors",
      "database-direct RLS under authenticated/anon roles",
      "cross-user run, approval and control-state mutation coverage",
      "hosting rollback, disaster recovery and billing webhook authenticity",
    ],
  };
  if (env.STAGING_REPORT_PATH) writeFileSync(env.STAGING_REPORT_PATH, JSON.stringify(result, null, 2) + "\n", { mode: 0o600 });
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await runStagingAcceptance();
    console.log(`PASS ${result.passed} staging HTTP checks (${result.mode}); outstanding gates listed in report`);
  } catch (error) {
    console.error(`STAGING ACCEPTANCE FAILED: ${error instanceof Error ? error.message : "Unknown error"}`);
    process.exitCode = 1;
  }
}
