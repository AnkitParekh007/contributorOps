import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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

        <div className="navbar-controls">
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

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
        </div>

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
