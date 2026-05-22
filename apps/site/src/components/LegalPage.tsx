import { Section } from "./Section";

interface LegalPageProps {
	eyebrow: string;
	title: string;
	description: string;
	lastUpdated: string;
	children: React.ReactNode;
}

export function LegalPage({ eyebrow, title, description, lastUpdated, children }: LegalPageProps) {
	return (
		<div className="page">
			<Section eyebrow={eyebrow} title={title} description={description}>
				<article className="legal-article docs-section-card">
					{children}
					<p className="legal-last-updated">Last updated: {lastUpdated}</p>
				</article>
			</Section>
		</div>
	);
}
