# ADR-0001: Human-approved external GitHub writes

**Status:** Accepted

## Context

ContributorOps helps developers discover and prepare open-source contributions. Some workflows may eventually create comments, branches, commits, or draft pull requests on repositories the user does not maintain.

Unattended write automation creates material risks:
- spam and maintainer burden
- duplicated or low-quality activity
- accidental writes to the wrong repository or issue
- misleading contribution claims
- loss of user and maintainer trust

## Decision

Any external GitHub write must require explicit human approval for the exact action being performed.

Research and planning may run without write approval. Scheduled jobs may discover, score, and prepare work, but they must not perform unattended external writes.

Before an approved write, the implementation should apply deterministic scope/safety checks and preserve audit evidence of the action.

## Consequences

### Positive
- keeps a human accountable for external activity
- reduces spam and duplicate-action risk
- makes the product easier to audit and explain
- creates a clear trust boundary for future features

### Negative
- limits fully autonomous contribution throughput
- adds interaction steps to contribution flows
- requires approval state and audit handling in the API/product UX

## Alternatives considered

### Fully autonomous writes
Rejected because contribution volume is not the product goal and the maintainer-trust risk is too high.

### Repository-level blanket approval
Not adopted as the default because broad approval weakens the exact-action boundary. A future version could propose narrower policy-based approvals through a new ADR.

## Invariant

New features must not bypass this decision through scheduled jobs, hidden API paths, or UI-only assumptions. Replacing this invariant requires an explicit superseding ADR and corresponding safety-policy change.