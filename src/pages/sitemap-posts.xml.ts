import { getSortedPosts } from "@utils/content-utils";
import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ site }) => {
	const posts = await getSortedPosts(false);
	const siteUrl = site?.toString() || "https://your-site.com/";
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${posts
	.map((post) => {
		const url = new URL(`/posts/${post.slug}/`, siteUrl).toString();
		const lastmod = (post.data.updated || post.data.published).toISOString();
		const imageEntry = post.data.image
			? `\n    <image:image>\n      <image:loc>${new URL(post.data.image, siteUrl).toString()}</image:loc>\n    </image:image>`
			: "";
		return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imageEntry}
  </url>`;
	})
	.join("\n")}
</urlset>`;
	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"X-Content-Type-Options": "nosniff",
		},
	});
};
