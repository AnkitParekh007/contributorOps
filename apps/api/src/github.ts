import { Octokit } from "@octokit/rest";
import { config, defaultFilters } from "./config.js";
import type {
  ApprovedPullRequestRequest,
  ControlModeState,
  DiscoveryFilters,
  DraftProposal,
  PullRequestActivity,
  RawIssueCandidate
} from "./types.js";

const mockIssues: RawIssueCandidate[] = [
  {
    id: 1,
    repoFullName: "octokit/octokit.js",
    repoName: "octokit.js",
    repoUrl: "https://github.com/octokit/octokit.js",
    repoDescription: "The all-batteries-included GitHub SDK for browsers and Node.js.",
    repoTopics: ["sdk", "api-client", "developer-tools", "typescript"],
    repoLanguage: "TypeScript",
    issueNumber: 3120,
    issueTitle: "Clarify retry examples for secondary rate limit handling",
    issueUrl: "https://github.com/octokit/octokit.js/issues/3120",
    issueBody: "The retry documentation does not explain how secondary rate limit responses interact with custom request hooks. A focused documentation improvement and example update would help contributors and users avoid incorrect retry behavior.",
    labels: ["documentation", "good first issue"],
    comments: 4,
    updatedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 86_400_000).toISOString(),
    author: "maintainer-a"
  },
  {
    id: 2,
    repoFullName: "graphql/graphql-js",
    repoName: "graphql-js",
    repoUrl: "https://github.com/graphql/graphql-js",
    repoDescription: "A reference implementation of GraphQL for JavaScript.",
    repoTopics: ["graphql", "api", "developer-tools"],
    repoLanguage: "TypeScript",
    issueNumber: 4044,
    issueTitle: "Add regression coverage for schema extension validation edge case",
    issueUrl: "https://github.com/graphql/graphql-js/issues/4044",
    issueBody: "A schema extension validation path accepts a malformed input combination. The main task is to reproduce the edge case with a failing test and then patch the validation check in the smallest possible location.",
    labels: ["bug", "help wanted"],
    comments: 8,
    updatedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 35 * 86_400_000).toISOString(),
    author: "maintainer-b"
  },
  {
    id: 3,
    repoFullName: "openapi-generator/openapi-generator",
    repoName: "openapi-generator",
    repoUrl: "https://github.com/openapi-generator/openapi-generator",
    repoDescription: "OpenAPI Generator allows generation of API client libraries and server stubs.",
    repoTopics: ["openapi", "sdk", "rest-api", "developer-tools"],
    repoLanguage: "Java",
    issueNumber: 22011,
    issueTitle: "Node generator docs need clearer npm publish guidance",
    issueUrl: "https://github.com/openapi-generator/openapi-generator/issues/22011",
    issueBody: "The Node generator publishing docs are fragmented across multiple sections. Contributors could improve this by consolidating the current guidance, linking the release steps, and verifying the final examples against the actual generator output.",
    labels: ["documentation", "help wanted"],
    comments: 2,
    updatedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 9 * 86_400_000).toISOString(),
    author: "maintainer-c"
  }
];

function getOctokit(token: string): Octokit | null {
  return token ? new Octokit({ auth: token }) : null;
}

function requireOctokit(): Octokit {
  const octokit = getOctokit(config.githubToken);

  if (!octokit) {
    throw new Error("A GitHub token is required for this action.");
  }

  return octokit;
}

function normalizeFilters(filters?: Partial<DiscoveryFilters>): DiscoveryFilters {
  return {
    topics: filters?.topics?.length ? filters.topics : defaultFilters.topics,
    languages: filters?.languages?.length ? filters.languages : defaultFilters.languages,
    labels: filters?.labels?.length ? filters.labels : defaultFilters.labels
  };
}

function repoMatchesFilters(candidate: RawIssueCandidate, filters: DiscoveryFilters): boolean {
  const topicMatch =
    filters.topics.length === 0 ||
    candidate.repoTopics.some((topic) =>
      filters.topics.some((selected) => topic.toLowerCase().includes(selected.toLowerCase()))
    );

  const languageMatch =
    filters.languages.length === 0 ||
    filters.languages.some((language) =>
      candidate.repoLanguage.toLowerCase().includes(language.toLowerCase())
    );

  const labelMatch =
    filters.labels.length === 0 ||
    candidate.labels.some((label) =>
      filters.labels.some((selected) => label.toLowerCase().includes(selected.toLowerCase()))
    );

  return topicMatch && languageMatch && labelMatch;
}

export async function discoverIssues(filtersInput?: Partial<DiscoveryFilters>): Promise<{
  mode: "demo" | "github";
  candidates: RawIssueCandidate[];
}> {
  const filters = normalizeFilters(filtersInput);
  const octokit = getOctokit(config.githubToken);

  if (!octokit) {
    return {
      mode: "demo",
      candidates: mockIssues.filter((candidate) => repoMatchesFilters(candidate, filters))
    };
  }

  const repoQueryParts = [
    "archived:false",
    "is:public",
    `(${filters.topics.map((topic) => `topic:${topic}`).join(" OR ")})`,
    `(${filters.languages.map((language) => `language:${language}`).join(" OR ")})`
  ];

  const repos = await octokit.search.repos({
    q: repoQueryParts.join(" "),
    per_page: 8,
    sort: "updated",
    order: "desc"
  });

  const repoItems = repos.data.items.filter((repo) => !repo.fork);

  const issueLists = await Promise.all(
    repoItems.map(async (repo) => {
      if (!repo.owner?.login) {
        return [];
      }

      const issues = await octokit.issues.listForRepo({
        owner: repo.owner.login,
        repo: repo.name,
        state: "open",
        sort: "updated",
        direction: "desc",
        per_page: 12
      });

      return issues.data
        .filter((issue) => !("pull_request" in issue))
        .map<RawIssueCandidate>((issue) => ({
          id: issue.id,
          repoFullName: repo.full_name,
          repoName: repo.name,
          repoUrl: repo.html_url,
          repoDescription: repo.description || "No repository description provided.",
          repoTopics: repo.topics || [],
          repoLanguage: repo.language || "Unknown",
          issueNumber: issue.number,
          issueTitle: issue.title,
          issueUrl: issue.html_url,
          issueBody: issue.body || "",
          labels: issue.labels.map((label) =>
            typeof label === "string" ? label : label.name || "unlabeled"
          ),
          comments: issue.comments,
          updatedAt: issue.updated_at,
          createdAt: issue.created_at,
          author: issue.user?.login || "unknown"
        }));
    })
  );

  const flattened = issueLists
    .flat()
    .filter((candidate) => repoMatchesFilters(candidate, filters))
    .slice(0, 30);

  return { mode: "github", candidates: flattened };
}

export async function createPlanningIssue(title: string, body: string): Promise<{
  issueUrl?: string;
  created: boolean;
  message: string;
}> {
  const octokit = getOctokit(config.githubToken);

  if (!octokit) {
    return {
      created: false,
      message: "No GitHub token configured. Returning preview only."
    };
  }

  const issue = await octokit.issues.create({
    owner: config.owner,
    repo: config.repo,
    title,
    body
  });

  return {
    created: true,
    issueUrl: issue.data.html_url,
    message: "Planning issue created in contributorOps."
  };
}

async function ensureForkRepository(
  octokit: Octokit,
  upstreamOwner: string,
  upstreamRepo: string,
  forkOwner: string
) {
  try {
    const fork = await octokit.repos.get({
      owner: forkOwner,
      repo: upstreamRepo
    });
    return fork.data;
  } catch {
    const createdFork = await octokit.repos.createFork({
      owner: upstreamOwner,
      repo: upstreamRepo
    });

    if (createdFork.data.owner?.login?.toLowerCase() !== forkOwner.toLowerCase()) {
      throw new Error(
        `ContributorOps could not confirm a fork under ${forkOwner}. Create the fork manually first, then retry Approved PR Mode.`
      );
    }

    return createdFork.data;
  }
}

export async function createApprovedDraftPullRequest(
  request: ApprovedPullRequestRequest,
  controlMode: ControlModeState,
  activity: PullRequestActivity[]
): Promise<{ draftPullRequestUrl: string; branchName: string }> {
  if (controlMode.safetyLevel !== "approved-pr") {
    throw new Error("Approved PR Mode is required before ContributorOps can write to a fork.");
  }

  if (!request.explicitApproval || !request.approvalReason.trim()) {
    throw new Error("Explicit user approval and a human approval reason are required.");
  }

  if (!request.proposal.prBody.trim() || !request.proposal.testEvidence.trim()) {
    throw new Error("PR body and test evidence must be present before opening a draft PR.");
  }

  const today = new Date().toISOString().slice(0, 10);
  const alreadyOpenedToday = activity.some(
    (entry) =>
      entry.upstreamRepoFullName === request.issue.repoFullName &&
      entry.createdAt.slice(0, 10) === today
  );

  if (alreadyOpenedToday) {
    throw new Error("ContributorOps will not open more than one draft PR per upstream repo per day.");
  }

  const [upstreamOwner, upstreamRepo] = request.issue.repoFullName.split("/");
  const octokit = requireOctokit();
  const upstream = await octokit.repos.get({
    owner: upstreamOwner,
    repo: upstreamRepo
  });
  const fork = await ensureForkRepository(octokit, upstreamOwner, upstreamRepo, request.forkOwner);
  const baseBranch = upstream.data.default_branch;
  const forkBaseRef = await octokit.git.getRef({
    owner: request.forkOwner,
    repo: upstreamRepo,
    ref: `heads/${fork.default_branch || baseBranch}`
  });
  const branchName = `${request.proposal.branchName}-${Date.now().toString().slice(-6)}`;

  await octokit.git.createRef({
    owner: request.forkOwner,
    repo: upstreamRepo,
    ref: `refs/heads/${branchName}`,
    sha: forkBaseRef.data.object.sha
  });

  const baseCommit = await octokit.git.getCommit({
    owner: request.forkOwner,
    repo: upstreamRepo,
    commit_sha: forkBaseRef.data.object.sha
  });

  const tree = await octokit.git.createTree({
    owner: request.forkOwner,
    repo: upstreamRepo,
    base_tree: baseCommit.data.tree.sha,
    tree: request.proposal.suggestedChanges.map((change) => ({
      path: change.path,
      mode: "100644",
      type: "blob",
      content: change.content
    }))
  });

  const commit = await octokit.git.createCommit({
    owner: request.forkOwner,
    repo: upstreamRepo,
    message: request.proposal.commitMessage,
    tree: tree.data.sha,
    parents: [forkBaseRef.data.object.sha]
  });

  await octokit.git.updateRef({
    owner: request.forkOwner,
    repo: upstreamRepo,
    ref: `heads/${branchName}`,
    sha: commit.data.sha,
    force: true
  });

  const pullRequest = await octokit.pulls.create({
    owner: upstreamOwner,
    repo: upstreamRepo,
    head: `${request.forkOwner}:${branchName}`,
    base: baseBranch,
    title: request.proposal.prTitle,
    body: `${request.proposal.prBody}\n\n## Human approval note\n${request.approvalReason}`,
    draft: true
  });

  return {
    draftPullRequestUrl: pullRequest.data.html_url,
    branchName
  };
}
