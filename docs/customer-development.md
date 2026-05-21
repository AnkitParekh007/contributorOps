# Customer Development

This document tracks target customer segments, interview questions, validation plan, and go-to-market strategy for ContributorOps.

---

## Target Customer Segments

### 1. Junior Developers (0–2 Years Experience)

**Profile:** Recent CS graduates or self-taught developers in their first or second role. Struggling to differentiate themselves from other entry-level candidates. Have learned the skills but lack visible evidence of applying them in real-world contexts.

**Core problem:** Recruiters ask for experience they haven't had the chance to get yet. Side projects feel thin. Bootcamp projects all look the same. They need something that reads as professional and verifiable.

**What ContributorOps offers them:** A structured path to their first merged PR in a real project, plus the tooling to turn that into a resume bullet and portfolio entry they can actually talk about.

**Willingness to pay:** Low-to-medium. $19/month Pro is viable if they genuinely believe it helps them get a job. Free tier is the entry point.

---

### 2. Mid-Level Developers Switching Roles

**Profile:** 3–6 years of experience, currently employed, wants to move from backend to full-stack, or from one industry to another (e.g., fintech to infrastructure, web to AI tooling). Has skills but their public GitHub doesn't reflect the direction they're moving.

**Core problem:** Their GitHub history shows what they've been paid to do, not what they want to do next. They need to build visible evidence in the target domain before job searching.

**What ContributorOps offers them:** Targeted issue discovery by tech stack and domain, plus portfolio tooling to frame new contributions in the context of the role they're pursuing.

**Willingness to pay:** Medium-to-high. $49/month Career plan is realistic for someone actively job searching in a new direction.

---

### 3. Bootcamp Graduates

**Profile:** Completed an intensive program (12–24 weeks). Have classroom projects, capstone work, and tutorial code. Entering the job market with no real-world professional experience and a portfolio that looks like everyone else's from the same cohort.

**Core problem:** Employers have seen a thousand bootcamp portfolios. The contribution from a maintained OSS project is the thing that stands out because very few bootcamp grads have it.

**What ContributorOps offers them:** Guided first contribution — discovery, proposal drafting, quality check — with a low floor for getting started. The goal is one merged PR before the job search starts.

**Willingness to pay:** Low initially. This segment benefits most from the Free tier. Pro conversion happens after the first real contribution succeeds.

---

### 4. Developer Relations Professionals

**Profile:** DevRel engineers, developer advocates, or technical community managers. Need a strong public OSS presence as a credential for their role. Often contribute to OSS but their activity is scattered across repositories they don't track systematically.

**Core problem:** Their contribution activity looks unfocused because it is. They need to curate and communicate it better, especially when job searching within or transitioning out of DevRel.

**What ContributorOps offers them:** Portfolio organization, resume export, and public portfolio sharing. The discovery and planning features are secondary for this segment.

**Willingness to pay:** Medium. Career plan at $49/month is a fit. May also have budget from employer for career development tools.

---

### 5. Bootcamp Instructors and Coordinators

**Profile:** Leads curriculum at a coding bootcamp or technical training program. Responsible for student outcomes and placement rates. Wants students to have differentiating assets before graduation.

**Core problem:** Students graduate without verified real-world contributions. The instructor knows this is a gap but doesn't have a scalable way to run OSS contribution programs within a curriculum.

**What ContributorOps offers them:** Team plan with multiple developer seats, shared repository radar, and student portfolio tracking. Enables running a structured "OSS contribution sprint" as part of the curriculum.

**Willingness to pay:** High for institutional buyers. $199/month Team plan is viable if it demonstrably improves student placement rates.

---

### 6. Technical Recruiters

**Profile:** In-house or agency recruiters who evaluate developer candidates. Spends significant time trying to verify portfolio claims that are unverifiable.

**Core problem:** "Contributed to open source" on a resume means nothing without a link, and most links don't tell a clear story. They want proof-of-work that is credible, readable, and tells them what the developer actually did.

**What ContributorOps offers them:** The public portfolio and resume export features — what a developer generates with ContributorOps is designed to be readable and verifiable by a non-technical recruiter.

**Willingness to pay:** This segment probably doesn't pay directly. Their value is as a pull-through buyer — recruiters requesting ContributorOps-formatted portfolios creates demand among developers.

---

## Customer Interview Questions

### For Developers

1. How do you currently show proof of your technical work to recruiters? What does your portfolio look like right now?
2. Have you ever tried contributing to an open-source project? What happened — did you follow through, and if not, what stopped you or slowed you down?
3. If you had a merged PR in a real OSS project right now, how would you use it in your job search? What would you say about it in an interview?
4. What does "job-ready portfolio" mean to you right now — what would make you feel confident applying?
5. Have you ever received feedback from a recruiter or hiring manager about your GitHub profile? What did they say?
6. When you look at your GitHub profile, what do you wish looked different?

### For Bootcamp Operators

1. How do you currently help students build visible proof of work beyond their capstone project?
2. What's the biggest gap between what students build in your curriculum and what employers say they want to see?
3. How do you currently measure student portfolio quality before graduation?
4. Have you ever run an OSS contribution component in your curriculum? What happened?
5. How do your placement rates compare between students with and without real-world contributions on their resumes?
6. If a tool could help every student leave your program with at least one merged PR in a maintained project, what would that be worth to you?

### For Recruiters

1. When you see "contributed to open source" on a resume, how do you verify it? Do you click the link?
2. What would make a developer's GitHub profile more convincing to you — what are you actually looking at?
3. Have you ever rejected a candidate because their portfolio lacked credibility or was unverifiable? How often does that happen?
4. What's the most impressive thing you've seen in a developer portfolio? What made it stand out?
5. If a candidate gave you a link to a single page summarizing their top 3 contributions with context and impact, would that be useful?

---

## Validation Plan

**Phase 1 — Problem Validation (Weeks 1–3)**
- Conduct 10 developer interviews to validate problem severity
- Goal: Confirm that "can't show my work convincingly" is a top-3 career frustration for junior and mid-level developers
- Method: Reach out through bootcamp alumni networks, Reddit (r/cscareerquestions), LinkedIn, and personal network

**Phase 2 — Team Tier Interest (Weeks 3–5)**
- Have 5 conversations with bootcamp instructors or coordinators
- Goal: Validate that the Team plan concept resonates and $199/month is in the right range
- Method: LinkedIn outreach, bootcamp community Slack channels

**Phase 3 — Waitlist Launch (Week 4)**
- Ship the waitlist endpoint and page
- Target: 100 signups in the first 30 days
- Track: where signups come from, which plan interests people most, what role they have

**Phase 4 — Early User Cohort (Weeks 6–8)**
- Offer the Career plan free for 90 days to the first 10 users in exchange for weekly 30-minute feedback calls
- Goal: First real merged PRs through the product, collect testimonials and friction points

**Phase 5 — First Paid Conversion (Week 10+)**
- Target first paid conversion at $19/month Pro tier
- Success metric: 5 paying users before public launch announcement

---

## First 100 Users Strategy

**Community posts (organic):**
- Post in `r/cscareerquestions` with a problem-framing post ("I built a tool to help developers build OSS proof-of-work") — lead with the problem, not the product
- Post in `r/webdev` and `r/javascript` with a show-and-tell post once the site is live
- Share in JavaScript/TypeScript Discord communities (e.g., Reactiflux, TypeScript Discord)
- Post in dev-focused Slack communities for bootcamp alumni networks

**Content (earned):**
- Write a Dev.to post: "Why I can't show my work as a developer (and what I'm building about it)"
- Write a Hashnode post: "The architecture of ContributorOps: local-first, human-approved, file-based"
- Post the founder story on LinkedIn — honest, specific, not promotional

**GitHub visibility:**
- Ensure README quality is excellent — clear value prop in first 3 lines
- Add relevant GitHub topics to the repo
- Update repo description and website URL in GitHub settings
- Respond to every issue and star notification personally in the first 100 days

**Product Hunt:**
- Submit after reaching 50 waitlist signups (social proof matters for PH launch)
- Prepare a first comment explaining the trust-first philosophy
- Coordinate upvotes from genuine supporters — no fake voting

---

## Pricing Tests

**Test 1: Junior developer willingness to pay at $19/month**
- Hypothesis: Yes, if they genuinely believe it helps them get a job
- How to test: Show the Pro pricing page to 10 developers in job-search mode, ask directly "Would you pay this? What would you need to see first?"
- Success signal: 5 of 10 say they would pay after seeing the features list

**Test 2: Bootcamp willingness to pay $199/month for Team**
- Hypothesis: Yes, if it measurably reduces the effort of running student portfolio programs
- How to test: Walk through the Team features with 3 bootcamp operators, present the price, and ask what objections they have
- Success signal: At least 1 operator willing to pilot at $199/month with a small cohort

**Test 3: $99 Founder Lifetime Deal compelling enough for early signups**
- Hypothesis: Yes, for developers who dislike subscriptions and want to bet early on a useful tool
- How to test: Feature it prominently on the waitlist and pricing pages during the first 30 days
- Success signal: At least 10 lifetime deal signups in the first 30 days of the waitlist being live
