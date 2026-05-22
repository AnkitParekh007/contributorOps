# GitHub Pages Deployment

## Deployment model

The ContributorOps business website is deployed through GitHub Actions using `.github/workflows/deploy-site.yml`.

## Build output

The workflow builds the static site from `apps/site` and uploads:

```text
apps/site/dist
```

## GitHub Pages settings

1. Go to the repository **Settings**
2. Open **Pages**
3. Set **Source** to **GitHub Actions**
4. Push to `main`

## Vite base path

Because the repository name is `contributorOps`, the site uses:

```ts
base: "/contributorOps/";
```

## Avoiding 404 refresh issues

The site uses `HashRouter`, which avoids GitHub Pages refresh errors on nested routes.

## Troubleshooting blank page issues

If the site loads blank:

- confirm `base` is `/contributorOps/`
- confirm the Pages source is GitHub Actions
- confirm the workflow artifact path is `apps/site/dist`
- hard refresh the browser after deployment

## Troubleshooting route issues

If navigation breaks:

- confirm `HashRouter` is still used
- confirm all navigation links point to valid React routes
- confirm the workflow deployed the latest commit on `main`
