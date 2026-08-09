# ContributorOps Security Model

ContributorOps is an AI-assisted contribution workflow. Its highest-value security property is not that automation never writes to GitHub; it is that **a generated plan or draft is never, by itself, authority to mutate an external repository**.

ContributorOps supports two deliberately separate authorization paths:

1. **Interactive approval path** — a person prepares a run, inspects the exact payload, and approves one specific external action with an action-scoped capability.
2. **Standing-authorized exact-patch path** — an operator explicitly enables bounded contribution execution and places an exact, deterministic patch plan into the repository-owned patch queue. Scheduled execution may submit that already-specified patch only after live repository-policy, duplicate, scope, rate-limit, and exact-match checks pass.

The interactive write path is:

```text
Discover / plan
    ↓
Generate or edit draft locally
    ↓
Prepare immutable contribution run
    ↓
Inspect exact action payload
    ↓
Human approves one specific action
    ↓
Action-scoped capability validated
    ↓
Safety + duplicate + daily-limit checks
    ↓
External GitHub write
    ↓
Approval/write event retained in run history
```

The standing-authorized patch path is:

```text
Discover / evaluate candidate
    ↓
Prepare exact patch plan in repository-owned queue
    ↓
Operator has explicitly enabled AUTO_CONTRIBUTE_ENABLED
    ↓
Validate bounded file/replacement scope
    ↓
Re-check live issue, repository policy, duplicate PRs, and daily limits
    ↓
Require every exact replacement to match exactly once
    ↓
Create/update managed fork branch
    ↓
Open draft PR with automation disclosure
    ↓
Record execution result
```

## Assets to protect

ContributorOps must protect:

- GitHub credentials and authenticated GitHub actions
- Supabase credentials and authenticated sessions when configured
- the authorization boundary for third-party writes
- the exact proposal/diff or exact patch plan that was authorized
- auditability of allowed and denied write attempts
- maintainer trust: no duplicate, bulk, deceptive, or unconstrained contribution activity
- the dependency/build chain used to produce ContributorOps

## Trust boundaries

### 1. Planning is not authorization

Discovery, daily planning, issue ranking, draft generation, PR copy generation, and local preview are not permission to mutate an external repository.

`apps/api/src/daily.ts` is intentionally separated from contribution write primitives. Regression tests fail if daily planning starts referencing comment, branch, or pull-request execution functions.

The hourly OSS radar may discover candidates and prepare contributor-owned fork workspaces. A normal radar run is not itself authority to submit maintainer-facing content.

Standing-authorized patch execution is a separate path. It requires `AUTO_CONTRIBUTE_ENABLED=true`, a repository-owned patch-queue item containing the exact intended changes, and the deterministic execution checks described below. A candidate merely appearing in discovery or hourly-radar output cannot trigger a pull request.

### 2. Interactive preparation freezes the reviewed payload

A contribution run is prepared before an interactive external action can be approved. If the dashboard contains an edited draft proposal, preparation validates that the proposal still matches the selected issue before it becomes the run payload.

The legacy direct `/approved-pr` write route has been removed. The canonical interactive flow is now:

`prepare → inspect → approve action → execute`

### 3. Interactive approval is action-scoped

A newly prepared interactive run receives independent capabilities for:

- `approve-comment`
- `approve-branch`
- `approve-draft-pr`

A capability issued for one action cannot authorize another action. For example, a comment approval token cannot open a draft pull request.

This limits the blast radius of accidental token reuse and makes the authorization decision match the action the user actually reviewed.

### 4. Legacy generic tokens fail closed

Older stored runs may contain `userApprovalToken`. ContributorOps keeps that field readable for migration/history, but it is not accepted for a new interactive external write.

A legacy run must be re-prepared to receive action-scoped capabilities.

### 5. Explicit human intent is still required for interactive writes

A valid capability is not sufficient on its own. Interactive approval validation also requires:

- the run to be in an allowed state
- `explicitApproval` to be true
- a non-empty written approval reason
- the action-specific capability to match

The downstream GitHub safety controls remain in force after approval validation.

### 6. Standing authorization is exact-patch scoped

Standing authorization does not grant the scheduler permission to invent arbitrary repository changes. The patch queue must already contain a concrete patch plan with bounded files, exact text replacements, commit metadata, PR copy, and test evidence.

Before execution ContributorOps validates, among other things:

- one to four changed files per queued patch
- bounded replacement counts and total changed-character budget
- safe relative paths
- no placeholder/no-op patch content
- an open, non-archived upstream issue/repository
- repository contribution-policy checks, including detected prohibitions on AI-assisted work
- no open PR already referencing the issue
- no same-repository ContributorOps PR already opened that day
- the configured daily PR cap
- every old-text replacement matches current branch content exactly once

A mismatch fails closed instead of applying a fuzzy or guessed patch.

The standing path opens **draft** pull requests and includes an automation disclosure. It does not mark PRs ready for review or reply to maintainers automatically.

### 7. Denied attempts are evidence

A rejected action-scoped interactive approval is recorded as an approval event with `approved: false` when the run exists.

The run is not automatically destroyed merely because a token was wrong. This preserves evidence of the rejected attempt while allowing the user to retry the legitimate action with the correct capability.

Patch-queue execution records submitted, blocked, and error results so unattended execution remains inspectable.

Unexpected execution failures remain error conditions.

## External-write protections

The contribution paths apply controls such as:

- issue/repository safety checks
- duplicate-comment or duplicate-PR protection where applicable
- daily comment and PR limits
- fork/branch validation
- draft pull requests rather than automatically marking work ready for review
- dry-run behavior when external contribution execution is disabled
- exact-match patch application for standing-authorized queue execution

Changes must not weaken either authorization boundary without explicit architectural review.

## Regression proof

`npm run test:api` includes deterministic tests for interactive approval, hourly-radar guardrails, managed-fork behavior, executable patch safety, and patch-queue validation.

Current approval regression coverage includes:

- valid scoped capability succeeds for its action
- a capability for one action cannot authorize a different action
- legacy generic run tokens cannot authorize writes
- explicit approval and written reason are mandatory
- cancelled or incorrectly staged runs cannot execute
- denied approval events are auditable
- the legacy direct `/approved-pr` route is absent
- daily planning cannot reference third-party write primitives

Current standing-patch coverage includes:

- focused exact patch plans are accepted
- unsafe paths and placeholder proposal content are rejected
- ambiguous or missing exact-text matches fail closed
- queue items require valid issue/repository metadata and executable patch plans

Tests do not require real credentials and do not write to an external repository.

## Supply-chain controls

ContributorOps layers multiple controls rather than treating one tool as comprehensive:

| Control | Purpose |
| --- | --- |
| Runtime `npm audit` | Fails CI on high/critical vulnerabilities reachable through installed production dependencies |
| Dependency Review | Prevents PRs from introducing newly vulnerable dependency changes at high severity or above when GitHub Dependency Graph is enabled |
| Dependabot | Produces regular npm and GitHub Actions update proposals |
| CodeQL | Static analysis for JavaScript/TypeScript security issues |
| Secret-pattern scan | Rejects common accidentally committed credential patterns |
| SBOM command | `npm run security:sbom` produces a CycloneDX software bill of materials |

A full `npm audit` is also available through `npm run security:audit`. It is useful for maintenance, including development-tool findings, but the runtime audit is the deterministic merge gate because production reachability matters most for application risk.

## Security automation boundaries

Security automation is evidence, not a security guarantee.

The current controls do **not** prove:

- the absence of every vulnerability
- that a dependency advisory is exploitable in ContributorOps
- that a clean secret-pattern scan means no secret can ever be committed
- that CodeQL covers every design flaw
- that browser or infrastructure configuration is production hardened
- that local JSON persistence is suitable for multi-user production workloads
- that every future GitHub API permission is least-privilege by default
- that deterministic patch checks substitute for maintainer judgment after a draft PR is opened

Manual review remains required for authentication, credentials, GitHub write-path changes, dependency major upgrades, changes to interactive approval semantics, or expansion of the standing-authorized patch envelope.

## Dependency findings and remediation policy

When an audit reports a vulnerability:

1. identify the package and dependency path
2. distinguish runtime from development-only reachability
3. determine the first non-vulnerable version
4. prefer compatible upgrades over force-upgrades
5. document any remaining blocker and reachability
6. rerun trust tests, type checks, builds, site quality, Lighthouse, and runtime dependency audit

Do not use `npm audit fix --force` merely to obtain a green check.

## Responsible testing

Tests for external-write behavior should use fixtures, dry-run mode, or repositories controlled by the tester. ContributorOps should never turn security validation into unsolicited activity against third-party maintainers.

See [`SECURITY.md`](../SECURITY.md) for vulnerability reporting guidance and [`docs/safety-policy.md`](./safety-policy.md) for the broader automation policy.
