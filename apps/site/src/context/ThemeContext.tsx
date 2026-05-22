import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: "dark",
	toggleTheme: () => {},
});

export function useTheme() {
	return useContext(ThemeContext);
}

function getInitialTheme(): Theme {
	try {
		const stored = localStorage.getItem("contributorops_theme") as Theme | null;
		if (stored === "light" || stored === "dark") return stored;
	} catch {
		// localStorage unavailable
	}
	return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem("contributorops_theme", theme);
		} catch {
			// ignore
		}
	}, [theme]);

	const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
