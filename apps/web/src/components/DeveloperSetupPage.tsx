import { BookOpen, FileCode2, Layers3 } from "lucide-react";

export type DeveloperSetupSection = "guide" | "api-template" | "web-template";

interface DeveloperSetupPageProps {
  selectedSection: DeveloperSetupSection;
  onSelectSection: (section: DeveloperSetupSection) => void;
}

const apiTemplate = `PORT=8787
PUBLIC_APP_URL=http://localhost:8787
CORS_ORIGINS=http://localhost:5174,http://localhost:8787

GITHUB_TOKEN=YOUR_GITHUB_TOKEN
GITHUB_USERNAME=YOUR_GITHUB_USERNAME
GH_CONTRIBUTOROPS_TOKEN=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

CONTRIBUTOROPS_OWNER=AnkitParekh007
CONTRIBUTOROPS_REPO=contributorOps

AUTO_CONTRIBUTE_ENABLED=false
AUTO_PR_DAILY_LIMIT=3
AUTO_COMMENT_DAILY_LIMIT=5
CREATE_DAILY_ISSUE=false

STORAGE_MODE=demo
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
TOKEN_ENCRYPTION_KEY=
LOG_LEVEL=debug`;

const webTemplate = `VITE_API_BASE_URL=http://localhost:8787
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=`;

const sectionMeta: Record<
  DeveloperSetupSection,
  { title: string; kicker: string; icon: typeof BookOpen; description: string }
> = {
  guide: {
    title: "Full environment setup guide",
    kicker: "Full guide",
    icon: BookOpen,
    description: "Workspace file locations, variable-by-variable setup, GitHub token steps, Supabase keys, OAuth, and Actions secrets."
  },
  "api-template": {
    title: "API environment template",
    kicker: "API template",
    icon: FileCode2,
    description: "Server-side variables for GitHub discovery, automation limits, GitHub OAuth, Supabase mode, and CORS."
  },
  "web-template": {
    title: "Web environment template",
    kicker: "Web template",
    icon: Layers3,
    description: "Browser-safe Vite variables for the React app and optional Supabase auth."
  }
};

export function DeveloperSetupPage({
  selectedSection,
  onSelectSection
}: DeveloperSetupPageProps) {
  const activeMeta = sectionMeta[selectedSection];
  const ActiveIcon = activeMeta.icon;

  return (
    <div className="page-stack">
      <section className="panel hero-panel">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow">Developer setup</span>
            <span className="mode-pill">local configuration</span>
          </div>
          <h1>Set up ContributorOps environment files the right way.</h1>
          <p>
            This app uses separate env files for the API, the React dashboard, and the static site.
            Use this page as the in-product source of truth instead of jumping out to GitHub.
          </p>
        </div>
        <div className="mission-card">
          <div className="mission-title">
            <ActiveIcon size={18} />
            <strong>{activeMeta.title}</strong>
          </div>
          <p>{activeMeta.description}</p>
          <div className="mission-meta">
            <span>API: <code>apps/api/.env</code></span>
            <span>Web: <code>apps/web/.env.local</code></span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Choose a guide</p>
            <h2>Open the full setup flow or jump straight to the templates.</h2>
          </div>
        </div>
        <div className="developer-setup-tabs">
          <button
            type="button"
            className={`developer-setup-tab ${selectedSection === "guide" ? "active" : ""}`}
            onClick={() => onSelectSection("guide")}
          >
            Full env guide
          </button>
          <button
            type="button"
            className={`developer-setup-tab ${selectedSection === "api-template" ? "active" : ""}`}
            onClick={() => onSelectSection("api-template")}
          >
            API template
          </button>
          <button
            type="button"
            className={`developer-setup-tab ${selectedSection === "web-template" ? "active" : ""}`}
            onClick={() => onSelectSection("web-template")}
          >
            Web template
          </button>
        </div>
      </section>

      {selectedSection === "guide" ? (
        <>
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="section-kicker">File placement</p>
                <h2>Use workspace-specific env files.</h2>
              </div>
            </div>
            <div className="detail-grid">
              <article className="info-card">
                <div className="info-card-title">
                  <strong>API server</strong>
                </div>
                <p><code>apps/api/.env</code></p>
                <p>Backend secrets, GitHub API credentials, automation flags, Supabase service key, OAuth client secrets, and CORS settings.</p>
              </article>
              <article className="info-card">
                <div className="info-card-title">
                  <strong>React app</strong>
                </div>
                <p><code>apps/web/.env.local</code></p>
                <p>Vite browser variables such as <code>VITE_API_BASE_URL</code>, <code>VITE_SUPABASE_URL</code>, and <code>VITE_SUPABASE_ANON_KEY</code>.</p>
              </article>
              <article className="info-card">
                <div className="info-card-title">
                  <strong>Static site</strong>
                </div>
                <p><code>apps/site/.env.local</code></p>
                <p>Optional Vite variables used by the marketing/docs site, typically just <code>VITE_API_BASE_URL</code>.</p>
              </article>
              <article className="info-card">
                <div className="info-card-title">
                  <strong>GitHub Actions</strong>
                </div>
                <p>Repository secrets</p>
                <p>Scheduled workflows do not read local env files. Put automation credentials in GitHub Actions repository secrets instead.</p>
              </article>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="section-kicker">Where to get the keys</p>
                <h2>Official URLs and exactly which variables they populate.</h2>
              </div>
            </div>
            <div className="job-mode-grid">
              <article className="job-card">
                <strong>GitHub personal access token</strong>
                <p>Use for <code>GITHUB_TOKEN</code> and optionally <code>GH_CONTRIBUTOROPS_TOKEN</code>.</p>
                <textarea readOnly value={"1. Open https://github.com/settings/tokens/new\n2. Create a classic token for local development\n3. Add public_repo and read:user if you only target public repositories\n4. Copy the token once and place it in apps/api/.env as GITHUB_TOKEN"} />
              </article>
              <article className="job-card">
                <strong>GitHub OAuth app</strong>
                <p>Use for <code>GITHUB_CLIENT_ID</code> and <code>GITHUB_CLIENT_SECRET</code>.</p>
                <textarea readOnly value={"1. Open https://github.com/settings/developers\n2. Create a new OAuth App\n3. Homepage URL: http://localhost:5174\n4. Authorization callback URL: http://localhost:8787/api/github/callback\n5. Copy the client ID and client secret into apps/api/.env"} />
              </article>
              <article className="job-card">
                <strong>Supabase project keys</strong>
                <p>Use for <code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_KEY</code>, <code>VITE_SUPABASE_URL</code>, and <code>VITE_SUPABASE_ANON_KEY</code>.</p>
                <textarea readOnly value={"1. Open https://supabase.com/dashboard\n2. Open your project\n3. Go to Project Settings → API\n4. Copy Project URL\n5. Copy service_role key for apps/api/.env\n6. Copy anon key for apps/web/.env.local"} />
              </article>
              <article className="job-card">
                <strong>GitHub Actions secrets</strong>
                <p>Use for scheduled workflows such as daily planning.</p>
                <textarea readOnly value={"1. Open https://github.com/AnkitParekh007/contributorOps/settings/secrets/actions\n2. Create GH_CONTRIBUTOROPS_TOKEN\n3. Store the token there instead of committing it to the repo\n4. Keep CREATE_DAILY_ISSUE scoped to your own contributorOps repo only"} />
              </article>
            </div>
          </section>
        </>
      ) : null}

      {selectedSection === "api-template" ? (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">API template</p>
              <h2>Paste this into <code>apps/api/.env</code>.</h2>
            </div>
          </div>
          <div className="stack-section">
            <div className="copy-block full-span">
              <pre>{apiTemplate}</pre>
            </div>
          </div>
        </section>
      ) : null}

      {selectedSection === "web-template" ? (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Web template</p>
              <h2>Paste this into <code>apps/web/.env.local</code>.</h2>
            </div>
          </div>
          <div className="stack-section">
            <div className="copy-block full-span">
              <pre>{webTemplate}</pre>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
