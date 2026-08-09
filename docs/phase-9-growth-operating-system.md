# Phase 9 — Growth operating system

Phase 9 moves ContributorOps from launch readiness to measured public distribution. The goal is not to maximize raw impressions. It is to learn which launch channels produce product evaluation, useful feedback, source inspection, contributions, and repeat participation.

## Growth truth contract

ContributorOps keeps four signal classes separate:

1. **Public GitHub participation** — stars, forks, issues, pull requests, and contributor history.
2. **Maintainer-only GitHub traffic** — views, unique visitors, clones, referrers, and popular content from Insights → Traffic.
3. **Optional site conversion telemetry** — selected low-cardinality events when the Plausible integration is explicitly configured.
4. **Qualitative evidence** — useful issue feedback, maintainer critique, recruiter feedback, contribution starts, and repeat contributors.

A public repository metric is never presented as a customer count. No conversion rate is reported when the numerator or denominator is unavailable.

## Canonical campaign

All Phase 9 distribution uses campaign id `phase9-growth`.

The application owns the channel registry in `apps/site/src/lib/campaigns.ts`. Each channel has one audience, one destination, one goal, and these attribution dimensions:

- `utm_source`
- `utm_medium`
- `utm_campaign=phase9-growth`
- `utm_content`

The canonical channels are:

| Channel | Destination | Primary goal |
| --- | --- | --- |
| Show HN | Browser demo | Technical evaluation and feedback |
| Product Hunt | Launch hub | Product evaluation without SaaS overclaiming |
| Developer communities | Browser demo | Engineering discussion and contributor interest |
| Recruiter outreach | Recruiter brief | Architecture / hiring evaluation |
| Maintainer outreach | Safety model | Critique of trust and automation boundaries |
| GitHub repository | Browser demo | Convert repository discovery into product evaluation |

The Share Hub uses the same campaign builder so campaign naming cannot silently diverge.

## Event funnel

When optional site analytics is configured, evaluate this sequence rather than optimizing a single click:

1. attributed visit
2. browser-demo interaction
3. demo reaches the `prove` step
4. source, Codespaces, safety, recruiter, or contribution path opened
5. GitHub issue / PR participation
6. repeat contributor activity

The browser demo already emits role-selection and step events. Reaching the `prove` step is the deterministic proxy for a completed walkthrough.

## Pre-launch baseline

Before the first Phase 9 distribution wave, capture:

### Public
- stars
- forks
- open issues / pull requests
- listed contributors

### GitHub Insights → Traffic
- views / unique visitors
- clones / unique cloners
- top referring sites
- popular content

### Optional analytics
If configured, record the current event baseline before sharing Phase 9 campaign links.

Do not postpone the launch merely because optional analytics is disabled. GitHub traffic and qualitative feedback still provide useful evidence.

## Wave 1 — technical evaluators

Start with audiences most likely to provide engineering feedback:

- Show HN packet from `docs/phase-8-launch-execution.md`
- one relevant frontend / AI / OSS developer community
- a small set of maintainers or senior engineers who can critique the authorization model

Primary question: **Does the product and trust model make sense after a short hands-on evaluation?**

Do not ask people to star the repository as the main action. Ask them to try, inspect, critique, or contribute.

## Wave 2 — product discovery

After Wave 1 feedback is incorporated or consciously rejected, use the Product Hunt / broader builder path.

Lead with:

- browser demo or launch hub
- open-source availability
- explicit hosted-SaaS boundaries
- current security / CI proof
- a concrete request for product feedback

## Wave 3 — hiring proof

Use the recruiter-specific campaign URL for targeted hiring and engineering-leader sharing.

Lead with the two-minute brief instead of a generic repository URL. The desired outcome is architecture evaluation, not a vanity repository action.

## 48-hour review

At 48 hours after each meaningful launch wave, record:

- traffic by available source/referrer
- browser-demo interaction and completion when analytics is configured
- repository stars and forks as secondary intent signals
- issue / PR activity
- useful feedback threads
- Codespaces / clone signals where available
- contribution starts

For every channel, classify the result as:

- **keep** — produced meaningful evaluation or participation
- **change artifact** — attention arrived but users did not reach the intended proof
- **change message** — wrong expectation or audience fit
- **stop** — repeated activity would add noise without learning

## 7-day review

Seven days after the first Phase 9 wave:

1. compare public metrics to the baseline
2. compare GitHub traffic to the baseline
3. review campaign-attributed events if configured
4. count substantive feedback separately from reactions
5. identify first-time contributors and any repeat participation
6. update the next launch artifact based on the strongest drop-off or confusion point

The 7-day review should end with a decision, not just a metrics screenshot.

## Anti-gaming rules

- Do not run coordinated star campaigns or ask groups to inflate GitHub metrics.
- Do not coordinate Product Hunt votes, Hacker News votes, reactions, or comments.
- Do not mass-post identical launch copy across communities.
- Do not use fake accounts, purchased engagement, engagement exchanges, or misleading user counts.
- Do not describe repository visitors as product users or customers.
- Do not optimize a channel solely because it produces the easiest public metric.

Organic stars and forks are welcome outcomes, but they are not the operating objective.

## Growth integrity gate

Run:

```bash
npm run growth:quality
```

The deterministic gate verifies:

- the Phase 9 campaign id
- required channel registry entries
- all four UTM dimensions
- analytics campaign enrichment
- Growth dashboard usage of the canonical registry
- Share Hub reuse of the same campaign builder
- 48-hour / 7-day review policy
- anti-gaming requirements

This gate catches attribution and policy drift; it does not prove a channel is effective.

## Manual tasks

The following remain intentionally human-operated:

- repository About/topics/social-preview settings
- enabling GitHub Dependency Graph
- capturing GitHub Insights traffic baselines
- submitting to external communities
- responding to public feedback
- deciding whether a channel should continue after the review window

Issue #12 is the canonical checklist for the launch/settings work that cannot be completed through the repository code path.
