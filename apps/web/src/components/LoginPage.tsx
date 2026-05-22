import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BrandLogo } from "./BrandLogo";

export function LoginPage() {
  const { signInWithGitHub, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const theme =
    typeof document !== "undefined" && document.documentElement.dataset.theme === "light"
      ? "light"
      : "dark";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    const { error } = await signInWithEmail(email.trim());
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setEmailSent(true);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <BrandLogo theme={theme} compact />
        </div>

        <h1 className="login-title">Sign in to your account</h1>
        <p className="login-subtitle">
          Turn real open-source contributions into job-ready proof of work.
        </p>

        {emailSent ? (
          <div className="login-success">
            <div className="login-success-icon">✓</div>
            <h3>Check your email</h3>
            <p>We sent a magic link to <strong>{email}</strong>. Click it to sign in.</p>
            <button
              type="button"
              className="login-resend-btn"
              onClick={() => { setEmailSent(false); setEmail(""); }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="login-github-btn"
              onClick={() => signInWithGitHub()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Continue with GitHub
            </button>

            <div className="login-divider">
              <span>or continue with email</span>
            </div>

            <form className="login-form" onSubmit={handleEmailSubmit}>
              {error && (
                <div className="login-error" role="alert">{error}</div>
              )}
              <div className="login-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Sending…" : "Send magic link"}
              </button>
            </form>
          </>
        )}

        <p className="login-footer-note">
          By signing in, you agree to the{" "}
          <a href="https://ankitparekh007.github.io/contributorOps/#/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="https://ankitparekh007.github.io/contributorOps/#/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}
