import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";
export function applyThemeToDocument(theme: LIGHT_DARK_MODE): void {
	if (typeof document === "undefined") {
		return;
	}
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (
				typeof window !== "undefined" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches
			) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("theme-changed", { detail: { theme } }),
		);
	}
}
export function setTheme(theme: LIGHT_DARK_MODE): void {
	if (typeof localStorage !== "undefined") {
		localStorage.setItem("theme", theme);
	}
	applyThemeToDocument(theme);
}
export function getStoredTheme(): LIGHT_DARK_MODE {
	if (typeof localStorage !== "undefined") {
		return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
	}
	return DEFAULT_THEME;
}
