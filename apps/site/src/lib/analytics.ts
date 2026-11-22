import { campaignAttribution } from "./campaigns";

type PlausibleProps = Record<string, string | number | boolean>;

type PlausibleOptions = {
	props?: PlausibleProps;
	interactive?: boolean;
};

type PlausibleFunction = ((eventName: string, options?: PlausibleOptions) => void) & {
	q?: unknown[][];
	o?: Record<string, unknown>;
	init?: (options?: Record<string, unknown>) => void;
};

declare global {
	interface Window {
		plausible?: PlausibleFunction;
	}
}

export function analyticsConfigured(): boolean {
	return Boolean(import.meta.env.VITE_PLAUSIBLE_SCRIPT_SRC?.trim());
}

export function initAnalytics(): boolean {
	if (typeof window === "undefined" || typeof document === "undefined") return false;

	const scriptSrc = import.meta.env.VITE_PLAUSIBLE_SCRIPT_SRC?.trim();
	if (!scriptSrc) return false;

	if (!window.plausible) {
		const plausible = ((...args: unknown[]) => {
			plausible.q = plausible.q ?? [];
			plausible.q.push(args);
		}) as PlausibleFunction;

		plausible.init = (options = {}) => {
			plausible.o = options;
		};

		window.plausible = plausible;
	}

	if (!document.querySelector('script[data-contributorops-analytics="plausible"]')) {
		const script = document.createElement("script");
		script.async = true;
		script.src = scriptSrc;
		script.dataset.contributoropsAnalytics = "plausible";
		document.head.appendChild(script);
	}

	window.plausible.init?.({
		hashBasedRouting: true,
		outboundLinks: true,
	});

	return true;
}

export function trackEvent(eventName: string, props?: PlausibleProps): void {
	if (!analyticsConfigured() || typeof window === "undefined" || !window.plausible) return;
	const campaign = campaignAttribution();
	const mergedProps = { ...campaign, ...props };
	window.plausible(eventName, Object.keys(mergedProps).length ? { props: mergedProps } : undefined);
}
