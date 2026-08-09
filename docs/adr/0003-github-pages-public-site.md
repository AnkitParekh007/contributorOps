# ADR-0003: GitHub Pages for the public product and documentation site

**Status:** Accepted

## Context

ContributorOps needs a public surface that explains the product, safety model, roadmap, contributor workflow, and engineering evidence without requiring backend availability.

The repository already uses GitHub Actions and benefits from keeping the public project experience close to the source code.

## Decision

Build `apps/site` as a static React + Vite application and deploy it to GitHub Pages through GitHub Actions.

Use a GitHub Pages-safe base path and hash-based client routing so deep navigation does not require server rewrite configuration.

The public site must not depend on runtime API availability for core documentation and project evaluation.

## Consequences

### Positive
- low operational overhead
- public documentation remains available independently of the API
- deployment is visible and auditable in the repository
- contributors can preview/build the site with standard workspace commands
- the project has a stable shareable public URL

### Negative
- hash routing is less elegant than server-backed history routing
- dynamic authenticated product behavior cannot live entirely on Pages
- advanced server-side SEO rendering is unavailable in the current architecture

## Alternatives considered

### Hosted SSR platform
Deferred because the current public site is primarily static and does not need server rendering enough to justify another production dependency.

### Serve the site from the Express API
Rejected for the public documentation surface because it would couple project visibility to backend uptime and deployment.

## Revisit trigger

Revisit this decision if ContributorOps needs authenticated public application flows, server-side rendering, custom edge behavior, or a production domain/runtime that materially improves the product. A migration should preserve stable public links where practical.