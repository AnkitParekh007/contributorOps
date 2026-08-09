# ContributorOps Launch Checklist

Use this checklist before a public launch push, recruiter campaign, community announcement, or meaningful GitHub release. It reflects the current GitHub Pages routes and the project's open-source-first positioning.

## 1. Technical baseline

- [x] GitHub Pages deployment workflow exists
- [x] CI validates API, Web, Site, TypeScript, and common secret patterns
- [x] SEO and social metadata exist in `apps/site/index.html`
- [x] `robots.txt`, `sitemap.xml`, manifest, and favicons exist
- [x] public safety model is documented
- [x] repository citation metadata exists in `CITATION.cff`
- [x] generated release-note categories exist in `.github/release.yml`
- [ ] run a fresh Lighthouse pass on the deployed home, Showcase, Contribute, Recruiter, and Share pages
- [ ] test mobile navigation and CTAs on a real narrow viewport
- [ ] verify every external GitHub link in the public site after merge

## 2. Public product routes

Verify these deployed routes after the launch PR reaches `main`:

- [ ] `/#/` — Home
- [ ] `/#/features` — Features
- [ ] `/#/showcase` — Engineering showcase
- [ ] `/#/contribute` — Contributor onboarding
- [ ] `/#/recruiter` — Recruiter brief
- [ ] `/#/share` — Audience-specific share hub
- [ ] `/#/pricing` — Pricing architecture
- [ ] `/#/docs` — Documentation
- [ ] `/#/safety` — Safety model
- [ ] `/#/roadmap` — Roadmap
- [ ] `/#/waitlist` — Early-access interest

## 3. Repository authority

- [x] strong README with quick start and architecture summary
- [x] `CONTRIBUTING.md`, Code of Conduct, issue forms, and PR template
- [x] `good first issue` / `help wanted` contribution funnel
- [x] architecture document
- [x] Architecture Decision Records for major trust/operability choices
- [x] contributor recognition guidance
- [x] changelog and repeatable release-note configuration
- [x] citation metadata
- [ ] add/update GitHub repository description in Settings/About
- [ ] set repository website to `https://ankitparekh007.github.io/contributorOps/`
- [ ] add repository topics in Settings/About
- [ ] upload the repository social preview image in Settings → General → Social preview

### Recommended repository description

> Human-approved OSS contribution intelligence: discover better issues, prepare stronger PRs, and turn real contributions into recruiter-readable proof.

### Recommended topics

`open-source`, `developer-tools`, `github`, `typescript`, `react`, `nodejs`, `career`, `portfolio`, `pull-requests`, `ai-tools`

## 4. Recruiter readiness

- [ ] recruiter brief can be understood in under two minutes
- [ ] architecture and ADR links are visible from the recruiter surface
- [ ] example proof is clearly labeled as example data
- [ ] production boundaries are stated without underselling implemented work
- [ ] shareable recruiter URL works after GitHub Pages deployment
- [ ] recruiter option on the Share Hub copies the correct concise message and URL

## 5. Community readiness

- [ ] at least three open `good first issue` items remain available
- [ ] every starter issue has concrete acceptance criteria
- [ ] contributor setup commands match current package scripts
- [ ] responses to contributor questions are timely and specific
- [ ] merged external contributions are acknowledged through release notes / contributor history

## 6. Distribution package

Use:
- [`docs/distribution-playbook.md`](./distribution-playbook.md) for launch waves, conversion logic, and growth rules
- [`docs/share-kit.md`](./share-kit.md) for canonical copy and article angles
- the public `/#/share` route for audience-specific copy and Web Share/clipboard actions

Before posting:
- [ ] choose one primary audience per post
- [ ] lead with the developer problem or engineering decision, not star-count goals
- [ ] link directly to the most relevant surface
- [ ] avoid invented adoption metrics, testimonials, or customer claims
- [ ] include a concrete ask: feedback, contribution, architecture review, or star if useful
- [ ] do not coordinate upvotes/comments/stars

## 7. Suggested launch sequence

1. GitHub + README first: make sure repo metadata, preview image, starter issues, release notes, and CI are clean.
2. Publish a meaningful GitHub release that explains the current milestone and acknowledges contributors.
3. LinkedIn: engineering/product story with recruiter brief or Showcase link.
4. Dev.to or Hashnode: architecture deep dive centered on the approval boundary and proof-of-work model.
5. Reddit/community forums: problem-first discussion, transparent that it is your open-source project.
6. X / Bluesky: short visual product thread pointing to the live Showcase or Share Hub.
7. Show HN only after the project is directly tryable without a mandatory signup barrier.
8. Relevant newsletters/directories only after the public site and repo metadata are stable.

## 8. Post-launch signal to track

Track durable signals rather than vanity traffic alone:
- stars and forks over time
- unique contributors and merged external PRs
- issue-to-PR conversion on `good first issue`
- repeat contributors
- repository traffic and referring sites
- recruiter or engineering-leader conversations generated from the brief
- qualitative maintainer feedback about contribution quality

Do not optimize the product toward automated contribution volume to improve these numbers. The maintainer-trust model remains the primary constraint.

## 9. Release checklist

For every meaningful release:
- [ ] describe what materially changed and why
- [ ] link architecture/ADR changes when relevant
- [ ] call out safety/trust implications
- [ ] acknowledge external contributors and meaningful reviews
- [ ] state current limitations honestly
- [ ] include a live demo/showcase link when useful
- [ ] share the release only with audiences for whom it is relevant
