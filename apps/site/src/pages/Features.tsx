import { Link } from "react-router-dom";
import { Section } from "../components/Section";

interface FeatureDef {
  title: string;
  plan: "Free" | "Pro" | "Career" | "Team";
  problem: string;
  solution: string;
  whoItHelps: string[];
  whyItHelpsHiring: string[];
  accentClass: string;
}

const featureDefs: FeatureDef[] = [
  {
    title: "Job-Matched Issue Finder",
    plan: "Free",
    problem: "GitHub has millions of open issues. Most developers pick randomly, contributing to repos irrelevant to their career target.",
    solution: "Discover and score issues by role relevance — API Developer, Backend Engineer, Angular Developer, Platform Engineer, or Developer Advocate. Every issue is ranked for career signal, not just activity.",
    whoItHelps: ["Junior developers building first OSS history", "Developers switching roles or specialisms", "Anyone who wants contributions to mirror their target job"],
    whyItHelpsHiring: ["Shows recruiters that your contributions match the role you're applying for", "Makes GitHub history readable as career intent, not random activity"],
    accentClass: "accent-role",
  },
  {
    title: "Daily Contribution Plan",
    plan: "Free",
    problem: "Developers lose track of contribution intent. Issues get bookmarked and forgotten. Progress stalls.",
    solution: "Generate a focused daily mission: 3–5 scored issues, a scoped focus area, and explicit next steps. Consistent, traceable momentum instead of scattered intent.",
    whoItHelps: ["Developers building habits around OSS", "Bootcamp students working on portfolio goals", "Anyone who needs external structure to stay consistent"],
    whyItHelpsHiring: ["Daily plan creates a contribution trail that's visible over time", "Shows recruiters a pattern of intentional, structured work"],
    accentClass: "",
  },
  {
    title: "PR Quality Checker",
    plan: "Pro",
    problem: "Most first-time contributors submit PRs with weak titles, missing context, and no test coverage plan — creating friction for maintainers and reducing merge chances.",
    solution: "Score PR titles, bodies, test plans, and maintainer context before submission. Deterministic quality check gives you a concrete score with actionable improvement notes.",
    whoItHelps: ["Any developer preparing to submit a PR", "Developers who've had PRs closed without feedback", "Bootcamp students learning what 'good PR' means"],
    whyItHelpsHiring: ["Demonstrates PR discipline to recruiters and hiring managers", "Proves you understand what maintainers care about, not just what builds"],
    accentClass: "accent-safety",
  },
  {
    title: "Public Proof-of-Work Portfolio",
    plan: "Pro",
    problem: "GitHub activity is not career proof. Contributions exist but they're scattered, unnarrated, and invisible to recruiters who don't know where to look.",
    solution: "Publish a single public portfolio page showing your best contributions, skill signals, resume bullets, and interview stories — all traceable back to real PRs.",
    whoItHelps: ["Developers applying for jobs", "Developers who want a shareable career page beyond LinkedIn", "Anyone who wants contributions to be findable and legible"],
    whyItHelpsHiring: ["Gives recruiters one URL that proves the work is real and well-prepared", "Removes friction from the 'show me your work' moment in interviews"],
    accentClass: "accent-role",
  },
  {
    title: "GitHub Resume Generator",
    plan: "Career",
    problem: "Developers struggle to turn GitHub activity into resume-friendly language. Contribution descriptions are either too technical or too vague.",
    solution: "Export tracked contributions as clean, quantified Markdown resume bullets formatted for ATS and human reviewers. Plug-and-play into any resume or GitHub profile README.",
    whoItHelps: ["Developers updating their resume after contributions", "Job seekers who want GitHub history on paper", "Developers who don't know how to frame OSS work for non-technical recruiters"],
    whyItHelpsHiring: ["Resume bullets grounded in real, verifiable PRs carry more weight than generic project claims", "Recruiters can verify every bullet by following the contribution link"],
    accentClass: "",
  },
  {
    title: "LinkedIn Post Generator",
    plan: "Career",
    problem: "LinkedIn visibility helps job search, but developers rarely post about their work. When they do, posts feel generic and lose engagement.",
    solution: "Generate short, medium, and detailed LinkedIn post drafts grounded in your actual contribution. Real context, real code, real impact — not AI filler.",
    whoItHelps: ["Developers building professional visibility", "Developers who struggle to talk publicly about technical work", "Developer Advocates and DevRel professionals maintaining audience presence"],
    whyItHelpsHiring: ["Public posts about real contributions create inbound recruiter interest", "Demonstrates communication skill alongside technical skill"],
    accentClass: "",
  },
  {
    title: "Interview STAR Story Generator",
    plan: "Career",
    problem: "Developers freeze on behavioral interview questions. 'Tell me about a time you improved a codebase' is unanswerable without a prepared story.",
    solution: "Convert each tracked contribution into a Situation, Task, Action, Result story structured for behavioral interviews. Pre-built answers for the most common hiring questions.",
    whoItHelps: ["Developers preparing for technical interviews", "Junior developers who lack experience packaging their work as stories", "Mid-level developers pivoting to senior or lead roles"],
    whyItHelpsHiring: ["Behavioral interviews are the most commonly failed part of hiring — good stories are rare", "Stories grounded in real contributions hold up to follow-up questions"],
    accentClass: "accent-role",
  },
  {
    title: "Safe Auto-Contribute Guardrails",
    plan: "Pro",
    problem: "Automation in contribution workflows creates spam risk. Mass comments and mass PRs damage maintainer trust and harm the broader OSS ecosystem.",
    solution: "Three-level safety model: Research Mode (no writes), Draft Mode (local drafts only), Approved Auto-Contribute Mode (every external action requires explicit human approval).",
    whoItHelps: ["Developers who want automation efficiency without spam risk", "Developers who care about maintainer relationships", "Teams that need audit trails for contribution behavior"],
    whyItHelpsHiring: ["Maintainer-trusted contribution history carries more hiring signal than spam history", "Shows hiring managers that you understand professional norms in OSS"],
    accentClass: "accent-safety",
  },
  {
    title: "Team Radar",
    plan: "Team",
    problem: "Bootcamps and engineering teams can't see which repos are best for students or junior engineers to contribute to. Guidance is ad-hoc and inconsistent.",
    solution: "Shared repository intelligence across a team or cohort. Track which repos are high-signal for your team's tech stack. Coordinate contribution planning without duplication.",
    whoItHelps: ["Bootcamp instructors coordinating student OSS programs", "Engineering managers building team OSS visibility", "Developer Advocacy teams maintaining ecosystem presence"],
    whyItHelpsHiring: ["Teams that contribute coherently to ecosystem repos build organizational credibility", "Students with bootcamp-coordinated portfolios are more competitive at hiring time"],
    accentClass: "accent-role",
  },
];

const planColorMap: Record<string, string> = {
  Free: "plan-free",
  Pro: "plan-pro",
  Career: "plan-career",
  Team: "plan-team",
};

export function Features() {
  return (
    <div className="page">
      <Section
        eyebrow="Features"
        title="Every feature aligned to a single outcome."
        description="ContributorOps is built around one goal: turning real open-source contributions into visible, verifiable career proof."
      >
        <div className="features-page-grid">
          {featureDefs.map((f) => (
            <article key={f.title} className={`feature-page-card ${f.accentClass}`}>
              <div className="feature-meta">
                <h3 style={{ margin: 0 }}>{f.title}</h3>
                <span className={`plan-badge ${planColorMap[f.plan]}`}>{f.plan}</span>
              </div>

              <div className="feature-detail-block">
                <p className="feature-detail-label">Problem</p>
                <p>{f.problem}</p>
              </div>

              <div className="feature-detail-block">
                <p className="feature-detail-label">Solution</p>
                <p>{f.solution}</p>
              </div>

              <div className="feature-two-col">
                <div className="feature-detail-block">
                  <p className="feature-detail-label">Who it helps</p>
                  <ul className="feature-list">
                    {f.whoItHelps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="feature-detail-block">
                  <p className="feature-detail-label">Why it helps hiring</p>
                  <ul className="feature-list">
                    {f.whyItHelpsHiring.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="features-cta"
        eyebrow="Get started"
        title="See the full product in action."
        description="The demo shows mock data for every feature listed here."
      >
        <div className="cta-panel">
          <Link to="/demo" className="button-primary">
            View the Demo
          </Link>
          <Link to="/pricing" className="button-secondary">
            See pricing
          </Link>
        </div>
      </Section>
    </div>
  );
}
