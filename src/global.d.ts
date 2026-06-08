import type { AstroIntegration } from "@swup/astro";
declare global {
	interface Window {
		swup: AstroIntegration;
		artalkInstance?: {
			destroy: () => void;
		} | null;
		rainEngine: {
			start: () => void;
			stop: (withRipples?: boolean) => void;
			freeze: () => void;
		};
	}
}

declare module "*.yml" {
	const content: any;
	export default content;
}
