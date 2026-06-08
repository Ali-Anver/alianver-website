import type { APIRoute } from "astro";

export const GET: APIRoute = (context) => {
	const siteUrl = context.site?.toString() || "https://lonetrail.vercel.app";
	const robotsTxt = `
User-agent: *
Disallow: /favicon/
Disallow: /Link/
Disallow: /audio/
Disallow: /go/
Disallow: /*?tag=*
Disallow: /*?category=*
Disallow: /*?uncategorized=*
Sitemap: ${siteUrl}/sitemap-index.xml
`.trim();
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
