import assert from "node:assert/strict";
import test from "node:test";
import { hasAiContributionProhibition, isLowSignalIssue, normalizeRadarState } from "./hourly.js";

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
