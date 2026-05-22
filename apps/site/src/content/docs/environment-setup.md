# Environment Setup

ContributorOps uses separate environment files for the API, the React app, and the static site.

## File locations

- `apps/api/.env`
  Server-side secrets and automation flags.
- `apps/web/.env.local`
  Vite browser variables for the app.
- `apps/site/.env.local`
  Optional Vite browser variables for the marketing site.

## Key variables

### API

- `GITHUB_TOKEN`
- `GITHUB_USERNAME`
- `GH_CONTRIBUTOROPS_TOKEN`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `PORT`
- `PUBLIC_APP_URL`
- `CORS_ORIGINS`
- `AUTO_CONTRIBUTE_ENABLED`
- `AUTO_PR_DAILY_LIMIT`
- `AUTO_COMMENT_DAILY_LIMIT`
- `CREATE_DAILY_ISSUE`
- `CONTRIBUTOROPS_OWNER`
- `CONTRIBUTOROPS_REPO`
- `STORAGE_MODE`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `TOKEN_ENCRYPTION_KEY`

### Web

- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Site

- `VITE_API_BASE_URL`

## Official docs and setup URLs

- GitHub personal access tokens:
  [https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- GitHub token creation screen:
  [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)
- GitHub OAuth apps:
  [https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- GitHub developer settings:
  [https://github.com/settings/developers](https://github.com/settings/developers)
- GitHub Actions secrets:
  [https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
- Supabase API keys:
  [https://supabase.com/docs/guides/api/api-keys](https://supabase.com/docs/guides/api/api-keys)
- Supabase GitHub social login:
  [https://supabase.com/docs/guides/auth/social-login/auth-github](https://supabase.com/docs/guides/auth/social-login/auth-github)
- Supabase redirect URLs:
  [https://supabase.com/docs/guides/auth/redirect-urls](https://supabase.com/docs/guides/auth/redirect-urls)

## Recommended local setup

### `apps/api/.env`

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

### `apps/web/.env.local`

```env
VITE_API_BASE_URL=http://localhost:8787
```

If you enable Supabase auth:

```env
VITE_API_BASE_URL=http://localhost:8787
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## Full detailed guide

Read the full repository guide here:

[docs/environment-setup.md](https://github.com/AnkitParekh007/contributorOps/blob/main/docs/environment-setup.md)
