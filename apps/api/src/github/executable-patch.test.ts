import assert from "node:assert/strict";
import test from "node:test";
import {
  applyExecutablePatchFile,
  materializeExecutablePatch,
  validateExecutablePatchPlan,
  type ExecutablePatchPlan
} from "./executable-patch.js";

const basePlan: ExecutablePatchPlan = {
  files: [
    {
      path: "src/example.ts",
      replacements: [{ oldText: "const enabled = false;", newText: "const enabled = true;" }]
    }
  ],
  commitMessage: "fix: enable expected behavior",
  prTitle: "fix: enable expected behavior",
  prBody: "Fixes a reproducible behavior regression with a narrow exact replacement.",
  testEvidence: "Targeted regression test passes."
};

test("validates a focused executable patch plan", () => {
  assert.doesNotThrow(() => validateExecutablePatchPlan(basePlan));
});

test("rejects placeholder proposal content", () => {
  assert.throws(
    () =>
      validateExecutablePatchPlan({
        ...basePlan,
        prBody: "ContributorOps draft proposal - planned change"
      }),
    /Placeholder proposal content/
  );
});

test("rejects unsafe paths", () => {
  assert.throws(
    () =>
      validateExecutablePatchPlan({
        ...basePlan,
        files: [{ path: "../secret", replacements: basePlan.files[0].replacements }]
      }),
    /Unsafe patch path/
  );
});

test("requires an exact single match", () => {
  assert.throws(
    () => applyExecutablePatchFile("const enabled = false;\nconst enabled = false;", basePlan.files[0]),
    /expected exactly one match.*found 2/
  );
});

test("materializes exact replacements against current source", async () => {
  const result = await materializeExecutablePatch(basePlan, async () => "const enabled = false;\n");
  assert.equal(result.length, 1);
  assert.equal(result[0].content, "const enabled = true;\n");
  assert.equal(result[0].replacementCount, 1);
});
