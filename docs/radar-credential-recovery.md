# Hourly radar credential recovery and safe operation

The radar needs GitHub API access to search public repositories and verify open issues. Preparing a contributor-owned fork is a **separate, write-capable option**. An invalid custom PAT must not be treated as permission to write with an unrelated fallback credential.

## Credential sources

The `Hourly AI + Frontend OSS Radar` workflow checks `GH_CONTRIBUTOROPS_TOKEN` first. If it is absent or rejected during the `gh api user` check, the workflow logs a warning, clears the custom token for subsequent steps, and falls back to the workflow-scoped `GITHUB_TOKEN` for **read-only discovery**.

The fallback **explicitly disables** `AUTO_WORKSPACE_ENABLED` and `AUTO_CONTRIBUTE_ENABLED`. It can discover and plan, but it cannot intentionally create contributor forks, branches, or upstream PRs.

## Recover a rejected custom token (HTTP 401)

1. In the repository, open **Settings → Secrets and variables → Actions**.
2. Rotate or replace the secret named `GH_CONTRIBUTOROPS_TOKEN`. Create a fine-grained token with only the repository permissions required for the specific workflows you actually intend to run. Do not paste token values in issues, PRs, workflow logs or support chats.
3. Re-run the hourly workflow and check that the credential check no longer shows a 401 warning.
4. For **opt-in fork preparation**, define the repository Actions variable `CONTRIBUTOROPS_ALLOW_FORK_PREP=true`. Verify the custom token has the necessary permission for creating and updating contributor-owned forks.
5. The separate standing exact-patch workflow has its own safety checks and authorization. Only if the operator intends that independent execution path should they configure its permissions and `CONTRIBUTOROPS_ALLOW_UNATTENDED_PATCHES=true`. Merely setting this variable is not an authorization to bypass queue validation, scope limits or upstream policies.

If no custom token is available, leave the write opt-ins off. Read-only discovery is a better outcome than failing every scheduled run or accidentally widening access.

## Monitoring after recovery

Review the newest [hourly radar Actions runs](https://github.com/AnkitParekh007/contributorOps/actions/workflows/hourly-oss-radar.yml). Verify:

- GitHub API queries no longer return 401;
- the workflow completes and uploads a usable summary;
- it shows either verified candidates or an honest `none passed` result;
- read-only fallback does not create forks, issues, comments, or upstream PRs;
- write-capable runs remain constrained by the [security model](./security-model.md).

**Important:** Workflow code can be inspected, but secret rotation, GitHub repository settings and a successful follow-up scheduled run must be checked in GitHub Actions. A green CI build does not prove that the custom token is valid.
