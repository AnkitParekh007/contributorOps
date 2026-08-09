# Security Policy

ContributorOps handles GitHub credentials and can perform explicitly approved external GitHub actions. Security reports that could bypass those boundaries are treated as high priority.

## Supported version

Security fixes target the current `main` branch. Older commits, local snapshots, and unreleased forks are not maintained as supported security versions.

## Reporting a vulnerability

Please do **not** publish exploit details, tokens, private repository data, or a working approval bypass in a public issue.

If GitHub shows **Report a vulnerability** in this repository's Security tab, use that private reporting flow. If private vulnerability reporting is not available, contact the repository maintainer through the GitHub profile and ask for a private channel before sharing exploit details.

A useful report includes:

- affected commit or version
- impacted component or route
- expected security boundary
- observed behavior
- minimal reproduction steps that do not target third-party repositories
- whether credentials or external GitHub writes are involved
- suggested mitigation, if known

Never include real access tokens or secrets in the report.

## High-value security boundaries

Please report issues involving:

- bypassing explicit human approval for an external GitHub write
- reusing an approval capability for a different action
- executing a write from a scheduled or daily-planning path
- creating comments, branches, commits, or pull requests without the documented approval path
- leaking GitHub, Supabase, or other credentials
- authentication or authorization bypasses
- unsafe handling of repository content or generated patches
- dependency or build-chain vulnerabilities with a credible ContributorOps impact

## Safe research expectations

Security testing should stay within repositories and accounts you control. Do not use ContributorOps to test write behavior against an unrelated third-party repository or maintainer account.

Prefer demo mode, dry-run mode, fixtures, or a repository you own when reproducing a write-path issue.

## Current security controls

The repository currently uses:

- action-scoped approval capabilities for external contribution actions
- explicit approval reasons and state checks
- duplicate-action and daily-limit guards
- approval event history, including denied attempts
- regression tests for the external-write trust boundary
- authentication middleware for protected API routes when Supabase auth is configured
- API rate limiting
- common secret-pattern scanning
- runtime dependency auditing
- pull-request dependency review
- CodeQL analysis
- Dependabot update automation
- reproducible SBOM generation with `npm run security:sbom`

These controls reduce risk; they do not prove the absence of vulnerabilities. See [`docs/security-model.md`](./docs/security-model.md) for the architecture and limitations.
