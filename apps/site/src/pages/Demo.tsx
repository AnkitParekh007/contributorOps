import { useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "../components/Section";

const mockIssues = [
  {
    ref: "express-validator/express-validator #892",
    title: "Fix TypeScript type inference for nested validators",
    score: 87,
    difficulty: "medium",
    label: "typescript",
  },
  {
    ref: "fastify/fastify #5203",
    title: "Improve error message context for schema validation",
    score: 82,
    difficulty: "medium",
    label: "enhancement",
  },
  {
    ref: "axios/axios #6401",
    title: "Add retry-after header parsing to interceptors",
    score: 76,
    difficulty: "easy",
    label: "good-first-issue",
  },
];

const mockPortfolioEntry = {
  repo: "express-validator/express-validator",
  pr: "#892 — feat: improve TypeScript type inference for nested validators",
  status: "PR Merged",
  resumeBullet:
    "• Improved TypeScript type inference for nested validator chains in express-validator (400k+ weekly downloads), reducing compile-time errors for users by removing manual type casts. PR merged in 3 days.",
  starSummary:
    "Situation: express-validator lacked proper TypeScript generics for nested validators, forcing users to add manual casts. Task: Add generic constraints without breaking existing call sites. Action: Traced type flow through 4 internal functions, added bounded generics, validated against 40+ existing tests. Result: PR merged in 3 days, 0 breaking changes, referenced in 2 downstream issues.",
};

const mockResumeBullets = [
  "• Contributed TypeScript type improvements to express-validator (used in 50k+ projects), eliminating manual type casts for nested validator chains. PR merged by maintainer within 72 hours.",
  "• Added OpenAPI 3.1 schema export to Fastify plugin ecosystem, enabling auto-generated API docs for downstream users.",
  "• Resolved async error propagation bug in axios interceptor chain, affecting retry logic in high-frequency API clients.",
];

const mockLinkedInPost = `Just shipped a PR to express-validator — an open-source library with 3M+ weekly downloads.

The fix? TypeScript type inference for nested validators was forcing manual type casts. I traced it to a missing generic constraint, scoped the fix to 12 lines, and validated against the existing test suite.

Maintainer merged it in 3 days.

This is what proof-of-work looks like in 2026.

#OpenSource #TypeScript #APIdev #JavaScript`;

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handle}
      style={{
        padding: "4px 12px",
        border: "1px solid rgba(125,240,210,0.3)",
        borderRadius: "8px",
        background: copied ? "rgba(125,240,210,0.12)" : "transparent",
        color: copied ? "var(--accent)" : "var(--muted)",
        fontSize: "0.76rem",
        cursor: "pointer",
        transition: "all 160ms ease",
      }}
    >
      {copied ? "✓ Copied" : `⎘ ${label}`}
    </button>
  );
}

export function Demo() {
  return (
    <div className="page">
      <Section
        eyebrow="Product Demo"
        title="See ContributorOps in action."
        description="Static preview of every major product surface. All data is mock — no GitHub token required."
      >
        <div className="demo-note">
          <span>This is a static demo using sample data.</span>
          <Link to="/docs" className="demo-note-link">Read the setup docs →</Link>
        </div>
      </Section>

      {/* Section 1: Daily Plan */}
      <Section
        eyebrow="Daily Plan"
        title="Today's contribution mission."
        description="Focused daily plans replace scattered GitHub browsing."
      >
        <div className="demo-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)" }}>May 21, 2026 · API Developer</p>
              <h3 style={{ margin: 0 }}>Tackle API documentation gaps in express-validator</h3>
            </div>
            <span className="plan-badge plan-free">Free</span>
          </div>
          <div className="demo-terminal">
            <p style={{ margin: "0 0 14px", color: "var(--accent)", fontSize: "0.78rem" }}>▸ 3 job-matched issues · avg score 82</p>
            {mockIssues.map((issue) => (
              <div key={issue.ref} className="demo-issue-row">
                <span className={`score-badge ${issue.score >= 85 ? "score-high" : issue.score >= 78 ? "score-med" : "score-low"}`}>
                  {issue.score}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)", fontFamily: "monospace" }}>{issue.ref}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.88rem" }}>{issue.title}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.05)", color: "var(--muted)", whiteSpace: "nowrap" }}>
                  {issue.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 2: Issue Score */}
      <Section
        eyebrow="Issue Scoring"
        title="Every issue is scored for career relevance."
        description="Not just activity — signal quality aligned to your target role."
      >
        <div className="demo-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h3 style={{ margin: "0 0 4px" }}>Add OpenAPI 3.1 schema export to express-validator</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>express-validator/express-validator · open · typescript, enhancement</p>
            </div>
            <span className="score-badge score-high" style={{ fontSize: "1rem", minWidth: 54, height: 32 }}>91</span>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { label: "Role relevance", score: 32, max: 35, note: "API Developer match" },
              { label: "Activity level", score: 28, max: 30, note: "recent commits, active maintainer" },
              { label: "Label quality", score: 18, max: 20, note: "good-first-issue, typescript" },
              { label: "Scope clarity", score: 13, max: 15, note: "clear, bounded scope" },
            ].map((row) => (
              <div key={row.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: "0.85rem" }}>
                  <span>{row.label}</span>
                  <span style={{ color: "var(--accent)" }}>{row.score}<span style={{ color: "var(--muted)" }}>/{row.max}</span></span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(row.score / row.max) * 100}%`, background: "linear-gradient(90deg, var(--accent), var(--accent-2))", borderRadius: 3 }} />
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "0.74rem", color: "var(--muted)" }}>{row.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 3: PR Quality */}
      <Section
        eyebrow="PR Quality Checker"
        title="Know your PR is ready before you submit."
        description="Deterministic quality scoring catches weak drafts before they reach maintainers."
      >
        <div className="demo-card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h3 style={{ margin: "0 0 4px" }}>feat: add OpenAPI 3.1 schema export endpoint</h3>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>Draft PR · express-validator/express-validator</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent-2)" }}>79</span>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>/ 100</span>
            </div>
          </div>
          <p style={{ margin: "0 0 14px", padding: "8px 12px", borderRadius: 8, background: "rgba(116,167,255,0.08)", color: "var(--accent-2)", fontSize: "0.85rem" }}>
            Good draft — add a test plan to reach 90+
          </p>
          {[
            { label: "Title quality", score: 88, note: "Clear, conventional commit format" },
            { label: "Body completeness", score: 76, note: "Has description, missing test plan" },
            { label: "Test coverage signal", score: 62, note: "No test files mentioned" },
            { label: "Maintainer context", score: 90, note: "References issue, mentions related PR" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.88rem" }}>
              <span>{row.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{row.note}</span>
                <span style={{ color: row.score >= 85 ? "var(--accent)" : row.score >= 70 ? "var(--accent-2)" : "var(--warning)", fontWeight: 600 }}>{row.score}%</span>
              </div>
            </div>
          ))}
          <span className="plan-badge plan-pro" style={{ marginTop: 14, display: "inline-flex" }}>Pro</span>
        </div>
      </Section>

      {/* Section 4: Portfolio */}
      <Section
        eyebrow="Proof-of-Work Portfolio"
        title="One page that proves the work is real."
        description="Every portfolio entry links to a real PR with packaged career assets."
      >
        <div className="demo-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "0.78rem", color: "var(--muted)", fontFamily: "monospace" }}>{mockPortfolioEntry.repo}</p>
              <h3 style={{ margin: 0 }}>{mockPortfolioEntry.pr}</h3>
            </div>
            <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600, background: "rgba(125,240,210,0.16)", color: "var(--accent)" }}>
              {mockPortfolioEntry.status}
            </span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <p style={{ margin: "0 0 6px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>Resume Bullet</p>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(0,0,0,0.3)", fontFamily: "monospace", fontSize: "0.84rem", lineHeight: 1.6, position: "relative" }}>
              {mockPortfolioEntry.resumeBullet}
            </div>
          </div>

          <div>
            <p style={{ margin: "0 0 6px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>Interview STAR Preview</p>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>{mockPortfolioEntry.starSummary}</p>
          </div>
          <span className="plan-badge plan-pro" style={{ marginTop: 14, display: "inline-flex" }}>Pro</span>
        </div>
      </Section>

      {/* Section 5: Resume Bullets */}
      <Section
        eyebrow="Resume Generator"
        title="Export contribution history as resume bullets."
        description="Clean, quantified bullets formatted for ATS and human reviewers."
      >
        <div className="demo-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>3 bullets · Markdown export ready</p>
            <CopyBtn text={mockResumeBullets.join("\n")} label="All Bullets" />
          </div>
          {mockResumeBullets.map((bullet, i) => (
            <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(0,0,0,0.3)", fontFamily: "monospace", fontSize: "0.84rem", lineHeight: 1.6, marginBottom: 10, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
                <CopyBtn text={bullet} label="Bullet" />
              </div>
              {bullet}
            </div>
          ))}
          <span className="plan-badge plan-career" style={{ marginTop: 6, display: "inline-flex" }}>Career</span>
        </div>
      </Section>

      {/* Section 6: LinkedIn Post */}
      <Section
        eyebrow="LinkedIn Generator"
        title="Turn contributions into LinkedIn content."
        description="Short, medium, and detailed post drafts grounded in real work."
      >
        <div className="demo-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>Detailed post draft</p>
            <CopyBtn text={mockLinkedInPost} label="Post" />
          </div>
          <div style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(0,0,0,0.3)", fontFamily: "var(--font-sans)", fontSize: "0.9rem", lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {mockLinkedInPost}
          </div>
          <span className="plan-badge plan-career" style={{ marginTop: 14, display: "inline-flex" }}>Career</span>
        </div>
      </Section>

      {/* Section 7: Safe Auto-Contribute */}
      <Section
        eyebrow="Safe Auto-Contribute"
        title="Every external action requires your approval."
        description="Human-approved guardrails are built into the core workflow, not bolted on."
      >
        <div className="demo-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600, background: "rgba(116,167,255,0.16)", color: "var(--accent-2)" }}>
              Draft Mode (Level 2)
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>No external writes without approval</span>
          </div>

          <div style={{ padding: "16px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", marginBottom: 14 }}>
            <p style={{ margin: "0 0 8px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--warning)" }}>Pending Approval</p>
            <p style={{ margin: "0 0 10px", fontWeight: 600 }}>Post maintainer question on express-validator #892</p>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, color: "var(--muted)" }}>
              Hi @expressjs-team — I'd like to work on improving TypeScript type inference for nested validators. I've traced the issue to the validator chain return type. Would you prefer I target v7.x or main? Happy to include a migration note in the PR body.
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" className="button-primary" style={{ fontSize: "0.88rem", minHeight: 38 }}>
              ✓ Approve &amp; Post
            </button>
            <button type="button" className="button-secondary" style={{ fontSize: "0.88rem", minHeight: 38 }}>
              Edit First
            </button>
          </div>

          <p style={{ margin: "14px 0 0", fontSize: "0.78rem", color: "var(--muted)", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--line)", display: "inline-block" }}>
            🔒 No external writes happen without your explicit approval.
          </p>
        </div>
      </Section>

      <Section
        id="demo-cta"
        eyebrow="Ready to start"
        title="Run this on your own contributions."
        description="Set up locally in minutes. No database required."
      >
        <div className="cta-panel">
          <Link to="/docs" className="button-primary">
            Read the Setup Docs
          </Link>
          <Link to="/waitlist" className="button-secondary">
            Join the Waitlist
          </Link>
        </div>
      </Section>
    </div>
  );
}
