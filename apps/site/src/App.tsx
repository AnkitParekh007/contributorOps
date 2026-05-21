import { HashRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Contact } from "./pages/Contact";
import { Demo } from "./pages/Demo";
import { Docs } from "./pages/Docs";
import { Features } from "./pages/Features";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Pricing } from "./pages/Pricing";
import { Privacy } from "./pages/Privacy";
import { Roadmap } from "./pages/Roadmap";
import { Safety } from "./pages/Safety";
import { Terms } from "./pages/Terms";
import { UseCases } from "./pages/UseCases";
import { Waitlist } from "./pages/Waitlist";

function App() {
  return (
    <HashRouter>
      <div className="site-shell">
        <Navbar />
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
