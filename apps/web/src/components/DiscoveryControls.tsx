import { Filter, RefreshCw } from "lucide-react";
import type { DiscoveryFilters } from "../types";

interface DiscoveryControlsProps {
  filters: DiscoveryFilters;
  isLoading: boolean;
  onChange: (next: DiscoveryFilters) => void;
  onGenerate: () => void;
}

function updateArray(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function renderChipGroup(
  title: string,
  options: string[],
  selected: string[],
  onToggle: (value: string) => void
) {
  return (
    <div className="filter-group">
      <span>{title}</span>
      <div className="chip-grid">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`filter-chip ${selected.includes(option) ? "active" : ""}`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DiscoveryControls({ filters, isLoading, onChange, onGenerate }: DiscoveryControlsProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Search and discovery</p>
          <h2>Define the issue market you want to attack.</h2>
        </div>
        <button type="button" className="primary-button" onClick={onGenerate} disabled={isLoading}>
          {isLoading ? <RefreshCw size={16} className="spin" /> : <Filter size={16} />}
          Generate Daily Plan
        </button>
      </div>

      {renderChipGroup(
        "Topics",
        ["openapi", "sdk", "api-client", "graphql", "rest-api", "developer-tools"],
        filters.topics,
        (value) => onChange({ ...filters, topics: updateArray(filters.topics, value) })
      )}

      {renderChipGroup(
        "Languages",
        ["typescript", "javascript", "node", "python"],
        filters.languages,
        (value) => onChange({ ...filters, languages: updateArray(filters.languages, value) })
      )}

      {renderChipGroup(
        "Labels",
        ["good first issue", "help wanted", "documentation", "bug"],
        filters.labels,
        (value) => onChange({ ...filters, labels: updateArray(filters.labels, value) })
      )}
    </section>
  );
}
