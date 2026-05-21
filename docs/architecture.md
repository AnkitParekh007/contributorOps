# ContributorOps Architecture

## Overview

ContributorOps is a human-approved contribution intelligence platform built as a monorepo with three distinct applications. The API backend handles all business logic and file-based persistence. The web application is the interactive product dashboard where developers discover issues, manage contributions, and build their portfolio. The site application is a static marketing website deployed to GitHub Pages. All three applications share a single npm workspace and are developed and deployed independently.

---

## Monorepo Structure

```
contributorOps/
├── apps/
│   ├── api/                        # Node/Express/TypeScript backend
│   │   ├── src/
│   │   │   ├── server.ts           # Express app, all route definitions
│   │   │   ├── billing.ts          # Plan management, entitlements
│   │   │   ├── contribute.ts       # Contribution run orchestration
│   │   │   ├── daily.ts            # Daily plan scheduler
│   │   │   ├── github.ts           # GitHub API integration
│   │   │   ├── planner.ts          # Issue discovery and planning
│   │   │   ├── scorer.ts           # PR quality scoring
│   │   │   ├── storage.ts          # JSON file read/write helpers
│   │   │   ├── config.ts           # Runtime configuration
│   │   │   └── types.ts            # Shared TypeScript types
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                        # React 19 product dashboard SPA
│   │   ├── src/
│   │   │   ├── App.tsx             # Root component, state-based navigation
│   │   │   ├── main.tsx            # Entry point
│   │   │   ├── styles.css          # Global styles
│   │   │   ├── api/                # API client functions
│   │   │   ├── types/              # TypeScript type definitions
│   │   │   └── components/         # 12 UI components (see below)
│   │   ├── vite.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── site/                       # React 19 static marketing site
│       ├── src/
│       │   ├── App.tsx             # HashRouter, route definitions
│       │   ├── main.tsx            # Entry point
│       │   ├── styles.css          # Global styles
│       │   ├── components/         # Shared layout components
│       │   ├── pages/              # Page components
│       │   └── data/               # Static content (pricing, features)
│       ├── public/                 # Static assets (og-image, manifest)
│       ├── vite.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── data/                           # File-based persistence (JSON)
│   ├── billing.json
│   ├── contribution-runs.json
│   ├── control-mode.json
│   ├── daily-plan.json
│   ├── portfolio.json
│   ├── pr-activity.json
│   ├── usage.json
│   └── waitlist.json
│
├── docs/                           # Project documentation
│   ├── architecture.md             # This file
│   ├── api-reference.md
│   ├── product-overview.md
│   ├── local-development.md
│   ├── github-pages-deployment.md
│   ├── safety-policy.md
│   ├── monetization-plan.md
│   ├── roadmap.md
│   ├── founder-notes.md
│   ├── customer-development.md
│   └── launch-checklist.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Build, typecheck, secret scan
│       ├── deploy-site.yml         # GitHub Pages deployment
│       └── daily-contributorops.yml # Scheduled daily plan runner
│
├── package.json                    # Root workspace config
└── README.md
```

---

## Application Details

### apps/api — Express Backend

**Tech stack:** Node.js, Express 5, TypeScript  
**Port:** 8787  
**Persistence:** File-based JSON in `/data/`

The API is a single Express application defined in `server.ts`. All routes are registered in that file. Business logic is split across focused modules:

| Module | Responsibility |
|--------|---------------|
| `server.ts` | Express app setup, all route handlers (~25 endpoints) |
| `billing.ts` | Plan state, entitlement checks, mock plan selection |
| `contribute.ts` | Contribution run lifecycle (prepare, approve, cancel) |
| `daily.ts` | Daily plan job execution and scheduling |
| `github.ts` | GitHub API calls (issues, PRs, profile data) |
| `planner.ts` | Issue discovery, filtering, daily plan generation |
| `scorer.ts` | PR quality scoring algorithm |
| `storage.ts` | JSON file read/write with atomic helpers |
| `config.ts` | Environment variable loading and runtime config |
| `types.ts` | Shared TypeScript interfaces and enums |

The API runs in one of three safety modes controlled by `data/control-mode.json`:

- **Research Mode** — read-only; no writes to external repositories
- **Draft Mode** — can create planning issues and draft proposals with approval
- **Approved Auto-Contribute Mode** — full contribution workflow with explicit per-action approval gates

### apps/web — Product Dashboard SPA

**Tech stack:** React 19, TypeScript, Vite  
**Port:** 5173  
**API proxy:** `/api/*` requests are proxied to `http://localhost:8787`

The web app is a React single-page application. Navigation is state-based inside `App.tsx` — there is no client-side router. The active view is tracked in component state, and components are conditionally rendered. This approach keeps the bundle simple and avoids hash/history routing complexity for a tool that runs locally.

**Components (12 total):**

| Component | Purpose |
|-----------|---------|
| `AutoContributePage.tsx` | Contribution run management and approval gates |
| `CandidateList.tsx` | Discovered issue list with scoring |
| `ContributionModePanel.tsx` | Mode status and workflow controls |
| `ControlModePanel.tsx` | Safety level configuration |
| `DiscoveryControls.tsx` | Issue discovery filters and search |
| `IssueDetailPanel.tsx` | Issue detail, notes, and planning |
| `JobModePanel.tsx` | Job-matching configuration |
| `MissionCard.tsx` | Daily mission summary card |
| `PortfolioTracker.tsx` | Portfolio entries CRUD |
| `PricingPage.tsx` | Plan selection and upgrade UI |
| `ProofOfWorkPage.tsx` | Resume export and career assets |
| `PublicPortfolioPage.tsx` | Public portfolio preview |
| `TeamRadarPage.tsx` | Team repository radar (Team plan) |

### apps/site — Static Marketing Site

**Tech stack:** React 19, TypeScript, Vite  
**Port:** 4174 (dev), static files in production  
**Routing:** HashRouter (required for GitHub Pages)  
**API calls:** None — fully static content

The site is deployed to GitHub Pages via `.github/workflows/deploy-site.yml`. Because GitHub Pages serves static files without server-side routing, the site uses `HashRouter` from React Router, which encodes routes as URL fragments (`/#/features`, `/#/pricing`, etc.).

The Vite base path is configured to `/contributorOps/` to match the GitHub Pages subdirectory.

**Pages:**

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.tsx` | Hero, value prop, social proof |
| `/features` | (planned) | Feature deep-dive |
| `/use-cases` | (planned) | Audience-specific use cases |
| `/pricing` | `Pricing.tsx` | Plan comparison, monthly/yearly toggle |
| `/roadmap` | `Roadmap.tsx` | Public roadmap |
| `/safety` | `Safety.tsx` | Safety model explanation |
| `/docs` | `Docs.tsx` | Documentation index |
| `/demo` | (planned) | Polished mock demo |
| `/waitlist` | (planned) | Waitlist signup form |

---

## Data Storage

ContributorOps uses file-based persistence. All state is stored as JSON files in the `/data/` directory. There is no database.

| File | Contents |
|------|----------|
| `billing.json` | Current plan, usage counters, entitlements |
| `contribution-runs.json` | All contribution run records with status and history |
| `control-mode.json` | Current safety level and approval state |
| `daily-plan.json` | Most recently generated daily plan |
| `portfolio.json` | Portfolio entries array |
| `pr-activity.json` | PR quality check history |
| `usage.json` | Weekly action usage counts |
| `waitlist.json` | Waitlist signups (name, email, role, plan interest) |

The `storage.ts` module provides typed read/write helpers. All writes are synchronous to keep the implementation simple. This is appropriate for a local-first tool used by a single developer; it is not designed for concurrent multi-user access.

---

## GitHub Actions

### deploy-site.yml

Triggered on push to `main`. Builds `apps/site` with Vite and deploys the output from `apps/site/dist/` to GitHub Pages using the official `actions/deploy-pages` action.

### daily-contributorops.yml

Scheduled workflow that runs the daily contribution planner job. Calls `npm run daily`, which executes the `daily.ts` module in the API workspace. In Research Mode, this job only reads and plans — it does not write to any external repository.

### ci.yml

Triggered on push and pull requests to `main`. Runs in parallel:

- **install** — `npm ci` (shared cache)
- **build-api** — TypeScript compilation for `apps/api`
- **build-web** — Vite build for `apps/web`
- **build-site** — Vite build for `apps/site`
- **typecheck** — `tsc --noEmit` for all three apps
- **secret-scan** — regex scan for common secret patterns in source files

---

## Local-First Design Philosophy

ContributorOps is intentionally local-first. The API runs on your machine, state is stored in local JSON files, and no data is sent to external services unless you explicitly trigger a GitHub action with your own token.

This design has several intentional consequences:

1. **No account required to start.** Clone, install, run. The product works without signing up for anything.
2. **Full data ownership.** Everything in `/data/` is plain JSON you can read, edit, and back up.
3. **Safe by default.** Without a `GITHUB_TOKEN`, the system runs in mock mode. No external API calls are made accidentally.
4. **Privacy by default.** No telemetry, no usage reporting, no external analytics.
5. **Easy to audit.** The entire backend is a single TypeScript file you can read in an hour.

The tradeoff is that this architecture does not support multi-user or cloud-hosted deployment without significant changes. That is an intentional scope decision for v1.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | For live mode | — | GitHub personal access token. Without this, the system runs in mock mode. |
| `AUTO_CONTRIBUTE_ENABLED` | No | `false` | Enable Approved Auto-Contribute mode. Must be explicitly set to `true`. |
| `CREATE_DAILY_ISSUE` | No | — | If set, the daily plan job will create a GitHub planning issue. |
| `PORT` | No | `8787` | Port for the Express API server. |

All environment variables are read in `apps/api/src/config.ts`.
