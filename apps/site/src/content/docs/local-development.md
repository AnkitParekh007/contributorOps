# Local Development

ContributorOps can be evaluated locally without a hosted account, production database, or GitHub token.

## Fastest path: GitHub Codespaces

Open:

https://codespaces.new/AnkitParekh007/contributorOps?quickstart=1

The dev container uses Node.js 20, installs dependencies with `npm ci`, forwards the product/API/site ports, and keeps auto-contribution disabled.

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

Without a GitHub token, authenticated GitHub actions are unavailable and the product can use its mock discovery path. This is the recommended first evaluation mode.

## Optional environment configuration

Only configure environment files when you want live GitHub discovery, OAuth, Supabase persistence, or other integrations.

- API server: `apps/api/.env`
- web app: `apps/web/.env.local`
- optional public-site config: `apps/site/.env.local`

See the Environment Setup guide for the complete variable list.

## Run the public site locally

```bash
npm run site:dev
```

This starts the static React/Vite site on port `4174`.

## Build and validate

```bash
npm run typecheck
npm run build:all
```

## Useful evaluation routes

- `/#/try` — no-signup evaluation guide
- `/#/showcase` — engineering proof model
- `/#/recruiter` — recruiter/engineering brief
- `/#/contribute` — contributor onboarding
- `/#/adoption` — public GitHub adoption signals
- `/#/safety` — external-write trust boundary

## Notes

- No GitHub token is required to inspect the demo workflow.
- Routing uses `HashRouter` to stay GitHub Pages safe.
- External GitHub writes remain explicitly approval-gated when live credentials are configured.
- Optional site analytics remains disabled unless a Plausible per-site script is explicitly configured at build time.
