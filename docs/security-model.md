# ContributorOps Security Model

ContributorOps is an AI-assisted contribution workflow. Its highest-value security property is not that automation never writes to GitHub; it is that **an external write cannot be executed by merely generating a plan, draft, or scheduled job**.

The intended write path is:

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

## Assets to protect

ContributorOps must protect:

- GitHub credentials and authenticated GitHub actions
- Supabase credentials and authenticated sessions when configured
- the human-approval boundary for third-party writes
- the exact proposal/diff that a user reviewed
- auditability of allowed and denied write attempts
- maintainer trust: no duplicate, bulk, or scheduled contribution spam
- the dependency/build chain used to produce ContributorOps

## Trust boundaries

### 1. Planning is not authorization

Discovery, daily planning, issue ranking, draft generation, PR copy generation, and local preview are not permission to mutate an external repository.

`apps/api/src/daily.ts` is intentionally separated from contribution write primitives. Regression tests fail if scheduled planning starts referencing comment, branch, or pull-request execution functions.

The hourly OSS radar may prepare contributor-owned fork workspaces for evaluation, but it runs with `AUTO_CONTRIBUTE_ENABLED=false` and does not authorize comments, commits, or pull requests to third-party repositories.

### 2. Preparation freezes the reviewed payload

A contribution run is prepared before an external action can be approved. If the dashboard contains an edited draft proposal, preparation validates that the proposal still matches the selected issue before it becomes the run payload.

The legacy direct `/approved-pr` write route has been removed. The canonical flow is now:

`prepare → inspect → approve action → execute`

### 3. Approval is action-scoped

A newly prepared run receives independent capabilities for:

- `approve-comment`
- `approve-branch`
- `approve-draft-pr`

A capability issued for one action cannot authorize another action. For example, a comment approval token cannot open a draft pull request.

This limits the blast radius of accidental token reuse and makes the authorization decision match the action the user actually reviewed.

### 4. Legacy generic tokens fail closed

Older stored runs may contain `userApprovalToken`. ContributorOps keeps that field readable for migration/history, but it is not accepted for a new external write.

A legacy run must be re-prepared to receive action-scoped capabilities.

### 5. Explicit human intent is still required

A valid capability is not sufficient on its own. Approval validation also requires:

- the run to be in an allowed state
- `explicitApproval` to be true
- a non-empty written approval reason
- the action-specific capability to match

The downstream GitHub safety controls remain in force after approval validation.

### 6. Denied attempts are evidence

A rejected action-scoped approval is recorded as an approval event with `approved: false` when the run exists.

The run is not automatically destroyed merely because a token was wrong. This preserves evidence of the rejected attempt while allowing the user to retry the legitimate action with the correct capability.

Unexpected execution failures remain error conditions.

## External-write protections

The contribution path also applies controls such as:

- issue/repository safety checks
- duplicate-comment protection
- duplicate-PR protection
- daily comment and PR limits
- fork/branch validation
- draft pull requests rather than automatically marking work ready for review
- dry-run behavior when external contribution execution is disabled

The exact checks evolve over time, but changes must not weaken the prepare-and-approve trust boundary without explicit architectural review.

## Regression proof

`npm run test:api` includes deterministic tests for the approval boundary and hourly-radar guardrails.

Current approval regression coverage includes:

- valid scoped capability succeeds for its action
- a capability for one action cannot authorize a different action
- legacy generic run tokens cannot authorize writes
- explicit approval and written reason are mandatory
- cancelled or incorrectly staged runs cannot execute
- denied approval events are auditable
- the legacy direct `/approved-pr` route is absent
- daily planning cannot reference third-party write primitives

Tests do not require real credentials and do not write to an external repository.

## Supply-chain controls

ContributorOps layers multiple controls rather than treating one tool as comprehensive:

| Control | Purpose |
| --- | --- |
| Runtime `npm audit` | Fails CI on high/critical vulnerabilities reachable through installed production dependencies |
| Dependency Review | Prevents PRs from introducing newly vulnerable dependency changes at high severity or above |
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

Manual review remains required for authentication, credentials, GitHub write paths, dependency major upgrades, and changes to approval semantics.

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
