import { CheckCircle2, Save, Trash2 } from "lucide-react";
import type { PortfolioEntry, PortfolioStatus } from "../types";

interface PortfolioTrackerProps {
  entries: PortfolioEntry[];
  selectedEntryId: string | null;
  onSelect: (entry: PortfolioEntry) => void;
  onDelete: (id: string) => void;
  onChange: (entry: PortfolioEntry) => void;
  onSave: (entry: PortfolioEntry) => void;
}

const statuses: PortfolioStatus[] = [
  "discovered",
  "planned",
  "in progress",
  "PR opened",
  "merged",
  "rejected"
];

export function PortfolioTracker({
  entries,
  selectedEntryId,
  onSelect,
  onDelete,
  onChange,
  onSave
}: PortfolioTrackerProps) {
  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId) || entries[0] || null;

  return (
    <section className="panel portfolio-panel">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Portfolio tracker</p>
          <h2>Track discovered issues through merged proof.</h2>
        </div>
      </div>

      <div className="portfolio-layout">
        <div className="portfolio-list">
          {entries.length === 0 ? (
            <div className="empty-note">Save an issue from the detail panel to create your first tracked contribution.</div>
          ) : (
            entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`portfolio-item ${selectedEntry?.id === entry.id ? "active" : ""}`}
                onClick={() => onSelect(entry)}
              >
                <strong>{entry.selectedRepo}</strong>
                <span>{entry.status}</span>
                <small>{entry.issueUrl}</small>
              </button>
            ))
          )}
        </div>

        {selectedEntry ? (
          <div className="portfolio-editor">
            <div className="editor-grid">
              <label>
                Selected repo
                <input
                  value={selectedEntry.selectedRepo}
                  onChange={(event) => onChange({ ...selectedEntry, selectedRepo: event.target.value })}
                />
              </label>
              <label>
                Issue URL
                <input
                  value={selectedEntry.issueUrl}
                  onChange={(event) => onChange({ ...selectedEntry, issueUrl: event.target.value })}
                />
              </label>
              <label>
                PR URL
                <input
                  value={selectedEntry.prUrl}
                  onChange={(event) => onChange({ ...selectedEntry, prUrl: event.target.value })}
                />
              </label>
              <label>
                Status
                <select
                  value={selectedEntry.status}
                  onChange={(event) =>
                    onChange({ ...selectedEntry, status: event.target.value as PortfolioStatus })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Notes
              <textarea
                rows={3}
                value={selectedEntry.notes}
                onChange={(event) => onChange({ ...selectedEntry, notes: event.target.value })}
              />
            </label>

            <label>
              Interview story
              <textarea
                rows={3}
                value={selectedEntry.interviewStarStory}
                onChange={(event) =>
                  onChange({ ...selectedEntry, interviewStarStory: event.target.value })
                }
              />
            </label>

            <div className="editor-actions">
              <button type="button" className="primary-button" onClick={() => onSave(selectedEntry)}>
                <Save size={16} />
                Save entry
              </button>
              <button type="button" className="ghost-button" onClick={() => onDelete(selectedEntry.id)}>
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
