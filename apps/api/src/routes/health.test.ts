import assert from "node:assert/strict";
import test from "node:test";
import { configuredSupabaseProjectRef } from "./health.js";

const REF = "abcdefghijklmnopqrst";

test("canonical HTTPS Supabase URL exposes only the expected public project reference", () => {
  assert.equal(configuredSupabaseProjectRef(`https://${REF}.supabase.co`), REF);
  assert.equal(configuredSupabaseProjectRef(`https://${REF}.supabase.co/`), REF);
  assert.equal(configuredSupabaseProjectRef(""), null);
});

test("noncanonical or spoofed Supabase backends cannot satisfy staging identity", () => {
  for (const url of [
    `http://${REF}.supabase.co`,
    `https://${REF}.supabase.co:8443`,
    `https://${REF}.supabase.co/other`,
    `https://${REF}.supabase.co/?project=other`,
    `https://${REF}.supabase.co#other`,
    `https://${REF}.supabase.co.attacker.tld`,
    `https://${REF}.supabase.co@attacker.tld`,
    "https://localhost:54321",
    "not-a-url",
  ]) {
    assert.equal(configuredSupabaseProjectRef(url), null, url);
  }
});
