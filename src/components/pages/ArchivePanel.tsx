import { useEffect, useMemo, useState } from "react";
import I18nKey from "../../i18n/i18nKey";
import { i18n } from "../../i18n/translation";
import { getPostUrlBySlug } from "../../utils/url-utils";
import Button from "../ui/Button";
import { RpStamp } from "../ui/RpStamp";
import { StripeFooter } from "../ui/StripeFooter";

interface Post {
	slug: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
	};
}

interface Props {
	sortedPosts: Post[];
}

export default function ArchivePanel({ sortedPosts }: Props) {
	const [filterDimension, setFilterDimension] = useState<
		"none" | "category" | "tag"
	>("none");
	const [activeFilter, setActiveFilter] = useState<string | null>(null);

	const allCategories = useMemo(() => {
		const cats = sortedPosts
			.map((p) => p.data.category)
			.filter((c): c is string => !!c);
		const uncategorized = i18n(I18nKey.uncategorized);
		const hasUncategorized = sortedPosts.some((p) => !p.data.category);
		const unique = Array.from(new Set(cats)).sort();
		return hasUncategorized ? [uncategorized, ...unique] : unique;
	}, [sortedPosts]);

	const allTags = useMemo(() => {
		const tags = sortedPosts.flatMap((p) => p.data.tags || []);
		return Array.from(new Set(tags)).sort();
	}, [sortedPosts]);

	const filteredPosts = useMemo(() => {
		if (filterDimension === "none" || !activeFilter) return sortedPosts;
		if (filterDimension === "category") {
			const uncategorized = i18n(I18nKey.uncategorized);
			if (activeFilter === uncategorized) {
				return sortedPosts.filter((p) => !p.data.category);
			}
			return sortedPosts.filter((p) => p.data.category === activeFilter);
		}
		if (filterDimension === "tag") {
			return sortedPosts.filter((p) => p.data.tags?.includes(activeFilter));
		}
		return sortedPosts;
	}, [sortedPosts, filterDimension, activeFilter]);

	const groupedByYear = useMemo(() => {
		const grouped = filteredPosts.reduce(
			(acc, post) => {
				const year = new Date(post.data.published).getFullYear();
				if (!acc[year]) acc[year] = [];
				acc[year].push(post);
				return acc;
			},
			{} as Record<number, Post[]>,
		);
		return Object.keys(grouped)
			.map((year) => ({
				year: Number.parseInt(year, 10),
				posts: grouped[Number.parseInt(year, 10)].sort(
					(a, b) =>
						new Date(b.data.published).getTime() -
						new Date(a.data.published).getTime(),
				),
			}))
			.sort((a, b) => b.year - a.year);
	}, [filteredPosts]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const tag = params.get("tag");
		const category = params.get("category");
		const uncategorized = params.get("uncategorized");

		if (tag) {
			setFilterDimension("tag");
			setActiveFilter(tag);
		} else if (category) {
			setFilterDimension("category");
			setActiveFilter(category);
		} else if (uncategorized !== null) {
			setFilterDimension("category");
			setActiveFilter(i18n(I18nKey.uncategorized));
		}
	}, []);

	const formatDate = (date: Date) => {
		const d = new Date(date);
		return `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
	};

	return (
		<div className="relative w-full max-w-[840px] bg-lt-bg paper-texture shadow-2xl px-6 md:px-16 py-12 overflow-hidden flex flex-col gap-8 transition-all duration-500">
			<div className="relative z-10 flex flex-col gap-6">
				<div className="flex gap-2 p-1 bg-lt-surface border border-lt-border/30 rounded-sm w-fit">
					<Button
						onClick={() => {
							setFilterDimension("none");
							setActiveFilter(null);
						}}
						variant="toggle"
						active={filterDimension === "none"}
					>
						{i18n(I18nKey.home)}
					</Button>
					<Button
						onClick={() => {
							setFilterDimension("category");
							setActiveFilter(null);
						}}
						variant="toggle"
						active={filterDimension === "category"}
					>
						{i18n(I18nKey.categories)}
					</Button>
					<Button
						onClick={() => {
							setFilterDimension("tag");
							setActiveFilter(null);
						}}
						variant="toggle"
						active={filterDimension === "tag"}
					>
						{i18n(I18nKey.tags)}
					</Button>
				</div>

				<div
					className={`transition-all duration-500 overflow-hidden flex flex-wrap gap-2 ${
						filterDimension !== "none"
							? "max-h-[300px] opacity-100"
							: "max-h-0 opacity-0 pointer-events-none"
					}`}
				>
					{(filterDimension === "category" ? allCategories : allTags).map(
						(item) => (
							<Button
								key={item}
								onClick={() =>
									setActiveFilter(activeFilter === item ? null : item)
								}
								variant="chip"
								active={activeFilter === item}
							>
								{filterDimension === "tag" ? `# ${item}` : item}
							</Button>
						),
					)}
				</div>
			</div>

			<div className="relative z-10 flex flex-col">
				{groupedByYear.map((group, idx) => (
					<div key={group.year} className="mb-12 last:mb-0">
						<div className="flex items-center gap-4 mb-8">
							<span
								className={`font-display text-4xl md:text-5xl text-lt-ink ${idx > 0 ? "opacity-40" : ""}`}
							>
								{group.year}
							</span>
							<div className="flex-1 h-[1px] bg-lt-border" />
							<span className="font-mono text-[10px] text-lt-ghost uppercase tracking-widest">
								{idx === 0
									? "Cycle_Alpha"
									: idx === 1
										? "Cycle_Beta"
										: "Cycle_Gamma"}
							</span>
						</div>

						<div className="space-y-0">
							{group.posts.map((post) => (
								<a
									key={post.slug}
									href={getPostUrlBySlug(post.slug)}
									className="group flex items-center justify-between py-4 border-b border-lt-border/40 hover:bg-lt-surface -mx-4 px-4 transition-all duration-150"
								>
									<div className="flex items-center gap-6 flex-1 min-w-0">
										<span className="font-mono text-[11px] text-lt-ghost font-bold whitespace-nowrap">
											{formatDate(post.data.published)}
										</span>
										<h3 className="font-cn text-[15px] text-lt-ink font-bold truncate group-hover:text-lt-accent transition-colors">
											{post.data.title}
										</h3>
									</div>
									<span className="text-lt-ghost font-display text-xl group-hover:text-lt-ink transition-colors ml-4 shrink-0">
										→
									</span>
								</a>
							))}
						</div>
					</div>
				))}

				{groupedByYear.length === 0 && (
					<div className="py-12 text-center">
						<p className="font-mono text-[11px] text-lt-ghost italic">
							No further entries in this sector.
						</p>
					</div>
				)}
			</div>

			<div className="relative z-10 mt-20 pt-8 border-t border-lt-ink flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
				<div className="flex items-center gap-4">
					<div className="scale-90 origin-left">
						<RpStamp />
					</div>
					<div className="text-[10px] font-mono text-lt-ghost leading-none uppercase tracking-tighter text-center md:text-left">
						Rhine Lab Pioneer Division
						<br />
						Index_Complete
						{(new Date().getMonth() + 1).toString().padStart(2, "0")}
					</div>
				</div>
				<span className="text-[10px] font-mono text-lt-ghost uppercase tracking-widest italic" />
			</div>

			<StripeFooter />
		</div>
	);
}
