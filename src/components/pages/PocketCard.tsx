import { Icon } from "@iconify/react";
import { StripeFooter } from "../ui/StripeFooter";
import { siteConfig } from "../../config";

interface PocketCardProps {
	name: string;
	slogan: string;
	avatarSrc?: string;
	links?: { label: string; href: string }[];
	className?: string;
}

export const PocketCard = ({
	name,
	slogan,
	avatarSrc,
	links = [],
	className = "",
}: PocketCardProps) => {
	return (
		<div
			className={`relative w-full max-w-[840px] bg-lt-bg paper-texture shadow-2xl px-6 md:px-16 py-8 overflow-hidden border-t border-lt-border/20 ${className}`}
		>
			<div className="absolute -top-10 -right-20 pointer-events-none select-none z-0">
				<span className="font-display text-[150px] md:text-[240px] text-lt-ink opacity-[0.03] leading-none uppercase whitespace-nowrap">
					Pioneer
				</span>
			</div>

			<div className="relative z-10 flex flex-row gap-8 md:gap-12">
				<div className="relative w-20 h-24 md:w-24 md:h-28 bg-lt-surface border border-lt-border/50 shrink-0 overflow-hidden shadow-inner group -translate-y-1">
					<div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-lt-ink transition-all group-hover:scale-110" />
					<div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-lt-ink transition-all group-hover:scale-110" />
					{avatarSrc ? (
						<img
							src={avatarSrc}
							alt="Avatar"
							className="w-full h-full object-cover transition-all duration-700 block no-styling"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
						</div>
					)}
				</div>

				<div className="flex-1 flex flex-col md:flex-row justify-between gap-4 min-w-0 pt-0">
					<div className="min-w-0 flex flex-col items-start">
						<div className="flex items-start gap-3 mb-1">
							<h1 className="font-display text-3xl md:text-4xl text-lt-ink uppercase tracking-tighter leading-none m-0 p-0">
								{name}
							</h1>
							<span className="font-mono text-[9px] font-bold text-lt-accent uppercase tracking-widest border border-lt-accent/30 px-1">
								Auth_05
							</span>
						</div>
						<p className="font-cn text-[14px] text-lt-ink font-black truncate">
							{slogan}
						</p>

					</div>

					<div className="flex gap-1.5 shrink-0 flex-wrap">
						<a
							href={siteConfig.url}
							target="_blank"
							rel="noopener noreferrer"
							className="w-8 h-8 flex items-center justify-center border border-lt-accent text-lt-accent hover:bg-lt-accent hover:text-lt-bg transition-all active:scale-95 bg-lt-accent/5"
							title={siteConfig.url}
						>
							<Icon icon="material-symbols:home-outline" className="w-4 h-4" />
						</a>
						<a
							href="/subscribe/"
							className="h-8 flex items-center gap-1 px-2 border border-lt-ink text-lt-ink bg-lt-ink/5 hover:bg-lt-ink hover:text-lt-bg transition-all active:scale-95 text-[10px] font-mono font-bold"
							title="Follow via RSS"
						>
							<Icon icon="material-symbols:rss-feed" className="w-3.5 h-3.5" />
							Follow
						</a>
						{links.map((link) => (
							<a
								key={link.label}
								href={link.href}
								className="w-8 h-8 flex items-center justify-center text-[10px] font-mono font-bold border border-lt-ink text-lt-ink hover:bg-lt-ink hover:text-lt-bg transition-all active:scale-95"
							>
								{link.label}
							</a>
						))}
					</div>
				</div>
			</div>

			<StripeFooter />
		</div>
	);
};
