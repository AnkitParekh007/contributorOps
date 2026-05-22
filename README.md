# ContributorOps

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./apps/site/public/contributorops-logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./apps/site/public/contributorops-logo-light.svg">
  <img src="./apps/site/public/contributorops-logo-light.svg" alt="ContributorOps logo" width="720">
</picture>

**ContributorOps is a human-approved contribution intelligence platform that turns real open-source work into job-ready proof of work.**

ContributorOps is designed for developers, career programs, and teams that want a more structured way to identify worthwhile open-source issues, prepare higher-quality pull requests, preserve maintainer trust, and package finished contributions into durable professional evidence.

The system is intentionally not positioned as a spam bot, growth-hacking tool, or mass-PR engine. Its purpose is to improve contribution quality, contribution clarity, and contribution portability into hiring artifacts.

## Executive Overview

ContributorOps addresses a common gap in developer portfolios: GitHub activity is often real, but not sufficiently structured, explainable, or reusable as hiring signal.

The platform provides:
- discovery and ranking of contribution opportunities
- structured contribution planning
- PR quality review and readiness checks
- controlled, approval-gated contribution workflows
- portfolio and proof-of-work tracking
- career packaging outputs such as resume bullets, interview stories, recruiter-ready summaries, and public contribution pages

The result is a system that connects open-source contribution work with career outcomes without bypassing human judgment or maintainer trust.

## Product Scope

ContributorOps currently focuses on five capability domains.

### 1. Opportunity Discovery
- issue discovery across external repositories
- role-aware issue scoring
- contributor-oriented filtering for API, backend, Angular, platform, and developer-tooling work
- daily plan generation

### 2. Contribution Preparation
- scoped contribution plans
- file and testing suggestions
- maintainer question drafting
- branch, commit, and PR draft generation

### 3. Quality And Trust Controls
- PR quality scoring
- deterministic pre-submit checks
- duplicate-action prevention
- external write rate limits
- explicit approval gates for higher-risk operations

### 4. Proof-Of-Work Packaging
- portfolio tracking
- public contribution pages
- GitHub resume export
- LinkedIn post generation
- interview STAR story generation
- recruiter-facing summaries

### 5. Commercial Product Layer
- plan-aware feature gating
- local billing state
- monetization-ready packaging for Free, Pro, Career, and Team tiers
- static business website and documentation site

## Safety And Operating Model

ContributorOps is built around a controlled automation model.

It does **not**:
- mass-comment on third-party repositories
- mass-open pull requests
- run unsupervised external write workflows from scheduled jobs
- generate deceptive contribution claims
- optimize for contribution volume at the expense of maintainer trust

The operating model is split into three safety levels:

1. `Research Mode`
   Discovery, scoring, and planning only. No external GitHub writes.
2. `Draft Mode`
   Local proposal generation, including changes, PR content, and tests, without external submission.
3. `Approved Auto-Contribute Mode`
   Explicit approval is required for exact actions such as comments, fork branches, and draft pull requests.

Scheduled workflows are restricted to internal planning and repository-local automation. External repository writes remain approval-gated.

## Architecture Summary

The repository currently contains a multi-surface product implementation:

- `apps/web`
  Frontend application surface for ContributorOps product workflows.
- `apps/api`
  Backend API and orchestration layer for discovery, scoring, planning, storage, and controlled GitHub operations.
- `apps/site`
  Static business website and documentation site deployed to GitHub Pages.
- `data`
  Local JSON-backed persistence for MVP product state.
- `docs`
  Long-form product, safety, deployment, and monetization documentation.

Current technical characteristics:
- React + Vite + TypeScript on the frontend surfaces
- Node.js + Express on the API layer
- Octokit for GitHub API integration
- local JSON storage for early-stage persistence
- GitHub Actions for scheduled planning and static site deployment

## Repository Status

| Area | Current State |
|------|---------------|
| Static marketing site | Live on GitHub Pages |
| Documentation surface | Implemented in-site and in markdown |
| Discovery and planning workflows | Implemented |
| Controlled contribution modes | Implemented |
| Local-first portfolio tracking | Implemented |
| Billing and payments | Mock state only |
| Per-user GitHub OAuth | Not yet implemented |
| Production database | Not yet implemented |
| Multi-user SaaS operations | Planned |

This repository should be treated as a product foundation and working preview rather than a production SaaS deployment.

## Feature Model

Core product modules include:
- Job-Matched Issue Finder
- Daily Contribution Planner
- PR Quality Checker
- Maintainer-Friendly Draft Assistant
- Public Proof-of-Work Portfolio
- GitHub Resume Generator
- LinkedIn Post Generator
- Interview STAR Story Generator
- Recruiter Share Surfaces
- Controlled Auto-Contribute Guardrails

These modules are packaged into commercial plans without changing the underlying safety model.

## Commercial Packaging

ContributorOps is monetization-ready, but real payment processing is not yet enabled.

Current plan structure:
- `Free`
  Basic discovery, limited planning, manual portfolio tracking, and core docs.
- `Pro`
  Daily planning, issue matching, PR quality review, and portfolio surfaces.
- `Career`
  Career artifact generation, recruiter tools, GitHub profile audit, and advanced proof exports.
- `Team`
  Shared contribution tracking, team reporting, repo radar, and admin-oriented controls.

The codebase is structured so Stripe or Lemon Squeezy can be added later without reworking the product model or entitlement boundaries.

## Website And Documentation

Public site:
[https://ankitparekh007.github.io/contributorOps/](https://ankitparekh007.github.io/contributorOps/)

The public site includes:
- product overview
- features
- pricing
- safety model
- roadmap
- documentation landing and article pages

Supporting markdown documentation lives in [`/docs`](./docs):
- [`product-overview.md`](./docs/product-overview.md)
- [`local-development.md`](./docs/local-development.md)
- [`environment-setup.md`](./docs/environment-setup.md)
- [`github-pages-deployment.md`](./docs/github-pages-deployment.md)
- [`safety-policy.md`](./docs/safety-policy.md)
- [`monetization-plan.md`](./docs/monetization-plan.md)
- [`roadmap.md`](./docs/roadmap.md)

## Deployment Model

The static business site deploys from `apps/site/dist` through GitHub Actions using:

[`/.github/workflows/deploy-site.yml`](./.github/workflows/deploy-site.yml)

GitHub Pages configuration:
- Pages source: `GitHub Actions`
- Vite base path: `/contributorOps/`
- router strategy: `HashRouter` for refresh-safe GitHub Pages navigation

The main application and API remain local-development surfaces at this stage.

## Local Development

Repository setup:

```bash
npm install
```

Environment setup:

- API env file: `apps/api/.env`
- web env file: `apps/web/.env.local`
- optional site env file: `apps/site/.env.local`
- full guide: [`docs/environment-setup.md`](./docs/environment-setup.md)

Static site workflows:

```bash
npm run site:dev
npm run site:build
npm run site:preview
```

Full workspace workflows:

```bash
npm run dev
npm run build
npm run daily
npm run start
```

## Roadmap

### Foundation
- business website
- documentation surface
- GitHub Pages deployment
- daily contribution planning
- portfolio tracking

### Professional Workflow
- job-matched issue finding
- PR quality review
- resume generation
- LinkedIn artifact generation
- public proof-of-work pages

### Career Layer
- GitHub profile audit
- interview story generation
- recruiter share workflows
- weekly career reporting

### Team Layer
- team dashboard
- bootcamp mode
- maintainer quality analytics
- shared contribution radar

## Positioning

ContributorOps is intentionally narrow in its value proposition:

> Turn real open-source contributions into job-ready proof of work.

That means the repository prioritizes:
- contribution quality over contribution volume
- structured professional evidence over vanity activity
- human approval over opaque automation
- maintainer trust over growth mechanics
