import { z } from "zod";

const PortfolioStatusSchema = z.enum([
  "discovered", "planned", "in progress", "PR opened", "merged", "rejected",
]);

export const PortfolioEntrySchema = z.object({
  selectedRepo: z.string().max(200).optional(),
  issueUrl: z.string().url().max(500).optional().or(z.literal("")),
  prUrl: z.string().url().max(500).optional().or(z.literal("")),
  status: PortfolioStatusSchema.optional(),
  notes: z.string().max(2000).optional(),
  interviewStarStory: z.string().max(2000).optional(),
  interviewSituation: z.string().max(2000).optional(),
  interviewTask: z.string().max(2000).optional(),
  interviewAction: z.string().max(2000).optional(),
  interviewResult: z.string().max(2000).optional(),
  resumeBullet: z.string().max(500).optional(),
  linkedInPost: z.string().max(3000).optional(),
  linkedInShort: z.string().max(1000).optional(),
  linkedInMedium: z.string().max(2000).optional(),
  linkedInDetailed: z.string().max(3000).optional(),
  recruiterOutreach: z.string().max(2000).optional(),
  githubProfileSnippet: z.string().max(1000).optional(),
});

export const PortfolioUpdateSchema = PortfolioEntrySchema.partial();
