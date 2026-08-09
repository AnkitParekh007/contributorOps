# Safety Policy

## Human approval and standing authorization model

ContributorOps is designed around explicit operator authorization, bounded execution, and maintainer trust. It helps users prepare better contribution work, but it does not replace judgment, honesty, repository policy, or safety checks.

ContributorOps supports two separate execution models:

- **Interactive contribution runs** require per-action human approval before maintainer-facing writes.
- **Standing-authorized exact-patch runs** may execute unattended only when the operator has explicitly enabled contribution execution and a concrete patch plan has already been placed in the repository-owned patch queue.

A discovered issue, generated plan, draft, or hourly-radar result is not by itself authorization to write to a third-party repository.

## External repository restrictions

- No mass-commenting
- No mass-opening pull requests
- No deceptive or inaccurate contribution activity
- No unconstrained generated changes submitted on a schedule
- No automatic maintainer replies or ready-for-review transitions
- No bypass of repository contribution policies or duplicate checks

## Managed contributor workspaces

ContributorOps may provision a contribution workspace **inside the authenticated user's own GitHub account** when `AUTO_WORKSPACE_ENABLED=true` and the candidate has passed the blocking safety checks.

The allowed unattended workspace operations include:

- create or reuse the user's fork of the selected public upstream repository
- verify that a same-name repository is actually a fork of the expected upstream
- wait for GitHub's asynchronous fork creation to become ready
- sync the fork's default branch from upstream
- create or reuse the prepared contribution branch in that fork
- record the fork and branch in the local managed-fork registry

ContributorOps will never overwrite a same-name repository that is not the expected fork.

## Scheduled jobs

Scheduled discovery/radar jobs may discover opportunities, generate plans, and prepare user-owned workspaces.

When `AUTO_CONTRIBUTE_ENABLED=true`, a separate standing-authorized patch-queue workflow may also submit a **pre-authored exact patch plan** as a draft pull request. This is allowed only when all deterministic checks pass, including:

- the queued item names a specific open issue
- the upstream repository is not archived
- detected repository policy does not prohibit AI-assisted contributions
- no open PR already references the issue
- ContributorOps has not already opened a PR for that repository that day
- the configured daily PR limit has not been reached
- the patch stays within bounded file/replacement limits
- every exact replacement matches the current source exactly once
- the PR remains a draft and includes automation disclosure

The scheduler may execute the queued plan; it may not invent a materially different patch when the exact plan no longer matches. Ambiguity or drift fails closed.

## Approval requirements

- Interactive external comments require per-action approval
- Interactive external draft PRs require per-action approval
- Interactive maintainer-facing actions must be previewed before execution
- Managed fork/workspace preparation requires explicit operator opt-in through `AUTO_WORKSPACE_ENABLED=true`, but does not require per-fork approval once enabled
- Standing-authorized exact-patch execution requires explicit operator opt-in through `AUTO_CONTRIBUTE_ENABLED=true` plus a concrete repository-owned patch-queue item
- Expanding the standing authorization beyond the exact-patch envelope requires architectural review

## Rate limits

ContributorOps is designed to cap noisy behavior and preserve maintainer trust. That includes one-PR-per-repo-per-day protection and broader daily caps in approved or standing-authorized flows.

Workspace provisioning does not bypass any PR or comment rate limit.

## Maintainer trust principles

- Relevance to a real, currently open issue
- Honest drafts and automation disclosure
- Clear test evidence
- Minimal, focused diffs
- Exact-match execution rather than fuzzy unattended edits
- No promotional or job-seeking spam inside maintainer workflows
- Reuse existing forks instead of creating disposable repositories
- Never race or duplicate an existing contributor's implementation
- Respect repository-level restrictions on AI-assisted contributions
