# ContributorOps Architecture

ContributorOps is a monorepo with three product/runtime surfaces and one deliberately narrow trust boundary around external GitHub writes.

## System context

```text
Developer / contributor
  ├─> apps/site  — public product, docs, showcase, recruiter and contributor surfaces
  └─> apps/web   — interactive product UI
                    └─> apps/api — planning, scoring, persistence, GitHub integration
                                  ├─> data/ — local MVP state
                                  └─> GitHub via Octokit
```

GitHub Actions validates the monorepo and deploys the static public site. Scheduled planning workflows may research and prepare work but do not get unattended permission to write to third-party repositories.

## Surfaces

### apps/site
React + Vite + TypeScript static public surface deployed to GitHub Pages.

### apps/web
React + Vite + TypeScript interactive product interface for discovery, planning, contribution-control, and proof-of-work workflows.

### apps/api
Node.js + Express + TypeScript orchestration and GitHub integration boundary.

### data
Local JSON-backed MVP persistence. This is deliberately replaceable and is not presented as production multi-user storage.

## Trust boundaries

1. **Read access is not write permission.** Discovery and planning do not imply permission to comment, branch, commit, or open pull requests.
2. **External writes require human approval.** Higher-risk actions cross an explicit approval boundary for the exact operation.
3. **Scheduled jobs are planning-only toward third-party repositories.** No unattended external write loop.
4. **Auditability is part of the feature.** Controlled actions should leave enough evidence to explain what was approved and what happened.

## CI

Pull requests to `main` validate:
- dependency installation
- API build
- Web build
- Site build
- TypeScript checks across all three apps
- common secret-pattern scanning

## Architecture Decision Records

The full repository contains ADRs for the main decisions:

- [ADR-0001: Human-approved external GitHub writes](https://github.com/AnkitParekh007/contributorOps/blob/main/docs/adr/0001-human-approved-external-writes.md)
- [ADR-0002: Local-first persistence for the MVP](https://github.com/AnkitParekh007/contributorOps/blob/main/docs/adr/0002-local-first-mvp-persistence.md)
- [ADR-0003: GitHub Pages for the public site](https://github.com/AnkitParekh007/contributorOps/blob/main/docs/adr/0003-github-pages-public-site.md)

For diagrams, production evolution, and the complete architecture narrative, read the [repository architecture document](https://github.com/AnkitParekh007/contributorOps/blob/main/docs/architecture.md).
