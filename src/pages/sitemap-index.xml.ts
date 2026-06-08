import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ site }) => {
	const siteUrl = site?.toString() || "https://your-site.com/";
	const sitemaps = [
		"sitemap-pages.xml",
		"sitemap-posts.xml",
		"sitemap-series.xml",
		"sitemap-taxonomies.xml",
	];
	const now = new Date().toISOString();
	const sitemapItems = sitemaps
		.map(
			(s) => `  <sitemap>
    <loc>${new URL(s, siteUrl).toString()}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
		)
		.join("\n");
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapItems}
</sitemapindex>`;
	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
