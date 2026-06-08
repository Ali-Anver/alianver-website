import { defineCollection } from "astro:content";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/posts",
		generateId: ({ entry, base }) => {
			const entryPath =
				typeof entry === "string" ? entry : fileURLToPath(entry);
			const basePath = typeof base === "string" ? base : fileURLToPath(base);
			const relativePath = path
				.relative(basePath, entryPath)
				.replace(/\.[^/.]+$/, "");
			return relativePath;
		},
	}),
	schema: z.preprocess(
		(data: Record<string, unknown>) => {
			if (!data.category && data.categories && Array.isArray(data.categories)) {
				data.category = data.categories[0];
			} else if (!data.category && typeof data.categories === "string") {
				data.category = data.categories;
			}
			return data;
		},
		z.object({
			title: z.string(),
			published: z.preprocess(
				(val) => new Date(val as string | number | Date),
				z.date(),
			),
			updated: z.preprocess(
				(val) => (val ? new Date(val as string | number | Date) : undefined),
				z.date().optional(),
			),
			draft: z.boolean().optional().default(false),
			description: z.string().optional().default(""),
			image: z.string().optional().default(""),
			tags: z.array(z.string()).optional().default([]),
			category: z.string().optional().nullable().default(""),
			lang: z.string().optional().default(""),
			prevTitle: z.string().optional().default(""),
			prevSlug: z.string().optional().default(""),
			nextTitle: z.string().optional().default(""),
			nextSlug: z.string().optional().default(""),
			excerpt: z.string().optional(),
			pv_offset: z.number().optional().default(0),
			password: z.preprocess((val) => val?.toString(), z.string().optional()),
			archive: z.boolean().optional().default(false),
		}),
	),
});

const specCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		published: z.preprocess(
			(val) => new Date(val as string | number | Date),
			z.date(),
		),
		updated: z.preprocess(
			(val) => (val ? new Date(val as string | number | Date) : undefined),
			z.date().optional(),
		),
	}),
});

const seriCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/seri" }),
	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		description: z.string().optional(),
		image: z.string().optional(),
		published: z.preprocess(
			(val) => new Date(val as string | number | Date),
			z.date(),
		),
		filter: z
			.object({
				tag: z.string().optional(),
				category: z.string().optional(),
			})
			.optional(),
		sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
	}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	seri: seriCollection,
};
