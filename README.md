# ContributorOps

**ContributorOps helps developers turn real open-source contributions into job-ready proof of work.**

ContributorOps is a human-approved open-source contribution intelligence platform. It helps developers discover high-quality issues, prepare better pull requests, build public proof-of-work portfolios, and convert real contributions into resume bullets, LinkedIn posts, and interview stories.

It is **not** positioned as a spam bot or fake contribution farming tool.

## Website

The static business website and documentation site lives in `apps/site` and deploys to GitHub Pages.

Live URL:
[https://ankitparekh007.github.io/contributorOps/](https://ankitparekh007.github.io/contributorOps/)

The website includes:
- Home
- Features
- Pricing
- Docs
- Safety
- Roadmap

## Local Setup

Install dependencies from the repo root:

```bash
npm install
```

Run the business website locally:

```bash
npm run site:dev
```

Build the website:

```bash
npm run site:build
```

Preview the built website:

```bash
npm run site:preview
```

The main app still supports:

```bash
npm run dev
npm run build
npm run daily
npm run start
```

## GitHub Pages Deployment

The site deploys from `apps/site/dist` through GitHub Actions using:

[`/.github/workflows/deploy-site.yml`](./.github/workflows/deploy-site.yml)

To enable GitHub Pages:

1. Go to repository **Settings**
2. Open **Pages**
3. Set **Source** to **GitHub Actions**
4. Push to `main`

The Vite config uses:
- base path: `/contributorOps/`
- `HashRouter` for GitHub Pages-safe routing

## Product Positioning

ContributorOps is built around one core message:

> ContributorOps helps developers turn real open-source contributions into job-ready proof of work.

That means:
- real issues
- real pull requests
- human-approved workflows
- maintainer trust
- honest career packaging

It does **not**:
- mass-comment on third-party repos
- mass-open PRs
- automate deceptive or low-effort contributions
- claim proof that a developer cannot defend in an interview

## Safety Philosophy

ContributorOps uses three safety levels:

1. `Research Mode`
   Discover repos and issues, score opportunities, and generate plans with no external writes.
2. `Draft Mode`
   Prepare local draft changes, PR content, and test plans without pushing externally.
3. `Approved Auto-Contribute Mode`
   External comments, fork branches, and draft PRs require explicit approval for exact actions.

Scheduled jobs cannot write to external repositories.

## Monetization Summary

The product is monetization-ready, but no real payment processing is implemented yet.

Plans:

- `Free` - `$0`
  Basic issue discovery, 3 plans per week, manual portfolio tracker, basic docs
- `Pro` - `$19/month`
  Daily contribution plans, job-matched issue finder, PR quality checker, portfolio page, resume bullets, LinkedIn drafts
- `Career` - `$49/month`
  Everything in Pro, interview stories, recruiter outreach drafts, GitHub profile audit, advanced proof-of-work exports, weekly career report
- `Team` - `$199/month`
  Team contribution dashboard, bootcamp/team tracking, shared repo radar, team portfolio reports, admin controls

The code is structured so Stripe or Lemon Squeezy can be added later.

## Roadmap

### MVP
- Business website
- Documentation
- GitHub Pages deployment
- Daily contribution planner
- Portfolio tracker

### Pro
- Job-matched issue finder
- PR quality checker
- Resume generator
- LinkedIn post generator
- Public portfolio page

### Career
- GitHub profile audit
- Interview story generator
- Recruiter share link
- Weekly career report

### Team
- Team dashboard
- Bootcamp mode
- Maintainer quality analytics
- Shared contribution radar

## Docs

Detailed docs live in [`/docs`](./docs):

- [`product-overview.md`](./docs/product-overview.md)
- [`local-development.md`](./docs/local-development.md)
- [`github-pages-deployment.md`](./docs/github-pages-deployment.md)
- [`safety-policy.md`](./docs/safety-policy.md)
- [`monetization-plan.md`](./docs/monetization-plan.md)
- [`roadmap.md`](./docs/roadmap.md)
