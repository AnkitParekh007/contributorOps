# Safety Policy

## Human approval model

ContributorOps is designed as a human-approved contribution intelligence platform. It helps users prepare better contribution work, but it does not replace judgment, honesty, or approval.

## External repository restrictions

- No mass-commenting
- No mass-opening pull requests
- No deceptive or inaccurate contribution activity
- No scheduled writes to third-party repositories

## Managed contributor workspaces

ContributorOps may provision a contribution workspace **inside the authenticated user's own GitHub account** when `AUTO_WORKSPACE_ENABLED=true` and the candidate has passed the blocking safety checks.

The allowed unattended workspace operations are deliberately limited to:

- create or reuse the user's fork of the selected public upstream repository
- verify that a same-name repository is actually a fork of the expected upstream
- wait for GitHub's asynchronous fork creation to become ready
- sync the fork's default branch from upstream
- create or reuse the prepared contribution branch in that fork
- record the fork and branch in the local managed-fork registry

These workspace operations are not maintainer-facing submissions. They do **not** grant permission to comment on issues, open upstream pull requests, mark pull requests ready for review, or reply to maintainers automatically.

ContributorOps will never overwrite a same-name repository that is not the expected fork.

## Scheduled jobs

Scheduled jobs may discover opportunities and generate plans. When managed workspace automation is explicitly enabled, they may also prepare user-owned forks and contribution branches after safety validation.

Scheduled jobs must not write comments, pull requests, reviews, or other content to third-party repositories.

## Approval requirements

- External comments require approval
- External draft PRs require approval
- Exact maintainer-facing actions must be previewed before execution
- Managed fork/workspace preparation requires explicit operator opt-in through `AUTO_WORKSPACE_ENABLED=true`, but does not require per-fork approval once enabled

## Rate limits

ContributorOps is designed to cap noisy behavior and preserve maintainer trust. That includes one-PR-per-repo-per-day style limits and broader daily caps in approved flows.

Workspace provisioning does not bypass any PR or comment rate limit.

## Maintainer trust principles

- Relevance to a real issue
- Honest drafts
- Clear test evidence
- Minimal, focused diffs
- No promotional or job-seeking spam inside maintainer workflows
- Reuse existing forks instead of creating disposable repositories
- Never race or duplicate an existing contributor's implementation
