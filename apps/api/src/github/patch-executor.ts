import { Octokit } from "@octokit/rest";
import {
  materializeExecutablePatch,
  type ExecutablePatchPlan
} from "./executable-patch.js";

export interface ExecutePatchInput {
  upstreamRepoFullName: string;
  forkOwner: string;
  branchName: string;
  baseBranch: string;
  plan: ExecutablePatchPlan;
}

export interface ExecutePatchResult {
  commitSha: string;
  pullRequestUrl: string;
  pullRequestNumber: number;
  changedFiles: string[];
}

function splitRepo(fullName: string): [string, string] {
  const [owner, repo] = fullName.split("/");
  if (!owner || !repo) throw new Error(`Invalid repository name: ${fullName}`);
  return [owner, repo];
}

async function readUtf8File(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string> {
  const response = await octokit.repos.getContent({ owner, repo, path, ref });
  const data = response.data;
  if (Array.isArray(data) || data.type !== "file" || !("content" in data)) {
    throw new Error(`${owner}/${repo}:${path} is not a readable text file.`);
  }
  if (data.encoding !== "base64") {
    throw new Error(`${owner}/${repo}:${path} returned unsupported encoding ${data.encoding}.`);
  }
  return Buffer.from(data.content, "base64").toString("utf8");
}

export async function executeExecutablePatchPlan(
  octokit: Octokit,
  input: ExecutePatchInput
): Promise<ExecutePatchResult> {
  const [upstreamOwner, repo] = splitRepo(input.upstreamRepoFullName);
  const branchRef = await octokit.git.getRef({
    owner: input.forkOwner,
    repo,
    ref: `heads/${input.branchName}`
  });
  const parentSha = branchRef.data.object.sha;
  const parentCommit = await octokit.git.getCommit({
    owner: input.forkOwner,
    repo,
    commit_sha: parentSha
  });

  const materialized = await materializeExecutablePatch(input.plan, (path) =>
    readUtf8File(octokit, input.forkOwner, repo, path, input.branchName)
  );

  const tree = await octokit.git.createTree({
    owner: input.forkOwner,
    repo,
    base_tree: parentCommit.data.tree.sha,
    tree: materialized.map((file) => ({
      path: file.path,
      mode: "100644" as const,
      type: "blob" as const,
      content: file.content
    }))
  });

  const commit = await octokit.git.createCommit({
    owner: input.forkOwner,
    repo,
    message: input.plan.commitMessage,
    tree: tree.data.sha,
    parents: [parentSha]
  });

  await octokit.git.updateRef({
    owner: input.forkOwner,
    repo,
    ref: `heads/${input.branchName}`,
    sha: commit.data.sha,
    force: false
  });

  const pull = await octokit.pulls.create({
    owner: upstreamOwner,
    repo,
    head: `${input.forkOwner}:${input.branchName}`,
    base: input.baseBranch,
    title: input.plan.prTitle,
    body: `${input.plan.prBody}\n\n## Validation\n${input.plan.testEvidence}\n\n## Automation disclosure\nThis contribution was prepared with AI assistance and submitted by ContributorOps after deterministic scope, duplicate, policy, and exact-patch safety checks.`,
    draft: true,
    maintainer_can_modify: true
  });

  return {
    commitSha: commit.data.sha,
    pullRequestUrl: pull.data.html_url,
    pullRequestNumber: pull.data.number,
    changedFiles: materialized.map((file) => file.path)
  };
}
