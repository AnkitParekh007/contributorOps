import { Link } from "react-router-dom";

export function PreviewBanner() {
	return (
		<div className="preview-banner" role="banner" aria-label="Preview status">
			<span className="preview-banner-dot" aria-hidden="true" />
			<span className="preview-banner-text">
				<strong>Founder Preview</strong> — payments not live, no production accounts yet.
			</span>
			<Link to="/waitlist" className="preview-banner-cta">
				Join Waitlist
			</Link>
		</div>
	);
}
