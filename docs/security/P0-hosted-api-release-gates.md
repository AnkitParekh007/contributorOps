# Hosted API P0 security release gates (C01–C06)

**State:** security remediation proposed in [PR #54](https://github.com/AnkitParekh007/contributorOps/pull/54). The production Supabase deployment is **not certified** until every staging acceptance check below has actually been witnessed.

## Implemented protections

| ID | Remediation | Automated evidence |
| --- | --- | --- |
| C01 | Method-specific public whitelist using paths relative to the Express `/api` mount; authenticated private endpoints | `auth/public-routes.test.ts`, `auth/route-matrix.integration.test.ts` |
| C02 | 256-bit state + independent httpOnly browser binding, 10-minute expiry, atomic one-use DB consumption **with current authenticated user ID**. GitHub redirects to the first-party onboarding route; only `POST /api/github/complete` with a verified Supabase bearer JWT exchanges the code and saves the GitHub identity. | `db/oauth-state.test.ts`, route-matrix JWT test |
| C03 | Forward-only migration `003_security_oauth_and_user_state.sql` reconciles token fields and provider identity uniqueness. | Disposable PostgreSQL 001→002→003 contract workflow |
| C04 | Hosted JSON-equivalent state stored in `user_scoped_state` by verified user ID; canonical hosted portfolio exports read the user-owned `portfolio_entries` records. Local demo files remain local-only. | `storage/repository.test.ts`, `storage/portfolio-export.test.ts`, database migration contract |
| C05 | HTTP external writes return 403 regardless of demo/hosted mode. Demo server defaults to loopback, unsafe token/automation combinations fail at startup. Operator CLI workflows are separate. | Route-matrix regression, source gate |
| C06 | Mock plan changes denied in hosted mode; only active, server-side subscription rows may resolve to a paid plan. Overrides from local/demo state cannot grant hosted entitlements. | `billing-entitlements.test.ts` and route-matrix checks |

## Automated CodeQL review triage (PR #54)

Two GitHub Advanced Security inline comments classify the OAuth nonce as a
password and its browser-binding cookie as cleartext sensitive storage:

- [Random-state hashing comment](https://github.com/AnkitParekh007/contributorOps/pull/54#discussion_r4659368292)
- [Browser-binding cookie comment](https://github.com/AnkitParekh007/contributorOps/pull/54#discussion_r4659409752)

**Nonce hash — likely false positive.** `createOAuthState` generates two
independent `crypto.randomBytes(32)` values (256 bits each), not
human-memorable passwords. The database stores only SHA-256 hashes of
these unguessable, ten-minute, single-use verifiers. A slow password KDF
would not improve meaningful attack resistance; it would increase
lookup/DoS cost. Unit tests assert raw values never enter stored rows.

**Cookie — intentional browser-bound secret transport, not token persistence.**
The independently generated browser binding must reach the same browser
that initiated the OAuth redirect, so it is sent as a host-only,
`HttpOnly`, `SameSite=Lax`, ten-minute cookie scoped to `/api/github`.
`Secure` is enabled under the required HTTPS production origin. The
database stores only its SHA-256 hash. It is **not** a GitHub access token,
and the cookie cannot connect an account by itself: completion additionally
requires a valid one-use state and the exact initiating user's authenticated
Supabase JWT. Authenticated authorization URLs also use `Cache-Control:
no-store` and `Referrer-Policy: no-referrer`.

These comments are documented as **potential CodeQL false positives**, not
as proof that a live hosted deployment is safe. An authorized maintainer
must examine the final code-scanning alert state and record any
false-positive dismissal separately. Do not silence CodeQL globally,
suppress the rule wholesale, remove the browser binding, or treat
green CodeQL workflow execution as evidence that alerts have been
dismissed.

## Non-negotiable staging verification

- [ ] Provision a **disposable or designated staging Supabase project** for ContributorOps. Do not apply migrations to unrelated or production databases.
- [ ] Apply migrations 001, 002, 003, verify source schema and generated Supabase TypeScript types, and run Supabase security advisors.
- [ ] Execute two **real** authenticated-user sessions. Verify A cannot read, update, approve, cancel, export, or access B's runs, consent, billing or portfolio evidence using real RLS/service-role behavior.
- [ ] Configure and check a **first-party, same-site** API/web origin for `SameSite=Lax` browser binding; ensure `PUBLIC_APP_URL` is the externally reachable API origin, and the intended web origin is first in `CORS_ORIGINS`. The server must use HTTPS in hosted deployments. In cross-site deployments the browser may block the binding cookie, and OAuth will fail closed until a supported same-site deployment is arranged.
- [ ] Run real GitHub OAuth in staging with account A: connect → GitHub redirect → authenticated `/github/complete` → token save → status → disconnect; confirm no secret material is exposed to the client.
- [ ] Repeat in the same browser after switching the active Supabase account to B: B must not complete A's pending authorization. Test missing, forged, expired, and replayed states.
- [ ] Attempt hosted public health/pricing/waitlist/callback/public portfolio and private portfolio/billing/write routes without auth, invalid bearer and two valid but different users. Confirm exact 200/201/400/401/403/404 behavior as applicable.
- [ ] As an authenticated free user, POST `/api/billing/mock-select-plan` and attempt paid features; no entitlement escalation. Only trusted subscription provisioning may grant paid features.
- [ ] Confirm no hosted HTTP GitHub write endpoint runs with a process-wide PAT. Do **not** enable hosted contribution writes until a per-user installation/token execution adapter and run-owner authorization are implemented.

## Deployment configuration and rollback

- Never expose `SUPABASE_SERVICE_KEY`, `GITHUB_CLIENT_SECRET` or `TOKEN_ENCRYPTION_KEY` to Vite/frontend environment variables.
- Do not enable `AUTO_CONTRIBUTE_ENABLED`, `AUTO_WORKSPACE_ENABLED` or `CREATE_DAILY_ISSUE` with a process-wide token in the HTTP API.
- Preserve the previous deployment/image and DB backup before migrating an existing database; migrations are forward-only and must be reviewed for pre-existing duplicate `(user_id, provider)` rows.
- A failed migration or staging security test is a **stop-ship**, not a reason to bypass RLS, loosen CORS, trust user-supplied `user_id`, or revert to a global GitHub PAT.
- Migrations should be applied in a dedicated staging environment before using hosted mode. The disposable PostgreSQL workflow proves the SQL contract, **not** real Supabase Auth/OAuth interoperability.

**No release readiness claim should be made merely from green CI.** Deployment and authenticated multi-user acceptance remain separate evidence gates.
