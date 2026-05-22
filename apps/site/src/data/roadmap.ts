export type RoadmapStatus = "current" | "next" | "planned" | "later";

export interface RoadmapPhase {
  title: string;
  status: RoadmapStatus;
  icon: string;         // lucide-react component name
  description: string;
  items: string[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    title: "MVP",
    status: "current",
    icon: "Rocket",
    description: "Building the foundation for proof-of-work infrastructure and the business site.",
    items: [
      "Business website",
      "Docs",
      "GitHub Pages deployment",
      "Daily contribution planner",
      "Portfolio tracker",
    ],
  },
  {
    title: "Pro — Execution Layer",
    status: "next",
    icon: "Sparkles",
    description: "AI-powered daily contribution intelligence with job-matching and PR quality signals.",
    items: [
      "Job-matched issue finder",
      "PR quality checker",
      "Resume generator",
      "LinkedIn post generator",
      "Public portfolio page",
    ],
  },
  {
    title: "Career — Hiring Assets",
    status: "planned",
    icon: "Briefcase",
    description: "Convert contributions into interview-ready assets and recruiter-facing proof.",
    items: [
      "GitHub profile audit",
      "Interview story generator",
      "Recruiter share link",
      "Weekly career report",
      "Advanced proof-of-work exports",
    ],
  },
  {
    title: "Team — Shared Intelligence",
    status: "later",
    icon: "Users",
    description: "Coordinate open-source contribution building across cohorts, bootcamps, and engineering teams.",
    items: [
      "Team dashboard",
      "Bootcamp mode",
      "Maintainer quality analytics",
      "Shared contribution radar",
      "Team portfolio reports",
    ],
  },
];
