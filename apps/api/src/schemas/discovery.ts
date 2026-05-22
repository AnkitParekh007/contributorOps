import { z } from "zod";

export const DiscoveryFiltersSchema = z.object({
  topics: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  labels: z.array(z.string()).optional().default([]),
  targetRole: z
    .enum(["API Developer", "Backend Engineer", "Angular Developer", "Platform Engineer", "Developer Advocate"])
    .optional(),
});
