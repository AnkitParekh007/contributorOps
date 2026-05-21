import { ArrowUpRight } from "lucide-react";
import type { IssueCandidate } from "../types";

interface CandidateListProps {
  issues: IssueCandidate[];
  selectedId: string | null;
  onSelect: (issue: IssueCandidate) => void;
}

function difficultyClassName(difficulty: IssueCandidate["difficulty"]) {
  return difficulty.replace(/\s+/g, "-");
}

export function CandidateList({ issues, selectedId, onSelect }: CandidateListProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Candidates</p>
          <h2>Contribution opportunities ranked for job signal.</h2>
        </div>
      </div>

      <div className="table-shell">
        <table className="issue-table">
          <thead>
            <tr>
              <th>Repo</th>
              <th>Issue</th>
              <th>Labels</th>
              <th>Score</th>
              <th>Difficulty</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr
                key={issue.id}
                className={issue.id === selectedId ? "selected" : ""}
                onClick={() => onSelect(issue)}
              >
                <td>
                  <button type="button" className="table-link">
                    {issue.repoFullName}
                  </button>
                </td>
                <td>
                  <div className="issue-title-cell">
                    <span>{issue.issueTitle}</span>
                    <a href={issue.issueUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </td>
                <td>
                  <div className="label-row">
                    {issue.labels.slice(0, 3).map((label) => (
                      <span key={label} className="label-pill">
                        {label}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`score-badge score-${issue.score >= 75 ? "high" : issue.score >= 50 ? "mid" : "low"}`}>
                    {issue.score}
                  </span>
                </td>
                <td>
                  <span className={`difficulty-pill ${difficultyClassName(issue.difficulty)}`}>
                    {issue.difficulty}
                  </span>
                </td>
                <td>{issue.reasonForRecommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
