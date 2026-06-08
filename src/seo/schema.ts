import { profileConfig, siteConfig } from "@/config";

interface JsonLdProps {
	siteUrl: string;
	canonicalURL: string;
	title?: string;
	metaDescription?: string;
	siteLang?: string;
	isHomePage?: boolean;
	isPostPage?: boolean;
	published?: Date;
	updated?: Date;
	ogImage?: string;
	tags?: string[];
	category?: string;
	wordCount?: number;
	entities?: Record<string, unknown>[];
	citations?: string[];
	currentPath: string;
}

export function generateJsonLd({
	siteUrl,
	canonicalURL,
	title,
	metaDescription,
	siteLang,
	isHomePage,
	isPostPage,
	published,
	updated,
	ogImage,
	tags,
	category,
	wordCount,
	entities,
	citations,
	currentPath,
}: JsonLdProps) {
	let schemaType: string | string[] = "WebPage";
	if (isHomePage) schemaType = "CollectionPage";
	if (isPostPage) {
		schemaType =
			category === "TECH" ? ["BlogPosting", "TechArticle"] : "BlogPosting";
	} else if (currentPath.includes("/about/")) {
		schemaType = "AboutPage";
	} else if (currentPath.includes("/links/")) {
		schemaType = "CollectionPage";
	}

	const jsonLd: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": Array.isArray(schemaType) ? schemaType : [schemaType],
				"@id": `${canonicalURL}#main-entity`,
				url: canonicalURL,
				name: title || siteConfig.title,
				description: metaDescription,
				isPartOf: { "@id": `${siteUrl}#website` },
				publisher: { "@id": `${siteUrl}/#person` },
				author: { "@id": `${siteUrl}/#person` },
				inLanguage: siteLang,
			},
			{
				"@type": "WebSite",
				"@id": `${siteUrl}#website`,
				url: siteUrl,
				name: siteConfig.title,
				description: siteConfig.subtitle,
				publisher: { "@id": `${siteUrl}/#person` },
			},
			{
				"@type": "Person",
				"@id": `${siteUrl}/#person`,
				name: profileConfig.name,
				alternateName: [profileConfig.name],
				url: siteUrl + "/",
				image: profileConfig.avatar
					? {
							"@type": "ImageObject",
							"@id": siteUrl + "/#person",
							url: new URL(profileConfig.avatar, siteUrl).toString(),
						}
					: undefined,
				sameAs: profileConfig.links.map(l => l.url) || [],
			},
		],
	};

	const graph = jsonLd["@graph"] as Record<string, unknown>[];

	if (isPostPage) {
		const mainEntity = graph[0];
		mainEntity.headline = title || siteConfig.title;
		mainEntity.datePublished = published?.toISOString();
		mainEntity.dateModified = (updated || published)?.toISOString();
		mainEntity.image = ogImage;
		mainEntity.keywords = tags || [];
		mainEntity.articleSection = category;
		mainEntity.wordCount = wordCount;

		if (entities && entities.length > 0) {
			mainEntity.about = entities.map((e) => ({
				"@type": (e["@type"] as string) || "Thing",
				name: e.name as string,
				description: e.description as string,
				sameAs: (e.sameAs || e.url) as string | undefined,
			}));
		}

		if (citations && citations.length > 0) {
			mainEntity.citation = citations;
		}
	}

	const types = graph[0]["@type"] as string[];
	if (types.includes("CreativeWorkSeries") && entities) {
		graph[0].hasPart = entities.map((e) => ({
			"@type": "BlogPosting",
			name: e.title as string,
			url: e.url as string,
		}));
	}

	return jsonLd;
}
