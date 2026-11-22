import assert from "node:assert/strict";
import test from "node:test";
import { toExportPortfolioEntry, toHostedPortfolioWrite } from "../storage.js";
import type { PortfolioEntryDB } from "../db/portfolio.js";

test("hosted proof export maps the canonical owner-scoped portfolio record", () => {
  const row = toExportPortfolioEntry({
    id: "record-a",
    repo: "example/maintainer-repo",
    title: "https://github.com/example/maintainer-repo/issues/7",
    prUrl: "https://github.com/example/maintainer-repo/pull/9",
    description: "Owner A's verified contribution",
    tags: [],
    status: "merged",
    proof: {
      resumeBullet: "Fixed owner A's upstream integration",
      interviewStarStory: "Owned a small API regression fix",
    },
    isPublic: false,
    createdAt: "2026-11-22T00:00:00.000Z",
  });
  assert.equal(row.id, "record-a");
  assert.equal(row.selectedRepo, "example/maintainer-repo");
  assert.equal(row.status, "merged");
  assert.equal(row.resumeBullet, "Fixed owner A's upstream integration");
  assert.equal(row.interviewStarStory, "Owned a small API regression fix");
  assert.equal(row.prUrl, "https://github.com/example/maintainer-repo/pull/9");
  assert.ok(!JSON.stringify(row).includes("customerEmail"));
});

test("hosted editor create round-trips recruiter proof, notes, and timestamps", () => {
  const issueUrl = "https://github.com/acme/library/issues/42";
  const input = {
    selectedRepo: "acme/library",
    issueUrl,
    prUrl: "https://github.com/acme/library/pull/43",
    status: "merged" as const,
    notes: "Maintainer-reviewed fix",
    resumeBullet: "Fixed an upstream regression",
    interviewStarStory: "Resolved a complex issue with tests",
    interviewSituation: "A public SDK integration failed",
    interviewTask: "Reduce integration errors",
    interviewAction: "Added deterministic regression tests",
    interviewResult: "Change merged by upstream maintainer",
    linkedInPost: "Open-source contribution update",
    linkedInShort: "Short update",
    linkedInMedium: "Medium update",
    linkedInDetailed: "Detailed update",
    recruiterOutreach: "Example recruiter note",
    githubProfileSnippet: "Verified upstream contribution",
  };
  const created = toHostedPortfolioWrite(input);
  assert.equal(created.repo, input.selectedRepo);
  assert.equal(created.title, issueUrl);
  assert.equal(created.description, input.notes);
  assert.equal(created.proof?.interviewSituation, input.interviewSituation);
  const row: PortfolioEntryDB = {
    id: "e-1", repo: created.repo!, title: created.title!,
    prUrl: created.prUrl, description: created.description!,
    tags: [], status: created.status!, proof: created.proof,
    isPublic: false,
    createdAt: "2026-11-20T12:00:00.000Z",
    updatedAt: "2026-11-23T12:00:00.000Z",
  };
  const result = toExportPortfolioEntry(row);
  for (const [key, value] of Object.entries(input)) {
    assert.equal(result[key as keyof typeof result], value, key);
  }
  assert.equal(result.updatedAt, "2026-11-23T12:00:00.000Z");
  assert.equal(result.createdAt, "2026-11-20T12:00:00.000Z");
});

test("partial hosted patches keep existing evidence and do not write a public flag", () => {
  const before: PortfolioEntryDB = {
    id: "e-2", repo: "first/repo",
    title: "https://github.com/first/repo/issues/5",
    description: "Before", tags: [],
    status: "planned",
    proof: { resumeBullet: "Unchanged evidence", issueUrl: "https://github.com/first/repo/issues/5" },
    isPublic: false, createdAt: "2026-11-20T12:00:00.000Z",
  };
  const patch = toHostedPortfolioWrite({ notes: "After", status: "in progress" }, before);
  assert.equal(patch.description, "After");
  assert.equal(patch.status, "in progress");
  assert.equal(patch.proof?.resumeBullet, "Unchanged evidence");
  assert.equal(patch.proof?.issueUrl, "https://github.com/first/repo/issues/5");
  assert.equal(Object.hasOwn(patch, "repo"), false);
  assert.equal(Object.hasOwn(patch, "isPublic"), false);
  assert.equal(Object.hasOwn(patch, "title"), false);
});

test("an explicit clear of the issue URL does not resurrect a legacy title URL", () => {
  const before: PortfolioEntryDB = {
    id: "e-3", repo: "first/repo",
    title: "https://github.com/first/repo/issues/5",
    description: "", tags: [], status: "discovered", proof: {},
    isPublic: false, createdAt: "2026-11-20T12:00:00.000Z",
  };
  assert.equal(toExportPortfolioEntry(before).issueUrl, before.title, "legacy fallback works");
  const patch = toHostedPortfolioWrite({ issueUrl: "" }, before);
  const after = toExportPortfolioEntry({
    ...before, title: patch.title || before.title,
    proof: patch.proof,
  });
  assert.equal(after.issueUrl, "");
});
