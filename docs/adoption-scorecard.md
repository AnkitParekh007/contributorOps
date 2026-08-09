# ContributorOps Adoption Scorecard

This scorecard defines how ContributorOps measures growth without optimizing for vanity activity or silently introducing invasive tracking.

## Measurement principles

1. **Separate public repository signal from product-user claims.** Stars, forks, issues, and contributors are GitHub engagement signals. They are not customer counts.
2. **Use GitHub as the source of truth for repository adoption.** The public `/#/adoption` page reads public GitHub API data directly.
3. **Use GitHub Insights for private traffic metrics.** Repository owners and collaborators with push access can review traffic, referrers, popular content, views, unique visitors, and clones in **Insights → Traffic**.
4. **Keep site analytics optional.** The public site loads no analytics script unless `VITE_PLAUSIBLE_SCRIPT_SRC` is configured at build time.
5. **Do not collect PII in custom events.** Event properties should describe surfaces and actions, never names, usernames, emails, tokens, or other identifying values.

## Public adoption dashboard

Route:

`https://ankitparekh007.github.io/contributorOps/#/adoption`

The page reads:

- stars
- forks
- open issues + pull requests
- listed contributors (first 100 from the public contributors endpoint, excluding entries GitHub marks as bots)
- repository update timestamp

The public page deliberately does not attempt to expose GitHub Traffic data because that data is permissioned to repository maintainers.

## Maintainer-only GitHub traffic

Review weekly:

`https://github.com/AnkitParekh007/contributorOps/graphs/traffic`

Capture the following values in your weekly notes or release retrospective:

| Metric | Why it matters |
| --- | --- |
| Views | top-of-funnel repository interest |
| Unique visitors | approximate reach over GitHub's available traffic window |
| Clones | stronger implementation/inspection intent |
| Unique cloners | distinct clone intent |
| Referring sites | which launch/community surfaces generate useful visits |
| Popular content | README/docs/pages that earn attention |

Do not publish GitHub Traffic screenshots as proof of customers or active product users.

## Optional Plausible integration

ContributorOps supports an optional Plausible script but ships with analytics **disabled**.

### Configure

Create a Plausible site for:

`ankitparekh007.github.io/contributorOps`

Copy the unique per-site script URL from Plausible's Site Installation screen. It looks similar to:

```text
https://plausible.io/js/pa-XXXXX.js
```

Set this environment variable for the site build:

```bash
VITE_PLAUSIBLE_SCRIPT_SRC=https://plausible.io/js/pa-XXXXX.js
```

When configured, `apps/site/src/lib/analytics.ts` initializes the script with:

- hash-based route tracking
- outbound-link measurement
- selected custom conversion events

When the variable is absent, no Plausible script is added to the page.

## Conversion events

Keep the event set small and actionable.

### Page-level goals

Useful route goals:

- `/#/showcase` — technical/product interest
- `/#/recruiter` — hiring/evaluation intent
- `/#/contribute` — contributor intent
- `/#/share` — advocacy/share intent
- `/#/adoption` — adoption/metrics interest

### Custom events

Current Phase 5 event names:

- `Adoption CTA`
  - `action=open_repository`
  - `action=open_contribute`
- `Share Action`
  - action such as `copy`, `native_share`, or `open_destination`
  - audience such as `developer`, `recruiter`, `maintainer`, or `community`

Do not attach usernames, email addresses, issue content, or other potentially identifying values to analytics events.

## Campaign attribution

Use UTM tags for deliberate launch links so referral traffic can be attributed without creating user profiles.

Examples:

### LinkedIn recruiter launch

```text
https://ankitparekh007.github.io/contributorOps/?utm_source=linkedin&utm_medium=social&utm_campaign=phase5-launch&utm_content=recruiter-brief#/recruiter
```

### Developer community launch

```text
https://ankitparekh007.github.io/contributorOps/?utm_source=dev-community&utm_medium=community&utm_campaign=phase5-launch&utm_content=showcase#/showcase
```

### GitHub README

Use the canonical untagged links inside the repository itself. UTMs are for deliberate external campaign links, not every internal navigation action.

## Weekly scorecard

Capture once per week, ideally on the same weekday:

| Funnel stage | Signal | Current | Previous | Change | Notes |
| --- | --- | ---: | ---: | ---: | --- |
| Discovery | unique GitHub visitors | — | — | — | GitHub Insights |
| Interest | stars | — | — | — | public GitHub metric |
| Evaluation | clones / unique cloners | — | — | — | GitHub Insights |
| Intent | forks | — | — | — | public GitHub metric |
| Participation | new issues / PRs | — | — | — | GitHub |
| Contribution | merged external PRs | — | — | — | GitHub |
| Retention | repeat external contributors | — | — | — | GitHub contributor history |
| Hiring signal | recruiter conversations | — | — | — | manual qualitative count |

## Healthy growth interpretation

Good signals:

- views increase after useful technical content is published
- stars/forks rise without coordinated engagement
- clones increase after architecture/demo launches
- starter issues convert into focused PRs
- contributors return for a second contribution
- recruiter conversations reference architecture, safety, or implementation details

Warning signals:

- traffic increases but nobody reaches Contribute/Recruiter/Showcase
- starter issues are repeatedly abandoned because scope is unclear
- stars rise but forks/issues/PRs remain flat over multiple launch waves
- external contributions require heavy rework because onboarding is insufficient
- promotional posting produces moderation friction or low-quality discussion

## Decision rule

Use measurement to improve the project and its explanation—not to weaken the human-approval boundary, generate low-context GitHub activity, or pressure communities into artificial engagement.
