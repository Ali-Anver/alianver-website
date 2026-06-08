import { StripeFooter } from "../ui/StripeFooter";
import { Tag } from "../ui/Tag";

interface BlogCardProps {
	title: string;
	summary: string;
	category: "Tech" | "Log" | "Meta";
	date: string;
	index: number;
	href: string;
}

export const BlogCard = ({
	title,
	summary,
	category,
	date,
	index,
	href,
}: BlogCardProps) => {
	const getTagVariant = (cat: string) => {
		switch (cat) {
			case "Tech":
				return "dark";
			case "Log":
			case "Meta":
				return "outline";
			default:
				return "default";
		}
	};

	const formattedIndex = index.toString().padStart(2, "0");

	return (
		<a
			href={href}
			className="group relative w-full max-w-[840px] bg-lt-bg paper-texture shadow-2xl px-8 sm:px-16 py-10 overflow-hidden block hover:bg-lt-surface transition-colors duration-150"
		>
			<div className="relative z-10">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center gap-2">
						<Tag variant={getTagVariant(category)}>{category}</Tag>
					</div>
					<span className="font-mono text-[11px] text-lt-ghost uppercase tracking-widest">
						{`RPT_${formattedIndex}`} · {date}
					</span>
				</div>

				<div className="flex justify-between items-start gap-8">
					<div className="flex-1 min-w-0">
						<h2 className="font-display text-[24px] sm:text-[28px] leading-[1.1] tracking-tight text-lt-ink uppercase mb-4 group-hover:text-lt-accent transition-colors font-black">
							{title}
						</h2>
						<p className="font-cn text-[14px] text-lt-muted leading-[1.75] line-clamp-2 text-justify">
							{summary}
						</p>
					</div>
					<span className="font-display text-3xl text-lt-ghost group-hover:text-lt-accent transition-colors flex-shrink-0 mt-1 font-black">
						→
					</span>
				</div>
			</div>

			<StripeFooter />
		</a>
	);
};
