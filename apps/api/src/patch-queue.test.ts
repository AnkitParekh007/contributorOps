import assert from "node:assert/strict";
import test from "node:test";
import { hasAiContributionProhibition, validatePatchQueueItem } from "./patch-queue.js";

const validItem = {
  id: "mui-48908",
  upstreamRepoFullName: "mui/material-ui",
  issueNumber: 48908,
  issueUrl: "https://github.com/mui/material-ui/issues/48908",
  issueTitle: "Autocomplete StrictMode null ref crash",
  branchName: "fix/autocomplete-strictmode-null-input-ref",
  plan: {
    files: [
      {
        path: "packages/mui-material/src/useAutocomplete/useAutocomplete.js",
        replacements: [{ oldText: "before", newText: "after" }]
      }
    ],
    commitMessage: "fix(Autocomplete): guard input ref during highlight sync",
    prTitle: "[material-ui][Autocomplete] Guard input ref during highlight sync",
    prBody: "Fixes #48908 with an exact null-safe input ref update.",
    testEvidence: "Targeted regression coverage added and validated."
  }
};

test("accepts a complete exact-patch queue item", () => {
  assert.equal(validatePatchQueueItem(validItem).id, "mui-48908");
});

test("rejects issue URL and number mismatch", () => {
  assert.throws(
    () => validatePatchQueueItem({ ...validItem, issueUrl: "https://github.com/mui/material-ui/issues/1" }),
    /issueUrl must reference issueNumber/
  );
});

test("detects explicit AI contribution prohibitions", () => {
  assert.equal(hasAiContributionProhibition(["We do not accept AI-generated pull requests."]), true);
});

test("does not flag ordinary AI documentation", () => {
  assert.equal(hasAiContributionProhibition(["This project contains AI-assisted developer tooling examples."]), false);
});
