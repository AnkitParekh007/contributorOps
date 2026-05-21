import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand-col">
          <Link to="/" className="brand" style={{ marginBottom: 10 }}>
            <span className="brand-mark" />
            <span>ContributorOps</span>
          </Link>
          <p>Human-approved contribution intelligence for job-ready proof of work.</p>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <div className="footer-col-links">
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/demo">Demo</Link>
            <Link to="/roadmap">Roadmap</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <div className="footer-col-links">
            <Link to="/docs">Docs</Link>
            <Link to="/safety">Safety</Link>
            <a href="https://github.com/AnkitParekh007/contributorOps" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://github.com/AnkitParekh007/contributorOps/tree/main/docs" target="_blank" rel="noreferrer">
              Markdown Docs
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <div className="footer-col-links">
            <Link to="/waitlist">Waitlist</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 ContributorOps · Open-source · Human-approved
        </div>
      </div>
    </footer>
  );
}
