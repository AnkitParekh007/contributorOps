# Environment Setup

This guide explains exactly how to configure `ContributorOps` for local development and GitHub Actions.

It covers:
- where each environment file belongs
- which variables are required vs optional
- where to find every key
- the exact URLs and settings screens to use

## How ContributorOps reads environment variables

This repo uses **different env file locations for different workspaces**.

### 1. API server env file

The backend runs from:

`apps/api`

Create this file:

`apps/api/.env`

This is where the Express API reads:
- GitHub tokens
- GitHub OAuth credentials
- Supabase server credentials
- automation flags
- CORS settings

### 2. Web app env file

The React app runs from:

`apps/web`

Create this file:

`apps/web/.env.local`

This is where Vite reads:
- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Site env file

The business website runs from:

`apps/site`

Create this file only if you need the website waitlist or forms to call the API:

`apps/site/.env.local`

This is where Vite reads:
- `VITE_API_BASE_URL`

### 4. GitHub Actions secrets

Scheduled workflows do **not** read your local `.env` files.

For GitHub Actions, add secrets in:

[https://github.com/AnkitParekh007/contributorOps/settings/secrets/actions](https://github.com/AnkitParekh007/contributorOps/settings/secrets/actions)

Official GitHub docs:

[Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)

## Fastest setup paths

## Option A: Demo mode only

Use this if you just want the UI to run with mock data.

Required:
- no GitHub key
- no Supabase project

Create:

`apps/api/.env`

```env
PORT=8787
PUBLIC_APP_URL=http://localhost:8787
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:8787
AUTO_CONTRIBUTE_ENABLED=false
CREATE_DAILY_ISSUE=false
```

Create:

`apps/web/.env.local`

```env
VITE_API_BASE_URL=http://localhost:8787
```

That is enough for mock discovery mode.

## Option B: Live GitHub discovery

Use this if you want real issue discovery and daily plans from GitHub, but you do **not** need Supabase auth yet.

Required:
- GitHub personal access token
- your GitHub username

Create:

`apps/api/.env`

```env
PORT=8787
PUBLIC_APP_URL=http://localhost:8787
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:8787

GITHUB_TOKEN=YOUR_GITHUB_TOKEN
GITHUB_USERNAME=YOUR_GITHUB_USERNAME

AUTO_CONTRIBUTE_ENABLED=false
AUTO_PR_DAILY_LIMIT=3
AUTO_COMMENT_DAILY_LIMIT=5
CREATE_DAILY_ISSUE=false

CONTRIBUTOROPS_OWNER=AnkitParekh007
CONTRIBUTOROPS_REPO=contributorOps
```

Create:

`apps/web/.env.local`

```env
VITE_API_BASE_URL=http://localhost:8787
```

## Option C: Full auth + per-user token storage

Use this if you want:
- Supabase login
- persisted user sessions
- per-user GitHub token storage
- Supabase-backed storage instead of local JSON

Required:
- Supabase project
- Supabase URL
- Supabase anon key
- Supabase service role key
- token encryption key
- GitHub OAuth app for the backend connect flow
- Supabase GitHub auth provider if you want GitHub login on the sign-in screen

## Environment variables by file

## `apps/api/.env`

### Core server variables

| Variable | Required | Example | What it does |
|---|---|---:|---|
| `PORT` | No | `8787` | Port for the Express API |
| `PUBLIC_APP_URL` | Yes for OAuth | `http://localhost:8787` | Public URL of the API server used in GitHub OAuth callback construction |
| `CORS_ORIGINS` | Recommended | `http://localhost:5174,http://localhost:8787` | Allowed frontend origins. Put your real web dev port first |
| `LOG_LEVEL` | No | `debug` | Optional server log level |

### GitHub API variables

| Variable | Required | Example | What it does |
|---|---|---:|---|
| `GITHUB_TOKEN` | Recommended for live mode | `ghp_...` | Main backend GitHub token for discovery, planning, and live GitHub API access |
| `GITHUB_USERNAME` | Recommended | `AnkitParekh007` | Used when generating forked PR flows and profile-aware output |
| `GH_CONTRIBUTOROPS_TOKEN` | Optional alternative | `ghp_...` | Fallback token used by scheduled jobs if `GITHUB_TOKEN` is not set |

### GitHub OAuth variables

| Variable | Required only for per-user GitHub connect | Example | What it does |
|---|---|---:|---|
| `GITHUB_CLIENT_ID` | Optional | `Iv1.abc123...` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Optional | `abc123...` | GitHub OAuth app client secret |

### Safety / automation variables

| Variable | Required | Example | What it does |
|---|---|---:|---|
| `AUTO_CONTRIBUTE_ENABLED` | Yes | `false` | Master switch for external write APIs |
| `AUTO_PR_DAILY_LIMIT` | No | `3` | Max external PRs per day |
| `AUTO_COMMENT_DAILY_LIMIT` | No | `5` | Max external comments per day |
| `CREATE_DAILY_ISSUE` | No | `false` | Allows the daily workflow to create planning issues in your own repo only |

### Repo-target variables

| Variable | Required | Example | What it does |
|---|---|---:|---|
| `CONTRIBUTOROPS_OWNER` | No | `AnkitParekh007` | Owner for internal planning issue creation |
| `CONTRIBUTOROPS_REPO` | No | `contributorOps` | Repo name for internal planning issue creation |

### Supabase server variables

| Variable | Required only for Supabase mode | Example | What it does |
|---|---|---:|---|
| `STORAGE_MODE` | Optional | `demo` or `supabase` | Switches persistence layer |
| `SUPABASE_URL` | Yes in Supabase mode | `https://PROJECT.supabase.co` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Yes in Supabase mode | `eyJ...` | Service role key used by the API |
| `TOKEN_ENCRYPTION_KEY` | Yes in Supabase mode | `64+ random hex chars` | Used to encrypt stored GitHub user tokens |

## `apps/web/.env.local`

| Variable | Required | Example | What it does |
|---|---|---:|---|
| `VITE_API_BASE_URL` | Yes | `http://localhost:8787` | Base URL for API requests |
| `VITE_SUPABASE_URL` | Only if using Supabase auth | `https://PROJECT.supabase.co` | Supabase browser URL |
| `VITE_SUPABASE_ANON_KEY` | Only if using Supabase auth | `eyJ...` | Supabase anon/public browser key |

## `apps/site/.env.local`

| Variable | Required | Example | What it does |
|---|---|---:|---|
| `VITE_API_BASE_URL` | Optional | `http://localhost:8787` | Lets website forms call the API |

## How to get each key

## 1. `GITHUB_TOKEN`

This is the main backend token used for live GitHub issue discovery.

Recommended for this repo:
- use a **classic personal access token** for local development
- grant only the scopes you actually need
- if you only work with public repositories, start with `public_repo` and `read:user`

GitHub docs:
- [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

Direct GitHub token page:
- [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)

Steps:
1. Open [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new).
2. Sign in to GitHub if prompted.
3. Give the token a clear note such as `ContributorOps local dev`.
4. Set an expiration you are comfortable rotating, such as 30 or 90 days.
5. If you are using a classic token for public open-source workflows, select:
   - `public_repo`
   - `read:user`
6. Click `Generate token`.
7. Copy the token immediately. GitHub will not show it again.
8. Put it into:

```env
GITHUB_TOKEN=YOUR_TOKEN_HERE
```

## 2. `GITHUB_USERNAME`

This is your GitHub username.

How to find it:
1. Open your GitHub profile, for example [https://github.com/AnkitParekh007](https://github.com/AnkitParekh007).
2. Copy the username from the URL.
3. Put it into:

```env
GITHUB_USERNAME=AnkitParekh007
```

## 3. `GH_CONTRIBUTOROPS_TOKEN`

This is typically used in GitHub Actions for the daily workflow.

Use one of these approaches:
- reuse the same token value as `GITHUB_TOKEN`
- create a second token dedicated to automation

If you use GitHub Actions, add it as a repository secret:
1. Open [https://github.com/AnkitParekh007/contributorOps/settings/secrets/actions](https://github.com/AnkitParekh007/contributorOps/settings/secrets/actions).
2. Click `New repository secret`.
3. Name it:

`GH_CONTRIBUTOROPS_TOKEN`

4. Paste the token value.
5. Save the secret.

## 4. `SUPABASE_URL`

This is your Supabase project URL.

Supabase docs:
- [API keys](https://supabase.com/docs/guides/api/api-keys)

Supabase dashboard:
- [https://supabase.com/dashboard](https://supabase.com/dashboard)

Steps:
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Open your project.
3. Go to `Project Settings` -> `API`.
4. Find `Project URL`.
5. Copy it.
6. Put it into:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
```

For the frontend, also put the same value into:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
```

## 5. `SUPABASE_SERVICE_KEY`

This is the backend-only service role key. Never expose it to the browser.

Supabase docs:
- [API keys](https://supabase.com/docs/guides/api/api-keys)

Steps:
1. Open your project in the Supabase dashboard.
2. Go to `Project Settings` -> `API`.
3. Find the `service_role` key.
4. Copy it.
5. Put it into:

```env
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
```

Important:
- do **not** put this into `apps/web/.env.local`
- do **not** expose this key in client-side code

## 6. `VITE_SUPABASE_ANON_KEY`

This is the browser-safe Supabase anon/public key.

Steps:
1. Open your Supabase project.
2. Go to `Project Settings` -> `API`.
3. Copy the `anon` or `publishable` browser key shown there.
4. Put it into:

```env
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 7. `TOKEN_ENCRYPTION_KEY`

This is used by the API to encrypt stored per-user GitHub tokens when Supabase mode is enabled.

Generate one locally with Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then put the output into:

```env
TOKEN_ENCRYPTION_KEY=YOUR_64_CHAR_HEX_STRING
```

Rules:
- keep this secret
- do not commit it
- if you change it later, previously encrypted GitHub tokens may no longer decrypt

## 8. `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

These are for the backend GitHub OAuth flow used by:

`/api/github/connect`

This is separate from the `GITHUB_TOKEN` server token.

GitHub docs:
- [Creating an OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

GitHub developer settings:
- [https://github.com/settings/developers](https://github.com/settings/developers)

Steps:
1. Open [https://github.com/settings/developers](https://github.com/settings/developers).
2. Click `OAuth Apps`.
3. Click `New OAuth App`.
4. Fill in:
   - **Application name**: `ContributorOps Local`
   - **Homepage URL**: your frontend URL, for example `http://localhost:5174`
   - **Authorization callback URL**: `http://localhost:8787/api/github/callback`
5. Create the app.
6. Copy the `Client ID`.
7. Generate and copy the `Client Secret`.
8. Put them into:

```env
GITHUB_CLIENT_ID=YOUR_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

Important:
- if your backend runs on another port, update the callback URL
- `PUBLIC_APP_URL` must match that backend base URL

## 9. Supabase GitHub login provider

If you want the sign-in screen to support `Continue with GitHub`, configure GitHub as a Supabase auth provider.

Supabase docs:
- [GitHub social login](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

Steps:
1. Open your Supabase project.
2. Go to `Authentication` -> `Providers` -> `GitHub`.
3. Enable the provider.
4. If Supabase asks for a GitHub OAuth app:
   - create one in [https://github.com/settings/developers](https://github.com/settings/developers)
   - use the callback URL Supabase shows on that provider screen
5. In Supabase, add your local frontend URL to allowed redirect URLs, for example:
   - `http://localhost:5173`
   - `http://localhost:5174`
6. Save.

Important:
- this Supabase GitHub provider is for **sign-in**
- the backend `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are for the separate `/api/github/connect` flow

## 10. `PUBLIC_APP_URL`

This must be the public URL of your backend API.

Local example:

```env
PUBLIC_APP_URL=http://localhost:8787
```

Use the API server URL, not the frontend URL.

It is used when building:

`http://localhost:8787/api/github/callback`

## 11. `CORS_ORIGINS`

This must list the browser origins allowed to call the backend.

Example:

```env
CORS_ORIGINS=http://localhost:5174,http://localhost:8787
```

Important:
- put your current frontend dev origin first
- if Vite moves from `5173` to `5174`, update this
- if you preview the site on another port, add that too

## 12. `STORAGE_MODE`

Values:
- `demo`
- `supabase`

Use:

```env
STORAGE_MODE=demo
```

for local JSON mode, or:

```env
STORAGE_MODE=supabase
```

for Supabase persistence.

## Recommended local file templates

## `apps/api/.env`

### Minimal live GitHub mode

```env
PORT=8787
PUBLIC_APP_URL=http://localhost:8787
CORS_ORIGINS=http://localhost:5174,http://localhost:8787

GITHUB_TOKEN=YOUR_GITHUB_TOKEN
GITHUB_USERNAME=YOUR_GITHUB_USERNAME

CONTRIBUTOROPS_OWNER=AnkitParekh007
CONTRIBUTOROPS_REPO=contributorOps

AUTO_CONTRIBUTE_ENABLED=false
AUTO_PR_DAILY_LIMIT=3
AUTO_COMMENT_DAILY_LIMIT=5
CREATE_DAILY_ISSUE=false

STORAGE_MODE=demo
```

### Full Supabase mode

```env
PORT=8787
PUBLIC_APP_URL=http://localhost:8787
CORS_ORIGINS=http://localhost:5174,http://localhost:8787

GITHUB_TOKEN=YOUR_GITHUB_TOKEN
GITHUB_USERNAME=YOUR_GITHUB_USERNAME
GH_CONTRIBUTOROPS_TOKEN=YOUR_GITHUB_TOKEN

GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET

CONTRIBUTOROPS_OWNER=AnkitParekh007
CONTRIBUTOROPS_REPO=contributorOps

AUTO_CONTRIBUTE_ENABLED=false
AUTO_PR_DAILY_LIMIT=3
AUTO_COMMENT_DAILY_LIMIT=5
CREATE_DAILY_ISSUE=false

STORAGE_MODE=supabase
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
TOKEN_ENCRYPTION_KEY=YOUR_64_CHAR_HEX_KEY
```

## `apps/web/.env.local`

### Demo or live GitHub mode

```env
VITE_API_BASE_URL=http://localhost:8787
```

### Supabase mode

```env
VITE_API_BASE_URL=http://localhost:8787
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## `apps/site/.env.local`

```env
VITE_API_BASE_URL=http://localhost:8787
```

## GitHub Actions secrets

For `.github/workflows/daily-contributorops.yml`, add these in repository secrets if needed:

- `GH_CONTRIBUTOROPS_TOKEN`
- optionally any future deployment-specific secrets

Repository secret screen:

[https://github.com/AnkitParekh007/contributorOps/settings/secrets/actions](https://github.com/AnkitParekh007/contributorOps/settings/secrets/actions)

Important rule:
- scheduled jobs may create planning issues only inside your own `contributorOps` repo
- scheduled jobs must not comment on or open PRs against third-party repos

## Step-by-step local setup checklist

1. Create `apps/api/.env`.
2. Create `apps/web/.env.local`.
3. If you use the site workspace, create `apps/site/.env.local`.
4. Add `VITE_API_BASE_URL=http://localhost:8787` to the frontend env files.
5. Add `GITHUB_TOKEN` and `GITHUB_USERNAME` to `apps/api/.env` if you want live GitHub discovery.
6. If you want Supabase auth, add `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `TOKEN_ENCRYPTION_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`.
7. If you want backend GitHub connect flow, add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
8. Start the app:

```bash
npm install
npm run dev
```

## Troubleshooting

## The app still shows demo mode

Check:
- `GITHUB_TOKEN` exists in `apps/api/.env`
- you restarted the API after editing `.env`

## GitHub login redirects fail

Check:
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set
- the OAuth callback URL in GitHub exactly matches:
  - `http://localhost:8787/api/github/callback`
- `PUBLIC_APP_URL` matches the actual API origin

## Supabase login does not work

Check:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are in `apps/web/.env.local`
- the frontend was restarted after editing the file
- the local frontend URL is listed in Supabase redirect URLs

## CORS errors in the browser

Check:
- the frontend origin is in `CORS_ORIGINS`
- the first origin in `CORS_ORIGINS` is the one you want the backend OAuth callback to redirect to

## A key works in the API but not in the React app

That usually means you placed the variable in the wrong file.

Rules:
- backend secrets go in `apps/api/.env`
- browser `VITE_*` variables go in `apps/web/.env.local`
- website-only `VITE_*` variables go in `apps/site/.env.local`
