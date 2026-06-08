import { useMemo } from "react";
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
	sortOrder?: "asc" | "desc";
}

export default function SpecPanel({ sortedPosts, sortOrder = "desc" }: Props) {
	const groupedByYear = useMemo(() => {
		const grouped = sortedPosts.reduce(
			(acc, post) => {
				const year = new Date(post.data.published).getFullYear();
				if (!acc[year]) acc[year] = [];
				acc[year].push(post);
				return acc;
			},
			{} as Record<number, Post[]>,
		);

		const isAsc = sortOrder === "asc";

		return Object.keys(grouped)
			.map((year) => ({
				year: Number.parseInt(year, 10),
				posts: grouped[Number.parseInt(year, 10)].sort((a, b) =>
					isAsc
						? new Date(a.data.published).getTime() -
							new Date(b.data.published).getTime()
						: new Date(b.data.published).getTime() -
							new Date(a.data.published).getTime(),
				),
			}))
			.sort((a, b) => (isAsc ? a.year - b.year : b.year - a.year));
	}, [sortedPosts, sortOrder]);

	const formatDate = (date: Date) => {
		const d = new Date(date);
		return `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
	};

	return (
		<div className="relative w-full max-w-[840px] bg-lt-bg paper-texture shadow-2xl px-6 md:px-16 py-12 overflow-hidden flex flex-col gap-8 transition-all duration-500">
			<div className="relative z-10 flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<div className="w-1.5 h-3 bg-lt-accent" />
					<span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-lt-ink">
						Subject_Dossier
					</span>
				</div>
				<div className="h-[1px] w-full bg-lt-ink/10" />
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
									? "Sector_Lead"
									: idx === 1
										? "Sector_Secondary"
										: "Sector_Tertiary"}
							</span>
						</div>

						<div className="space-y-0">
							{group.posts.map((post) => (
								<Button
									as="a"
									key={post.slug}
									href={getPostUrlBySlug(post.slug)}
									className="group relative z-20 flex items-center justify-between py-4 border-b border-lt-border/40 hover:bg-lt-surface px-4 transition-all duration-150 cursor-pointer block"
								>
									<div className="flex items-center gap-6 flex-1 min-w-0 pointer-events-none">
										<span className="font-mono text-[11px] text-lt-ghost font-bold whitespace-nowrap">
											{formatDate(post.data.published)}
										</span>
										<h3 className="font-cn text-[15px] text-lt-ink font-bold truncate group-hover:text-lt-accent transition-colors">
											{post.data.title}
										</h3>
									</div>
									<span className="text-lt-ghost font-display text-xl group-hover:text-lt-ink transition-colors ml-4 shrink-0 pointer-events-none">
										→
									</span>
								</Button>
							))}
						</div>
					</div>
				))}

				{groupedByYear.length === 0 && (
					<div className="py-12 text-center">
						<p className="font-mono text-[11px] text-lt-ghost italic">
							No records associated with this dossier.
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
						Rhine Lab Spec Division
						<br />
						Dossier_Verified
						{(new Date().getMonth() + 1).toString().padStart(2, "0")}
					</div>
				</div>
				<span className="text-[10px] font-mono text-lt-ghost uppercase tracking-widest italic" />
			</div>

			<StripeFooter />
		</div>
	);
}
