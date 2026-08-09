# ContributorOps Quality Gates

ContributorOps treats quality claims as useful only when they map to checks that can fail before merge.

This document describes the current repository quality gates, their scope, and their limitations.

## Merge gate overview

Every pull request targeting `main` runs the CI workflow in `.github/workflows/ci.yml`.

The current quality layers are:

1. dependency reproducibility with `npm ci`
2. API build
3. product Web build
4. public Site build
5. TypeScript checks for API, Web, and Site
6. common secret-pattern scan
7. deterministic public-site integrity checks
8. Lighthouse accessibility, performance, best-practices, and SEO budgets

A green badge is not the goal by itself. The goal is to make regressions visible before they become part of the repository's public proof.

## Deterministic site quality gate

Run locally with:

```bash
npm run site:quality
```

The command builds the public site and runs `scripts/site-quality.mjs`.

The script currently checks:

- `html lang` exists
- viewport metadata exists
- document description exists
- canonical metadata exists
- Open Graph title/description exist
- Twitter card metadata exists
- manifest link exists
- the document has a non-empty title
- public routes are discoverable from `App.tsx`
- every static public route has a route-level metadata definition
- dynamic documentation routes receive generated metadata
- literal internal React Router links resolve to declared routes
- JSX image elements include an `alt` attribute
- JSX button elements declare an explicit `type`
- the Site build output exists
- production assets retain the `/contributorOps/` GitHub Pages base path
- no accidental root-relative `/assets` output is emitted

These checks are deliberately deterministic and run without external credentials.

## Route-level metadata

`apps/site/src/components/RouteMeta.tsx` updates metadata when HashRouter navigation changes.

For major public routes it manages:

- `document.title`
- description
- Open Graph title
- Open Graph description
- Open Graph URL
- Twitter title
- Twitter description

Documentation article routes receive generated metadata based on the document slug.

The static quality gate requires metadata coverage whenever a new static route is added.

That means adding a public route without adding its metadata should fail CI instead of becoming an easy-to-miss SEO/accessibility regression.

## Lighthouse budgets

Run the same browser-level quality gate locally with one command:

```bash
npm run site:lighthouse
```

That command:

1. builds the Site
2. prepares a local directory that mirrors the real GitHub Pages `/contributorOps/` base path
3. runs pinned Lighthouse CI `0.15.0`
4. fails when any configured category falls below its budget

Lighthouse CI runs against the built GitHub Pages-shaped site for:

- Home
- Showcase
- Contribute
- Try
- Quality

Current minimum category scores:

| Category | Minimum |
| --- | ---: |
| Accessibility | 0.90 |
| Performance | 0.80 |
| Best Practices | 0.90 |
| SEO | 0.90 |

The budgets and route set are stored in `lighthouserc.json`.

They are intended as regression floors, not marketing claims. A score above the floor does not mean the site is universally accessible or production-perfect.

## Accessibility boundary

The automated checks cover machine-detectable accessibility issues and static JSX hygiene.

They do **not** replace:

- keyboard-only manual testing
- screen-reader testing
- zoom/reflow testing
- real mobile-device testing
- cognitive-accessibility review
- testing with actual assistive-technology users

Any accessibility issue found manually is valid even if Lighthouse is green.

## Security boundary

The secret scan catches only common credential patterns. It is not a complete secret-detection or dependency-vulnerability platform.

ContributorOps still requires reviewers to inspect:

- environment-variable changes
- token handling
- OAuth flows
- Supabase service credentials
- GitHub write paths
- external-action permissions

Changes affecting GitHub automation must also satisfy `docs/safety-policy.md` and the human-approval architecture in ADR-0001.

## Performance boundary

Lighthouse runs in CI under a synthetic environment. It is useful for regression detection but is not equivalent to production field data.

ContributorOps does not currently claim:

- production Core Web Vitals
- uptime SLOs
- multi-region latency
- hosted SaaS availability

Those claims would require production telemetry that the current open-source preview does not have.

## When a gate fails

Do not lower a budget only to make CI green.

Use this order:

1. reproduce the failure
2. identify whether it is a product regression, flaky measurement, or an invalid gate
3. fix the product when practical
4. document a justified gate change when the previous threshold or assertion is genuinely wrong
5. explain the decision in the pull request

Material changes to the quality model should receive an ADR when they alter long-term engineering policy.

## Reviewer checklist

Before merging a quality-sensitive change, confirm:

- [ ] API/Web/Site builds pass
- [ ] TypeScript checks pass
- [ ] deterministic Site Quality gate passes
- [ ] Lighthouse budgets pass
- [ ] secret scan passes
- [ ] new public routes include metadata
- [ ] keyboard/focus behavior was considered for changed interactions
- [ ] external GitHub write behavior is unchanged or explicitly reviewed under the safety policy

## Public proof

The public Quality page is available at:

`https://ankitparekh007.github.io/contributorOps/#/quality`

It summarizes only currently enforced gates and explicitly states what those gates do not prove.
