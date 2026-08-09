import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initAnalytics } from "./lib/analytics";
import "./styles.css";
import "./engagement.css";
import "./growth.css";
import "./authority.css";
import "./distribution.css";
import "./adoption.css";
import "./try.css";
import "./quality.css";

initAnalytics();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
