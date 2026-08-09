import { z } from "zod";

// Minimal IssueCandidate shape — just what the API needs to validate presence
const IssueCandidateSchema = z.object({
  id: z.string(),
  repoName: z.string(),
  repoFullName: z.string(),
  repoUrl: z.string(),
  issueTitle: z.string(),
  issueNumber: z.number().int().positive(),
  issueUrl: z.string(),
  score: z.number(),
}).passthrough(); // allow full IssueCandidate fields without re-declaring all

const DraftProposalSchemaShape = z.object({
  proposalId: z.string().min(1),
  issueId: z.string().min(1),
  upstreamRepoFullName: z.string().min(1),
  upstreamIssueUrl: z.string().min(1),
}).passthrough();

export const PrepareRunSchema = z.object({
  mode: z.enum(["research", "draft", "approved-auto-contribute"]),
  issue: IssueCandidateSchema,
  proposal: DraftProposalSchemaShape.optional(),
});

const ApprovalBaseSchema = z.object({
  runId: z.string().uuid(),
  approvalToken: z.string().uuid(),
  approvalReason: z.string().min(10).max(500),
  explicitApproval: z.literal(true),
});

export const ApproveCommentSchema = ApprovalBaseSchema;

export const ApproveBranchSchema = ApprovalBaseSchema.extend({
  forkOwner: z.string().min(1).max(100),
});

export const ApproveDraftPrSchema = ApprovalBaseSchema.extend({
  forkOwner: z.string().min(1).max(100),
});

export const CancelRunSchema = z.object({
  reason: z.string().max(500).optional(),
});

export const DraftProposalSchema = z.object({
  issue: IssueCandidateSchema,
});

// Kept for parsing old clients during migration, but no route performs a direct external write.
export const ApprovedPrSchema = z.object({
  issue: IssueCandidateSchema,
  proposal: DraftProposalSchemaShape,
  forkOwner: z.string().min(1).max(100),
  approvalReason: z.string().min(10).max(500),
  explicitApproval: z.literal(true),
});

export const PlanningIssueSchema = z.object({
  title: z.string().max(200).optional(),
  body: z.string().max(10000).optional(),
});

export const PrQualityCheckSchema = z.object({
  issue: IssueCandidateSchema,
});
