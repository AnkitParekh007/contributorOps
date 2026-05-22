import { z } from "zod";

export const SelectPlanSchema = z.object({
  plan: z.enum(["free", "pro", "career", "team"]),
});

export const BillingProfileSchema = z.object({
  customerName: z.string().max(100).optional(),
  customerEmail: z.string().email().max(200).optional(),
  profileHeadline: z.string().max(200).optional(),
  profileSummary: z.string().max(1000).optional(),
  publicPortfolioEnabled: z.boolean().optional(),
  premiumThemeEnabled: z.boolean().optional(),
});
