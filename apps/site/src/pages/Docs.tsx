import { Link } from "react-router-dom";
import { DocsLayout } from "../components/DocsLayout";
import { docs } from "../data/docs";

const CATEGORY_COLORS: Record<string, string> = {
  "Product": "docs-cat-product",
  "Developer Setup": "docs-cat-devsetup",
  "Trust & Safety": "docs-cat-safety",
  "Business": "docs-cat-business",
};

export function Docs() {
  return (
    <DocsLayout>
      <div className="docs-article">
        <div className="docs-breadcrumb">
          <span>Documentation</span>
        </div>

        <div className="docs-page-header">
          <h1>Documentation</h1>
          <p className="docs-page-intro">
            Everything you need to understand ContributorOps — the product vision, developer
            setup, deployment, safety model, monetization plan, and roadmap.
          </p>
        </div>

        <div className="docs-home-grid">
          {docs.map((doc) => (
            <Link key={doc.slug} to={`/docs/${doc.slug}`} className="docs-home-card">
              <span className={`docs-home-card-cat ${CATEGORY_COLORS[doc.category] ?? ""}`}>
                {doc.category}
              </span>
              <h3>{doc.title}</h3>
              <p>{doc.summary}</p>
              <span className="docs-home-card-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>

        <div className="docs-home-quickstart">
          <h2>Quick start</h2>
          <p>
            New here? Start with{" "}
            <Link to="/docs/product-overview">Product Overview</Link> for the product
            vision, then{" "}
            <Link to="/docs/local-development">Local Development</Link> to run the
            site locally.
          </p>
        </div>
      </div>
    </DocsLayout>
  );
}
