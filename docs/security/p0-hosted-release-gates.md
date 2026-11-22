# P0 hosted API release gates (C01–C06)

> Security remediation proposed in PR #54. **Hosted deployment is blocked** until the migration and first-party OAuth staging checks below are complete. A green unit test suite is not a substitute for staging validation.

## Current scope

| Finding | Implemented behavior | Verification and remaining gap |
| --- | --- | --- |
| C01 Express mounted-route auth | Public API permits only explicit method/path pairs. Protected endpoints require JWT; callback is public, OAuth initiation and completion protected. | Route matrix exercises real HTTP 200/401 in demo and Supabase mode; positive authenticated path exercised in multi-user test. |
| C02 OAuth CSRF/identity | 256-bit random nonce, one-time DB state, 10-minute expiry, independent httpOnly browser cookie and account-bound authenticated completion. Public callback only inspects state and forwards code to the first-party SPA fragment; token exchange occurs after a logged-in JWT confirms the original user. | Forgery, replay, expiry, wrong account and mismatched cookie tests. **Real GitHub OAuth redirect/browser cookie flow remains a staging gate.** |
| C03 Schema | Migration 003 aligns encrypted token field, adds provider-specific unique user ownership, updated timestamp and GitHub numeric provider identity. | PostgreSQL service tests apply 001 → 002 → 003 and validate uniqueness/reconnect; encrypted token round-trip tested with an emulated REST service. **Supabase-generated types, live PostgREST migrations and staging write/read test still needed.** |
| C04 Tenant isolation | A StorageRepository routes demo files only to local mode and all hosted state (runs, consent, activity, billing metadata, daily plans, portfolio and usage) through rows indexed by authenticated user ID. Hosted public portfolio only reads explicitly visible profiles and entries; waitlist writes stay in Supabase. | Two-user adversarial tests (mock Supabase REST + isolated repository), migrations with RLS and privilege checks. **Real Supabase session/RLS validation remains.** |
| C05 Token/approval boundaries | Hosted discovery uses only the authenticated user's GitHub token, and hosted startup refuses a process PAT. HTTP GitHub write routes return 403 until a user-owned execution implementation exists. Demo HTTP also cannot invoke owner GitHub writes and binds localhost only. | Negative HTTP tests show writes denied. **Hosted contribution writes intentionally unavailable** pending user-scoped ownership, operation token and entitlement tests. |
| C06 Billing escalation | Hosted mock-select-plan cannot update subscription; server builds entitlements from verified user subscription, never editable override JSON; non-active subscription falls back to free. | HTTP free-plan test and entitlement unit test. **Trusted billing webhooks must be independently verified before launching paid subscriptions.** |

## Staging release checklist

1. Create a **separate staging Supabase project** and configure its secrets only in the hosting environment: `STORAGE_MODE=supabase`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `TOKEN_ENCRYPTION_KEY`, `PUBLIC_APP_URL`, `CORS_ORIGINS`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`. Never put the service role or encryption secret into `VITE_*` browser variables.
2. Use Supabase's supported migration workflow to apply **001, 002, 003 in order**, then verify indexes, RLS policies, and an actual encrypted OAuth insert → upsert → read → disconnect cycle. The GitHub Actions PostgreSQL contract is an additional guard, not a Supabase integration replacement.
3. Test with **two real Supabase users** and two GitHub identities: start and finish a normal connection, then retry missing state, changed-browser cookie, expired state, replayed state, and a different user signed in on the same browser. Ensure no GitHub code or bearer tokens appear in logs or analytics.
4. Exercise anonymous health/pricing/waitlist/public profile requests plus unauthenticated and invalid-bearer requests to protected endpoints. Ensure only explicitly published portfolio entries are available anonymously.
5. Confirm distinct state for plans, runs, control mode, approvals, usage, portfolio and billing across user A and B. Test cross-user IDs, cancellation, export, approval and reconnection; record negative 401/403/404 outcomes.
6. Confirm mock billing upgrades always fail in hosted mode; a free user does not acquire career/team features. Verify subscriptions are changed **only by trusted billing events** before charging customers.
7. Verify production config refuses a process-wide GitHub PAT; external-write endpoints remain blocked. Do not weaken this gate just to make a demonstration work.
8. Run GitHub Actions API suite, CodeQL, Dependency Review and PostgreSQL contract on the **exact PR head SHA**. Require independent review of the OAuth and service-role code before merge.

## Non-goals and deferred capabilities

- The hosted API will **not** create GitHub comments, branches or pull requests until a separate user-token-backed execution adapter with run ownership and atomic idempotency is written and tested.
- The protected `user_scoped_state` JSONB store is a safe stopgap for tenant isolation; future relational tables should add atomic state transitions and concurrency protection.
- Demo mode is only intended for a **single trusted local user**. Do not bind it to public interfaces or deploy it as a public multi-user service.
- The API does not certify commercial billing readiness or validate a real GitHub OAuth provider until staging tests actually run.

## Evidence

- [Draft remediation PR #54](https://github.com/AnkitParekh007/contributorOps/pull/54)
- [PostgreSQL migration contract workflow](https://github.com/AnkitParekh007/contributorOps/actions/workflows/hosted-api-contract.yml)
- [P0 source audit references](https://github.com/AnkitParekh007/contributorOps/tree/main/apps/api/src)
