import assert from "node:assert/strict";
import test from "node:test";
import { verifyApiStartupPolicy, type ApiStartupPolicy } from "./startup-policy.js";

const secure: ApiStartupPolicy = {
  storageMode: "supabase",
  nodeEnv: "production",
  host: "0.0.0.0",
  publicAppUrl: "https://api.contributorops.example",
  allowedOrigins: ["https://app.contributorops.example"],
  supabaseUrl: "https://project.supabase.co",
  supabaseServiceKey: "nonsecret-test-only-service-role-placeholder",
  tokenEncryptionKey: "a".repeat(40),
  githubToken: "",
  githubClientId: "test-id",
  githubClientSecret: "test-oauth-client-secret",
  autoContributeEnabled: false,
  autoWorkspaceEnabled: false,
  createDailyIssue: false,
};

test("secure remotely bound hosted configuration passes the startup gate", () => {
  assert.doesNotThrow(() => verifyApiStartupPolicy(secure));
});

test("hosted API fails closed for localhost URLs, CORS origins, or weak encryption keys", () => {
  assert.throws(() => verifyApiStartupPolicy({ ...secure, publicAppUrl: "http://localhost:8787" }), /HTTPS/);
  assert.throws(() => verifyApiStartupPolicy({ ...secure, supabaseUrl: "http://localhost:9999" }), /HTTPS/);
  assert.throws(() => verifyApiStartupPolicy({ ...secure, allowedOrigins: ["http://localhost:5173"] }), /HTTPS CORS/);
  assert.throws(() => verifyApiStartupPolicy({ ...secure, allowedOrigins: [] }), /HTTPS CORS/);
  assert.throws(() => verifyApiStartupPolicy({ ...secure, allowedOrigins: ["https://example.com/sneaky"] }), /HTTPS CORS/);
  assert.throws(() => verifyApiStartupPolicy({ ...secure, tokenEncryptionKey: "" }), /strong token-encryption/);
  assert.throws(() => verifyApiStartupPolicy({ ...secure, tokenEncryptionKey: "short" }), /strong token-encryption/);
});

test("hosted mode forbids shared PATs and partial OAuth client configuration", () => {
  assert.throws(() => verifyApiStartupPolicy({ ...secure, githubToken: "unsafe-global-pat" }), /process-wide/);
  assert.throws(() => verifyApiStartupPolicy({ ...secure, githubClientSecret: "" }), /configured together/);
  assert.throws(() => verifyApiStartupPolicy({ ...secure, githubClientId: "" }), /configured together/);
  assert.throws(() => verifyApiStartupPolicy({ ...secure, supabaseServiceKey: "" }), /Supabase endpoint/);
});

test("demo API cannot bind to the network or combine process PAT with writes", () => {
  const demo = { ...secure, storageMode: "demo" as const, host: "127.0.0.1" };
  assert.doesNotThrow(() => verifyApiStartupPolicy(demo));
  assert.throws(() => verifyApiStartupPolicy({ ...demo, host: "0.0.0.0" }), /localhost/);
  assert.throws(() => verifyApiStartupPolicy({ ...demo, githubToken: "unsafe-pat", autoContributeEnabled: true }), /process-wide/);
});

test("test-only localhost Supabase contract remains available without production secrets", () => {
  const local = {
    ...secure, nodeEnv: "test", host: "127.0.0.1",
    publicAppUrl: "http://localhost:8787",
    supabaseUrl: "http://127.0.0.1:9999",
    allowedOrigins: ["http://localhost:5173"],
    tokenEncryptionKey: "",
    githubClientId: "", githubClientSecret: "",
  };
  assert.doesNotThrow(() => verifyApiStartupPolicy(local));
});
