# Local Development

## Install dependencies

```bash
npm install
```

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
