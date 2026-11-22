# Phase 11 — ContributorOps staging database provisioning evidence

**Date:** 23 November 2026 (Asia/Kolkata)  
**Scope:** Isolated database staging only; no hosted API deployment, paid billing activation, or GitHub write enablement.

## Project and cost

- Project: **ContributorOps Staging**
- Organization: **AnkitParekh007's Org** (`mephnlxqsvrvmqgsnvqs`)
- Project ref: `tckrlgsercznivfayffb`
- Region: `ap-south-1` (Mumbai, India)
- Project endpoint (public identifier, not secret): `https://tckrlgsercznivfayffb.supabase.co`
- Quoted project-creation cost from the connected Supabase pricing tool: **$0 per month**, approved before provisioning. Actual account usage and future limits are separate; no claim of unlimited free resources.
- Project status after creation: `ACTIVE_HEALTHY`, PostgreSQL 17.
- Pre-migration inspection: **zero application tables** and **zero migration entries**. None of the existing unrelated projects were modified.

## Applied schema and verifications

All four migration calls returned `success: true` on this project, in order:

1. `001_initial_schema`
2. `002_rls_policies`
3. `003_security_oauth_and_user_state`
4. `004_restrict_auth_trigger_rpc` — required after security advisors discovered exposed direct RPC privileges on two `SECURITY DEFINER` Auth provisioning trigger functions.

The migration inventory confirmed four committed entries on the isolated project. A separate table inventory confirmed **20 application tables with RLS enabled** and zero application rows at inspection.

After migration 004, SQL confirmed `anon` and `authenticated` **cannot execute** `public.handle_new_user()` or `public.handle_new_subscription()`, while the service role retains execution permissions. The follow-up Supabase security advisors no longer flagged privileged trigger RPC execution.

**Security-advisor notes:** Six `INFO`-severity findings remain for `RLS Enabled No Policy` on `billing_events`, `oauth_accounts`, `oauth_states`, `user_scoped_state`, `waitlist_entries`, and `webhook_events`. This is intentional default-deny access for server-only tables, not an invitation to add public policies. Independently verify service-role grants as part of end-to-end staging tests. Health advisors returned no findings.

TypeScript schema types were generated from the live staging database and committed to `supabase/generated/database.types.ts` for reference. Wiring the generated database type into all API queries requires a separate compile-safe change.

## Outstanding release evidence (do not mark production-ready)

- [ ] Design and deploy the API and React web app to explicit **same-site HTTPS staging hostnames** with approved DNS control and protected environment variables.
- [ ] Configure the environment's `STAGING_APPROVED_DOMAIN`, `STAGING_API_URL`, `STAGING_WEB_URL`, `STAGING_SUPABASE_PROJECT_REF`, and deployed `STAGING_EXPECTED_SHA`.
- [ ] Create two independent staging-only Supabase Auth test users, test token verification and cross-user API ownership, and collect real evidence without exposing tokens.
- [ ] Verify user creation triggers really create profile + free subscription rows.
- [ ] Complete real browser GitHub OAuth connect/complete/reconnect/disconnect and forged/replayed/account-switch tests.
- [ ] Validate database-direct RLS with `anon` and `authenticated` roles and distinguish it from service-role application checks.
- [ ] Test portfolio, plans, approvals, billing and exports across A/B users; retain sanitized evidence.
- [ ] Confirm rollback, backups, monitoring and cost limits before broader activation.
- [ ] Keep externally reachable GitHub write features and real payment processing **disabled**.

Refer to [issue #58](https://github.com/AnkitParekh007/contributorOps/issues/58) and [the operations runbook](./staging-acceptance-operations.md). A healthy database and passing SQL schema checks **do not certify** a production API.
