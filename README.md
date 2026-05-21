# ContributorOps

ContributorOps is a production-oriented contribution planning app for backend, API, and developer-tooling open source work. It helps you discover realistic issues, score them transparently, generate deterministic contribution plans, track progress, and turn every contribution into job-search proof.

It is intentionally **not** a spam bot.

## Controlled contribution mode

ContributorOps supports three explicit safety levels.

### Level 1: Research Mode

- discover repos and issues
- score opportunities
- generate contribution plans
- no GitHub writes except local portfolio tracking

### Level 2: Draft Mode

- generate suggested code changes locally
- generate branch name, commit message, and PR body
- create planning issues only in `contributorOps`
- never push to external repos

### Level 3: Approved PR Mode

- only after explicit user approval
- uses the user's fork of the external repo, or creates a fork only when the authenticated GitHub account matches the requested fork owner
- creates a branch in the user's fork
- commits proposed changes to the user's fork
- opens a **draft** pull request against upstream
- never marks ready for review automatically
- never comments repeatedly
- never opens more than one PR per repo per day
- always requires a clear human-written PR description and test evidence

## What the app does

- discovers daily contribution opportunities across API, SDK, GraphQL, REST, and developer-tooling repositories
- scores issues from `0` to `100` using visible rules
- generates a daily contribution mission and top-5 markdown plan
- shows contribution detail for each issue:
  - issue summary
  - contribution plan
  - likely files involved
  - testing strategy
  - maintainer question draft
  - PR description draft
  - resume bullet draft
- tracks your portfolio progress locally
- adds **Job Mode** outputs for each contribution:
  - resume bullet
  - LinkedIn post draft
  - interview STAR story
  - recruiter outreach message
  - GitHub profile README snippet
- can optionally create planning issues **only inside this repo**

## Safety philosophy

ContributorOps is built around human approval and safe automation.

- It does **not** auto-comment on third-party repositories.
- It does **not** auto-open PRs on third-party repositories.
- It does **not** push code to external repositories.
- GitHub Actions only generates a local daily plan artifact and may optionally create a planning issue in `contributorOps` itself.
- Any actual contribution still requires you to read the repo, understand the issue, make a minimal change, run tests, and manually open a draft PR.

## Tech stack

- React + Vite + TypeScript frontend
- Node.js + Express backend
- GitHub REST API via Octokit
- Local JSON storage in `data/`
- GitHub Actions daily workflow

## Project structure

```text
contributorOps/
├─ apps/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ components/
│  │  │  ├─ api/
│  │  │  ├─ types/
│  │  │  ├─ App.tsx
│  │  │  ├─ main.tsx
│  │  │  └─ styles.css
│  │  ├─ package.json
│  │  └─ vite.config.ts
│  └─ api/
│     ├─ src/
│     │  ├─ server.ts
│     │  ├─ daily.ts
│     │  ├─ github.ts
│     │  ├─ scorer.ts
│     │  ├─ planner.ts
│     │  ├─ storage.ts
│     │  ├─ types.ts
│     │  └─ config.ts
│     ├─ package.json
│     └─ tsconfig.json
├─ data/
│  ├─ portfolio.json
│  └─ daily-plan.json
├─ .github/
│  └─ workflows/
│     └─ daily-contributorops.yml
├─ package.json
├─ .env.example
├─ .gitignore
└─ README.md
```

## GitHub token permissions

### Local app

If you set `GITHUB_TOKEN`, use a token with:

- `public_repo` or equivalent repository read access for GitHub search and issue discovery

### Optional planning issue creation

If you want ContributorOps or GitHub Actions to create planning issues in this repo, the token must also be able to:

- create issues in `AnkitParekh007/contributorOps`

No broader permissions are required.

## Setup

1. Clone the repo.
2. Copy `.env.example` to `.env`.
3. Add `GITHUB_TOKEN` if you want live GitHub discovery.
4. Leave it empty if you want demo mode.

```bash
npm install
```

## Running locally

### Development

Starts backend and frontend together:

```bash
npm run dev
```

- frontend: `http://localhost:5173`
- backend: `http://localhost:8787`

### Build

```bash
npm run build
```

### Production server

After build:

```bash
npm run start
```

### Daily plan generation

```bash
npm run daily
```

This writes the latest plan to:

- `data/daily-plan.json`

## Demo mode vs live mode

### Demo mode

If `GITHUB_TOKEN` is missing:

- the app still works
- mock contribution opportunities are used
- you can generate a daily plan
- portfolio tracking still works

### Live mode

If `GITHUB_TOKEN` is present:

- ContributorOps searches GitHub repositories and issues using Octokit
- issues are filtered by your selected topics, languages, and labels
- plans are generated deterministically from real issue data

## API endpoints

- `GET /api/health`
- `GET /api/control-mode`
- `POST /api/control-mode`
- `POST /api/discover`
- `GET /api/daily-plan`
- `POST /api/portfolio`
- `GET /api/portfolio`
- `PATCH /api/portfolio/:id`
- `DELETE /api/portfolio/:id`
- `POST /api/create-planning-issue`
- `POST /api/draft-proposal`
- `POST /api/approved-pr`

## Scoring model

Scoring is transparent and deterministic.

- `+20` good first issue
- `+15` help wanted
- `+10` documentation/docs
- `+10` bug
- `+10` API/backend topic match
- `+10` updated within 30 days
- `+5` has discussion but fewer than 10 comments
- `-10` stale issue older than 180 days
- `-10` too many comments over 20
- `-15` unclear or no body

The app also returns a score explanation array for each issue.

## Daily plan output

The daily plan includes:

- date
- mission
- rules
- top 5 opportunities
- repo
- issue
- score
- labels
- why it is useful
- first action
- contribution plan
- test plan
- PR draft
- resume bullet
- checklist

## Draft and approved PR flow

### Draft Mode output

For a selected issue, ContributorOps generates:

- suggested local file changes
- branch name
- commit message
- draft PR title
- draft PR body
- test evidence template

These stay local until you explicitly move into Approved PR Mode.

### Approved PR Mode output

Approved PR Mode can:

1. validate explicit human approval
2. verify the daily PR rate limit for the target upstream repo
3. create or use your fork
4. create a branch in your fork
5. commit the proposed files to your fork
6. open a **draft** PR against upstream

It does **not**:

- mark the PR ready for review
- auto-comment on the issue or PR
- open repeated PRs for the same upstream repo in one day

## GitHub Actions setup

Workflow file:

- `.github/workflows/daily-contributorops.yml`

### Required secret

- `GH_CONTRIBUTOROPS_TOKEN`

### Optional repository variable

- `CREATE_DAILY_ISSUE=true`

If `CREATE_DAILY_ISSUE=true`, the workflow may create a planning issue **only** in this repo.

The workflow:

1. checks out the repo
2. installs dependencies
3. runs `npm run daily`
4. uploads `data/daily-plan.json` as an artifact
5. optionally creates a planning issue in `contributorOps` through the daily script

## How to use ContributorOps for a job search

1. generate a daily plan
2. pick one issue with good scope and strong career relevance
3. inspect the detail panel
4. read the target repo's README and CONTRIBUTING guide
5. reproduce or understand the issue locally
6. make a minimal change
7. run tests
8. open a draft PR manually
9. track status in the portfolio
10. refine the Job Mode outputs after progress or merge

## Contribution workflow

Recommended flow for each real OSS contribution:

1. discover the issue
2. validate score and recommendation reason
3. read the repository documentation
4. verify maintainers still want the issue worked on
5. implement the smallest sensible change
6. add or update tests
7. open a draft PR manually
8. update portfolio notes, STAR story, and resume bullet

## Root commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run daily`
- `npm run start`

## Future roadmap

- repository-specific heuristics for popular backend ecosystems
- richer maintainer-fit signals
- local markdown export for weekly contribution reports
- import of merged PR data back into portfolio tracker
- deeper PR review preparation surfaces

## License

MIT
