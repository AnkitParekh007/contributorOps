# Changelog

ContributorOps uses this changelog for meaningful project milestones. Fine-grained commit history remains available in GitHub.

## Unreleased — Phase 7: Security and trust hardening

### Approval boundary
- external contribution actions now use separate action-scoped approval capabilities for comments, fork branches, and draft pull requests
- legacy generic run tokens remain readable for history but fail closed for new external writes
- removed the legacy direct `/approved-pr` external-write route
- dashboard draft flow now prepares a reviewed run before any external action can be approved
- denied approval attempts are retained as explicit `approved: false` audit events

### Security proof
- added deterministic regression tests for cross-action token replay, explicit approval, state transitions, legacy token rejection, and scheduled-write separation
- added runtime high/critical dependency auditing as a merge gate
- added CodeQL analysis, dependency review, and Dependabot update policy
- updated the security disclosure policy and added a documented security model
- added reproducible CycloneDX SBOM generation

## 2026-08-09 — Phase 6: Production-grade quality proof

### Quality gates
- route-level title and description metadata for major public surfaces
- deterministic site-quality script for routes, links, metadata, JSX accessibility hygiene, and GitHub Pages build paths
- Lighthouse CI budgets for accessibility, performance, best practices, and SEO
- public Quality page that maps engineering claims to enforceable CI gates
- documented quality-policy boundaries so automated scores are not presented as production reliability claims

## 2026-08-09 — Phase 5: Measurable adoption and launch execution

### Adoption
- public Adoption dashboard backed by public GitHub API signals
- clear separation between repository engagement and customer/user claims
- maintainer adoption scorecard using GitHub Insights traffic metrics

### Measurement
- optional Plausible integration, disabled unless explicitly configured
- hash-route and outbound-link measurement support when configured
- selected conversion-event hooks without intentional PII properties
- campaign-tagged Share Hub links for aggregate launch attribution

### Launch execution
- concrete launch execution playbook with baseline capture, launch waves, and 48-hour review
- contributor-retention playbook focused on repeat contribution quality
- structured workflow-feedback issue form for developers, maintainers, recruiters, and engineering evaluators
- updated README, navigation, privacy policy, launch checklist, and Share Kit

## 2026-08-09 — Phase 4: Distribution and growth loops

- added audience-specific Share Hub with copy/share actions
- published distribution playbook and launch sequencing
- added GitHub release-note configuration
- added citation metadata for repository reuse/reference
- shifted preview messaging toward open-source contribution rather than waitlist-first conversion

## 2026-08-09 — Phase 3: Authority and shareability

- added a two-minute recruiter brief
- published system architecture and Architecture Decision Records
- added contributor recognition guidance
- strengthened README evidence paths and social-preview positioning
- added launch/share assets and explicit production boundaries

## 2026-08-09 — Phase 2: Contributor and recruiter growth

- added Engineering Showcase and Contribute pages
- created a GitHub-native `good first issue` / `help wanted` contribution funnel
- shifted public navigation toward open-source participation
- closed stale archive/transfer messaging that conflicted with active development

## 2026-08-09 — Phase 1: Public project positioning

- rewrote the repository front door for developers, recruiters, and maintainers
- added prominent star/fork/contribute paths
- improved SEO/social metadata and sitemap correctness
- added Code of Conduct, issue forms, and pull-request template

## Release philosophy

A GitHub release should represent a meaningful capability, architecture, safety, or contributor-experience milestone. ContributorOps does not publish releases merely to create activity.
