import { ArrowRight, ArrowUpRight, CheckCircle2, GitMerge, Github, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";

const GITHUB_REPO = "https://github.com/AnkitParekh007/contributorOps";
const MERGED_PR = "https://github.com/floating-ui/floating-ui/pull/3494";

const productLinks = [
  { label: "Interactive demo", to: "/demo" },
  { label: "Features", to: "/features" },
  { label: "Showcase", to: "/showcase" },
  { label: "Growth", to: "/adoption" },
  { label: "Roadmap", to: "/roadmap" },
];

const engineeringLinks = [
  { label: "Documentation", to: "/docs" },
  { label: "Architecture", to: "/docs/architecture" },
  { label: "Safety model", to: "/safety" },
  { label: "Quality gates", to: "/quality" },
  { label: "Contribute", to: "/contribute" },
];

const legalLinks = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms of service", to: "/terms" },
  { label: "Acceptable use", to: "/acceptable-use" },
  { label: "AI disclosure", to: "/ai-disclosure" },
  { label: "GitHub data", to: "/github-data-usage" },
];

function FooterNav({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <nav className="footer-v2-nav" aria-label={title}>
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer footer-v2">
      <div className="footer-inner footer-v2-inner">
        <section className="footer-v2-callout" aria-labelledby="footer-v2-heading">
          <div className="footer-v2-callout-copy">
            <span className="footer-v2-kicker">
              <span className="footer-v2-kicker-dot" aria-hidden="true" />
              BUILT FOR WORK THAT SPEAKS FOR ITSELF
            </span>

            <h2 id="footer-v2-heading">
              Turn real open-source work into{" "}
              <span>proof recruiters can trust.</span>
            </h2>
            <p className="footer-v2-intro">
              Find worthwhile issues, make reviewable contributions, and keep
              the evidence behind the work you actually shipped.
            </p>

            <ul className="footer-v2-trust" aria-label="ContributorOps principles">
              <li><ShieldCheck size={16} aria-hidden="true" /> Policy-gated actions</li>
              <li><CheckCircle2 size={16} aria-hidden="true" /> No contribution spam</li>
              <li><GitMerge size={16} aria-hidden="true" /> Verifiable outcomes</li>
            </ul>

            <div className="footer-v2-actions">
              <Link className="footer-v2-primary" to="/demo">
                Explore the demo <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                className="footer-v2-secondary"
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} aria-hidden="true" /> View source
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <p className="footer-v2-footnote">
              No sign-up for the demo. Example scenarios are fictional.
            </p>
          </div>

          <div className="footer-v2-evidence" aria-label="Verified open-source result">
            <div className="footer-v2-evidence-top">
              <span className="footer-v2-evidence-label">
                <GitMerge size={16} aria-hidden="true" /> REAL CONTRIBUTION
              </span>
              <span className="footer-v2-merged">
                <CheckCircle2 size={14} aria-hidden="true" /> Merged
              </span>
            </div>
            <div className="footer-v2-evidence-body">
              <span className="footer-v2-repo">floating-ui / floating-ui</span>
              <h3>Small patch. Real upstream impact.</h3>
              <p>
                An iOS scroll-restoration fix accepted by maintainers,
                with ContributorOps assistance disclosed in the PR.
              </p>
              <div className="footer-v2-diff" aria-label="Actual scroll restoration change">
                <span className="footer-v2-diff-label">BEFORE → AFTER</span>
                <code className="footer-v2-code-before">− window.scrollTo(scrollX, scrollY);</code>
                <code className="footer-v2-code-after">
                  + {"window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });"}
                </code>
              </div>
              <a
                href={MERGED_PR}
                className="footer-v2-proof-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inspect merged PR #3494 <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <p className="footer-v2-evidence-note">
                One verified result, not a claimed success rate.
              </p>
            </div>
          </div>
        </section>

        <div className="footer-v2-directory">
          <div className="footer-v2-identity">
            <Link to="/" className="footer-v2-brand-link" aria-label="ContributorOps homepage">
              <BrandLogo />
            </Link>
            <p>
              Thoughtful open-source work.
              <br />
              Credible proof of engineering.
            </p>
            <Link className="footer-v2-identity-link" to="/recruiter">
              For hiring teams <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="footer-v2-directory-links">
            <FooterNav title="Product" links={productLinks} />
            <FooterNav title="Engineering" links={engineeringLinks} />
            <FooterNav title="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="footer-v2-bottom">
          <p>© {new Date().getFullYear()} ContributorOps. Open source, built for contributors.</p>
          <div>
            <Link to="/ai-disclosure">AI transparency</Link>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
