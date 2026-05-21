import { LockKeyhole, ShieldCheck, TestTubeDiagonal } from "lucide-react";
import type { ControlModeState, ContributionSafetyLevel } from "../types";

interface ControlModePanelProps {
  controlMode: ControlModeState;
  approvalReason: string;
  isUpdating: boolean;
  onApprovalReasonChange: (value: string) => void;
  onChangeMode: (
    safetyLevel: ContributionSafetyLevel,
    options?: { explicitApproval?: boolean; approvalReason?: string }
  ) => void;
}

const levels: Array<{
  value: ContributionSafetyLevel;
  title: string;
  icon: typeof TestTubeDiagonal;
  description: string;
}> = [
  {
    value: "research",
    title: "Level 1: Research Mode",
    icon: TestTubeDiagonal,
    description: "Discovery, scoring, and planning only. No GitHub writes beyond local tracking."
  },
  {
    value: "draft",
    title: "Level 2: Draft Mode",
    icon: ShieldCheck,
    description: "Generate local draft changes and planning issues only inside contributorOps."
  },
  {
    value: "approved-pr",
    title: "Level 3: Approved PR Mode",
    icon: LockKeyhole,
    description: "Only after explicit approval. Can create a branch and draft PR in your fork."
  }
];

export function ControlModePanel({
  controlMode,
  approvalReason,
  isUpdating,
  onApprovalReasonChange,
  onChangeMode
}: ControlModePanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Controlled contribution mode</p>
          <h2>Choose the safety level before any GitHub write.</h2>
        </div>
      </div>

      <div className="mode-grid">
        {levels.map((level) => {
          const Icon = level.icon;
          const active = controlMode.safetyLevel === level.value;

          return (
            <button
              key={level.value}
              type="button"
              className={`mode-card ${active ? "active" : ""}`}
              disabled={isUpdating}
              onClick={() => onChangeMode(level.value)}
            >
              <div className="info-card-title">
                <Icon size={16} />
                <strong>{level.title}</strong>
              </div>
              <p>{level.description}</p>
            </button>
          );
        })}
      </div>

      <div className="approval-box">
        <label>
          Human approval note
          <textarea
            rows={3}
            value={approvalReason}
            onChange={(event) => onApprovalReasonChange(event.target.value)}
            placeholder="Required before entering Approved PR Mode."
          />
        </label>
        <div className="editor-actions">
          <button
            type="button"
            className="secondary-button"
            disabled={isUpdating || !approvalReason.trim()}
            onClick={() =>
              onChangeMode("approved-pr", {
                explicitApproval: true,
                approvalReason
              })
            }
          >
            Grant Approved PR Mode
          </button>
          <span className="muted-copy">
            {controlMode.approvalGrantedAt
              ? `Approved at ${new Date(controlMode.approvalGrantedAt).toLocaleString()}`
              : "Approved PR Mode is not active."}
          </span>
        </div>
      </div>
    </section>
  );
}
