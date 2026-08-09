import { Link } from "react-router-dom";

export function PreviewBanner() {
	return (
		<div className="preview-banner" role="banner" aria-label="Launch status">
			<span className="preview-banner-dot" aria-hidden="true" />
			<span className="preview-banner-text">
				<strong>Public OSS launch</strong> — the browser demo and source are live; hosted production accounts and billing are not live yet.
			</span>
			<Link to="/launch" className="preview-banner-cta">
				Launch hub
			</Link>
		</div>
	);
}
