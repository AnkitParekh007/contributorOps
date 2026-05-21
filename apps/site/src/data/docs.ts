export interface DocsCardData {
  title: string;
  summary: string;
  href: string;
}

export interface DocsSectionData {
  title: string;
  body: string[];
}

export const docsCards: DocsCardData[] = [
  {
    title: "Product Overview",
    summary: "Vision, target users, workflows, and why proof-of-work matters.",
    href: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/product-overview.md"
  },
  {
    title: "Local Development",
    summary: "Run the static business site locally with the new workspace scripts.",
    href: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/local-development.md"
  },
  {
    title: "GitHub Pages Deployment",
    summary: "Deploy the site from `apps/site/dist` with GitHub Actions and Vite base path safety.",
    href: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/github-pages-deployment.md"
  },
  {
    title: "Safety Policy",
    summary: "Human approval model, anti-spam rules, and external repo write restrictions.",
    href: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/safety-policy.md"
  },
  {
    title: "Monetization Plan",
    summary: "Free, Pro, Career, and Team packaging without real payments yet.",
    href: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/monetization-plan.md"
  },
  {
    title: "Roadmap",
    summary: "MVP, SaaS roadmap, career tooling, and team surfaces.",
    href: "https://github.com/AnkitParekh007/contributorOps/blob/main/docs/roadmap.md"
  }
];

export const docsSections: DocsSectionData[] = [
  {
    title: "What is ContributorOps?",
    body: [
      "ContributorOps is a human-approved contribution intelligence platform for developers who want real open-source work to become visible career proof.",
      "It is designed to help users discover realistic issues, prepare contribution plans, draft better pull requests, and package their work into public portfolio assets."
    ]
  },
  {
    title: "Who is it for?",
    body: [
      "It is for developers targeting backend, API, platform, Angular, or developer-relations roles who need stronger public proof than side-project claims alone.",
      "It is also useful for bootcamps, teams, or career accelerators that want structured, trust-preserving open-source workflows."
    ]
  },
  {
    title: "Core workflows",
    body: [
      "Discover high-quality issues, score them transparently, generate a daily mission, save them to a portfolio tracker, and convert work into recruiter-ready assets.",
      "For premium tiers, add job-matched discovery, PR quality checks, public portfolio pages, resume exports, and team radar."
    ]
  },
  {
    title: "Safe automation model",
    body: [
      "ContributorOps does not market spam, fake contribution farming, or deceptive automation.",
      "All external repository actions stay approval-gated, traceable, and relevant to a real issue."
    ]
  },
  {
    title: "Developer setup",
    body: [
      "The business site lives in `apps/site` and runs independently from the main app.",
      "Use the root scripts `npm run site:dev`, `npm run site:build`, and `npm run site:preview`."
    ]
  },
  {
    title: "Deployment",
    body: [
      "The static site is built with React, Vite, and TypeScript and deployed through GitHub Actions to GitHub Pages.",
      "Hash routing and the repo-specific Vite base path keep refreshes and deep links working under `/contributorOps/`."
    ]
  },
  {
    title: "Monetization roadmap",
    body: [
      "Free covers basic discovery. Pro adds daily planning and PR quality signals. Career adds resume, portfolio, LinkedIn, and interview tooling. Team adds shared radar and admin surfaces.",
      "The code is structured to accept Stripe or Lemon Squeezy later, but no payment processing is added in this site."
    ]
  },
  {
    title: "Future roadmap",
    body: [
      "Short-term work centers on polished docs, GitHub Pages delivery, and trust-preserving product education.",
      "Longer term work includes team dashboards, weekly career reports, and maintainer quality analytics."
    ]
  }
];
