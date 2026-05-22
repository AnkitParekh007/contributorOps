# Contributing to ContributorOps

Thank you for your interest in contributing.

## Before You Start

Read the [Safety Policy](./docs/safety-policy.md) before contributing to any code that touches GitHub API integration or contribution automation. The safety model is a first-class product constraint, not a feature.

## Safety Rules for Contributors

These rules are non-negotiable:

1. **No external GitHub writes without human approval.** Any code path that creates a comment, branch, commit, or pull request on an external repository must go through the approval gate in `apps/api/src/contribute.ts`.

2. **No scheduled jobs may write externally.** The daily cron (`daily.ts`) is limited to discovery, scoring, and planning. It must never call any write endpoint.

3. **No mass automation.** Pull requests that add bulk comment, bulk PR, or metric-gaming capabilities will not be merged.

4. **Audit logs are required.** Any new external write action must write an audit log entry.

## Development Setup

```bash
# Install all dependencies
npm install

# Start API + Web in development mode
npm run dev

# Start the marketing site only
npm run site:dev

# Run TypeScript checks for all apps
npm run typecheck

# Build everything
npm run build:all
```

## Environment Setup

Copy the `.env.example` files in each app:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/site/.env.example apps/site/.env
```

The API and Web run in **demo mode** without a GitHub token. Mock issues are returned and no real GitHub calls are made.

## Pull Request Guidelines

- Keep PRs focused on a single concern
- Run `npm run typecheck` before submitting
- Run `npm run build:all` and ensure it passes
- For any change to the contribution/approval flow, explain how the safety model is preserved

## Reporting Issues

Open a GitHub Issue. For security vulnerabilities, see [SECURITY.md](./SECURITY.md).
