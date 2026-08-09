# Managed Fork Workspaces

ContributorOps can automatically prepare the user-owned GitHub workspace needed for a high-confidence open-source contribution without writing anything to the upstream maintainer repository.

## Goal

Remove the recurring manual fork-creation blocker from the contribution flow while preserving the core ContributorOps trust boundary.

The managed workspace lifecycle is:

```text
candidate passes safety gates
  -> find or create user fork
  -> verify fork parent
  -> wait for GitHub fork readiness
  -> sync fork default branch from upstream
  -> create or reuse contribution branch
  -> record managed fork
  -> continue draft preparation
```

Upstream comments and pull requests remain approval-gated.

## Enable it

Set the following in `apps/api/.env` for local operation:

```env
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
GITHUB_USERNAME=YOUR_GITHUB_USERNAME
AUTO_WORKSPACE_ENABLED=true
```

For scheduled GitHub Actions, store the token as `GH_CONTRIBUTOROPS_TOKEN` and expose the flag to the job:

```yaml
env:
  GH_CONTRIBUTOROPS_TOKEN: ${{ secrets.GH_CONTRIBUTOROPS_TOKEN }}
  GITHUB_USERNAME: AnkitParekh007
  AUTO_WORKSPACE_ENABLED: "true"
```

The token must be able to read public repositories and create/sync repositories under the authenticated contributor account. For a user-owned public OSS automation workflow, a GitHub OAuth token or a carefully scoped PAT is more reliable than a GitHub App installation token because the target upstream repositories are not installed into your app.

## Optional timing controls

Fork creation is asynchronous on GitHub. ContributorOps polls until the fork repository and its default branch are available.

```env
FORK_READY_TIMEOUT_MS=45000
FORK_POLL_INTERVAL_MS=1500
```

The defaults are 45 seconds and 1.5 seconds respectively.

## Safety behavior

Workspace provisioning runs only when all of these are true:

- `AUTO_WORKSPACE_ENABLED=true`
- the requested contribution mode is not Research Mode
- the global control mode is not Research Mode
- GitHub credentials and username are configured
- there are no failed blocking safety checks

A workspace failure does not manufacture or submit a contribution. ContributorOps records a warning on the contribution run and leaves the run available for inspection/retry.

## Same-name repository protection

Before creating a fork, ContributorOps checks `GITHUB_USERNAME/<upstream-repo-name>`.

If that repository already exists, ContributorOps verifies both:

- GitHub reports it as a fork
- its parent is the expected upstream repository

If either check fails, provisioning stops. ContributorOps never overwrites an unrelated same-name repository.

## Fork reuse and synchronization

Existing valid forks are reused. Before creating the contribution branch, ContributorOps uses GitHub's upstream synchronization endpoint so the branch starts from the current fork default branch rather than a stale fork snapshot.

This means repeated contributions to the same upstream repository reuse one durable fork.

## Managed fork registry

ContributorOps stores local workspace metadata in:

```text
data/managed-forks.json
```

Each entry records:

- upstream repository
- fork repository
- fork owner
- default branch
- whether ContributorOps originally created the fork
- active contribution branch names
- last sync time
- last use time
- active/dormant status

The registry is an operational cache; GitHub remains the source of truth for whether a fork actually exists.

## Dormant forks

The registry supports marking forks dormant, but this implementation does not delete forks automatically.

That is intentional. A fork can retain useful PR history and can be reused for later contributions. Any future cleanup policy should require all of the following before deletion is considered:

- no open pull requests
- no active contribution branches
- no unique user work that would be lost
- a substantial inactivity period

## Trust boundary

Allowed without per-repository approval after the operator enables managed workspaces:

- fork under the user's account
- sync the fork
- create/reuse a branch under the user's account

Still requires explicit human approval:

- issue comments
- upstream pull requests
- review replies
- ready-for-review transitions
- other maintainer-facing writes

See [`safety-policy.md`](./safety-policy.md) for the canonical policy.
