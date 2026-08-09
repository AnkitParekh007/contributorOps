import { HashRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { PreviewBanner } from "./components/PreviewBanner";
import { ThemeProvider } from "./context/ThemeContext";
import { Contribute } from "./pages/Contribute";
import { Docs } from "./pages/Docs";
import { DocsArticle } from "./pages/DocsArticle";
import { Features } from "./pages/Features";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Pricing } from "./pages/Pricing";
import { RecruiterBrief } from "./pages/RecruiterBrief";
import { Roadmap } from "./pages/Roadmap";
import { Safety } from "./pages/Safety";
import { Share } from "./pages/Share";
import { Showcase } from "./pages/Showcase";
import { Contact } from "./pages/Contact";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Waitlist } from "./pages/Waitlist";
import { AcceptableUse } from "./pages/legal/AcceptableUse";
import { AIDisclosure } from "./pages/legal/AIDisclosure";
import { GitHubDataUsage } from "./pages/legal/GitHubDataUsage";

function App() {
	return (
		<ThemeProvider>
			<HashRouter>
				<div className="site-shell">
					<PreviewBanner />
					<Navbar />
					<main className="site-main">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/features" element={<Features />} />
							<Route path="/showcase" element={<Showcase />} />
							<Route path="/recruiter" element={<RecruiterBrief />} />
							<Route path="/share" element={<Share />} />
							<Route path="/contribute" element={<Contribute />} />
							<Route path="/pricing" element={<Pricing />} />
							<Route path="/docs" element={<Docs />} />
							<Route path="/docs/:slug" element={<DocsArticle />} />
							<Route path="/safety" element={<Safety />} />
							<Route path="/roadmap" element={<Roadmap />} />
							<Route path="/waitlist" element={<Waitlist />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/privacy" element={<Privacy />} />
							<Route path="/terms" element={<Terms />} />
							<Route path="/acceptable-use" element={<AcceptableUse />} />
							<Route path="/ai-disclosure" element={<AIDisclosure />} />
							<Route path="/github-data-usage" element={<GitHubDataUsage />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</main>
					<Footer />
				</div>
			</HashRouter>
		</ThemeProvider>
	);
}

export default App;
