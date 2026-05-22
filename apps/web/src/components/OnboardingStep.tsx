interface OnboardingStepProps {
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  children: React.ReactNode;
}

export function OnboardingStep({ stepNumber, title, description, isCompleted, isActive, children }: OnboardingStepProps) {
  return (
    <div className={`onboarding-wizard-step ${isActive ? "step-active" : ""} ${isCompleted ? "step-completed" : ""}`}>
      <div className="onboarding-step-header">
        <div className={`step-number ${isCompleted ? "step-number-done" : ""}`}>
          {isCompleted ? "✓" : stepNumber}
        </div>
        <div>
          <h3 className="onboarding-step-title">{title}</h3>
          <p className="onboarding-step-desc">{description}</p>
        </div>
      </div>
      {isActive && (
        <div className="onboarding-step-body">
          {children}
        </div>
      )}
    </div>
  );
}
