import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { makeUrl } from "@utils/url-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteYaml, siteConfig } from "@/config";

const parser = new MarkdownIt();
function stripInvalidXmlChars(str: string): string {
	return str.replace(
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}
export async function GET(context: APIContext): Promise<Response> {
	const blog = await getSortedPosts();
	const site = context.site?.toString() || "https://your-site.com/";
	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: site,
		stylesheet: "/rss-style.xsl",
		items: blog.map((post) => {
			const content =
				typeof post.body === "string" ? post.body : String(post.body || "");
			const cleanedContent = stripInvalidXmlChars(content);
			const renderedContent = sanitizeHtml(parser.render(cleanedContent), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat([
					"img",
					"figure",
					"figcaption",
					"video",
					"iframe",
				]),
				allowedAttributes: {
					...sanitizeHtml.defaults.allowedAttributes,
					img: ["src", "alt", "title", "width", "height", "loading"],
					iframe: [
						"src",
						"width",
						"height",
						"title",
						"frameborder",
						"allow",
						"allowfullscreen",
					],
				},
			});
			const imageUrl = post.data.image
				? new URL(post.data.image, site).toString()
				: "";
			const coverHtml = imageUrl
				? `<img src="${stripInvalidXmlChars(imageUrl)}" alt="${stripInvalidXmlChars(post.data.title)}" style="border-radius: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />`
				: "";
			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: makeUrl(`/posts/${post.slug}/`),
				content: coverHtml + renderedContent,
				categories: post.data.tags,
				author: siteYaml.copyright.text,
				customData: post.data.updated
					? `<atom:updated>${post.data.updated.toISOString()}</atom:updated>`
					: "",
			};
		}),
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
			content: "http://purl.org/rss/1.0/modules/content/",
			dc: "http://purl.org/dc/elements/1.1/",
		},
		customData: `
            <language>${siteConfig.lang}</language>
            <atom:link href="${site}rss.xml" rel="self" type="application/rss+xml" />
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            <generator>Astro RSS</generator>
        `,
	});
}
