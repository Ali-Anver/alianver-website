import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ site }) => {
	const siteUrl = site?.toString() || "https://your-site.com/";
	const pages = [
		{ url: "/", priority: "1.0", changefreq: "daily" },
		{ url: "/archive/", priority: "0.8", changefreq: "weekly" },
		{ url: "/about/", priority: "0.8", changefreq: "monthly" },
		{ url: "/links/", priority: "0.8", changefreq: "weekly" },
		{ url: "/seri/", priority: "0.8", changefreq: "weekly" },
		{ url: "/subscribe/", priority: "0.6", changefreq: "monthly" },
	];
	const pageUrls = pages
		.map(
			(page) => `  <url>
    <loc>${new URL(page.url, siteUrl).toString()}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`,
		)
		.join("\n");
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls}
</urlset>`;
	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
