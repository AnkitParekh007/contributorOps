# ContributorOps

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./apps/site/public/contributorops-logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./apps/site/public/contributorops-logo-light.svg">
  <img src="./apps/site/public/contributorops-logo-light.svg" alt="ContributorOps logo" width="720">
</picture>

**ContributorOps helps developers turn real open-source contributions into job-ready proof of work.**

ContributorOps is a human-approved open-source contribution intelligence platform for developers who want their GitHub work to become visible hiring signal. It helps you discover higher-quality issues, prepare stronger pull requests, package completed contributions into career assets, and build a public record of work that recruiters, hiring managers, and maintainers can actually understand.

It is deliberately not positioned as a spam bot, fake contribution farming tool, or unsupervised PR machine.

## Project Status

| Area | Status |
|------|--------|
| Public site | Live on GitHub Pages |
| Documentation | In-site GitBook-style docs |
| Demo mode | Fully functional (no setup required) |
| User accounts | Not implemented — coming in Phase 3 |
| Database | JSON file storage — not suitable for production |
| GitHub OAuth | Server-level token only — per-user OAuth coming in Phase 5 |
| Payments | Mock billing only — no charges processed |
| Safety model | Implemented and enforced in code |

**This is a Founder Preview.** The product is functional for local use and demo exploration.
Real accounts, billing, and GitHub OAuth are planned for the next development phases.
Join the [waitlist](https://ankitparekh007.github.io/contributorOps/#/waitlist) to be notified at launch.

## What ContributorOps Does

ContributorOps is designed around one practical outcome: helping developers convert real open-source work into something they can defend in an interview and showcase in public.

The product helps with:
- finding relevant OSS issues for backend, API, Angular, platform, and developer-tooling work
- creating structured contribution plans before writing code
- improving PR quality and maintainer-readiness
- tracking portfolio-worthy contributions over time
- turning finished work into resume bullets, LinkedIn drafts, STAR stories, and proof-of-work pages

## Why This Exists

Many developers already contribute to GitHub, but the signal is weak:
- issues are chosen randomly
- contribution scope is unclear
- PRs are not packaged well for maintainers
- the work never becomes a clear hiring story

ContributorOps exists to close that gap between "I contributed" and "I can prove I am ready for the role I want."

## Who It Is For

ContributorOps is built for:
- developers trying to break into stronger backend, API, Angular, platform, or developer-tooling roles
- engineers who want a more disciplined OSS contribution workflow
- job seekers who need real proof-of-work instead of generic portfolio claims
- bootcamps, career programs, and teams that want contribution tracking with trust guardrails

## How It Works

ContributorOps follows a structured loop:

1. Discover
   Find external repositories and issues that match your target role and contribution constraints.
2. Prepare
   Generate a contribution plan with likely files, testing strategy, maintainer questions, and PR framing.
3. Validate
   Check draft PR quality, trust risks, and contribution readiness before submission.
4. Prove
   Turn the finished contribution into public, career-ready artifacts.

## Core Product Surfaces

ContributorOps includes:
- a job-matched issue finder
- daily contribution planning
- PR quality checking
- maintainer-friendly draft messaging
- portfolio tracking
- public proof-of-work portfolio pages
- GitHub resume exports
- LinkedIn post generation
- interview STAR story generation
- recruiter-oriented sharing surfaces

## Safety Model

ContributorOps is built around maintainer trust and human approval.

It does not:
- mass-comment on third-party repositories
- mass-open pull requests
- schedule external repo writes from daily jobs
- automate deceptive contributions
- create career claims the developer cannot honestly defend

It uses three explicit safety levels:

1. `Research Mode`
   Discover and plan only. No external GitHub writes.
2. `Draft Mode`
   Generate local proposed changes, PR drafts, comments, and test plans. Nothing is pushed externally.
3. `Approved Auto-Contribute Mode`
   Explicit approval is required for exact actions such as comments, fork branches, and draft PR creation.

Scheduled jobs are limited to discovery, planning, and optional issue creation inside this repository only.

## Product Positioning

The product positioning is intentionally narrow:

> ContributorOps helps developers turn real open-source contributions into job-ready proof of work.

That means the platform optimizes for:
- contribution quality over volume
- trust over automation theater
- real maintainable work over fake activity
- hiring signal over vanity metrics

## Website

Public site:
[https://ankitparekh007.github.io/contributorOps/](https://ankitparekh007.github.io/contributorOps/)

The website includes:
- Home
- Features
- Pricing
- Docs
- Safety
- Roadmap

## Plans And Monetization

ContributorOps is monetization-ready, but real payment processing is not implemented yet.

Current product packaging:
- `Free` — basic discovery, 3 plans per week, manual portfolio tracker, basic docs
- `Pro` — daily plans, job-matched issue finder, PR checker, portfolio page, resume bullets, LinkedIn drafts
- `Career` — interview stories, recruiter tools, GitHub profile audit, advanced proof-of-work exports
- `Team` — shared repo radar, contribution dashboard, team reporting, admin-oriented controls

The codebase is structured so Stripe or Lemon Squeezy can be added later without reworking the product model.

## Repository Overview

This repository currently contains:
- the main ContributorOps app surfaces
- the static business website and docs site in `apps/site`
- supporting docs in [`/docs`](./docs)
- GitHub Pages deployment workflow
- product positioning, pricing, safety, and roadmap content

## Explore The Docs

Detailed documentation lives in [`/docs`](./docs):
- [`product-overview.md`](./docs/product-overview.md)
- [`local-development.md`](./docs/local-development.md)
- [`github-pages-deployment.md`](./docs/github-pages-deployment.md)
- [`safety-policy.md`](./docs/safety-policy.md)
- [`monetization-plan.md`](./docs/monetization-plan.md)
- [`roadmap.md`](./docs/roadmap.md)

## Local Development

For people working on the repo itself:

```bash
npm install
npm run site:dev
npm run site:build
npm run site:preview
```

The full app workspace also supports:

```bash
npm run dev
npm run build
npm run daily
npm run start
```

## GitHub Pages

The website deploys from `apps/site/dist` through GitHub Actions using:

[`/.github/workflows/deploy-site.yml`](./.github/workflows/deploy-site.yml)

To enable GitHub Pages:

1. Go to repository `Settings`
2. Open `Pages`
3. Set `Source` to `GitHub Actions`
4. Push to `main`

Routing is configured for GitHub Pages using:
- base path: `/contributorOps/`
- `HashRouter` for refresh-safe client routing

## Roadmap Snapshot

### MVP
- business website
- documentation
- GitHub Pages deployment
- daily contribution planner
- portfolio tracker

### Pro
- job-matched issue finder
- PR quality checker
- resume generator
- LinkedIn post generator
- public portfolio page

### Career
- GitHub profile audit
- interview story generator
- recruiter share link
- weekly career report

### Team
- team dashboard
- bootcamp mode
- maintainer quality analytics
- shared contribution radar

