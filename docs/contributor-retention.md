# Contributor Retention Playbook

ContributorOps should not treat a first pull request as the end of the contributor journey. The goal is to make useful contributors want to return because the project is clear, respectful, and worth improving.

## Retention principles

- respond with specific technical context, not generic praise
- keep starter issues genuinely scoped
- explain why requested changes matter
- acknowledge non-code contributions
- never use artificial contribution volume as a success metric
- preserve the human-approval and maintainer-trust constraints during growth

## First contribution experience

Before a newcomer starts:

- issue has a concrete outcome
- acceptance criteria are testable
- likely files/surfaces are named when helpful
- local validation commands are current
- safety implications are stated when relevant

During review:

- separate blocking feedback from optional suggestions
- explain project conventions rather than assuming them
- avoid expanding scope mid-PR unless necessary
- recognize useful investigation even when implementation needs revision

After merge:

- thank the contributor in the PR/release context
- include meaningful external contributions in release notes when a release is published
- suggest one adjacent issue only when it genuinely matches their contribution area

## Maintainer service goals

These are operating goals, not guarantees:

- acknowledge new focused issues within roughly two business days when possible
- acknowledge first-time contributor PRs within roughly two business days when possible
- do not leave requested changes ambiguous
- close or re-scope starter issues that are no longer good newcomer work
- keep at least three well-scoped starter issues available when the backlog supports it

## Contribution ladder

### Level 1 — first scoped fix

Examples:

- accessibility
- documentation
- small UI state
- test coverage
- isolated bug fix

Goal: learn the repo and complete the contribution loop successfully.

### Level 2 — owned surface

Examples:

- improve Share Hub accessibility
- extend recruiter evidence UX
- improve adoption dashboard resilience
- add CI validation around a focused workflow

Goal: understand a feature area and its tradeoffs.

### Level 3 — architecture contribution

Examples:

- persistence evolution
- GitHub API reliability/rate-limit handling
- analytics/privacy architecture
- testing strategy
- multi-user production evolution

Goal: contribute design reasoning as well as code. Significant decisions should use ADRs.

## Repeat-contributor signal

Track manually:

- contributors with 2+ merged PRs
- contributors who move from issue report → fix
- contributors who perform meaningful review/triage after their own PR
- contributors who help improve docs/onboarding for the next newcomer

Do not create a public leaderboard based purely on commit count.

## Review quality checklist

Before submitting maintainer feedback:

- [ ] blocking comments are clearly marked
- [ ] reasoning is included for non-obvious requests
- [ ] comments do not ask for unrelated cleanup
- [ ] safety concerns link to the relevant policy/ADR
- [ ] contributor has a clear path to completion

## Monthly cleanup

Review:

- stale `good first issue` items
- issues whose scope is now too broad
- onboarding instructions that no longer match scripts
- PR feedback patterns that indicate missing docs
- contributors who may be ready for a larger scoped issue

## Retention success

The strongest signal is not number of first-time PRs. It is whether contributors understand the project well enough to return, review, propose improvements, and preserve its quality constraints.
