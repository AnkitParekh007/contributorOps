import { HashRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import { Docs } from "./pages/Docs";
import { Features } from "./pages/Features";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Pricing } from "./pages/Pricing";
import { Roadmap } from "./pages/Roadmap";
import { Safety } from "./pages/Safety";

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <div className="site-shell">
          <Navbar />
          <main className="site-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/roadmap" element={<Roadmap />} />
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
