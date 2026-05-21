import { DocsLayout } from "../components/DocsLayout";
import { docsCards, docsSections } from "../data/docs";

export function Docs() {
  return (
    <DocsLayout
      title="Documentation"
      description="Everything needed to understand the product, run the static site locally, and deploy it safely on GitHub Pages."
    >
      <div className="docs-card-grid">
        {docsCards.map((card) => (
          <a key={card.title} href={card.href} target="_blank" rel="noreferrer" className="docs-card">
            <h3>{card.title}</h3>
            <p>{card.summary}</p>
          </a>
        ))}
      </div>

      {docsSections.map((section) => (
        <section key={section.title} className="docs-section-card">
          <h2>{section.title}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </DocsLayout>
  );
}
