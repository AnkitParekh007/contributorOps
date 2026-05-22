# Local Development

## Install dependencies

```bash
npm install
```

## Configure environment variables

Before running the product app, set up the required environment files:

- API server: `apps/api/.env`
- web app: `apps/web/.env.local`
- optional site workspace: `apps/site/.env.local`

Detailed guide:

- [`environment-setup.md`](./environment-setup.md)

## Run the business site locally

```bash
npm run site:dev
```

This starts the static React/Vite site from `apps/site`.

## Build the site

```bash
npm run site:build
```

## Preview the production build

```bash
npm run site:preview
```

## Notes

- No backend is required for the site workspace.
- No secrets are required.
- Routing is handled with `HashRouter` to stay GitHub Pages safe.
