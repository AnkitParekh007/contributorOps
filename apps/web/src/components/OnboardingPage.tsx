import { useEffect, useRef, useState } from "react";
import { apiClient } from "../api/client";
import { OnboardingStep } from "./OnboardingStep";

interface OnboardingStatus {
  githubConnected: boolean;
  safetyModeSet: boolean;
  firstRunComplete: boolean;
}

interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [status, setStatus] = useState<OnboardingStatus>({
    githubConnected: false,
    safetyModeSet: false,
    firstRunComplete: false,
  });
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [connectError, setConnectError] = useState("");
  const oauthCompletionStarted = useRef(false);

  useEffect(() => {
    apiClient
      .getOnboardingStatus()
      .then((s) => {
        setStatus(s);
        // Jump to first incomplete step
        if (!s.githubConnected) setActiveStep(1);
        else if (!s.safetyModeSet) setActiveStep(2);
        else setActiveStep(3);
      })
      .catch(() => {
        // Non-fatal — user can continue
      })
      .finally(() => setLoading(false));
  }, []);

  // GitHub returns to the browser, then the current authenticated Supabase
  // session finalizes the one-time code. Switching user accounts fails closed.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const code = params.get("github_code");
    const state = params.get("github_state");
    if (!code && !state) return;
    if (oauthCompletionStarted.current) return;
    oauthCompletionStarted.current = true;

    // Remove the short-lived OAuth authorization code from browser history first.
    window.history.replaceState({}, "", window.location.pathname + "#/onboarding");
    if (!code || !state) {
      setConnectError("Incomplete GitHub OAuth response. Please restart the connection.");
      return;
    }

    void apiClient.completeGithubConnect({ code, state })
      .then(async () => {
        const fresh = await apiClient.getOnboardingStatus();
        if (!fresh.githubConnected) throw new Error("The account connection could not be verified.");
        setStatus(fresh);
        setActiveStep(2);
      })
      .catch((error: unknown) => {
        setConnectError(error instanceof Error ? error.message : "GitHub connection failed. Please retry.");
      });
  }, []);

  const handleConnectGithub = async () => {
    setConnectError("");
    try {
      const { authorizationUrl } = await apiClient.beginGithubConnect();
      if (!authorizationUrl.startsWith("https://github.com/login/oauth/authorize?")) throw new Error("Invalid authorization destination");
      window.location.assign(authorizationUrl);
    } catch (error) {
      setConnectError(error instanceof Error ? error.message : "Unable to start GitHub connection.");
    }
  };

  const handleSetSafetyMode = async () => {
    try {
      await apiClient.updateControlMode({ safetyLevel: "draft" });
      setStatus((prev) => ({ ...prev, safetyModeSet: true }));
      setActiveStep(3);
    } catch {
      // ignore, user can retry
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const isAllDone = status.githubConnected && status.safetyModeSet;

  if (loading) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-loading">Setting up your workspace…</div>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-header-block">
        <p className="eyebrow">Welcome to ContributorOps</p>
        <h1>Let's set up your workspace</h1>
        <p className="onboarding-subtitle-text">
          Three quick steps to start discovering open-source opportunities and building proof of work.
        </p>
      </div>

      <div className="onboarding-wizard">
        <OnboardingStep
          stepNumber={1}
          title="Connect your GitHub account"
          description="Connect your GitHub identity for account-specific features. Hosted GitHub writes remain disabled until the user-owned approval workflow is available."
          isCompleted={status.githubConnected}
          isActive={activeStep === 1}
        >
          {status.githubConnected ? (
            <p className="step-success-msg">✓ GitHub connected</p>
          ) : (
            <div className="step-action">
              <button type="button" className="primary-button" onClick={handleConnectGithub}>
                Connect GitHub
              </button>
              {connectError ? <p className="step-note" role="alert">{connectError}</p> : null}
              <p className="step-note">
                This connection requests only <code>read:user</code> permission. Repository writes are not available from the hosted API.
              </p>
            </div>
          )}
        </OnboardingStep>

        <OnboardingStep
          stepNumber={2}
          title="Set your safety mode"
          description="Choose how much automation you're comfortable with. You can change this at any time."
          isCompleted={status.safetyModeSet}
          isActive={activeStep === 2}
        >
          {status.safetyModeSet ? (
            <p className="step-success-msg">✓ Safety mode configured</p>
          ) : (
            <div className="step-action">
              <div className="safety-mode-options">
                <div className="safety-option">
                  <strong>Research Mode</strong>
                  <p>Discover issues and read plans. No external actions.</p>
                </div>
                <div className="safety-option safety-option-highlight">
                  <strong>Draft Mode (recommended)</strong>
                  <p>Generate proposals and draft PRs — you approve every step.</p>
                </div>
              </div>
              <button type="button" className="primary-button" onClick={handleSetSafetyMode}>
                Start in Draft Mode
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setStatus((prev) => ({ ...prev, safetyModeSet: true }));
                  setActiveStep(3);
                }}
              >
                Keep Research Mode for now
              </button>
            </div>
          )}
        </OnboardingStep>

        <OnboardingStep
          stepNumber={3}
          title="Discover your first opportunities"
          description="Run a discovery to see job-matched open-source issues ranked by signal strength."
          isCompleted={status.firstRunComplete}
          isActive={activeStep === 3}
        >
          <div className="step-action">
            <p className="step-note">
              After setup, head to the Dashboard and click <strong>Generate Daily Plan</strong> to see
              your first ranked issue list.
            </p>
            <button type="button" className="primary-button" onClick={onComplete}>
              {isAllDone ? "Go to Dashboard →" : "Go to Dashboard →"}
            </button>
          </div>
        </OnboardingStep>
      </div>

      <div className="onboarding-footer">
        <button type="button" className="text-button" onClick={handleSkip}>
          Skip setup — take me to the dashboard
        </button>
      </div>
    </div>
  );
}
