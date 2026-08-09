import assert from "node:assert/strict";
import test from "node:test";
import { repositoryIsForkOf } from "./fork-manager.js";

test("repositoryIsForkOf accepts the expected upstream fork", () => {
  assert.equal(
    repositoryIsForkOf(
      {
        fork: true,
        parent: { full_name: "angular/components" }
      },
      "angular/components"
    ),
    true
  );
});

test("repositoryIsForkOf is case insensitive", () => {
  assert.equal(
    repositoryIsForkOf(
      {
        fork: true,
        parent: { full_name: "Assistant-UI/Assistant-UI" }
      },
      "assistant-ui/assistant-ui"
    ),
    true
  );
});

test("repositoryIsForkOf rejects same-name unrelated repositories", () => {
  assert.equal(
    repositoryIsForkOf(
      {
        fork: false,
        parent: null
      },
      "ant-design/ant-design"
    ),
    false
  );
});

test("repositoryIsForkOf rejects forks of a different upstream", () => {
  assert.equal(
    repositoryIsForkOf(
      {
        fork: true,
        parent: { full_name: "other/project" }
      },
      "ant-design/ant-design"
    ),
    false
  );
});
