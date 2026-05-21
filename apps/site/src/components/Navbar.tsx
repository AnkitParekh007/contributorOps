import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" />
          <span>ContributorOps</span>
        </Link>

        <button
          type="button"
          className="nav-hamburger"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="ham-bar" />
          <span className="ham-bar" />
          <span className="ham-bar" />
        </button>

        <nav className={`nav-links${menuOpen ? " nav-links-open" : ""}`} aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/features" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
            Features
          </NavLink>
          <NavLink to="/use-cases" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
            Use Cases
          </NavLink>
          <NavLink to="/pricing" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
            Pricing
          </NavLink>
          <NavLink to="/demo" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
            Demo
          </NavLink>
          <NavLink to="/docs" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
            Docs
          </NavLink>
          <NavLink to="/safety" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
            Safety
          </NavLink>
          <NavLink to="/roadmap" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
            Roadmap
          </NavLink>
          <a
            className="nav-link nav-link-external"
            href="https://github.com/AnkitParekh007/contributorOps"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <NavLink to="/waitlist" className="nav-link nav-link-cta">
            Join Waitlist
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
