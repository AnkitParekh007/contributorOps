# ContributorOps — isolated staging acceptance runbook

> **Status (23 November 2026): not yet production-certified.** P0 security and P1 portfolio/API reliability changes are merged, but [issue #58](https://github.com/AnkitParekh007/contributorOps/issues/58) still requires a real ContributorOps-owned staging project and verified browser/database acceptance.

## What this phase delivers

The [manual staging acceptance workflow](../../.github/workflows/staging-acceptance.yml) and [script](../../scripts/staging-acceptance.mjs) make a subset of the P0 release gates repeatable, observable and auditable.

There are two explicit modes. **Public** executes strictly non-mutating public HTTP checks, including intentionally invalid requests (no waitlist registration, no GitHub OAuth token exchange). **Two-user** requires two designated free staging test users, and probes owner-scoped control-mode state: A's temporary change must not affect B, then A is restored to Research mode. Portfolio editing requires a paid entitlement and is explicitly **not** covered by this automated mode. Nothing invokes a real GitHub repository-write endpoint successfully.

**A green staging HTTP run is not, by itself, proof of production readiness.** The workflow does not apply migrations, create users, change billing, grant access, provision infrastructure, verify database-direct RLS or complete real GitHub browser OAuth.

## 1. Prepare the environment (maintainer-only)

1. Designate an isolated **ContributorOps staging** Supabase project. Do not reuse the connected projects named Amaze Project, angular-copilot or bm-agent-foundry. Get explicit owner approval for region and any infrastructure cost *before* provisioning. Do not use a production database.
2. Apply migrations `001_initial_schema.sql`, `002_rls_policies.sql`, and `003_security_oauth_and_user_state.sql` to that staging project. Generate Supabase types from **that exact project**, audit schema/RLS grants, run security advisors and retain dated evidence. CI's disposable PostgreSQL contract is a different check.
3. Deploy the API and React web application to distinct explicitly named HTTPS **staging** origins (e.g. `https://api.staging.example.org` and `https://app.staging.example.org`), keeping them same-site so the OAuth HttpOnly/SameSite cookie is sent with `credentials: include`.
4. Configure the API with `STORAGE_MODE=supabase`, staging-only Supabase service key and URL, an unpredictable token-encryption key, explicit HTTPS `PUBLIC_APP_URL`, `CORS_ORIGINS` and OAuth app ID/secret. Never put a service key or OAuth client secret in Vite variables.
5. Keep `GH_CONTRIBUTOROPS_TOKEN`, `GITHUB_TOKEN`, `AUTO_CONTRIBUTE_ENABLED`, `AUTO_WORKSPACE_ENABLED` and `CREATE_DAILY_ISSUE` absent or disabled in the hosted HTTP service. Its external-write endpoints must still return HTTP 403.
6. In the repository, create GitHub **Environment → `contributorops-staging`**, restrict deployment branches to `main` and configure an authorized reviewer/approval gate when supported by your GitHub plan. Configure environment **variables** `STAGING_API_URL`, `STAGING_WEB_URL` (bare HTTPS origins with `staging` or `preview` in their hostname), `STAGING_SUPABASE_PROJECT_REF` (the actual staging project ID), and `STAGING_EXPECTED_SHA` (the **exact deployed commit**, 40 lowercase hexadecimal characters). Set the deployed API's `CONTRIBUTOROPS_BUILD_SHA` to that exact same commit as part of the build/release configuration. A value entered here is an operator attestation, *not* cryptographic proof of project ownership.
7. For the two-user run only, create two isolated **free** test identities A and B. Store their **short-lived JWT access tokens** as environment secrets `STAGING_USER_A_TOKEN` and `STAGING_USER_B_TOKEN`. Never store JWTs, OAuth codes or service-role keys in repository files, PR descriptions or workflow inputs.

Neither staging environment nor project is inferred automatically from other connected services.

## 2. Execute the manual workflow

Open [GitHub Actions → ContributorOps staging acceptance (manual, fail closed)](https://github.com/AnkitParekh007/contributorOps/actions/workflows/staging-acceptance.yml) and click **Run workflow** on `main`.

First run **`public`** and explicitly tick `confirm_staging`. The script refuses missing attestations, unconfigured project references or deployed-commit identity, non-HTTPS/origin URLs and hosts lacking `staging` or `preview`. It also checks `GET /api/meta` reports `mode: hosted`, `hostedWritesEnabled: false` and the exact expected SHA, rather than accidentally verifying an outdated build. It does not run automatically for a push, PR or cron event. If GitHub creates an empty environment implicitly, checks fail before network access because required variables are missing.

When public acceptance passes, refresh both test-user JWTs and select **`two-user`**, enabling `allow_control_mode_mutation` deliberately. Both test accounts must start on the **free plan** in **Research mode**. The script:

- Requires two distinct staging-user tokens and explicit authorization for a temporary internal state change;
- Confirms both users are free, and that the mock billing upgrade remains 403;
- Confirms authenticated hosted GitHub writes remain 403;
- Reads the baseline control mode for A and B, changes A to Draft mode, and verifies B's state is unchanged;
- Restores A to Research mode even if a cross-user assertion fails.

**Important:** The free tier does not include `portfolio-tracker`. Attempting an A-owned portfolio creation with free credentials would fail for entitlement reasons rather than prove isolation. Create additional *explicitly entitled staging-only users* and perform the paid-portfolio create/read/foreign-PATCH/delete test as separate manual release evidence. Do not bypass the feature gate or grant paid subscriptions through a public mock-plan API.

A failed control-mode restoration requires manual review of the test account's safety settings before further runs. These tests use *isolated test users only*; they never mutate real users.

Successful runs attach a **sanitized JSON evidence artifact** (14-day retention) with the observed HTTP statuses, deployed SHA, timestamp, mode and staging origins; no tokens or OAuth codes. Retain durable evidence elsewhere if the release audit requires longer retention.

## 3. Complete the acceptance this workflow cannot automate

- **Real GitHub OAuth:** In a real browser as A, connect → callback → authenticated `POST /api/github/complete` → status → reconnect → disconnect. Capture only redacted screenshots/statuses, not tokens, cookies or authorization codes. Attempt forged/missing/expired/replayed state and same-browser A→B account switch; every negative attempt must fail.
- **Database-direct RLS:** With staging-only `anon` and authenticated PostgREST sessions, verify the actual grants/policies for portfolio rows, subscriptions, OAuth states/accounts, audit, approvals and `user_scoped_state`. Do not mistake service-role user predicates for tested RLS.
- **Broader API owner isolation:** Test A/B on control mode, daily plans, contribution run ownership, approvals, billing, published portfolio and export endpoints, including malicious IDs. The automated check covers only A/B control-mode isolation, not portfolio or run ownership.
- **Secrets and subscription events:** Verify encrypted token persistence/retrieval/disconnect, free-to-paid changes only through trusted billing events, invalid token rejection and deletion/retention policies.
- **Operations:** Confirm environment settings, GitHub Dependency Graph (#21), secure logs, backup/rollback plan, staging monitoring, error rate/latency budgets and manual rollback of hosted deployments. Do not enable hosted GitHub write features until a separate user-owned credential adapter has been reviewed.

## 4. Release decision

Issue #58 is complete only after **all** relevant HTTP, real Supabase, browser OAuth, two-user authorization and operations evidence links are attached and reviewed. Use the [P0 release-gates checklist](./P0-hosted-api-release-gates.md) for the full matrix.

The GitHub Pages marketing site and source release may remain available independently. **Production activation of the authenticated hosted API, billing and GitHub writes is a separate decision.** A passing unit test, green CodeQL job or merge does not activate a feature.
