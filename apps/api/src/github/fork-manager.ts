import { Octokit } from "@octokit/rest";

export interface ManagedContributionWorkspace {
  upstreamRepoFullName: string;
  forkRepoFullName: string;
  forkHtmlUrl: string;
  forkOwner: string;
  repoName: string;
  baseBranch: string;
  baseSha: string;
  branchName: string;
  branchSha: string;
  forkCreated: boolean;
  branchCreated: boolean;
  lastSyncedAt: string;
  preparedAt: string;
}

export interface PrepareManagedWorkspaceInput {
  upstreamRepoFullName: string;
  forkOwner: string;
  branchName: string;
}

export interface ForkManagerOptions {
  pollIntervalMs?: number;
  readyTimeoutMs?: number;
  sleep?: (ms: number) => Promise<void>;
}

const DEFAULT_POLL_INTERVAL_MS = 1_500;
const DEFAULT_READY_TIMEOUT_MS = 45_000;

function statusOf(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return undefined;
  }

  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

function normalizeFullName(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}

export function repositoryIsForkOf(
  repository: { fork?: boolean; parent?: { full_name?: string | null } | null },
  upstreamRepoFullName: string
): boolean {
  return Boolean(
    repository.fork &&
      normalizeFullName(repository.parent?.full_name) === normalizeFullName(upstreamRepoFullName)
  );
}

async function getRepositoryOrNull(octokit: Octokit, owner: string, repo: string) {
  try {
    return (await octokit.repos.get({ owner, repo })).data;
  } catch (error) {
    if (statusOf(error) === 404) {
      return null;
    }
    throw error;
  }
}

async function getRefOrNull(octokit: Octokit, owner: string, repo: string, branch: string) {
  try {
    return (await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` })).data;
  } catch (error) {
    if (statusOf(error) === 404) {
      return null;
    }
    throw error;
  }
}

async function waitForForkReady(
  octokit: Octokit,
  forkOwner: string,
  repo: string,
  upstreamRepoFullName: string,
  expectedDefaultBranch: string,
  options: Required<ForkManagerOptions>
) {
  const deadline = Date.now() + options.readyTimeoutMs;

  while (Date.now() <= deadline) {
    const fork = await getRepositoryOrNull(octokit, forkOwner, repo);

    if (fork) {
      if (!repositoryIsForkOf(fork, upstreamRepoFullName)) {
        throw new Error(
          `${forkOwner}/${repo} already exists but is not a fork of ${upstreamRepoFullName}. ` +
            "Rename or remove the conflicting repository before ContributorOps provisions this workspace."
        );
      }

      const defaultBranch = fork.default_branch || expectedDefaultBranch;
      const baseRef = await getRefOrNull(octokit, forkOwner, repo, defaultBranch);
      if (baseRef) {
        return { fork, defaultBranch, baseRef };
      }
    }

    await options.sleep(options.pollIntervalMs);
  }

  throw new Error(
    `Timed out waiting for ${forkOwner}/${repo} to become ready after ${options.readyTimeoutMs}ms.`
  );
}

async function createForkIfMissing(
  octokit: Octokit,
  upstreamOwner: string,
  upstreamRepo: string,
  forkOwner: string,
  upstreamRepoFullName: string
): Promise<boolean> {
  const existing = await getRepositoryOrNull(octokit, forkOwner, upstreamRepo);

  if (existing) {
    if (!repositoryIsForkOf(existing, upstreamRepoFullName)) {
      throw new Error(
        `${forkOwner}/${upstreamRepo} already exists but is not a fork of ${upstreamRepoFullName}. ` +
          "ContributorOps will never overwrite an unrelated repository."
      );
    }
    return false;
  }

  const authenticated = await octokit.users.getAuthenticated();
  const authenticatedLogin = authenticated.data.login.toLowerCase();
  const targetOwner = forkOwner.toLowerCase();

  await octokit.repos.createFork({
    owner: upstreamOwner,
    repo: upstreamRepo,
    default_branch_only: true,
    ...(authenticatedLogin === targetOwner ? {} : { organization: forkOwner })
  });

  return true;
}

async function syncForkDefaultBranch(
  octokit: Octokit,
  forkOwner: string,
  repo: string,
  branch: string
): Promise<void> {
  try {
    await octokit.repos.mergeUpstream({
      owner: forkOwner,
      repo,
      branch
    });
  } catch (error) {
    if (statusOf(error) === 409) {
      throw new Error(
        `ContributorOps could not sync ${forkOwner}/${repo}:${branch} because GitHub reported a merge conflict.`
      );
    }
    throw error;
  }
}

async function ensureContributionBranch(
  octokit: Octokit,
  forkOwner: string,
  repo: string,
  branchName: string,
  baseBranch: string
): Promise<{ branchCreated: boolean; branchSha: string; baseSha: string }> {
  const existingBranch = await getRefOrNull(octokit, forkOwner, repo, branchName);
  const baseRef = await octokit.git.getRef({
    owner: forkOwner,
    repo,
    ref: `heads/${baseBranch}`
  });

  if (existingBranch) {
    return {
      branchCreated: false,
      branchSha: existingBranch.object.sha,
      baseSha: baseRef.data.object.sha
    };
  }

  await octokit.git.createRef({
    owner: forkOwner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseRef.data.object.sha
  });

  return {
    branchCreated: true,
    branchSha: baseRef.data.object.sha,
    baseSha: baseRef.data.object.sha
  };
}

export async function prepareManagedContributionWorkspace(
  octokit: Octokit,
  input: PrepareManagedWorkspaceInput,
  optionsInput: ForkManagerOptions = {}
): Promise<ManagedContributionWorkspace> {
  const [upstreamOwner, upstreamRepo] = input.upstreamRepoFullName.split("/");
  if (!upstreamOwner || !upstreamRepo) {
    throw new Error(`Invalid upstream repository name: ${input.upstreamRepoFullName}`);
  }

  const options: Required<ForkManagerOptions> = {
    pollIntervalMs: optionsInput.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS,
    readyTimeoutMs: optionsInput.readyTimeoutMs ?? DEFAULT_READY_TIMEOUT_MS,
    sleep: optionsInput.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)))
  };

  const upstream = await octokit.repos.get({ owner: upstreamOwner, repo: upstreamRepo });
  if (upstream.data.archived) {
    throw new Error(`${input.upstreamRepoFullName} is archived and cannot be prepared for contribution.`);
  }

  const forkCreated = await createForkIfMissing(
    octokit,
    upstreamOwner,
    upstreamRepo,
    input.forkOwner,
    input.upstreamRepoFullName
  );

  const ready = await waitForForkReady(
    octokit,
    input.forkOwner,
    upstreamRepo,
    input.upstreamRepoFullName,
    upstream.data.default_branch,
    options
  );

  await syncForkDefaultBranch(octokit, input.forkOwner, upstreamRepo, ready.defaultBranch);

  const branch = await ensureContributionBranch(
    octokit,
    input.forkOwner,
    upstreamRepo,
    input.branchName,
    ready.defaultBranch
  );

  const now = new Date().toISOString();
  return {
    upstreamRepoFullName: input.upstreamRepoFullName,
    forkRepoFullName: `${input.forkOwner}/${upstreamRepo}`,
    forkHtmlUrl: ready.fork.html_url,
    forkOwner: input.forkOwner,
    repoName: upstreamRepo,
    baseBranch: ready.defaultBranch,
    baseSha: branch.baseSha,
    branchName: input.branchName,
    branchSha: branch.branchSha,
    forkCreated,
    branchCreated: branch.branchCreated,
    lastSyncedAt: now,
    preparedAt: now
  };
}
