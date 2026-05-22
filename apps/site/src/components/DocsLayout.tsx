import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { docs } from "../data/docs";

interface DocsLayoutProps {
  children: ReactNode;
}

const CATEGORIES = ["Product", "Developer Setup", "Trust & Safety", "Business"] as const;

function MenuIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _location = useLocation(); // triggers re-render on route change

  return (
    <div className="docs-shell">
      {/* Mobile toggle */}
      <button
        type="button"
        className="docs-sidebar-toggle"
        aria-label={sidebarOpen ? "Close navigation" : "Open docs navigation"}
        onClick={() => setSidebarOpen((o) => !o)}
      >
        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        <span>{sidebarOpen ? "Close" : "Docs menu"}</span>
      </button>

      {/* Tap-away overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="docs-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left sidebar */}
      <aside className={`docs-sidebar${sidebarOpen ? " docs-sidebar-open" : ""}`}>
        <div className="docs-sidebar-inner">
          <NavLink
            to="/docs"
            end
            className={({ isActive }) =>
              `docs-sidebar-link docs-sidebar-overview${isActive ? " docs-sidebar-link-active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Overview
          </NavLink>

          {CATEGORIES.map((cat) => {
            const catDocs = docs.filter((d) => d.category === cat);
            if (!catDocs.length) return null;
            return (
              <div key={cat} className="docs-sidebar-group">
                <p className="docs-sidebar-category">{cat}</p>
                {catDocs.map((doc) => (
                  <NavLink
                    key={doc.slug}
                    to={`/docs/${doc.slug}`}
                    className={({ isActive }) =>
                      `docs-sidebar-link${isActive ? " docs-sidebar-link-active" : ""}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    {doc.title}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main reading column */}
      <div className="docs-reader">{children}</div>
    </div>
  );
}
