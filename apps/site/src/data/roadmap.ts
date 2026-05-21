export interface RoadmapPhase {
  title: string;
  items: string[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    title: "MVP",
    items: [
      "Business website",
      "Docs",
      "GitHub Pages deployment",
      "Daily contribution planner",
      "Portfolio tracker"
    ]
  },
  {
    title: "Pro",
    items: [
      "Job-matched issue finder",
      "PR quality checker",
      "Resume generator",
      "LinkedIn post generator",
      "Public portfolio page"
    ]
  },
  {
    title: "Career",
    items: [
      "GitHub profile audit",
      "Interview story generator",
      "Recruiter share link",
      "Weekly career report"
    ]
  },
  {
    title: "Team",
    items: [
      "Team dashboard",
      "Bootcamp mode",
      "Maintainer quality analytics",
      "Shared contribution radar"
    ]
  }
];
