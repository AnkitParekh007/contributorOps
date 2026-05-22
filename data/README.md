# /data directory

This directory holds runtime JSON state for local/demo mode.

Files are auto-created on first run. They are **not committed to git** (excluded in `.gitignore`).

| File | Purpose |
|------|---------|
| `portfolio.json` | User portfolio entries |
| `daily-plan.json` | Latest daily contribution plan |
| `control-mode.json` | Safety level state |
| `pr-activity.json` | PR submission history |
| `contribution-runs.json` | Contribution execution history |
| `billing.json` | Billing/plan state (mock) |
| `usage.json` | Weekly usage counters |
| `waitlist.json` | Waitlist signups |

All files are created automatically with sensible defaults if they don't exist.
Run `npm run dev` from the repo root to start in demo mode without any setup.
