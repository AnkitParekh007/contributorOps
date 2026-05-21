import { config, defaultFilters } from "./config.js";
import { discoverIssues, createPlanningIssue } from "./github.js";
import { buildDailyPlan, buildIssueCandidate } from "./planner.js";
import { writeDailyPlan } from "./storage.js";

export async function runDailyPlan() {
  const { mode, candidates } = await discoverIssues(defaultFilters);
  const plannedCandidates = candidates
    .map((candidate) => buildIssueCandidate(candidate, { targetRole: defaultFilters.targetRole }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 12);

  const dailyPlan = buildDailyPlan(plannedCandidates);
  await writeDailyPlan(dailyPlan);

  let planningIssueResult:
    | {
        created: boolean;
        message: string;
        issueUrl?: string;
      }
    | undefined;

  if (config.createDailyIssue) {
    planningIssueResult = await createPlanningIssue(
      `ContributorOps daily plan ${dailyPlan.generatedAt.slice(0, 10)}`,
      dailyPlan.markdown
    );
  }

  return {
    mode,
    dailyPlan,
    planningIssueResult
  };
}

if (process.argv[1]?.endsWith("daily.ts")) {
  runDailyPlan()
    .then((result) => {
      console.log(
        JSON.stringify(
          {
            generatedAt: result.dailyPlan.generatedAt,
            mission: result.dailyPlan.mission,
            mode: result.mode,
            planningIssueResult: result.planningIssueResult || null
          },
          null,
          2
        )
      );
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
