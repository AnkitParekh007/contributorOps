import assert from "node:assert/strict";
import test from "node:test";
import { toExportPortfolioEntry } from "../storage.js";

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
