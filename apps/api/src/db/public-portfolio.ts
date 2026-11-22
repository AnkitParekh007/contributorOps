import { getSupabaseAdmin } from "./client.js";
import { getSubscription } from "./billing.js";
import type { PublicPortfolioProfile, BillingState } from "../types.js";
import { config } from "../config.js";

/** Explicit publication is required; no global JSON is used for anonymous lookups. */
export async function publishPublicPortfolio(userId: string, billing: BillingState): Promise<void> {
  const { error } = await getSupabaseAdmin().from("public_portfolio_profiles").upsert({
    user_id: userId,
    slug: billing.publicPortfolioSlug,
    display_name: billing.customerName || null,
    headline: billing.profileHeadline,
    summary: billing.profileSummary,
    is_visible: true,
  }, { onConflict: "user_id" });
  if (error) throw new Error(`Publish portfolio failed: ${error.message}`);
}

export async function getPublishedPortfolio(slug: string): Promise<PublicPortfolioProfile | null> {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(slug)) return null;
  const db = getSupabaseAdmin();
  const { data: profile, error } = await db.from("public_portfolio_profiles")
    .select("user_id,slug,display_name,headline,summary")
    .eq("slug", slug).eq("is_visible", true).maybeSingle();
  if (error) throw new Error(`Public portfolio lookup failed: ${error.message}`);
  if (!profile) return null;

  const sub = await getSubscription(profile.user_id as string);
  if (sub?.status !== "active" || !["career", "team"].includes(sub.plan)) return null;

  const { data: rows, error: entriesError } = await db.from("portfolio_entries")
    .select("repo,pr_url,title,description,status,proof,updated_at")
    .eq("user_id", profile.user_id).eq("is_public", true)
    .order("updated_at", { ascending: false });
  if (entriesError) throw new Error(`Public portfolio entries failed: ${entriesError.message}`);
  const owner = profile.display_name || profile.slug;
  return {
    slug: profile.slug,
    username: profile.slug,
    owner,
    headline: profile.headline || "",
    summary: profile.summary || "",
    recruiterShareUrl: `${config.publicAppUrl.replace(/\/$/, "")}/u/${encodeURIComponent(profile.slug)}`,
    githubResumeMarkdown: "", // Public profile never exports private career evidence.
    premiumThemeEnabled: false,
    entries: (rows || []).map((row) => ({
      selectedRepo: row.repo || "",
      issueUrl: "",
      prUrl: row.pr_url || "",
      status: row.status || "discovered",
      notes: row.description || "",
      resumeBullet: "",
      linkedInPost: "",
      interviewStarStory: "",
      recruiterOutreach: "",
      githubProfileSnippet: "",
      updatedAt: row.updated_at || "",
    })),
  };
}
