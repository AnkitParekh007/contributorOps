import { useEffect, useState } from "react";
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

  // Check if onboarding is complete after GitHub callback redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    if (params.get("github") === "connected") {
      setStatus((prev) => ({ ...prev, githubConnected: true }));
      setActiveStep(2);
      // Clean up the URL
      window.history.replaceState({}, "", window.location.pathname + "#/onboarding");
    }
  }, []);

  const handleConnectGithub = () => {
    window.location.href = "/api/github/connect";
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
          description="We use your GitHub token to discover real issues and open PRs on your behalf."
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
              <p className="step-note">
                This requests <code>public_repo</code> scope — enough to fork repos and open draft PRs.
                You can request broader access later if needed.
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
