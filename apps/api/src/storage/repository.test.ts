import assert from "node:assert/strict";
import test from "node:test";
import { withUserContext } from "../auth/request-context.js";
import { getSupabaseAdmin } from "../db/client.js";
import { makeHostedStorageRepository } from "./repository.js";

function fakeDatabase() {
  const rows = new Map<string, unknown>();
  return {
    from(table: string) {
      assert.equal(table, "user_scoped_state");
      const criteria: Record<string, string> = {};
      const query = {
        eq(column: string, value: string) {
          criteria[column] = value;
          return query;
        },
        async maybeSingle() {
          const value = rows.get(`${criteria.user_id}::${criteria.state_key}`);
          return { data: value === undefined ? null : { value }, error: null };
        },
      };
      return {
        select(_columns: string) { return query; },
        async upsert(row: { user_id: string; state_key: string; value: unknown }) {
          rows.set(`${row.user_id}::${row.state_key}`, row.value);
          return { error: null };
        },
      };
    },
  } as unknown as ReturnType<typeof getSupabaseAdmin>;
}

test("parallel users cannot read or overwrite another user's state, run, billing or consent", async () => {
  const repo = makeHostedStorageRepository(() => fakeDatabaseShared);
  await Promise.all([
    withUserContext("11111111-1111-4111-8111-111111111111", async () => {
      await repo.write("controlMode", { safetyLevel: "approved-pr", consent: "owner A" });
      await repo.write("contributionRuns", [{ id: "run-a", approvalToken: "only-a" }]);
      await repo.write("billing", { plan: "career", customerEmail: "a@example.com" });
    }),
    withUserContext("22222222-2222-4222-8222-222222222222", async () => {
      await repo.write("controlMode", { safetyLevel: "research", consent: "owner B" });
      await repo.write("contributionRuns", [{ id: "run-b", approvalToken: "only-b" }]);
      await repo.write("billing", { plan: "free", customerEmail: "b@example.com" });
    }),
  ]);
  const [a, b] = await Promise.all([
    withUserContext("11111111-1111-4111-8111-111111111111", async () => ({
      control: await repo.read("controlMode", null),
      runs: await repo.read("contributionRuns", []),
      billing: await repo.read("billing", null),
    })),
    withUserContext("22222222-2222-4222-8222-222222222222", async () => ({
      control: await repo.read("controlMode", null),
      runs: await repo.read("contributionRuns", []),
      billing: await repo.read("billing", null),
    })),
  ]);
  assert.equal((a.control as { consent: string }).consent, "owner A");
  assert.equal((b.control as { consent: string }).consent, "owner B");
  assert.deepEqual(a.runs, [{ id: "run-a", approvalToken: "only-a" }]);
  assert.deepEqual(b.runs, [{ id: "run-b", approvalToken: "only-b" }]);
  assert.equal((a.billing as { plan: string }).plan, "career");
  assert.equal((b.billing as { plan: string }).plan, "free");
  await assert.rejects(repo.read("billing", null), /Authenticated user context/);
  await assert.rejects(repo.write("billing", { plan: "team" }), /Authenticated user context/);
});

test("unknown storage keys and fixed demo identity fail closed", async () => {
  const repo = makeHostedStorageRepository(() => fakeDatabase());
  assert.throws(() => withUserContext("demo-user", () => true), /verified user/);
  await assert.rejects(withUserContext("33333333-3333-4333-8333-333333333333", () => repo.read("not-a-state", 0)), /Unrecognized/);
});

const fakeDatabaseShared = fakeDatabase();
