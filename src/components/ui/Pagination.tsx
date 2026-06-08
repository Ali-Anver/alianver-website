import { RpStamp } from "./RpStamp";
import { StripeFooter } from "./StripeFooter";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	prevHref?: string;
	nextHref?: string;
	brandLabel?: string;
	footerLabel?: string;
}

export const Pagination = ({
	currentPage,
	totalPages,
	prevHref,
	nextHref,
	brandLabel = "Rhine Lab Pioneer Division",
	footerLabel = "Field Report Archive",
}: PaginationProps) => {
	return (
		<div className="relative w-full max-w-[840px] bg-lt-bg paper-texture shadow-2xl px-8 sm:px-16 py-10 overflow-hidden">
			<div className="relative z-10 flex justify-between items-center">
				{prevHref ? (
					<a
						href={prevHref}
						className="font-mono text-[11px] font-bold text-lt-ink uppercase tracking-widest hover:text-lt-accent transition-colors"
					>
						← Prev
					</a>
				) : (
					<span className="font-mono text-[11px] font-bold text-lt-ghost uppercase tracking-widest cursor-not-allowed">
						← Prev
					</span>
				)}

				<div className="flex flex-col items-center gap-3">
					<span className="font-mono text-[11px] text-lt-muted font-bold tracking-widest uppercase">
						Page {currentPage.toString().padStart(2, "0")} /{" "}
						{totalPages.toString().padStart(2, "0")}
					</span>
					<div className="flex gap-1.5">
						{Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
							<div
								key={i}
								className={`w-1.5 h-1.5 ${i + 1 === currentPage ? "bg-lt-accent" : "border border-lt-border"}`}
							/>
						))}
					</div>
				</div>

				{nextHref ? (
					<a
						href={nextHref}
						className="font-mono text-[11px] font-bold text-lt-ink uppercase tracking-widest hover:text-lt-accent transition-colors"
					>
						Next →
					</a>
				) : (
					<span className="font-mono text-[11px] font-bold text-lt-ghost uppercase tracking-widest cursor-not-allowed">
						Next →
					</span>
				)}
			</div>

			<div className="relative z-10 mt-10 pt-8 border-t border-lt-ink flex justify-between items-end">
				<div className="flex items-center gap-4">
					<RpStamp />
					<div className="font-mono text-[11px] text-lt-ghost leading-none uppercase tracking-tighter">
						{brandLabel}
						<br />
						{footerLabel}
					</div>
				</div>
				<span className="font-mono text-[11px] text-lt-ghost uppercase tracking-widest" />
			</div>

			<StripeFooter />
		</div>
	);
};
