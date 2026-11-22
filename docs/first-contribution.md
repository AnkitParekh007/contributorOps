# Your first ContributorOps contribution

**Start here if this is your first pull request.** You can improve ContributorOps without connecting a GitHub token or running any write-capable automation. This walkthrough goes from a clean checkout to a focused PR using the actual repository commands.

**Time and prerequisites:** Node.js **22 or newer**, npm **10 or newer**, Git, and a GitHub account if you want to submit a PR. GitHub CLI (`gh`) is optional. You can also start in [Codespaces](https://codespaces.new/AnkitParekh007/contributorOps?quickstart=1), which uses the project's dev-container configuration.

## 1. Choose a bounded issue and fork

Review [good first issues](https://github.com/AnkitParekh007/contributorOps/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and [help wanted](https://github.com/AnkitParekh007/contributorOps/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22). Check comments and open PRs before taking an issue.

For a **read-only evaluation**, clone the upstream repository:

```bash
git clone https://github.com/AnkitParekh007/contributorOps.git
cd contributorOps
```

To **submit your own changes**, first use GitHub's **Fork** button and clone your fork:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/contributorOps.git
cd contributorOps
git remote add upstream https://github.com/AnkitParekh007/contributorOps.git
git remote -v
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username. Do not push your work to the upstream `main` branch. With GitHub CLI, `gh repo fork AnkitParekh007/contributorOps --clone` is an alternative.

## 2. Install and run the app

```bash
node --version
npm --version
npm ci
npm run dev
```

This starts the **React product UI** (`apps/web`) and **Express API** (`apps/api`). Open the addresses printed in the terminal. The third surface, **public documentation/marketing website** (`apps/site`), can be run in another terminal:

```bash
npm run site:dev
```

With no personal GitHub token configured, you can explore **demo data** and the [browser-only walkthrough](https://ankitparekh007.github.io/contributorOps/#/demo). The browser walkthrough uses fictional example issues, never makes GitHub writes, and does not require sign-in.

If you need real GitHub discovery, see [environment setup](./environment-setup.md). Never commit `.env`, `.env.local`, credentials, or real user data.

## 3. Make a first, reviewable change

For your first PR, choose something limited: fix confusing docs, improve a keyboard label, or add an isolated regression test. For example, **clarify a sentence in a public guide**:

```bash
git fetch upstream  # only if you cloned your fork and added upstream above
git switch -c docs/clarify-first-run
```

Open `docs/environment-setup.md`, improve one unclear instruction **without changing its actual behavior**, and save. You should be able to explain precisely what a newcomer will understand better.

For a UI/accessibility change, start under `apps/site/src/pages` or `apps/site/src/components`. For API changes, start under `apps/api/src` and read the security boundary below before modifying write-related code.

## 4. Run the real validation commands

From the monorepo root:

```bash
npm run typecheck
npm run build:all
npm run test:api
```

For changes to `apps/site`, additionally run:

```bash
npm run site:quality
npm run site:lighthouse
```

Lighthouse launches browser checks and may need extra local setup; if you cannot run it, say so in your PR. At minimum inspect keyboard focus and a narrow mobile viewport for UI changes. Do not mark an unrun check as passing.

Inspect exactly what you are submitting:

```bash
git diff --check
git status --short
git diff --stat
git diff
```

If your changes are already committed, inspect `git show --stat` and `git show` instead of relying on an empty working-tree diff.

## 5. Push your branch and open a PR

If you cloned **your fork**:

```bash
git add docs/environment-setup.md
git commit -m "docs: clarify first-run environment setup"
git push -u origin docs/clarify-first-run
```

GitHub will offer a **Compare & pull request** link. Set the base repository to `AnkitParekh007/contributorOps` and the base branch to `main`. With GitHub CLI, you can run:

```bash
gh pr create --repo AnkitParekh007/contributorOps --base main --fill
```

Describe the **problem**, **scope**, **validation actually performed**, and **remaining limitations**. Link the relevant issue if applicable. For screenshots, show the real running interface (not a mockup) and avoid including secrets.

## 6. Understand the safety boundary

Most documentation, UI, and test PRs require no GitHub authorization knowledge beyond normal repository permissions. When a change touches GitHub write automation, first read [CONTRIBUTING.md](../CONTRIBUTING.md), the [Safety Policy](./safety-policy.md), and the [Security Model](./security-model.md).

ContributorOps has **two separate GitHub write-authority paths**:

- **Interactive:** a person inspects and approves an exact action using an action-scoped capability.
- **Standing exact-patch queue:** an operator **explicitly** enables bounded patch execution; live policy, duplicate, scope, rate-limit, exact-match, and disclosure checks apply before a draft PR can be opened.

**Discovery is not permission to write.** The hourly issue radar discovers candidates and may prepare contributor-owned workspaces only when explicitly enabled; it does not grant unbounded external write authority. Do not bypass approval checks or enable mass issue comments/PRs.

## Before requesting review

- Your branch contains one focused change, with no unrelated formatting or generated files.
- Your Node/npm prerequisites and commands match current `main`.
- You accurately describe tests, visual inspection, approval boundaries, and known gaps.
- You are ready to answer maintainer questions and refine the patch.

Thanks for contributing thoughtful, **verifiable** engineering work. The goal is a useful change a maintainer can actually review, not a higher PR count.
