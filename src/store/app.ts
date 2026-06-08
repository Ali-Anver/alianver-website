import { atom } from "nanostores";
import { AUTO_MODE } from "../constants/constants";
import type { LIGHT_DARK_MODE } from "../types/config";

const getInitialTheme = (): LIGHT_DARK_MODE => {
	if (typeof window !== "undefined") {
		return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || AUTO_MODE;
	}
	return AUTO_MODE;
};
export const $themeMode = atom<LIGHT_DARK_MODE>(getInitialTheme());
export const $isNavMenuOpen = atom(false);
export const $isBreadcrumbOpen = atom(false);
export const $scrollProgress = atom(0);
export const $isPageLoading = atom(false);
export function initThemeStore() {
	if (typeof window !== "undefined") {
		const stored = localStorage.getItem("theme") as LIGHT_DARK_MODE;
		if (stored) {
			$themeMode.set(stored);
		}
	}
}
export const setIsNavMenuOpen = (val: boolean) => $isNavMenuOpen.set(val);
export const setIsBreadcrumbOpen = (val: boolean) => $isBreadcrumbOpen.set(val);
