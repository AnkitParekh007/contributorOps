# ContributorOps

**ContributorOps helps developers turn real open-source contributions into job-ready proof of work.**

Not a spam bot. Not fake contribution farming. A human-approved contribution intelligence platform.

![CI](https://github.com/AnkitParekh007/contributorOps/actions/workflows/ci.yml/badge.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-brightgreen?logo=github)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)

**[Live Site](https://ankitparekh007.github.io/contributorOps/)** | **[Docs](docs/)** | **[API Reference](docs/api-reference.md)** | **[Architecture](docs/architecture.md)**

---

## What ContributorOps Does

ContributorOps is a platform for developers who need more than GitHub activity — they need proof of work that is real, verifiable, and explainable in an interview.

It discovers high-quality open-source issues matched to your skills and job target. It helps you prepare a professional contribution — a scoped proposal, a quality-checked PR, a maintainer comment that introduces you properly. It tracks what you contribute, generates resume bullets from real merged PRs, and produces a portfolio you can share with recruiters.

Every external action requires your explicit approval. Nothing writes to someone else's repository automatically.

---

## Monorepo Architecture

| App | Path | Purpose | Port |
|-----|------|---------|------|
| API | `apps/api` | Node/Express backend, all business logic | 8787 |
| Web | `apps/web` | React product dashboard | 5173 |
| Site | `apps/site` | Static marketing site (GitHub Pages) | 4174 |

All three apps share a single npm workspace. See [docs/architecture.md](docs/architecture.md) for full details.

---

## Local Development

Install all dependencies:

```bash
npm install
```

Run the product dashboard (API + Web):

```bash
npm run dev
```

Run the marketing site:

```bash
npm run site:dev
```

Build everything:

```bash
npm run build:all
```

Run the daily contribution planner:

```bash
npm run daily
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API (port 8787) and Web (port 5173) concurrently |
| `npm run build` | Build API and Web |
| `npm run build:all` | Build API, Web, and Site |
| `npm run start` | Start the API server in production mode |
| `npm run daily` | Run the daily contribution planner job |
| `npm run site:dev` | Start the marketing site (port 4174) |
| `npm run site:build` | Build the marketing site |
| `npm run site:preview` | Preview the marketing site build |
| `npm run typecheck` | TypeScript check all three apps |
| `npm run ci` | Install and build everything (used in CI) |

---

## GitHub Pages Deployment

The marketing site deploys automatically via `.github/workflows/deploy-site.yml` on every push to `main`.

### Setup

1. Go to repo **Settings > Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the workflow handles the rest

**Build output:** `apps/site/dist/`

The site uses `HashRouter` and a Vite base path of `/contributorOps/` for GitHub Pages compatibility. See [docs/github-pages-deployment.md](docs/github-pages-deployment.md) for full details.

---

## Site Pages

The marketing site includes the following routes:

| Route | Description |
|-------|-------------|
| `/#/` | Home — hero, value prop, how it works |
| `/#/features` | Feature deep-dive |
| `/#/use-cases` | Audience-specific use cases |
| `/#/pricing` | Plan comparison with monthly/yearly toggle |
| `/#/demo` | Polished mock demo |
| `/#/waitlist` | Waitlist signup |
| `/#/docs` | Documentation index |
| `/#/safety` | Safety model explanation |
| `/#/roadmap` | Public roadmap |
| `/#/privacy` | Privacy policy |
| `/#/terms` | Terms of service |
| `/#/contact` | Contact |

---

## Waitlist

The waitlist is available in two forms:

- **Static site (`/#/waitlist`):** Stores submissions in localStorage. No API required. Works on GitHub Pages.
- **API (`POST /api/waitlist`):** Persists to `data/waitlist.json`. Available when running locally.

See [docs/api-reference.md](docs/api-reference.md#post-apiwaitlist) for the full API spec.

---

## Safety Model

ContributorOps is built around human approval and maintainer trust.

Three safety levels:

1. **Research Mode** — read-only discovery and planning. No writes to external repositories.
2. **Draft Mode** — can create planning issues and draft proposals with your explicit approval.
3. **Approved Auto-Contribute Mode** — full contribution workflow, with approval required before each external action.

The product will not:
- Mass-comment on third-party repositories
- Mass-open PRs
- Write to external repos without your explicit per-action approval
- Generate fake activity or game contribution graphs

See [docs/safety-policy.md](docs/safety-policy.md) for the full safety policy.

---

## Monetization

ContributorOps is monetization-ready. Real payments are not implemented yet — billing runs on local state with mock plan selection.

| Plan | Price | Target |
|------|-------|--------|
| Free | $0 | Getting started — 3 discovery runs/week |
| Pro | $19/month | Daily plans, PR checker, portfolio page |
| Career | $49/month | Resume export, LinkedIn bullets, profile audit |
| Team | $199/month | Team dashboard, bootcamp mode, shared radar |

A Founder Lifetime Deal at $99 (Career plan forever) is planned for early adopters.

Payment integration (Stripe or Lemon Squeezy) can be added without changing the plan structure. See [docs/monetization-plan.md](docs/monetization-plan.md) for details.

---

## Roadmap

### MVP (Current)
- Marketing site with GitHub Pages deployment
- Full documentation
- Daily contribution planner
- Portfolio tracker
- File-based persistence

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

See [docs/roadmap.md](docs/roadmap.md) for the full roadmap.

---

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/architecture.md](docs/architecture.md) | Monorepo structure, app details, data storage |
| [docs/api-reference.md](docs/api-reference.md) | All API endpoints with request/response shapes |
| [docs/local-development.md](docs/local-development.md) | Detailed local setup guide |
| [docs/github-pages-deployment.md](docs/github-pages-deployment.md) | GitHub Pages deployment details |
| [docs/safety-policy.md](docs/safety-policy.md) | Full safety model and policy |
| [docs/monetization-plan.md](docs/monetization-plan.md) | Monetization strategy and plan details |
| [docs/roadmap.md](docs/roadmap.md) | Product roadmap |
| [docs/founder-notes.md](docs/founder-notes.md) | Why this product exists |
| [docs/customer-development.md](docs/customer-development.md) | Target segments and validation plan |
| [docs/launch-checklist.md](docs/launch-checklist.md) | Pre-launch checklist |

---

## What ContributorOps Does Not Do

It does **not**:
- Mass-comment on third-party repositories
- Mass-open PRs on third-party repositories
- Market fake contribution farming
- Present deceptive contribution automation as normal workflow
- Claim job outcomes without real proof-of-work
- Generate activity that the developer cannot explain or defend in an interview

---

## Contributing

Open an issue to report bugs or propose features. Follow the three-level safety model when discussing contribution workflows — any new automation feature must not lower the floor on human approval.

---

## License

MIT
