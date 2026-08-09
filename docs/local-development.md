# Local Development

ContributorOps can be evaluated locally without a hosted account, production database, or GitHub token.

## Fastest path: GitHub Codespaces

Use the repository dev container:

https://codespaces.new/AnkitParekh007/contributorOps?quickstart=1

The dev container:

- uses Node.js 20
- runs `npm ci` after creation
- forwards ports `5173`, `8787`, and `4174`
- sets `STORAGE_MODE=demo`
- keeps `AUTO_CONTRIBUTE_ENABLED=false`
- keeps `CREATE_DAILY_ISSUE=false`

After the Codespace opens:

```bash
npm run dev
```

Open the forwarded Product UI port (`5173`).

## Local machine quick start

### Prerequisites

- Node.js 20+
- npm 10+

### Clone and install

```bash
git clone https://github.com/AnkitParekh007/contributorOps.git
cd contributorOps
npm ci
```

### Run the product UI + API

```bash
npm run dev
```

This starts:

- Product UI: `http://localhost:5173`
- Express API: `http://localhost:8787`

With no GitHub token configured, live authenticated GitHub actions are unavailable and discovery can use the repository's mock issue path. This is the recommended evaluation mode for first-time visitors.

## Optional environment configuration

You only need environment files when you want live GitHub discovery, OAuth, Supabase persistence, or other integrations.

Locations:

- API server: `apps/api/.env`
- web app: `apps/web/.env.local`
- optional public-site config: `apps/site/.env.local`

Detailed guide:

- [`environment-setup.md`](./environment-setup.md)

Before adding a GitHub token, review:

- [`safety-policy.md`](./safety-policy.md)
- [`adr/0001-human-approved-external-writes.md`](./adr/0001-human-approved-external-writes.md)

## Run the public site locally

```bash
npm run site:dev
```

This starts the static React/Vite public site from `apps/site` on port `4174`.

The public site does not require the API for its core static routes.

## Build everything

```bash
npm run build:all
```

## Type-check everything

```bash
npm run typecheck
```

## Preview the public-site production build

```bash
npm run site:build
npm run site:preview
```

## Optional site analytics

Site analytics is disabled unless `VITE_PLAUSIBLE_SCRIPT_SRC` is configured for the `apps/site` build.

See [`adoption-scorecard.md`](./adoption-scorecard.md) for the measurement model and configuration guidance.

## Useful evaluation routes

After the public site is running:

- `/#/try` — no-signup evaluation guide
- `/#/showcase` — engineering proof model
- `/#/recruiter` — recruiter/engineering brief
- `/#/contribute` — contributor onboarding
- `/#/adoption` — live public GitHub adoption signals
- `/#/safety` — external-write trust boundary

## Notes

- `HashRouter` keeps public-site routes compatible with GitHub Pages.
- Demo mode is intentionally local-first.
- A GitHub token is not required to inspect the product workflow.
- External GitHub write behavior remains separately approval-gated even when live GitHub credentials are configured.
