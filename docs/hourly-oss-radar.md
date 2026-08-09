# Hourly AI + Frontend OSS Radar

ContributorOps can run an hourly discovery cycle that selects up to two high-signal contribution opportunities and prepares the contributor-owned GitHub workspace for each selected issue.

The two lanes are intentionally separate:

1. **AI** — AI SDKs, agent frameworks, MCP/tooling, LLM developer tooling, AI-first products, and TypeScript/JavaScript AI infrastructure.
2. **Frontend** — React, Next.js, Angular, Vite, component systems, accessibility, performance, testing, and frontend developer tooling.

The workflow is implemented by:

- `apps/api/src/hourly.ts`
- `.github/workflows/hourly-oss-radar.yml`

## What happens every hour

```text
AI discovery --------------------┐
                                 ├─> rank by issue quality + repository momentum
Frontend discovery --------------┘
                                      |
                                      v
                             reject low-signal work
                                      |
                                      v
                              live safety checks
                                      |
                        +-------------+-------------+
                        |                           |
                        v                           v
                 open issue/repo             duplicate checks
                 recent activity             no conflicting PR
                        |                           |
                        +-------------+-------------+
                                      |
                                      v
                          contribution policy scan
                                      |
                          reject explicit AI bans
                                      |
                                      v
                         same-repo/day state gate
                                      |
                                      v
                       create/reuse contributor fork
                                      |
                                      v
                              sync upstream
                                      |
                                      v
                       create/reuse contribution branch
                                      |
                                      v
                         write Actions summary/artifact
```

## What it does not do

The scheduled radar never:

- comments on an upstream issue
- opens an upstream pull request
- replies to a maintainer
- marks a pull request ready for review
- creates filler contributions to satisfy a quota

Those remain maintainer-facing actions and stay behind ContributorOps' explicit approval boundary.

## Repository momentum

The hourly runner combines the normal ContributorOps issue score with a bounded momentum score based on:

- repository stars
- repository forks
- how recently the repository was pushed

Momentum cannot rescue a weak issue. Low-signal, vanity, typo-only, duplicate, conflicting, stale, or policy-incompatible candidates are rejected before workspace preparation.

The default combined acceptance threshold is `70` and can be changed with:

```env
HOURLY_RADAR_MIN_SCORE=70
```

## Same repository once per day

The scheduled workflow stores the repositories selected during the current UTC day in:

```text
data/hourly-radar-state.json
```

GitHub Actions restores this small state file with `actions/cache` on the next hourly run. This prevents the same upstream repository from being selected more than once during the same UTC day without generating repository commits just to persist scheduler state.

The state automatically resets when the UTC date changes.

## Configure GitHub Actions

Add this repository secret:

```text
GH_CONTRIBUTOROPS_TOKEN
```

The token must belong to the contributor account and be able to read public repositories and create/sync public forks under that account.

The workflow supplies these runtime settings:

```env
GITHUB_USERNAME=<repository owner>
AUTO_WORKSPACE_ENABLED=true
AUTO_CONTRIBUTE_ENABLED=false
HOURLY_RADAR_MIN_SCORE=70
```

`AUTO_CONTRIBUTE_ENABLED=false` is deliberate. The scheduled workflow is allowed to prepare the user's own fork and branch, but it is not allowed to submit upstream PRs or comments.

## Research Mode and the scheduled workspace exception

The interactive ContributorOps flow respects the global control mode and will not prepare a workspace while the product is in Research Mode.

The hourly GitHub Actions runner uses a narrower scheduled-workspace path defined by the Safety Policy. It does **not** mutate the global control mode. Instead, it may prepare only user-owned forks and branches when all of these are true:

- `AUTO_WORKSPACE_ENABLED=true`
- a contributor GitHub token and username are configured
- live blocking safety checks pass
- no open PR already references the issue
- no explicit repository policy prohibiting AI-assisted contributions is detected
- the repository has not already been selected that UTC day

This exception applies only to user-owned workspace preparation. It does not extend to third-party writes.

## Output

Every run writes:

```text
data/hourly-radar-summary.md
data/hourly-radar-state.json
data/managed-forks.json
```

The workflow renders the summary into the GitHub Actions job summary and uploads the files as a 14-day artifact.

A selected contribution packet includes:

- category
- repository and issue
- combined score and momentum score
- repository stars/forks
- fork repository
- contribution branch
- workspace result
- likely files
- implementation plan
- test plan
- PR draft narrative

## Manual run

Locally:

```bash
npm run hourly
```

Or use **Actions → Hourly AI + Frontend OSS Radar → Run workflow** after the workflow is on the default branch.

## Schedule

The GitHub Actions schedule is:

```cron
7 * * * *
```

That means once per hour at minute `07` in UTC. GitHub scheduled workflows can start later than the nominal minute during periods of platform load; the automation should be treated as hourly cadence rather than a real-time scheduler.

See also:

- [`managed-fork-workspaces.md`](./managed-fork-workspaces.md)
- [`safety-policy.md`](./safety-policy.md)
- [`adr/0001-human-approved-external-writes.md`](./adr/0001-human-approved-external-writes.md)
