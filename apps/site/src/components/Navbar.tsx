import { Link, NavLink, useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    navigate("/");
    window.setTimeout(() => {
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" />
          <span>ContributorOps</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
            Home
          </NavLink>
          <button type="button" className="nav-link nav-button" onClick={scrollToFeatures}>
            Features
          </button>
          <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
            Pricing
          </NavLink>
          <NavLink to="/docs" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
            Docs
          </NavLink>
          <NavLink to="/safety" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
            Safety
          </NavLink>
          <NavLink to="/roadmap" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
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
        </nav>
      </div>
    </header>
  );
}
