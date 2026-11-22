# Contributing to ContributorOps

Thanks for making open-source contributions easier to discover, review, and explain. **Small, useful changes are welcome.** Documentation, examples, accessibility fixes, regression tests, and API improvements all count.

## Pick your first issue

Start with [good first issues](https://github.com/AnkitParekh007/contributorOps/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) or [help wanted](https://github.com/AnkitParekh007/contributorOps/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22). Before you begin, check whether an issue already has an open pull request and leave a short note when coordination would help. You can also report a confusing step using the workflow-feedback issue template.

The monorepo contains `apps/site` (public website), `apps/web` (product interface), and `apps/api` (issue discovery, planning, and authorized GitHub actions).

## Local development

Use Node.js 20+ and npm 10+:

```bash
git clone https://github.com/AnkitParekh007/contributorOps.git
cd contributorOps
npm ci
npm run dev
```

Open a separate terminal and run `npm run site:dev` to work on the public site. Demo discovery works without a GitHub token; never commit an `.env`, private key, or credential. Read [environment setup](./docs/environment-setup.md) if you need additional integrations.

Before you open a PR, run the checks appropriate to your change:

```bash
npm run typecheck
npm run build:all
npm run test:api
npm run site:quality       # for public-site changes
```

For changes to public-site layout or accessibility, also use `npm run site:lighthouse` and document any manual mobile/keyboard checks you performed. Keep diffs focused, use a descriptive branch name, and explain the user impact and your actual validation in the pull-request template. Do not claim checks you did not run.

## GitHub authority and maintainer trust

**Generated intent is never permission to write to an external repository.** Changes to automation and external-action code must preserve [the security model](./docs/security-model.md) and [safety policy](./docs/safety-policy.md).

There are **two separate, explicit authorization models**, each with its own limits:

1. **Interactive action-scoped approval.** Exact comments, fork branches and draft PR actions require the appropriate separate approval capability and leave auditable records.
2. **Operator-enabled standing exact-patch authorization.** Pre-authored bounded patches may be applied only after live repository policy, state, duplicate, path, size, daily-rate, and exact-match checks. These submissions are draft PRs and disclose automation.

The **hourly radar** discovers issues and can prepare a contributor-owned fork workspace when the operator explicitly enables that capability; it does not itself submit upstream PRs. The separate exact-patch workflow has its own safeguards. Do not remove approval gates, enable mass submissions, or add deceptive contribution/metrics behavior.

## Review process

A maintainer will review changes for correctness, scope, documentation, tests, and safety implications. A draft PR is treated as work in progress: please mark it ready for review when it is ready. We value constructive feedback and an accurate contribution history over speed or volume.

If a PR affects external GitHub actions, describe which authorization path it touches, what changes for users, and the regression tests proving the boundary remains intact. See [the project roadmap](./docs/roadmap.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).
