export interface FeatureItem {
  title: string;
  summary: string;
  accent: string;
  icon: string;       // lucide-react component name
  category: string;   // Discover | Prepare | Validate | Prove | Career | Safety
  plan: string;       // Free | Pro | Career | Team
}

export const features: FeatureItem[] = [
  {
    title: "Job-Matched Issue Finder",
    summary: "Score open-source issues by role relevance for API, backend, Angular, platform, or advocacy work.",
    accent: "role",
    icon: "Target",
    category: "Discover",
    plan: "Pro",
  },
  {
    title: "Daily Contribution Plan",
    summary: "Turn scattered issues into a focused daily mission with explicit next steps and validation paths.",
    accent: "plan",
    icon: "CalendarDays",
    category: "Prepare",
    plan: "Pro",
  },
  {
    title: "Contribution Tracker",
    summary: "Track discoveries through planning, implementation, draft PRs, merges, and rejection learnings.",
    accent: "tracker",
    icon: "GitBranch",
    category: "Prepare",
    plan: "Free",
  },
  {
    title: "Maintainer-Friendly Comment Assistant",
    summary: "Draft issue-specific, respectful maintainer questions without promotional filler or spammy tone.",
    accent: "trust",
    icon: "MessageSquarePlus",
    category: "Prepare",
    plan: "Pro",
  },
  {
    title: "PR Quality Checker",
    summary: "Audit draft PR titles, bodies, and test plans with deterministic scoring before you submit.",
    accent: "quality",
    icon: "ShieldCheck",
    category: "Validate",
    plan: "Pro",
  },
  {
    title: "Public Proof-of-Work Portfolio",
    summary: "Publish a recruiter-ready page that shows real contributions, resume bullets, and interview stories.",
    accent: "portfolio",
    icon: "Globe",
    category: "Prove",
    plan: "Career",
  },
  {
    title: "GitHub Resume Generator",
    summary: "Export your contribution history into clean Markdown bullets for resumes and GitHub profile updates.",
    accent: "resume",
    icon: "FileText",
    category: "Prove",
    plan: "Career",
  },
  {
    title: "LinkedIn Post Generator",
    summary: "Create short, medium, and detailed post drafts grounded in real contribution work.",
    accent: "career",
    icon: "Linkedin",
    category: "Career",
    plan: "Career",
  },
  {
    title: "Interview STAR Story Generator",
    summary: "Convert each contribution into structured Situation, Task, Action, and Result narratives.",
    accent: "story",
    icon: "BookOpen",
    category: "Career",
    plan: "Career",
  },
  {
    title: "Safe Auto-Contribute Guardrails",
    summary: "Human-approved flows only. No mass comments, no mass PRs, and no deceptive contribution automation.",
    accent: "safety",
    icon: "Shield",
    category: "Safety",
    plan: "Free",
  },
];
