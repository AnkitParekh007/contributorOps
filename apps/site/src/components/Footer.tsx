import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
	return (
		<footer className="footer">
			<div className="footer-inner">
				<div className="footer-shell">
					<div className="footer-top">
						<section className="footer-brand-panel" aria-labelledby="footer-brand-title">
							<Link to="/" className="brand footer-brand-link">
								<BrandLogo />
							</Link>
							<p id="footer-brand-title" className="footer-microcopy">
								ContributorOps helps developers turn real open-source contributions into job-ready proof
								of work.
							</p>
							<div className="footer-trust-list" aria-label="Core trust principles">
								<span className="footer-trust-pill">Human-approved</span>
								<span className="footer-trust-pill">No mass-commenting</span>
								<span className="footer-trust-pill">Draft PR guardrails</span>
							</div>
							<div className="footer-action-row">
								<a
									className="footer-cta"
									href="https://github.com/AnkitParekh007/contributorOps"
									target="_blank"
									rel="noreferrer"
								>
									View repository
								</a>
								<Link className="footer-secondary-link" to="/docs">
									Read documentation
								</Link>
							</div>
						</section>

						<div className="footer-link-grid">
							<nav className="footer-link-group" aria-labelledby="footer-product-links">
								<h4 id="footer-product-links">Product</h4>
								<div className="footer-link-list">
									<Link to="/">Home</Link>
									<Link to="/features">Features</Link>
									<Link to="/pricing">Pricing</Link>
									<Link to="/roadmap">Roadmap</Link>
								</div>
							</nav>

							<nav className="footer-link-group" aria-labelledby="footer-resources-links">
								<h4 id="footer-resources-links">Resources</h4>
								<div className="footer-link-list">
									<Link to="/docs">Docs</Link>
									<Link to="/safety">Safety</Link>
									<a
										href="https://github.com/AnkitParekh007/contributorOps/tree/main/docs"
										target="_blank"
										rel="noreferrer"
									>
										Markdown docs
									</a>
									<a href="https://github.com/AnkitParekh007/contributorOps" target="_blank" rel="noreferrer">
										GitHub
									</a>
									<Link to="/waitlist">Join Waitlist</Link>
									<Link to="/contact">Contact</Link>
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
									<span>Open-source job seekers</span>
									<span>Backend and API developers</span>
									<span>Developer tooling contributors</span>
									<span>Career-focused teams</span>
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
							<Link to="/pricing">Plans</Link>
							<Link to="/safety">Safety policy</Link>
							<Link to="/privacy">Privacy</Link>
							<Link to="/terms">Terms</Link>
							<Link to="/roadmap">Roadmap</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
