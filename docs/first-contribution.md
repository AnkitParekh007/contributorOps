# Your first contribution

This walkthrough is a small, repeatable path from cloning ContributorOps to
opening a focused pull request. Read [`CONTRIBUTING.md`](../CONTRIBUTING.md)
first, and read the [Safety Policy](./safety-policy.md) before changing any
GitHub integration or contribution-automation code.

## 1. Clone and install

Use Node.js 20 or newer and npm 10 or newer:

```bash
git clone https://github.com/AnkitParekh007/contributorOps.git
cd contributorOps
npm ci
```

The repository is a monorepo with three main surfaces:

- `apps/site` — the public documentation and marketing site;
- `apps/web` — the product UI;
- `apps/api` — the Express API and GitHub orchestration boundary.

For a demo-only setup, the dev container and local defaults keep GitHub writes
disabled. You do not need a GitHub token to inspect the mock discovery path.

## 2. Run the project

Start the API and product UI together:

```bash
npm run dev
```

To work only on the public site, use a second terminal:

```bash
npm run site:dev
```

The exact environment-file locations and demo-mode variables are documented in
[`docs/environment-setup.md`](./environment-setup.md). Do not commit `.env`
or `.env.local` files.

## 3. Choose a small, focused change

Good first contributions include a documentation correction, copy improvement,
accessible UI detail, test, or narrowly scoped bug fix. Before editing:

1. Search the open issues and confirm that nobody already has an overlapping
   pull request.
2. Read the relevant area under `apps/site`, `apps/web`, or `apps/api`.
3. Keep the change focused on one issue and note any safety implications.

Create a branch from `main`:

```bash
git switch main
git pull --ff-only origin main
git switch -c docs/first-contribution
```

Replace the branch name with one that describes your actual change.

## 4. Validate the change

Run the workspace checks before opening a pull request:

```bash
npm run typecheck
npm run build:all
```

For public-site changes, also run:

```bash
npm run site:quality
npm run site:lighthouse
```

Review the result and the final diff:

```bash
git diff --check
git status --short
git diff --stat
git diff
```

## 5. Prepare the pull request

Explain the user impact, the issue being addressed, the files changed, and the
validation you ran. Do not claim hosted or production verification that you
did not perform. Keep secrets, local environment files, generated build output,
and unrelated formatting changes out of the PR.

Before any external GitHub write, follow the approval gate and audit-log rules
in [`docs/safety-policy.md`](./safety-policy.md). Scheduled jobs are planning-
only; they must not create branches, comments, commits, or pull requests.

ContributorOps values a useful, reviewable contribution over contribution
volume. A small PR with clear evidence is ready for review.
