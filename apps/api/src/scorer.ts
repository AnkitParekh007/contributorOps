import type { Difficulty, RawIssueCandidate } from "./types.js";

function hasLabel(candidate: RawIssueCandidate, matcher: RegExp): boolean {
  return candidate.labels.some((label) => matcher.test(label));
}

export function scoreIssue(candidate: RawIssueCandidate): {
  score: number;
  difficulty: Difficulty;
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  if (hasLabel(candidate, /good first issue/i)) {
    score += 20;
    reasons.push("+20 labeled good first issue");
  }

  if (hasLabel(candidate, /help wanted/i)) {
    score += 15;
    reasons.push("+15 labeled help wanted");
  }

  if (hasLabel(candidate, /docs|documentation/i)) {
    score += 10;
    reasons.push("+10 documentation oriented issue");
  }

  if (hasLabel(candidate, /\bbug\b/i)) {
    score += 10;
    reasons.push("+10 bug label");
  }

  if (
    candidate.repoTopics.some((topic) =>
      /openapi|sdk|api|graphql|rest-api|developer-tools|cli|backend/i.test(topic)
    )
  ) {
    score += 10;
    reasons.push("+10 API or developer-tool topic match");
  }

  const updatedAt = new Date(candidate.updatedAt).getTime();
  const createdAt = new Date(candidate.createdAt).getTime();
  const daysSinceUpdate = Math.floor((Date.now() - updatedAt) / 86_400_000);
  const daysSinceCreation = Math.floor((Date.now() - createdAt) / 86_400_000);

  if (daysSinceUpdate <= 30) {
    score += 10;
    reasons.push("+10 updated within the last 30 days");
  }

  if (candidate.comments > 0 && candidate.comments < 10) {
    score += 5;
    reasons.push("+5 has discussion but remains tractable");
  }

  if (daysSinceUpdate > 180) {
    score -= 10;
    reasons.push("-10 stale issue older than 180 days");
  }

  if (candidate.comments > 20) {
    score -= 10;
    reasons.push("-10 too many comments over 20");
  }

  if (!candidate.issueBody || candidate.issueBody.trim().length < 80) {
    score -= 15;
    reasons.push("-15 unclear or missing issue body");
  }

  score = Math.max(0, Math.min(100, score));

  let difficulty: Difficulty = "starter";
  if (score < 45 || candidate.comments > 12 || daysSinceCreation > 365) {
    difficulty = "stretch";
  } else if (score < 70 || candidate.comments > 5) {
    difficulty = "steady";
  }

  return { score, difficulty, reasons };
}
