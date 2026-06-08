import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
export function pathsEqual(path1: string, path2: string): boolean {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}
function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}
export function getPostUrlBySlug(slug: string): string {
	return makeUrl(`/posts/${slug}/`);
}
export function getTagUrl(tag: string): string {
	if (!tag) return makeUrl("/archive/");
	return makeUrl(`/tags/${encodeURIComponent(tag.trim())}/`);
}
export function getCategoryUrl(category: string | null): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	)
		return makeUrl("/categories/uncategorized/");
	return makeUrl(`/categories/${encodeURIComponent(category.trim())}/`);
}
export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}
export function makeUrl(path: string): string {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
export function isHomePath(path: string): boolean {
	const p = path.endsWith("/") ? path : `${path}/`;
	const root = makeUrl("/");
	const rootP = root.endsWith("/") ? root : `${root}/`;
	return p === rootP || /^\/\d+\/?$/.test(p) || /^\/page\/\d+\/?$/.test(p);
}
export function wrapExternalLink(href: string): string {
	if (!href) return href;
	try {
		const urlObj = new URL(href);
		const siteDomains = siteYaml.trusted_domains;
		const isInternal = siteDomains.some(
			(domain) =>
				urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
		);
		if (isInternal) return href;
		return makeUrl(`/go/?url=${encodeURIComponent(href)}`);
	} catch (_e) {
		return href;
	}
}
