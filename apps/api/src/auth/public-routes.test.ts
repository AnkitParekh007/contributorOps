import { strict as assert } from "node:assert";
import test from "node:test";
import { isPublicApiRequest } from "./public-routes.js";

test("the public route matrix uses paths relative to the /api mount", () => {
  for (const route of ["/health", "/pricing", "/meta", "/launch-offer", "/github/callback", "/waitlist/stats", "/public/portfolio/alice", "/public/user/alice"]) {
    assert.equal(isPublicApiRequest("GET", route), true, `GET ${route}`);
  }
  assert.equal(isPublicApiRequest("POST", "/waitlist"), true);
  assert.equal(isPublicApiRequest("OPTIONS", "/contribute/approve-comment"), true);
});

test("private and write endpoints never match public routes", () => {
  for (const path of ["/github/connect", "/github/complete", "/github/disconnect", "/billing", "/billing/mock-select-plan", "/portfolio", "/portfolio/share", "/contribute/prepare", "/contribute/approve-comment", "/control-mode", "/discover", "/daily-plan", "/public/portfolio/alice/extra", "/waitlist/junk"]) {
    assert.equal(isPublicApiRequest("GET", path), false, `GET ${path}`);
    assert.equal(isPublicApiRequest("POST", path), false, `POST ${path}`);
  }
  for (const path of ["/waitlist", "/github/callback", "/health", "/pricing", "/public/user/alice"]) {
    assert.equal(isPublicApiRequest("DELETE", path), false, `DELETE ${path}`);
  }
  assert.equal(isPublicApiRequest("POST", "/github/callback"), false);
});
