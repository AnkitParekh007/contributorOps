/** Keep hosted API startup fail-closed before binding a network socket.
 * A remote service with localhost URLs, browser-write scopes, or missing
 * encryption material must never look production-ready.
 */
export interface ApiStartupPolicy {
  storageMode: "demo" | "supabase";
  nodeEnv: string;
  host: string;
  publicAppUrl: string;
  allowedOrigins: string[];
  supabaseUrl: string;
  supabaseServiceKey: string;
  tokenEncryptionKey: string;
  githubToken: string;
  githubClientId: string;
  githubClientSecret: string;
  createDailyIssue: boolean;
  autoContributeEnabled: boolean;
  autoWorkspaceEnabled: boolean;
}

function isLoopback(host: string): boolean {
  return ["127.0.0.1", "::1", "localhost"].includes(host);
}

function isHttpsAbsoluteUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function verifyApiStartupPolicy(options: ApiStartupPolicy): void {
  if (options.storageMode === "demo" && !isLoopback(options.host)) {
    throw new Error("Demo API must bind to localhost. Use Supabase mode for network access.");
  }

  if ((options.autoContributeEnabled || options.autoWorkspaceEnabled || options.createDailyIssue) &&
      options.githubToken) {
    throw new Error("HTTP API cannot run write automation using a process-wide GitHub token.");
  }

  if (options.storageMode !== "supabase") return;

  if (!options.supabaseUrl || !options.supabaseServiceKey) {
    throw new Error("Hosted mode requires a configured Supabase endpoint and service key.");
  }
  if (options.githubToken) {
    throw new Error("Hosted API refuses process-wide GitHub credentials.");
  }
  if (Boolean(options.githubClientId) !== Boolean(options.githubClientSecret)) {
    throw new Error("GitHub OAuth client ID and secret must be configured together.");
  }

  const externallyReachable = options.nodeEnv === "production" || !isLoopback(options.host);
  if (!externallyReachable) return; // local hosted-contract tests use test-only endpoints.

  if (!isHttpsAbsoluteUrl(options.publicAppUrl) ||
      !isHttpsAbsoluteUrl(options.supabaseUrl)) {
    throw new Error("Public hosted mode requires HTTPS API and Supabase URLs.");
  }
  if (!options.allowedOrigins.length ||
      options.allowedOrigins.some(origin => !isHttpsAbsoluteUrl(origin) || new URL(origin).origin !== origin)) {
    throw new Error("Public hosted mode requires explicit HTTPS CORS origins (without paths).");
  }
  // The API derives AES-256-GCM key material from this secret. Require at least
  // 32 unpredictable characters; length alone is not a substitute for entropy.
  if (!options.tokenEncryptionKey || options.tokenEncryptionKey.length < 32) {
    throw new Error("Public hosted mode requires a strong token-encryption secret.");
  }
}
