import { AsyncLocalStorage } from "node:async_hooks";

/** Per-request identity; no process-global mutable user state. */
const context = new AsyncLocalStorage<{ userId: string }>();

export function withUserContext<T>(userId: string, next: () => T): T {
  if (!userId || userId === "demo-user") throw new Error("A verified user identity is required.");
  context.run({ userId }, next);
}

export function requireRequestUserId(): string {
  const userId = context.getStore()?.userId;
  if (!userId) throw new Error("Authenticated user context is required for hosted state.");
  return userId;
}
