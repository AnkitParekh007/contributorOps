import { useEffect, useRef, useState, type ReactNode } from "react";

interface SectionProps {
	id?: string;
	eyebrow?: string;
	title: string;
	description?: string;
	children: ReactNode;
}

export function Section({ id, eyebrow, title, description, children }: SectionProps) {
	const ref = useRef<HTMLElement | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setVisible(true);
						observer.disconnect();
						break;
					}
				}
			},
			{ threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<section id={id} ref={ref} className={`site-section reveal-section${visible ? " is-visible" : ""}`}>
			<div className="site-section-panel">
				<div className="section-heading">
					{eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
					<h2>{title}</h2>
					{description ? <p>{description}</p> : null}
				</div>
				<div className="section-body">{children}</div>
			</div>
		</section>
	);
}
