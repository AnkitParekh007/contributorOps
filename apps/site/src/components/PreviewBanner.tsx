import { Link } from "react-router-dom";

export function PreviewBanner() {
	return (
		<div className="preview-banner" role="banner" aria-label="Preview status">
			<span className="preview-banner-dot" aria-hidden="true" />
			<span className="preview-banner-text">
				<strong>Open-source preview</strong> — core workflows are implemented; hosted production accounts and billing are not live yet.
			</span>
			<Link to="/contribute" className="preview-banner-cta">
				Contribute
			</Link>
		</div>
	);
}
