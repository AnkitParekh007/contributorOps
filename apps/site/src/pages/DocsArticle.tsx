import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { DocsLayout } from "../components/DocsLayout";
import { docs, getDocBySlug, extractHeadings, headingId } from "../data/docs";

// ---------------------------------------------------------------------------
// Heading component factory — adds stable id for TOC anchor links
// ---------------------------------------------------------------------------
function makeHeading(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  return function HeadingComponent({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    const text = Array.isArray(children)
      ? children
          .map((c) => (typeof c === "string" ? c : ""))
          .join("")
      : String(children ?? "");
    const id = headingId(text);
    return (
      <Tag id={id} {...props}>
        <a className="docs-heading-anchor" href={`#${id}`} aria-hidden="true" tabIndex={-1}>
          #
        </a>
        {children}
      </Tag>
    );
  };
}

// ---------------------------------------------------------------------------
// Custom renderers for react-markdown
// ---------------------------------------------------------------------------
const mdComponents: Components = {
  h1: makeHeading("h1"),
  h2: makeHeading("h2"),
  h3: makeHeading("h3"),
  h4: makeHeading("h4"),
  // External links → new tab; internal links → stay in app
  a({ href, children, ...props }) {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noreferrer" {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
  // Code blocks
  pre({ children, ...props }) {
    return <pre className="docs-code-block" {...props}>{children}</pre>;
  },
  code({ className, children, ...props }) {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return <code className={`docs-code ${className ?? ""}`} {...props}>{children}</code>;
    }
    return <code className="docs-inline-code" {...props}>{children}</code>;
  },
  // Tables
  table({ children, ...props }) {
    return (
      <div className="docs-table-wrap">
        <table className="docs-table" {...props}>{children}</table>
      </div>
    );
  },
  // Blockquotes
  blockquote({ children, ...props }) {
    return <blockquote className="docs-blockquote" {...props}>{children}</blockquote>;
  },
};

// ---------------------------------------------------------------------------
// Not-found state
// ---------------------------------------------------------------------------
function DocsNotFound() {
  return (
    <DocsLayout>
      <div className="docs-article docs-not-found-state">
        <div className="docs-breadcrumb">
          <Link to="/docs">Documentation</Link>
          <span className="docs-breadcrumb-sep">/</span>
          <span>Not found</span>
        </div>
        <h2>Page not found</h2>
        <p>This documentation page doesn't exist.</p>
        <Link to="/docs" className="button-secondary" style={{ display: "inline-flex", marginTop: 8 }}>
          ← Back to Docs
        </Link>
      </div>
    </DocsLayout>
  );
}

// ---------------------------------------------------------------------------
// Main article component
// ---------------------------------------------------------------------------
export function DocsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const doc = getDocBySlug(slug ?? "");

  if (!doc) return <DocsNotFound />;

  const currentIndex = docs.findIndex((d) => d.slug === slug);
  const prev = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const next = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;

  const headings = extractHeadings(doc.content).filter((h) => h.level > 1); // skip h1 (the title)

  return (
    <DocsLayout>
      <div className="docs-article-wrap">
        {/* ── Article ─────────────────────────────────── */}
        <article className="docs-article">
          <div className="docs-breadcrumb">
            <Link to="/docs">Documentation</Link>
            <span className="docs-breadcrumb-sep">/</span>
            <span>{doc.title}</span>
          </div>

          <div className="docs-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {doc.content}
            </ReactMarkdown>
          </div>

          <div className="docs-article-meta">
            <a
              href={doc.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="docs-github-link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              View source on GitHub
            </a>
          </div>

          {/* Prev / Next */}
          <nav className="docs-prev-next" aria-label="Article navigation">
            {prev ? (
              <Link to={`/docs/${prev.slug}`} className="docs-prev-next-item docs-prev-item">
                <span className="docs-prev-next-label">← Previous</span>
                <span className="docs-prev-next-title">{prev.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link to={`/docs/${next.slug}`} className="docs-prev-next-item docs-next-item">
                <span className="docs-prev-next-label">Next →</span>
                <span className="docs-prev-next-title">{next.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </article>

        {/* ── Right-side TOC (desktop only) ───────────── */}
        {headings.length > 0 && (
          <aside className="docs-toc" aria-label="Table of contents">
            <p className="docs-toc-label">On this page</p>
            <nav>
              {headings.map((h) => (
                <a
                  key={`${h.id}-${h.level}`}
                  href={`#${h.id}`}
                  className={`docs-toc-link docs-toc-h${h.level}`}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </DocsLayout>
  );
}
