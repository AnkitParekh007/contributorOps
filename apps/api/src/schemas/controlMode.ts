import { z } from "zod";

export const ControlModeSchema = z.object({
  safetyLevel: z.enum(["research", "draft", "approved-pr"]),
  approvalReason: z.string().max(500).optional(),
  explicitApproval: z.boolean().optional(),
});
