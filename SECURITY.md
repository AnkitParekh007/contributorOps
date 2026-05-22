# Security Policy

## Supported Versions

ContributorOps is currently in Founder Preview. Security fixes are applied to the `main` branch.

## Reporting a Vulnerability

Please do **not** open a public GitHub Issue for security vulnerabilities.

To report a security issue:
1. Open a [GitHub Security Advisory](https://github.com/AnkitParekh007/contributorOps/security/advisories/new) on this repository.
2. Describe the vulnerability, reproduction steps, and potential impact.
3. You will receive a response within 7 business days.

## Security Model

ContributorOps is designed with the following security properties:

- **No external GitHub writes without explicit human approval** — the approval gate is enforced in code
- **No shared credentials for user actions** — each user's GitHub token is their own (Phase 5+)
- **No mass automation** — rate limits and approval gates prevent bulk external writes
- **Audit logs** — every external action is logged with user ID, timestamp, and GitHub result URL

## Known Limitations (Preview Phase)

The following are known gaps that will be addressed in upcoming phases:

- No user authentication (Phase 3)
- Server-level GitHub token (per-user OAuth in Phase 5)
- JSON file storage (Postgres in Phase 3)
- No rate limiting on API endpoints (Phase 4)
- No Stripe webhook signature verification (Phase 7)

These limitations make the product unsuitable for production use with real user data. See the [Project Status](./README.md#project-status) section in README.md.
