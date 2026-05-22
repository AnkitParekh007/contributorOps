import { z } from "zod";

export const WaitlistSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  targetRole: z.string().min(1).max(50),
  planInterest: z.string().max(50).optional(),
  githubUsername: z.string().max(50).optional(),
  problemStatement: z.string().max(500).optional(),
  source: z.string().max(50).optional(),
});
