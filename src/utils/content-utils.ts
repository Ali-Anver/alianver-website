import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

async function getRawSortedPosts(filterArchived = false) {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		const isDraft = import.meta.env.PROD ? data.draft === true : false;
		const isArchived = data.archive === true;
		const isProtected = !!data.password;
		if (filterArchived) {
			return !isDraft && !isProtected && !isArchived;
		}
		return !isDraft && !isProtected;
	});
	const postsWithCase = allBlogPosts.map((entry: CollectionEntry<"posts">) => {
		const parts = entry.id.split("/");
		const filename = parts[parts.length - 1];
		return {
			...entry,
			slug: filename,
		};
	});
	const sorted = postsWithCase.sort((a: any, b: any) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}
export async function getSortedPosts(
	filterArchived = false,
): Promise<CollectionEntry<"posts">[]> {
	const sorted = await getRawSortedPosts(filterArchived);
	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}
	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts(false);
	const sortedPostsList = sortedFullPosts.map(
		(post: CollectionEntry<"posts">) => ({
			slug: post.slug,
			data: post.data,
		}),
	);
	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};
export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true && !data.password : true;
	});
	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: CollectionEntry<"posts">) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		const countDiff = countMap[b] - countMap[a];
		if (countDiff !== 0) return countDiff;
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	return keys.map((key) => ({ name: key, count: countMap[key] }));
}
export type Category = {
	name: string;
	count: number;
	url: string;
};
export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true && !data.password : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: CollectionEntry<"posts">) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}
		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();
		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});
	const lst = Object.keys(count).sort((a, b) => {
		const countDiff = count[b] - count[a];
		if (countDiff !== 0) return countDiff;
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
export async function getRelatedPosts(
	currentPost: CollectionEntry<"posts">,
	limit = 3,
): Promise<PostForList[]> {
	const allPosts = await getSortedPosts(false);
	const tokenize = (text: string) => {
		if (!text) return new Set<string>();
		const matches =
			text.toLowerCase().match(/[\u4e00-\u9fa5]|[a-zA-Z0-9]+/g) || [];
		const stopWords = new Set([
			"的",
			"了",
			"和",
			"与",
			"在",
			"是",
			"a",
			"an",
			"the",
			"is",
			"of",
			"for",
			"how",
			"to",
			"why",
			"in",
		]);
		return new Set(
			(matches as string[])
				.filter((m) => m.length > 1 || /[\u4e00-\u9fa5]/.test(m))
				.filter((m) => !stopWords.has(m)),
		);
	};
	const currentTokens = tokenize(currentPost.data.title);
	const currentTags = new Set(currentPost.data.tags || []);
	const currentCategory = currentPost.data.category;
	const scoredPosts = allPosts
		.filter((post) => post.id !== currentPost.id)
		.map((post) => {
			let score = 0;
			if (currentCategory && post.data.category === currentCategory) {
				score += 5;
			}
			const postTags = post.data.tags || [];
			postTags.forEach((tag: string) => {
				if (currentTags.has(tag)) score += 3;
			});
			const postTokens = tokenize(post.data.title);
			postTokens.forEach((token) => {
				if (currentTokens.has(token)) score += 8;
			});
			return { post, score };
		})
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((item) => ({
			slug: item.post.slug,
			data: item.post.data,
		}));
	return scoredPosts;
}
