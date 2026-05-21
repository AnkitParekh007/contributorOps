import { config } from "./config.js";
import { readBillingState, readPortfolio, readUsageSnapshot, writeBillingState, writeUsageSnapshot } from "./storage.js";
import type {
  BillingPlan,
  BillingState,
  ExportBundle,
  FeatureFlags,
  FeatureKey,
  PortfolioEntry,
  PricingTier,
  PublicPortfolioProfile,
  UsageSnapshot
} from "./types.js";

const featureMatrix: Record<BillingPlan, Record<FeatureKey, boolean>> = {
  free: {
    "basic-discovery": true,
    "daily-plans": false,
    "portfolio-tracker": false,
    "public-portfolio": false,
    "github-resume-export": false,
    "linkedin-generator": false,
    "interview-star-generator": false,
    "recruiter-share-link": false,
    "maintainer-trust-score": false,
    "pr-quality-checker": false,
    "team-dashboard": false,
    "shared-repo-radar": false,
    "approved-auto-contribute": false,
    "premium-public-theme": false,
    "github-profile-audit": false,
    "export-center": false
  },
  pro: {
    "basic-discovery": true,
    "daily-plans": true,
    "portfolio-tracker": true,
    "public-portfolio": false,
    "github-resume-export": false,
    "linkedin-generator": false,
    "interview-star-generator": false,
    "recruiter-share-link": false,
    "maintainer-trust-score": true,
    "pr-quality-checker": false,
    "team-dashboard": false,
    "shared-repo-radar": false,
    "approved-auto-contribute": true,
    "premium-public-theme": false,
    "github-profile-audit": true,
    "export-center": false
  },
  career: {
    "basic-discovery": true,
    "daily-plans": true,
    "portfolio-tracker": true,
    "public-portfolio": true,
    "github-resume-export": true,
    "linkedin-generator": true,
    "interview-star-generator": true,
    "recruiter-share-link": true,
    "maintainer-trust-score": true,
    "pr-quality-checker": true,
    "team-dashboard": false,
    "shared-repo-radar": false,
    "approved-auto-contribute": true,
    "premium-public-theme": true,
    "github-profile-audit": true,
    "export-center": true
  },
  team: {
    "basic-discovery": true,
    "daily-plans": true,
    "portfolio-tracker": true,
    "public-portfolio": true,
    "github-resume-export": true,
    "linkedin-generator": true,
    "interview-star-generator": true,
    "recruiter-share-link": true,
    "maintainer-trust-score": true,
    "pr-quality-checker": true,
    "team-dashboard": true,
    "shared-repo-radar": true,
    "approved-auto-contribute": true,
    "premium-public-theme": true,
    "github-profile-audit": true,
    "export-center": true
  }
};

const weeklyPlanLimitByPlan: Record<BillingPlan, number | null> = {
  free: 3,
  pro: null,
  career: null,
  team: null
};

export const pricingTiers: PricingTier[] = [
  {
    plan: "free",
    name: "Free",
    priceLabel: "$0",
    monthlyPrice: 0,
    tagline: "Basic discovery and 3 plans per week.",
    features: [
      "Issue discovery and transparent scoring",
      "Research mode only",
      "Three generated plans per week"
    ],
    limits: {
      weeklyPlans: 3,
      dailyPlans: false,
      sharedSeats: 1
    }
  },
  {
    plan: "pro",
    name: "Pro",
    priceLabel: "$19/mo",
    monthlyPrice: 19,
    tagline: "Daily plans, portfolio tracking, and maintainer fit signals.",
    features: [
      "Unlimited daily plans",
      "Portfolio tracker",
      "Maintainer trust score",
      "Approval-gated auto-contribute"
    ],
    limits: {
      weeklyPlans: null,
      dailyPlans: true,
      sharedSeats: 1
    }
  },
  {
    plan: "career",
    name: "Career",
    priceLabel: "$49/mo",
    monthlyPrice: 49,
    tagline: "Turn every contribution into job-ready proof of work.",
    features: [
      "GitHub resume export",
      "LinkedIn post generator",
      "Interview STAR story generator",
      "Recruiter share links",
      "Public proof-of-work portfolio"
    ],
    limits: {
      weeklyPlans: null,
      dailyPlans: true,
      sharedSeats: 1
    }
  },
  {
    plan: "team",
    name: "Team",
    priceLabel: "$199/mo",
    monthlyPrice: 199,
    tagline: "Shared repo radar and recruiting-grade team proof surfaces.",
    features: [
      "Everything in Career",
      "Team dashboard",
      "Shared repo radar",
      "Five seats for OSS sourcing and review"
    ],
    limits: {
      weeklyPlans: null,
      dailyPlans: true,
      sharedSeats: 5
    }
  }
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function currentWeekKey(date = new Date()): string {
  const year = date.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear) / 86_400_000);
  return `${year}-w${Math.floor(days / 7) + 1}`;
}

function normalizeUsage(usage: UsageSnapshot): UsageSnapshot {
  const weekKey = currentWeekKey();
  if (usage.weekKey === weekKey) {
    return usage;
  }

  return {
    weekKey,
    generatedPlans: 0,
    recruiterShares: 0,
    resumeExports: 0,
    publicPortfolioViews: usage.publicPortfolioViews
  };
}

export async function getBillingState(): Promise<BillingState> {
  const state = await readBillingState();
  if (state.publicPortfolioSlug) {
    return state;
  }

  const next = {
    ...state,
    publicPortfolioSlug: slugify(state.customerName || config.owner || "contributorops-proof"),
    lastUpdatedAt: new Date().toISOString()
  };
  await writeBillingState(next);
  return next;
}

export async function updateBillingPlan(plan: BillingPlan): Promise<BillingState> {
  const current = await getBillingState();
  const seatCount = plan === "team" ? 5 : 1;
  const next = {
    ...current,
    plan,
    status: "active" as const,
    seatCount,
    publicPortfolioEnabled: plan === "career" || plan === "team" ? current.publicPortfolioEnabled : false,
    premiumThemeEnabled: plan === "career" || plan === "team" ? current.premiumThemeEnabled : false,
    lastUpdatedAt: new Date().toISOString()
  };
  return writeBillingState(next);
}

export async function updatePublicProfile(payload: Partial<BillingState>): Promise<BillingState> {
  const current = await getBillingState();
  const next: BillingState = {
    ...current,
    profileHeadline: payload.profileHeadline ?? current.profileHeadline,
    profileSummary: payload.profileSummary ?? current.profileSummary,
    publicPortfolioEnabled: payload.publicPortfolioEnabled ?? current.publicPortfolioEnabled,
    premiumThemeEnabled: payload.premiumThemeEnabled ?? current.premiumThemeEnabled,
    publicPortfolioSlug: payload.publicPortfolioSlug
      ? slugify(payload.publicPortfolioSlug)
      : current.publicPortfolioSlug,
    lastUpdatedAt: new Date().toISOString()
  };
  return writeBillingState(next);
}

export function buildEntitlements(state: BillingState): FeatureFlags {
  const baseFeatures = { ...featureMatrix[state.plan] };
  for (const [feature, value] of Object.entries(state.featureOverrides)) {
    if (typeof value === "boolean") {
      baseFeatures[feature as FeatureKey] = value;
    }
  }

  return {
    plan: state.plan,
    features: baseFeatures,
    weeklyPlanLimit: weeklyPlanLimitByPlan[state.plan]
  };
}

export async function getUsageSnapshot(): Promise<UsageSnapshot> {
  const usage = await readUsageSnapshot();
  const normalized = normalizeUsage(usage);
  if (normalized.weekKey !== usage.weekKey) {
    await writeUsageSnapshot(normalized);
  }
  return normalized;
}

export async function incrementUsage(key: keyof Omit<UsageSnapshot, "weekKey">): Promise<UsageSnapshot> {
  const current = await getUsageSnapshot();
  const next = {
    ...current,
    [key]: current[key] + 1
  };
  return writeUsageSnapshot(next);
}

export async function ensureFeature(feature: FeatureKey): Promise<void> {
  const state = await getBillingState();
  const entitlements = buildEntitlements(state);
  if (!entitlements.features[feature]) {
    throw new Error(`The ${feature} feature is not included in the ${state.plan} plan.`);
  }
}

export async function ensurePlanGenerationAllowed(): Promise<void> {
  const state = await getBillingState();
  const entitlements = buildEntitlements(state);
  const usage = await getUsageSnapshot();

  if (!entitlements.features["basic-discovery"]) {
    throw new Error("Your current plan does not include discovery.");
  }

  if (entitlements.weeklyPlanLimit !== null && usage.generatedPlans >= entitlements.weeklyPlanLimit) {
    throw new Error(
      `The ${state.plan} plan includes ${entitlements.weeklyPlanLimit} generated plans per week. Upgrade to Pro for unlimited daily plans.`
    );
  }
}

function buildGithubResumeMarkdown(entries: PortfolioEntry[], owner: string, headline: string): string {
  const lines = [
    `# ${owner}'s ContributorOps Resume`,
    "",
    headline,
    "",
    "## Open-source proof of work"
  ];

  if (entries.length === 0) {
    lines.push("", "- Add your first contribution to generate recruiter-ready proof.");
    return lines.join("\n");
  }

  for (const entry of entries) {
    lines.push("");
    lines.push(`### ${entry.selectedRepo}`);
    lines.push(`- Status: ${entry.status}`);
    lines.push(`- Issue: ${entry.issueUrl || "N/A"}`);
    lines.push(`- PR: ${entry.prUrl || "N/A"}`);
    lines.push(`- Resume bullet: ${entry.resumeBullet}`);
    lines.push(`- STAR story: ${entry.interviewStarStory}`);
  }

  return lines.join("\n");
}

function buildResumeBullets(entries: PortfolioEntry[]): string {
  return entries.map((entry) => `- ${entry.resumeBullet}`).join("\n");
}

function buildLinkedInPosts(entries: PortfolioEntry[]): string {
  return entries
    .map(
      (entry) =>
        `## ${entry.selectedRepo}\n\nShort:\n${entry.linkedInShort || entry.linkedInPost}\n\nMedium:\n${entry.linkedInMedium || entry.linkedInPost}\n\nDetailed:\n${entry.linkedInDetailed || entry.linkedInPost}`
    )
    .join("\n\n");
}

function buildPortfolioMarkdown(entries: PortfolioEntry[]): string {
  return entries
    .map(
      (entry) =>
        `## ${entry.selectedRepo}\n- Status: ${entry.status}\n- Issue: ${entry.issueUrl || "N/A"}\n- PR: ${entry.prUrl || "N/A"}\n- Notes: ${entry.notes}\n- Interview story: ${entry.interviewStarStory}`
    )
    .join("\n\n");
}

function buildRecruiterPitch(entries: PortfolioEntry[]): string {
  return entries.map((entry) => entry.recruiterOutreach).join("\n\n");
}

function buildGithubReadmeSnippet(entries: PortfolioEntry[]): string {
  return entries.map((entry) => entry.githubProfileSnippet).join("\n");
}

export async function buildPublicPortfolioProfile(): Promise<PublicPortfolioProfile> {
  const [billing, entries] = await Promise.all([getBillingState(), readPortfolio()]);
  const recruiterShareUrl = `${config.publicAppUrl.replace(/\/$/, "")}/u/${config.owner}`;

  return {
    slug: billing.publicPortfolioSlug,
    username: config.owner,
    owner: billing.customerName || config.owner,
    headline: billing.profileHeadline,
    summary: billing.profileSummary,
    recruiterShareUrl,
    githubResumeMarkdown: buildGithubResumeMarkdown(entries, billing.customerName || config.owner, billing.profileHeadline),
    premiumThemeEnabled: billing.premiumThemeEnabled,
    entries: entries.map((entry) => ({
      selectedRepo: entry.selectedRepo,
      issueUrl: entry.issueUrl,
      prUrl: entry.prUrl,
      status: entry.status,
      notes: entry.notes,
      resumeBullet: entry.resumeBullet,
      linkedInPost: entry.linkedInPost,
      interviewStarStory: entry.interviewStarStory,
      recruiterOutreach: entry.recruiterOutreach,
      githubProfileSnippet: entry.githubProfileSnippet,
      updatedAt: entry.updatedAt
    }))
  };
}

export async function getPublicPortfolioProfileBySlug(slug: string): Promise<PublicPortfolioProfile> {
  const profile = await buildPublicPortfolioProfile();
  if (profile.slug !== slug && profile.username.toLowerCase() !== slug.toLowerCase()) {
    throw new Error("Public portfolio not found.");
  }
  return profile;
}

export async function exportGithubResume(): Promise<{ markdown: string; fileName: string }> {
  await ensureFeature("github-resume-export");
  await incrementUsage("resumeExports");
  const profile = await buildPublicPortfolioProfile();
  return {
    markdown: profile.githubResumeMarkdown,
    fileName: `${slugify(profile.owner)}-contributorops-resume.md`
  };
}

export async function exportAllCareerAssets(): Promise<ExportBundle> {
  await ensureFeature("export-center");
  const [profile, entries] = await Promise.all([buildPublicPortfolioProfile(), readPortfolio()]);
  return {
    resumeMarkdown: profile.githubResumeMarkdown,
    resumeBullets: buildResumeBullets(entries),
    linkedInPosts: buildLinkedInPosts(entries),
    portfolioMarkdown: buildPortfolioMarkdown(entries),
    recruiterPitch: buildRecruiterPitch(entries),
    githubReadmeSnippet: buildGithubReadmeSnippet(entries)
  };
}
