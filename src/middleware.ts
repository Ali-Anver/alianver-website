import { defineMiddleware } from "astro:middleware";
import { getSortedPosts } from "./utils/content-utils";

let urlCache: Set<string> | null = null;
async function getValidUrls(): Promise<Set<string>> {
	if (urlCache) return urlCache;
	const posts = await getSortedPosts(false);
	urlCache = new Set();
	for (const post of posts) {
		const postPath = `/posts/${post.slug}/`;
		urlCache.add(postPath);
	}
	urlCache.add("/");
	urlCache.add("/archive/");
	urlCache.add("/about/");
	urlCache.add("/links/");
	return urlCache;
}
export const onRequest = defineMiddleware(async (context, next) => {
	const { url: requestUrl, redirect } = context;
	const pathname = requestUrl.pathname;
	const searchParams = requestUrl.searchParams;
	if (pathname === "/archive/") {
		const tag = searchParams.get("tag");
		if (tag) return redirect(`/tags/${encodeURIComponent(tag.trim())}/`, 301);
		const category = searchParams.get("category");
		if (category)
			return redirect(
				`/categories/${encodeURIComponent(category.trim())}/`,
				301,
			);
		if (searchParams.get("uncategorized") === "true")
			return redirect("/categories/uncategorized/", 301);
	}
	if (
		pathname.includes(".") ||
		pathname.startsWith("/_astro/") ||
		pathname.startsWith("/api/") ||
		pathname.startsWith("/images/") ||
		pathname.startsWith("/fonts/") ||
		pathname.startsWith("/favicon/")
	) {
		return next();
	}
	const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
	try {
		const validUrls = await getValidUrls();
		if (validUrls.has(normalizedPath)) {
			return next();
		}
		const pathParts = normalizedPath.split("/").filter(Boolean);
		const potentialSlug = pathParts[pathParts.length - 1];
		if (potentialSlug) {
			const lowerPotentialSlug = potentialSlug.toLowerCase();
			for (const validUrl of validUrls) {
				const validParts = validUrl.split("/").filter(Boolean);
				const realSlug = validParts[validParts.length - 1];
				if (realSlug && realSlug.toLowerCase() === lowerPotentialSlug) {
					if (normalizedPath !== validUrl) {
						if (import.meta.env.DEV) {
							console.log(
								`[Middleware 301] Redirecting to canonical: ${pathname} -> ${validUrl}`,
							);
						}
						return redirect(validUrl, 301);
					}
				}
			}
		}
		const lowerPath = normalizedPath.toLowerCase();
		for (const validUrl of validUrls) {
			if (validUrl.toLowerCase() === lowerPath) {
				return redirect(validUrl, 301);
			}
		}
	} catch (error) {
		if (import.meta.env.DEV) console.error("Middleware Error:", error);
	}
	return next();
});
