import { getSortedPosts } from "@utils/content-utils";
import { makeUrl } from "@utils/url-utils";
import type { APIContext } from "astro";
import { Feed } from "feed";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteYaml, siteConfig } from "@/config";

const parser = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
});
export async function GET(context: APIContext): Promise<Response> {
	const blog = await getSortedPosts();
	const site = context.site?.toString() || "https://your-site.com/";
	const feed = new Feed({
		title: siteConfig.title,
		description: siteConfig.subtitle,
		id: site,
		link: site,
		language: siteConfig.lang,
		favicon: `${site}favicon.ico`,
		copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.title}`,
		updated:
			blog.length > 0
				? blog[0].data.updated || blog[0].data.published
				: new Date(),
		generator: "Astro - Feed Library",
		feedLinks: {
			atom: new URL("atom.xml", site).toString(),
		},
		author: {
			name: siteYaml.copyright.text,
			email: siteYaml.site.email,
			link: site,
		},
	});
	const escapeHtml = (unsafe: string) => {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	};
	for (const post of blog) {
		const postUrl = new URL(makeUrl(`/posts/${post.slug}/`), site).toString();
		const content =
			typeof post.body === "string" ? post.body : String(post.body || "");
		const normalizeImageUrl = (source: string, base: string = postUrl) => {
			try {
				return new URL(source, base).toString();
			} catch {
				return source;
			}
		};
		const renderedContent = sanitizeHtml(parser.render(content), {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([
				"img",
				"figure",
				"figcaption",
				"video",
				"iframe",
				"pre",
				"code",
				"span",
				"div",
			]),
			allowedAttributes: {
				...sanitizeHtml.defaults.allowedAttributes,
				img: ["src", "alt", "title", "width", "height", "loading", "style"],
				iframe: [
					"src",
					"width",
					"height",
					"title",
					"frameborder",
					"allow",
					"allowfullscreen",
					"style",
				],
				div: ["class", "style"],
				span: ["class", "style"],
				pre: ["class", "style"],
				code: ["class", "style"],
			},
			transformTags: {
				img: (tagName, attribs) => ({
					tagName,
					attribs: attribs.src
						? { ...attribs, src: normalizeImageUrl(attribs.src) }
						: attribs,
				}),
			},
		});
		const coverHtml = post.data.image
			? `<img src="${escapeHtml(normalizeImageUrl(post.data.image, site))}" alt="${escapeHtml(post.data.title)}" style="border-radius: 1rem; margin-bottom: 1rem; width: 100%; object-fit: cover;" />`
			: "";
		feed.addItem({
			title: post.data.title,
			id: postUrl,
			link: postUrl,
			description: post.data.description,
			content: coverHtml + renderedContent,
			author: [
				{
					name: siteYaml.copyright.text,
					email: siteYaml.site.email,
					link: site,
				},
			],
			date: post.data.updated || post.data.published,
			published: post.data.published,
			category: (post.data.tags || []).map((tag: string) => ({
				name: escapeHtml(tag),
			})),
		});
	}
	return new Response(feed.atom1(), {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
