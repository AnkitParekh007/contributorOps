import type { ReactNode } from "react";
import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

export type AsyncStateKind = "loading" | "empty" | "error";

interface AsyncStateProps {
  kind: AsyncStateKind;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}

/**
 * Shared site state surface. Callers own fetching, retry behavior and data truth.
 * No fake sample metrics are rendered while an API request is pending or failed.
 */
export function AsyncState({ kind, title, description, action, compact = false }: AsyncStateProps) {
  const Icon = kind === "loading" ? LoaderCircle : kind === "empty" ? Inbox : AlertCircle;
  return (
    <div
      className={`async-state async-state--${kind}${compact ? " async-state--compact" : ""}`}
      role={kind === "error" ? "alert" : kind === "loading" ? "status" : undefined}
      aria-live={kind === "loading" ? "polite" : undefined}
      aria-busy={kind === "loading"}
    >
      <div className="async-state__icon" aria-hidden="true">
        <Icon size={22} className={kind === "loading" ? "async-state__spinner" : undefined} />
      </div>
      <div className="async-state__content">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      {action ? <div className="async-state__action">{action}</div> : null}
    </div>
  );
}
