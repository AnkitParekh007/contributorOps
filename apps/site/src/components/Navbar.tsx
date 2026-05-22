import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { BrandLogo } from "./BrandLogo";

function SunIcon() {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
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
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
		</svg>
	);
}

function GitHubIcon() {
	return (
		<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
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
					<BrandLogo />
				</Link>

				<nav className={`nav-links${menuOpen ? " nav-links-open" : ""}`} aria-label="Main navigation">
					<NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
						Home
					</NavLink>
					<NavLink
						to="/features"
						className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}
					>
						Features
					</NavLink>
					<NavLink
						to="/pricing"
						className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}
					>
						Pricing
					</NavLink>
					<NavLink to="/docs" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
						Docs
					</NavLink>
					<NavLink to="/safety" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
						Safety
					</NavLink>
					<NavLink
						to="/roadmap"
						className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}
					>
						Roadmap
					</NavLink>
					<a
						className="nav-link nav-icon-btn"
						href="https://github.com/AnkitParekh007/contributorOps"
						target="_blank"
						rel="noreferrer"
						aria-label="GitHub repository"
						title="GitHub"
					>
						<GitHubIcon />
					</a>
				</nav>

				<div className="nav-end">
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
						onClick={() => setMenuOpen((open) => !open)}
					>
						<span className="ham-bar" />
						<span className="ham-bar" />
						<span className="ham-bar" />
					</button>
				</div>
			</div>
		</header>
	);
}
