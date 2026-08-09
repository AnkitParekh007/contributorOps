import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
	return (
		<footer className="footer">
			<div className="footer-inner">
				<div className="footer-shell">
					<div className="footer-top">
						<section className="footer-brand-panel" aria-labelledby="footer-brand-title">
							<Link to="/" className="brand footer-brand-link"><BrandLogo /></Link>
							<p id="footer-brand-title" className="footer-microcopy">
								ContributorOps helps developers turn real open-source contributions into job-ready proof of work.
							</p>
							<div className="footer-trust-list" aria-label="Core trust principles">
								<span className="footer-trust-pill">Human-approved</span>
								<span className="footer-trust-pill">No mass-commenting</span>
								<span className="footer-trust-pill">Measurable adoption</span>
							</div>
							<div className="footer-action-row">
								<a className="footer-cta" href="https://github.com/AnkitParekh007/contributorOps" target="_blank" rel="noreferrer">View repository</a>
								<Link className="footer-secondary-link" to="/try">Try without signup</Link>
							</div>
						</section>

						<div className="footer-link-grid">
							<nav className="footer-link-group" aria-labelledby="footer-product-links">
								<h4 id="footer-product-links">Product</h4>
								<div className="footer-link-list">
									<Link to="/">Home</Link>
									<Link to="/try">Try</Link>
									<Link to="/features">Features</Link>
									<Link to="/showcase">Showcase</Link>
									<Link to="/adoption">Adoption</Link>
									<Link to="/pricing">Pricing</Link>
									<Link to="/roadmap">Roadmap</Link>
								</div>
							</nav>

							<nav className="footer-link-group" aria-labelledby="footer-resources-links">
								<h4 id="footer-resources-links">Engineering</h4>
								<div className="footer-link-list">
									<Link to="/docs">Docs</Link>
									<Link to="/docs/architecture">Architecture</Link>
									<Link to="/safety">Safety</Link>
									<Link to="/recruiter">Recruiter brief</Link>
									<Link to="/contribute">Contribute</Link>
									<Link to="/share">Share</Link>
									<a href="https://github.com/AnkitParekh007/contributorOps/blob/main/docs/adoption-scorecard.md" target="_blank" rel="noreferrer">Adoption scorecard</a>
									<a href="https://github.com/AnkitParekh007/contributorOps" target="_blank" rel="noreferrer">GitHub</a>
								</div>
							</nav>

							<nav className="footer-link-group" aria-labelledby="footer-legal-links">
								<h4 id="footer-legal-links">Legal</h4>
								<div className="footer-link-list">
									<Link to="/privacy">Privacy Policy</Link>
									<Link to="/terms">Terms of Service</Link>
									<Link to="/acceptable-use">Acceptable Use</Link>
									<Link to="/ai-disclosure">AI Disclosure</Link>
									<Link to="/github-data-usage">GitHub Data</Link>
								</div>
							</nav>

							<section className="footer-link-group" aria-labelledby="footer-use-cases">
								<h4 id="footer-use-cases">Built for</h4>
								<div className="footer-link-list footer-link-list-static">
									<span>Open-source contributors</span>
									<span>Backend and API developers</span>
									<span>Developer tooling builders</span>
									<span>Recruiters and engineering leaders</span>
								</div>
							</section>
						</div>
					</div>

					<div className="footer-bottom-row">
						<div className="footer-bottom-meta">
							<span>© 2026 ContributorOps</span>
							<span>Open-source</span>
							<span>Human-approved automation</span>
						</div>
						<div className="footer-bottom-links">
							<Link to="/try">Try</Link>
							<Link to="/recruiter">Recruiter brief</Link>
							<Link to="/adoption">Adoption</Link>
							<Link to="/share">Share</Link>
							<Link to="/privacy">Privacy</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
