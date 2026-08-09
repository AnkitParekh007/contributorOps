export interface ExactTextReplacement {
  oldText: string;
  newText: string;
}

export interface ExecutablePatchFile {
  path: string;
  replacements: ExactTextReplacement[];
}

export interface ExecutablePatchPlan {
  files: ExecutablePatchFile[];
  commitMessage: string;
  prTitle: string;
  prBody: string;
  testEvidence: string;
}

export interface AppliedPatchFile {
  path: string;
  content: string;
  replacementCount: number;
}

const MAX_FILES = 4;
const MAX_REPLACEMENTS_PER_FILE = 8;
const MAX_TOTAL_CHANGED_CHARACTERS = 30_000;

function assertSafePath(path: string): void {
  const normalized = path.trim();
  if (!normalized || normalized.startsWith("/") || normalized.includes("..") || normalized.includes("\\")) {
    throw new Error(`Unsafe patch path: ${path}`);
  }
}

function countOccurrences(content: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let offset = 0;
  while (true) {
    const index = content.indexOf(needle, offset);
    if (index === -1) return count;
    count += 1;
    offset = index + needle.length;
  }
}

export function validateExecutablePatchPlan(plan: ExecutablePatchPlan): void {
  if (!plan.files.length || plan.files.length > MAX_FILES) {
    throw new Error(`Executable patch plans must touch between 1 and ${MAX_FILES} files.`);
  }

  if (!plan.commitMessage.trim() || !plan.prTitle.trim() || !plan.prBody.trim() || !plan.testEvidence.trim()) {
    throw new Error("Executable patch plans require commit, PR, and test evidence metadata.");
  }

  if (/contributorops draft proposal|todo\.md|planned change/i.test(plan.prBody)) {
    throw new Error("Placeholder proposal content cannot be submitted as an executable patch.");
  }

  let changedCharacters = 0;
  const paths = new Set<string>();

  for (const file of plan.files) {
    assertSafePath(file.path);
    if (paths.has(file.path)) {
      throw new Error(`Duplicate patch path: ${file.path}`);
    }
    paths.add(file.path);

    if (!file.replacements.length || file.replacements.length > MAX_REPLACEMENTS_PER_FILE) {
      throw new Error(
        `${file.path} must contain between 1 and ${MAX_REPLACEMENTS_PER_FILE} exact replacements.`
      );
    }

    for (const replacement of file.replacements) {
      if (!replacement.oldText || replacement.oldText === replacement.newText) {
        throw new Error(`${file.path} contains an empty or no-op replacement.`);
      }
      if (/contributorops draft proposal|planned change/i.test(replacement.newText)) {
        throw new Error(`${file.path} contains placeholder proposal content.`);
      }
      changedCharacters += replacement.oldText.length + replacement.newText.length;
    }
  }

  if (changedCharacters > MAX_TOTAL_CHANGED_CHARACTERS) {
    throw new Error(
      `Executable patch exceeds the ${MAX_TOTAL_CHANGED_CHARACTERS.toLocaleString()} character safety budget.`
    );
  }
}

export function applyExecutablePatchFile(content: string, file: ExecutablePatchFile): AppliedPatchFile {
  assertSafePath(file.path);
  let next = content;

  for (const replacement of file.replacements) {
    const matches = countOccurrences(next, replacement.oldText);
    if (matches !== 1) {
      throw new Error(
        `${file.path} expected exactly one match for a replacement but found ${matches}. Refusing an ambiguous patch.`
      );
    }
    next = next.replace(replacement.oldText, replacement.newText);
  }

  if (next === content) {
    throw new Error(`${file.path} produced no content change.`);
  }

  return {
    path: file.path,
    content: next,
    replacementCount: file.replacements.length
  };
}

export async function materializeExecutablePatch(
  plan: ExecutablePatchPlan,
  readFile: (path: string) => Promise<string>
): Promise<AppliedPatchFile[]> {
  validateExecutablePatchPlan(plan);
  const materialized: AppliedPatchFile[] = [];

  for (const file of plan.files) {
    const current = await readFile(file.path);
    materialized.push(applyExecutablePatchFile(current, file));
  }

  return materialized;
}
