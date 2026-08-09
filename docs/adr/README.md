# Architecture Decision Records

ContributorOps uses lightweight Architecture Decision Records (ADRs) to preserve the reasoning behind choices that affect trust, operability, and future evolution.

## Status model

- **Accepted** — current architecture direction
- **Superseded** — replaced by a newer ADR
- **Proposed** — under discussion

## Records

| ADR | Decision | Status |
| --- | --- | --- |
| [0001](./0001-human-approved-external-writes.md) | Human approval is required before external GitHub writes | Accepted |
| [0002](./0002-local-first-mvp-persistence.md) | Use local JSON persistence for the MVP boundary | Accepted |
| [0003](./0003-github-pages-public-site.md) | Use GitHub Pages for the static public site and docs | Accepted |

## Writing a new ADR

Use this compact structure:

1. Context
2. Decision
3. Consequences
4. Alternatives considered
5. Status

Create a new numbered file instead of silently changing the reasoning behind an accepted decision. If a decision changes, mark the previous ADR as superseded and link both records.