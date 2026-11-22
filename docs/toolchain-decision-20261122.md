# Node.js 22 toolchain maintenance decision — 2026-11-22

This records the outcome of [issue #42](https://github.com/AnkitParekh007/contributorOps/issues/42) and replaces the old, conflicted August Dependabot major-version PRs with a documented baseline.

## Verified compatible changes

- The supported runtime remains **Node.js 22+**, npm 10+.
- The API workspace now explicitly depends on **`@types/node ^22.20.5`**, instead of Node 24 types. npm may install a separate root Node 24 type package for other transitive consumers; the API module resolves its **workspace-local Node 22 types**. These are not evidence the runtime is Node 24.
- The compatible `tsx` 4.x resolver was refreshed to **4.23.15** in the lockfile while keeping the existing supported semver range.
- The GitHub Pages deployment workflow now uses **`actions/checkout@v6`**, matching other tested workflows instead of keeping an older v4 instance.

[The controlled dependency-update Actions run](https://github.com/AnkitParekh007/contributorOps/actions/runs/45040523627) completed API tests, TypeScript, API/Web/Site builds, site-quality, and both full and runtime high-severity npm audits with **no high/critical vulnerabilities**. It then removed its temporary write-capable workflow. Normal PR CI and the real Pages deploy are independent final gates.

## Explicitly deferred major updates

| Previously opened PR | Decision |
| --- | --- |
| #23, #25, #26 (deploy-pages v5, upload-artifact v7, cache v6) | **Defer** until a clean current-main integration and actual Pages deployment pass; avoid an untested coordinated Actions upgrade |
| #24 (checkout v7) | **Defer**; checkout v6 is already used in CI and now in Pages |
| #29 (`@types/node` v26) | **Decline for Node 22**; API types now explicitly align to Node 22 |
| #30 (`@vitejs/plugin-react` v6) | **Defer**; prior major-version attempt failed CI. Evaluate with a matching Vite/toolchain migration and browser checks |
| #31 (TypeScript v7) | **Defer**; prior major-version attempt failed CI. Keep the tested TypeScript 5.9 branch and revisit in a separate tested migration |
| #28 (tsx 4.23.9) | **Superseded** by compatible lockfile refresh to tsx 4.23.15 |

These are engineering compatibility decisions, **not** claims that major migrations have been completed. Dependabot remains enabled for new vulnerability and minor/patch updates. Re-evaluate major versions when tested support exists, without disabling safety checks or widening unattended GitHub write permissions.

## Acceptance gate

Before the maintenance PR lands, require CI, CodeQL, Lighthouse, TypeScript, API tests and both audits to pass. After merge, verify GitHub Pages deploys on the tested checkout version. A green workflow does not prove Dependency Review is active while GitHub Dependency Graph remains disabled ([issue #21](https://github.com/AnkitParekh007/contributorOps/issues/21)).
