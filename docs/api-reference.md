# ContributorOps API Reference

## General Notes

- **Base URL:** `http://localhost:8787`
- **Auth:** None. All endpoints are local-only. There is no authentication layer — the API is designed to run on your machine.
- **Content-Type:** All request bodies are `application/json`. All responses are `application/json`.
- **Error format:** `{ "error": "message" }` with an appropriate HTTP status code.

---

## Health & Meta

### GET /api/health

**Description:** Returns the current server health status, operating mode, safety control mode, billing state, usage counters, and entitlements. This is the primary status endpoint used by the web dashboard on load.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "status": "ok",
  "mode": "mock" | "live",
  "controlMode": { "safetyLevel": "research" | "draft" | "approved", "explicitApproval": false },
  "billing": { "plan": "free" | "pro" | "career" | "team", "usageThisWeek": 0 },
  "usage": { "discoveryRuns": 0, "contributionRuns": 0, "prChecks": 0 },
  "entitlements": { "dailyPlan": true, "prQualityCheck": false, "portfolio": false }
}
```

**Notes:** The `mode` field is `"mock"` when `GITHUB_TOKEN` is not set. All data in mock mode is simulated.

---

### GET /api/meta

**Description:** Returns application metadata including version, feature flags, and environment info.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "version": "0.1.0",
  "name": "ContributorOps",
  "features": {
    "waitlist": true,
    "launchOffer": true
  },
  "environment": "development" | "production"
}
```

---

## Pricing & Billing

### GET /api/pricing

**Description:** Returns the full pricing tiers array with plan names, prices, features, and limits.

**Auth:** None

**Query params:** None

**Response:**
```json
[
  {
    "id": "free",
    "name": "Free",
    "monthlyPrice": 0,
    "yearlyPrice": 0,
    "features": ["..."]
  },
  { "id": "pro", "name": "Pro", "monthlyPrice": 19, "yearlyPrice": 190, "features": ["..."] },
  { "id": "career", "name": "Career", "monthlyPrice": 49, "yearlyPrice": 490, "features": ["..."] },
  { "id": "team", "name": "Team", "monthlyPrice": 199, "yearlyPrice": 1990, "features": ["..."] }
]
```

---

### GET /api/billing

**Description:** Returns the current billing state including plan, usage counts, and computed entitlements.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "plan": "free",
  "usageThisWeek": 2,
  "limits": { "discoveryRunsPerWeek": 3, "contributionRunsPerWeek": 0 },
  "entitlements": {
    "dailyPlan": true,
    "prQualityCheck": false,
    "portfolio": false,
    "resumeExport": false,
    "teamRadar": false
  }
}
```

---

### POST /api/billing/mock-select-plan

**Description:** Mock plan selection. Updates the local billing state to the specified plan. No real payment is processed.

**Auth:** None

**Request body:**
```json
{ "plan": "free" | "pro" | "career" | "team" }
```

**Response:**
```json
{ "success": true, "plan": "pro" }
```

---

### PATCH /api/billing/profile

**Description:** Updates public profile fields stored in billing state (display name, slug, bio).

**Auth:** None

**Request body:**
```json
{
  "displayName": "string",
  "slug": "string",
  "bio": "string"
}
```

All fields are optional. Only provided fields are updated.

**Response:**
```json
{ "success": true, "profile": { "displayName": "...", "slug": "...", "bio": "..." } }
```

---

### GET /api/usage

**Description:** Returns a usage snapshot with weekly action counts.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "week": "2025-01-13",
  "discoveryRuns": 2,
  "contributionRuns": 0,
  "prChecks": 1,
  "planGenerations": 3
}
```

---

## Safety & Control Mode

### GET /api/control-mode

**Description:** Returns the current safety level state.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "safetyLevel": "research" | "draft" | "approved",
  "explicitApproval": false,
  "approvalReason": null,
  "updatedAt": "2025-01-13T10:00:00Z"
}
```

---

### POST /api/control-mode

**Description:** Updates the safety control mode. Switching to `"approved"` mode requires an explicit approval reason.

**Auth:** None

**Request body:**
```json
{
  "safetyLevel": "research" | "draft" | "approved",
  "explicitApproval": true,
  "approvalReason": "Testing contribution workflow on my own fork"
}
```

**Response:**
```json
{ "success": true, "controlMode": { "safetyLevel": "approved", "explicitApproval": true } }
```

**Notes:** Setting `safetyLevel` to `"approved"` without `explicitApproval: true` will return a 400 error.

---

## Discovery & Planning

### POST /api/discover

**Description:** Discovers open-source issues matching the provided filters and generates a daily contribution plan.

**Auth:** None

**Request body (DiscoveryFilters):**
```json
{
  "languages": ["TypeScript", "JavaScript"],
  "labels": ["good first issue", "help wanted"],
  "minStars": 100,
  "maxStars": 50000,
  "repos": [],
  "jobTarget": "Backend Engineer",
  "difficulty": "beginner" | "intermediate" | "advanced"
}
```

All filter fields are optional.

**Response:**
```json
{
  "issues": [
    {
      "id": 1,
      "title": "Fix memory leak in stream handler",
      "repo": "org/repo",
      "url": "https://github.com/org/repo/issues/1",
      "labels": ["bug", "good first issue"],
      "score": 87,
      "difficulty": "intermediate",
      "estimatedTime": "2-4 hours"
    }
  ],
  "dailyPlan": {
    "date": "2025-01-13",
    "topPick": { ... },
    "rationale": "..."
  }
}
```

**Notes:** In mock mode, returns simulated issues. In live mode, calls the GitHub search API using `GITHUB_TOKEN`.

---

### GET /api/daily-plan

**Description:** Returns the most recently generated daily contribution plan.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "date": "2025-01-13",
  "topPick": { "issueId": 1, "repo": "org/repo", "title": "..." },
  "candidates": [...],
  "rationale": "Selected because it matches your TypeScript target and has a clear scope.",
  "generatedAt": "2025-01-13T08:00:00Z"
}
```

Returns `null` if no plan has been generated yet.

---

## Portfolio

### GET /api/portfolio

**Description:** Returns all portfolio entries.

**Auth:** None

**Query params:** None

**Response:**
```json
[
  {
    "id": "uuid",
    "repo": "org/repo",
    "issueTitle": "Fix streaming bug",
    "prUrl": "https://github.com/org/repo/pull/42",
    "status": "merged",
    "techStack": ["TypeScript", "Node.js"],
    "impact": "Reduced memory usage by 30%",
    "resumeBullet": "Fixed streaming memory leak in OSS project (org/repo#42), merged by maintainer.",
    "createdAt": "2025-01-10T00:00:00Z"
  }
]
```

---

### POST /api/portfolio

**Description:** Creates a new portfolio entry.

**Auth:** None

**Request body:**
```json
{
  "repo": "org/repo",
  "issueTitle": "Fix streaming bug",
  "prUrl": "https://github.com/org/repo/pull/42",
  "status": "draft" | "open" | "merged" | "closed",
  "techStack": ["TypeScript"],
  "impact": "string",
  "resumeBullet": "string"
}
```

**Response:** The created portfolio entry object with generated `id` and `createdAt`.

---

### PATCH /api/portfolio/:id

**Description:** Updates a portfolio entry by ID.

**Auth:** None

**Request body:** Any subset of portfolio entry fields to update.

**Response:** The updated portfolio entry object.

**Notes:** Returns 404 if the entry does not exist.

---

### DELETE /api/portfolio/:id

**Description:** Deletes a portfolio entry by ID.

**Auth:** None

**Response:**
```json
{ "success": true }
```

**Notes:** Returns 404 if the entry does not exist.

---

### POST /api/portfolio/share

**Description:** Enables public portfolio sharing and returns the public share URL.

**Auth:** None

**Request body:**
```json
{ "enabled": true }
```

**Response:**
```json
{
  "enabled": true,
  "shareUrl": "http://localhost:8787/api/public/portfolio/your-slug",
  "slug": "your-slug"
}
```

**Notes:** Requires a `slug` to be set via `PATCH /api/billing/profile` first.

---

## GitHub Planning Actions

### POST /api/create-planning-issue

**Description:** Creates a GitHub issue in a target repository as a contribution planning artifact.

**Auth:** None (uses `GITHUB_TOKEN` from environment)

**Request body:**
```json
{
  "repo": "org/repo",
  "title": "string",
  "body": "string"
}
```

**Response:**
```json
{ "success": true, "issueUrl": "https://github.com/org/repo/issues/99" }
```

**Notes:** Requires `safetyLevel` to be `"draft"` or `"approved"`. Returns 403 in Research Mode.

---

### POST /api/draft-proposal

**Description:** Generates a draft contribution proposal for a specific issue. Returns a structured markdown document.

**Auth:** None

**Request body:**
```json
{
  "issueUrl": "https://github.com/org/repo/issues/42",
  "approach": "string (optional)"
}
```

**Response:**
```json
{
  "proposal": "## Contribution Proposal\n\n...",
  "estimatedTime": "3-5 hours",
  "keyFiles": ["src/stream.ts", "src/utils.ts"]
}
```

---

## Contribution Runs

### POST /api/contribute/prepare

**Description:** Starts a new contribution run for a target issue. Returns a run ID and the initial state.

**Auth:** None

**Request body:**
```json
{
  "issueUrl": "https://github.com/org/repo/issues/42",
  "repo": "org/repo",
  "issueNumber": 42
}
```

**Response:**
```json
{
  "runId": "uuid",
  "status": "pending_comment_approval",
  "createdAt": "2025-01-13T10:00:00Z"
}
```

**Notes:** Requires `safetyLevel` of `"approved"` or `AUTO_CONTRIBUTE_ENABLED=true`.

---

### POST /api/contribute/approve-comment

**Description:** Approves posting a maintainer comment for an in-progress contribution run.

**Auth:** None

**Request body:**
```json
{
  "runId": "uuid",
  "commentBody": "Hi, I'd like to work on this issue..."
}
```

**Response:**
```json
{ "success": true, "runId": "uuid", "status": "comment_posted" }
```

---

### POST /api/contribute/approve-branch

**Description:** Approves creating a feature branch for an in-progress contribution run.

**Auth:** None

**Request body:**
```json
{
  "runId": "uuid",
  "branchName": "fix/streaming-memory-leak"
}
```

**Response:**
```json
{ "success": true, "runId": "uuid", "status": "branch_created", "branchName": "..." }
```

---

### POST /api/contribute/approve-draft-pr

**Description:** Approves creating a draft PR for an in-progress contribution run.

**Auth:** None

**Request body:**
```json
{
  "runId": "uuid",
  "title": "Fix memory leak in stream handler",
  "body": "## Summary\n\n..."
}
```

**Response:**
```json
{ "success": true, "runId": "uuid", "status": "draft_pr_created", "prUrl": "..." }
```

---

### GET /api/contribute/runs

**Description:** Returns all contribution runs, most recent first.

**Auth:** None

**Query params:** None

**Response:**
```json
[
  {
    "id": "uuid",
    "issueUrl": "...",
    "repo": "org/repo",
    "status": "draft_pr_created",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### GET /api/contribute/runs/:id

**Description:** Returns a specific contribution run by ID with full history.

**Auth:** None

**Response:** Single contribution run object with `history` array of state transitions.

**Notes:** Returns 404 if the run does not exist.

---

### POST /api/contribute/runs/:id/cancel

**Description:** Cancels an in-progress contribution run.

**Auth:** None

**Request body:** None required.

**Response:**
```json
{ "success": true, "runId": "uuid", "status": "cancelled" }
```

---

## Public Portfolio

### GET /api/public/portfolio/:slug

**Description:** Returns the public portfolio view for a given slug. Used for portfolio sharing links.

**Auth:** None

**Response:**
```json
{
  "displayName": "Jane Dev",
  "bio": "Backend engineer, OSS contributor",
  "portfolio": [...],
  "stats": { "totalContributions": 5, "mergedPRs": 3 }
}
```

**Notes:** Returns 404 if the slug does not exist or portfolio sharing is disabled.

---

### GET /api/public/user/:username

**Description:** Returns the public portfolio for a GitHub username, if a matching profile exists.

**Auth:** None

**Response:** Same shape as `GET /api/public/portfolio/:slug`.

---

## Career & Export

### GET /api/export/github-resume

**Description:** Exports resume data in structured JSON format, derived from portfolio entries and GitHub activity.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "name": "Jane Dev",
  "headline": "Backend Engineer",
  "contributions": [
    {
      "repo": "org/repo",
      "title": "Fix streaming memory leak",
      "prUrl": "...",
      "resumeBullet": "Fixed streaming memory leak in OSS project...",
      "merged": true
    }
  ],
  "generatedAt": "2025-01-13T10:00:00Z"
}
```

---

### GET /api/export-center

**Description:** Returns all exportable career assets in one response: resume data, LinkedIn bullets, portfolio summary, and interview stories.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "resume": { ... },
  "linkedinBullets": ["..."],
  "portfolioSummary": "...",
  "interviewStories": ["..."]
}
```

---

## Quality & Audit Tools

### POST /api/pr-quality-check

**Description:** Scores a contribution plan against PR quality criteria and returns a structured quality report.

**Auth:** None

**Request body:**
```json
{
  "issue": {
    "title": "Fix memory leak",
    "body": "...",
    "repo": "org/repo",
    "labels": ["bug"]
  }
}
```

**Response:**
```json
{
  "score": 82,
  "grade": "B+",
  "breakdown": {
    "scopeClarity": 90,
    "maintainerFit": 75,
    "effortEstimate": 80
  },
  "suggestions": ["Narrow the scope to one function", "Add a test plan"]
}
```

**Notes:** Requires Pro plan or higher. Returns 403 on Free plan.

---

### GET /api/github-profile-audit

**Description:** Audits a GitHub profile and returns a structured quality report with improvement recommendations.

**Auth:** None (uses `GITHUB_TOKEN` for live data)

**Query params:**
- `username` (required) — GitHub username to audit

**Response:**
```json
{
  "username": "janedev",
  "score": 71,
  "strengths": ["Active commit history", "Has pinned repos"],
  "gaps": ["No README on profile", "No OSS contributions outside own repos"],
  "recommendations": ["Add a profile README", "Open 3 issues in maintained projects this month"]
}
```

---

### GET /api/team/radar

**Description:** Returns the team repository radar showing contribution opportunities across team-configured repositories.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "repos": [
    {
      "repo": "org/repo",
      "openIssues": 12,
      "goodFirstIssues": 3,
      "recentActivity": true,
      "topOpportunity": { "title": "...", "url": "..." }
    }
  ]
}
```

**Notes:** Requires Team plan. Returns 403 on lower plans.

---

## Scheduled Jobs

### POST /api/run-daily

**Description:** Manually triggers the daily plan generation job. Same logic as the scheduled `daily-contributorops.yml` workflow.

**Auth:** None

**Request body:** None required.

**Response:**
```json
{
  "success": true,
  "plan": { ... },
  "issueCreated": false
}
```

---

### POST /api/approved-pr

**Description:** Creates an approved draft PR directly, bypassing the step-by-step contribution run flow. Use for advanced workflows.

**Auth:** None

**Request body:**
```json
{
  "repo": "org/repo",
  "title": "string",
  "body": "string",
  "branchName": "string",
  "baseBranch": "main"
}
```

**Response:**
```json
{ "success": true, "prUrl": "..." }
```

**Notes:** Requires `safetyLevel` of `"approved"` and `explicitApproval: true`.

---

## Launch & Waitlist

### GET /api/launch-offer

**Description:** Returns the current founder lifetime deal offer details.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "active": true,
  "name": "Founder Lifetime Deal",
  "price": 99,
  "originalValue": "Career plan forever ($49/month)",
  "spotsTotal": 100,
  "spotsRemaining": 87,
  "features": [
    "Career plan features forever",
    "Direct founder access",
    "Influence roadmap priorities"
  ],
  "expiresAt": null
}
```

---

### POST /api/waitlist

**Description:** Adds a new signup to the waitlist.

**Auth:** None

**Request body:**
```json
{
  "name": "Jane Dev",
  "email": "jane@example.com",
  "targetRole": "Backend Engineer",
  "planInterest": "pro" | "career" | "team" | "founder",
  "source": "product-hunt" | "github" | "twitter" | "direct" | "other"
}
```

`name` and `email` are required. All other fields are optional.

**Response:**
```json
{
  "success": true,
  "position": 42,
  "message": "You're on the list. We'll reach out when your spot opens."
}
```

**Notes:** Persists to `data/waitlist.json`. Returns 400 if email is already registered.

---

### GET /api/waitlist/stats

**Description:** Returns aggregate waitlist statistics.

**Auth:** None

**Query params:** None

**Response:**
```json
{
  "total": 42,
  "byPlanInterest": {
    "pro": 18,
    "career": 15,
    "team": 5,
    "founder": 4
  },
  "bySource": {
    "github": 20,
    "twitter": 12,
    "direct": 10
  },
  "recentSignups": 7
}
```
