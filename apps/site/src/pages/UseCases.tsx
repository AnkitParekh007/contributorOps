import { Link } from "react-router-dom";
import { Section } from "../components/Section";

interface UseCase {
  icon: string;
  title: string;
  who: string;
  problem: string;
  solution: string;
  outcome: string;
  planRecommendation: string;
}

const useCases: UseCase[] = [
  {
    icon: "🎯",
    title: "Junior developer trying to land first job",
    who: "0–2 years experience, applying to first engineering role",
    problem: "No work experience, generic side projects, invisible GitHub profile. Recruiters see no evidence of real-world technical work.",
    solution: "ContributorOps surfaces beginner-friendly issues in real production codebases. Each contribution is packaged into a resume bullet, LinkedIn post, and interview STAR story.",
    outcome: "Visible OSS contributions in real repos, a recruiter-ready portfolio page, and prepared behavioral interview answers — all from real work.",
    planRecommendation: "Start on Free. Upgrade to Career when preparing for interview season.",
  },
  {
    icon: "⚙️",
    title: "Backend/API developer building proof of work",
    who: "Mid-level developer with strong backend skills but mostly private contribution history",
    problem: "Strong backend skills proven only in closed-source work. GitHub looks inactive. Recruiters can't verify depth.",
    solution: "Job-matched discovery in Express, Fastify, Django, Rails, and API-focused OSS projects. PR quality checker helps ensure contribution quality before submission. Resume bullets export directly.",
    outcome: "Public portfolio proving API and backend depth. LinkedIn content generated from real merged PRs. Verifiable contribution history in well-known repos.",
    planRecommendation: "Pro for discovery and PR quality. Career for resume and LinkedIn export.",
  },
  {
    icon: "🅰️",
    title: "Angular developer moving into platform work",
    who: "Developer with strong Angular/frontend experience targeting platform, infra, or full-stack roles",
    problem: "Angular-specific skills are valuable but not enough to pivot into platform or infrastructure roles without visible cross-domain proof.",
    solution: "Filter issues by Angular plus platform-adjacent labels. Target repos that span frontend configuration, build tooling, monorepo infrastructure, and developer tooling ecosystems.",
    outcome: "Portfolio showing breadth across frontend and platform work. STAR stories that span both domains. Stronger positioning for platform engineer roles that want Angular depth.",
    planRecommendation: "Pro for issue discovery and portfolio. Career for interview story generation.",
  },
  {
    icon: "🏫",
    title: "Bootcamp helping students build public portfolios",
    who: "Bootcamp operator, instructor, or program coordinator",
    problem: "Bootcamp students graduate with classroom projects but no visible real-world contribution history. Employers increasingly expect OSS proof beyond capstone work.",
    solution: "Team Radar lets instructors identify high-signal repos for the current cohort tech stack. Students build individual portfolios while instructors track cohort-level progress and guide contribution quality.",
    outcome: "Cohort-level proof-of-work visibility. Measurable, comparable student portfolios. Students graduate with contributions to real repos, not just classroom simulations.",
    planRecommendation: "Team plan for instructor + cohort. Individual Career plans for students during job search.",
  },
  {
    icon: "🔍",
    title: "Recruiter reviewing developer proof",
    who: "Technical recruiter or hiring manager evaluating a candidate's engineering credibility",
    problem: "Resume says 'contributed to open source' but there's no verifiable evidence. GitHub links go to inactive repos or toy projects with no context.",
    solution: "ContributorOps public portfolio pages surface verified PR links, contribution quality context, and structured narratives about what the developer did and why it mattered.",
    outcome: "One URL that proves the work is real: PR links, maintainer merge confirmation, score history, and interview-ready stories all in one place.",
    planRecommendation: "Recruiters don't pay — developers share portfolio links. Ask candidates to share their ContributorOps portfolio URL.",
  },
  {
    icon: "🌿",
    title: "Maintainer filtering serious contributors",
    who: "Open-source project maintainer who reviews incoming issues and PRs",
    problem: "Receives many low-effort 'first-timer' PRs with no context, no preparation, and no scoped intent. Review time is wasted on contributors who disappear after one interaction.",
    solution: "ContributorOps contributors come prepared: scoped validation steps, maintainer questions that show issue understanding, and PR quality checks that filter out weak drafts before submission.",
    outcome: "Higher-quality first contacts. Contributors who show preparation get priority responses. Better contributor relationships over time.",
    planRecommendation: "Maintainers benefit indirectly. The contribution quality improvement is a platform-level outcome.",
  },
];

export function UseCases() {
  return (
    <div className="page">
      <Section
        eyebrow="Use Cases"
        title="Real workflows, real outcomes."
        description="ContributorOps is designed for specific people with specific goals — not a generic productivity tool."
      >
        <div className="use-cases-grid">
          {useCases.map((uc) => (
            <article key={uc.title} className="use-case-card">
              <div className="use-case-icon" aria-hidden="true">{uc.icon}</div>
              <h3 style={{ margin: 0 }}>{uc.title}</h3>
              <p className="use-case-who">{uc.who}</p>

              <div className="feature-detail-block">
                <p className="feature-detail-label">Problem</p>
                <p style={{ margin: 0 }}>{uc.problem}</p>
              </div>

              <div className="feature-detail-block">
                <p className="feature-detail-label">How ContributorOps helps</p>
                <p style={{ margin: 0 }}>{uc.solution}</p>
              </div>

              <div className="use-case-outcome">
                <strong>Outcome: </strong>{uc.outcome}
              </div>

              <p className="use-case-plan">
                <strong>Recommended plan:</strong> {uc.planRecommendation}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="use-cases-cta"
        eyebrow="Find your fit"
        title="See which plan matches your use case."
        description="All plans start with real issue discovery and a human-approved safety model."
      >
        <div className="cta-panel">
          <Link to="/pricing" className="button-primary">
            View Pricing
          </Link>
          <Link to="/waitlist" className="button-secondary">
            Join the Waitlist
          </Link>
        </div>
      </Section>
    </div>
  );
}
