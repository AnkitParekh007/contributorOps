# ContributorOps

ContributorOps is a human-approved open-source contribution intelligence platform.

It helps developers discover high-quality open-source issues, prepare contribution plans, write better PRs, build proof-of-work portfolios, generate resume bullets, and turn GitHub contributions into job opportunities.

The positioning is explicit:

**ContributorOps helps developers turn real open-source contributions into job-ready proof of work.**

It is not a spam bot. It is not fake contribution farming software.

## Website preview

This repo now includes a polished static business website and documentation site in `apps/site`, built for GitHub Pages deployment.

The site covers:

- product positioning
- core features
- pricing
- safety model
- roadmap
- documentation landing page

## Product positioning

ContributorOps is for developers who want stronger public evidence than generic project claims alone.

Primary audiences:

- API Developers
- Backend Engineers
- Angular Developers
- Platform Engineers
- Developer Advocates

## Safety philosophy

ContributorOps is built around human approval and maintainer trust.

- It does **not** mass-comment on third-party repositories.
- It does **not** mass-open PRs.
- Scheduled jobs cannot write to external repositories.
- External comments require approval.
- External draft PRs require approval.
- It is designed to help users build maintainer trust, not exploit maintainers.

Safety levels:

1. `Research Mode`
2. `Draft Mode`
3. `Approved Auto-Contribute Mode`

## Local setup

Install dependencies:

```bash
npm install
```

Run the main product app:

```bash
npm run dev
```

Run the static website:

```bash
npm run site:dev
```

Build the static website:

```bash
npm run site:build
```

Preview the static website build:

```bash
npm run site:preview
```

Run the daily contribution planner:

```bash
npm run daily
```

## Commands

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run daily`
- `npm run site:dev`
- `npm run site:build`
- `npm run site:preview`

## GitHub Pages deployment

The business website deploys through:

`/.github/workflows/deploy-site.yml`

Build output:

`apps/site/dist`

### How to enable GitHub Pages

1. Go to repo **Settings**
2. Open **Pages**
3. Set **Source** to **GitHub Actions**
4. Push to `main`

## Static site details

The site workspace is:

`apps/site`

Tech stack:

- React
- Vite
- TypeScript
- plain CSS
- static content only

Routing uses `HashRouter` and the Vite base path is configured for:

`/contributorOps/`

## Documentation

Markdown docs live in:

- [docs/product-overview.md](docs/product-overview.md)
- [docs/local-development.md](docs/local-development.md)
- [docs/github-pages-deployment.md](docs/github-pages-deployment.md)
- [docs/safety-policy.md](docs/safety-policy.md)
- [docs/monetization-plan.md](docs/monetization-plan.md)
- [docs/roadmap.md](docs/roadmap.md)

## Monetization plan summary

ContributorOps is monetization-ready, but real payments are intentionally not implemented yet.

Plans:

- `Free`: basic discovery, 3 plans/week
- `Pro`: $19/month, daily plans, PR checker, portfolio page
- `Career`: $49/month, resume, LinkedIn, interview, recruiter tools
- `Team`: $199/month, team dashboard

The repo includes:

- pricing page
- mock upgrade buttons
- local plan config
- premium feature locking
- upgrade prompts

Stripe or Lemon Squeezy can be added later without changing the overall product packaging.

## Roadmap

### MVP

- Business website
- Docs
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

## What ContributorOps does not do

It does **not**:

- mass-comment on third-party repositories
- mass-open PRs on third-party repositories
- market fake contribution farming
- present deceptive contribution automation as normal workflow
- claim job outcomes without real proof-of-work
