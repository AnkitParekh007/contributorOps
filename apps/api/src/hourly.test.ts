import assert from "node:assert/strict";
import test from "node:test";
import { hasAiContributionProhibition, isLowSignalIssue, normalizeRadarState } from "./hourly.js";
import { buildRepoSearchTerms, canSkipDiscoveryError } from "./github.js";

test("normalizeRadarState resets a previous day and de-duplicates repos", () => {
  assert.deepEqual(normalizeRadarState({ date: "2026-08-08", repos: ["a/b"] }, "2026-08-09"), {
    date: "2026-08-09",
    repos: []
  });

  assert.deepEqual(
    normalizeRadarState({ date: "2026-08-09", repos: ["a/b", "a/b", " c/d "] }, "2026-08-09"),
    { date: "2026-08-09", repos: ["a/b", "c/d"] }
  );
});

test("hasAiContributionProhibition detects explicit AI contribution bans", () => {
  assert.equal(
    hasAiContributionProhibition(["Please do not submit AI generated code or ChatGPT-generated pull requests."]),
    true
  );
  assert.equal(
    hasAiContributionProhibition(["AI-assisted contributions are welcome when contributors review and test the final patch."]),
    false
  );
});

test("isLowSignalIssue rejects typo-only work but keeps real bugs", () => {
  assert.equal(
    isLowSignalIssue({
      issueTitle: "Fix typo in README",
      issueBody: "There is a spelling mistake in one sentence.",
      labels: ["documentation"]
    }),
    true
  );

  assert.equal(
    isLowSignalIssue({
      issueTitle: "Combobox focus ring remains visible in popup",
      issueBody:
        "The focus ring remains visible because the current selector has higher specificity. The bug is reproducible in the popup and affects keyboard users.",
      labels: ["bug", "accessibility"]
    }),
    false
  );
});

test("GitHub discovery uses bounded supported topic/language queries rather than OR qualifier groups", () => {
  const terms = buildRepoSearchTerms({
    topics: ["ai", "llm", "developer-tools"],
    languages: ["typescript", "javascript"],
    labels: ["good first issue"]
  });

  assert.equal(terms.length, 3);
  assert.match(terms[0], /topic:ai language:typescript$/);
  assert.match(terms[1], /topic:llm language:javascript$/);
  assert.match(terms[2], /topic:developer-tools language:typescript$/);
  assert.ok(terms.every((term) => !term.includes(" OR ") && !term.includes("(")));
  assert.ok(terms.every((term) => term.includes("archived:false") && term.includes("stars:>50")));
});

test("GitHub discovery limits repositories searched and has a safe default category", () => {
  const terms = buildRepoSearchTerms({
    topics: Array.from({ length: 16 }, (_, i) => `topic-${i}`),
    languages: [],
    labels: []
  });
  assert.equal(terms.length, 8);
  assert.ok(terms.every((term) => term.includes("language:typescript")));

  assert.deepEqual(
    buildRepoSearchTerms({ topics: [], languages: ["javascript"], labels: [] }),
    ["archived:false is:public stars:>50 topic:developer-tools language:javascript"]
  );
});

test("discovery tolerates isolated GitHub 5xx but never masks invalid credentials or rate limits", () => {
  assert.equal(canSkipDiscoveryError({ status: 502 }, "search"), true);
  assert.equal(canSkipDiscoveryError({ status: 503 }, "issues"), true);
  assert.equal(canSkipDiscoveryError({ status: 404 }, "issues"), true);
  assert.equal(canSkipDiscoveryError({ status: 410 }, "issues"), true);
  for (const status of [401, 403, 422, 429]) {
    assert.equal(canSkipDiscoveryError({ status }, "search"), false);
    assert.equal(canSkipDiscoveryError({ status }, "issues"), false);
  }
  assert.equal(canSkipDiscoveryError({ status: 404 }, "search"), false);
  assert.equal(canSkipDiscoveryError(new Error("no status"), "search"), false);
});
