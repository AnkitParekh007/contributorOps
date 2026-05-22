import { Link } from "react-router-dom";

export function NotFound() {
	return (
		<div className="page not-found">
			<h1>Page not found</h1>
			<p>The requested page does not exist in the static ContributorOps site.</p>
			<Link to="/" className="button-primary">
				Back to Home
			</Link>
		</div>
	);
}
