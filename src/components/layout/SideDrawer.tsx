import { useStore } from "@nanostores/react";
import { $isNavMenuOpen, setIsNavMenuOpen } from "../../store/app";
import Button from "../ui/Button";
import { RpStamp } from "../ui/RpStamp";
import I18nKey from "../../i18n/i18nKey";
import { i18n } from "../../i18n/translation";

interface NavItem {
	label: string;
	href: string;
}

const hrefLabelMap: Record<string, I18nKey> = {
	"/": I18nKey.home,
	"/archive/": I18nKey.archive,
	"/seri/": I18nKey.series,
	"/links/": I18nKey.links,
	"/about/": I18nKey.about,
};

interface SideDrawerProps {
	items: NavItem[];
	activePath: string;
	siteTitle?: string;
	authorName?: string;
	authorBio?: string;
	avatarSrc?: string;
}

export const SideDrawer = ({
	items,
	activePath,
	siteTitle = "",
	authorName = "",
	authorBio = "",
	avatarSrc = "",
}: SideDrawerProps) => {
	const isOpen = useStore($isNavMenuOpen);

	return (
		<>
			<nav
				className={
					"fixed top-0 left-[300px] w-screen h-14 flex items-center justify-between px-6 z-40 bg-lt-bg/80 border-b border-lt-border lg:hidden"
				}
			>
				<Button
					onClick={() => setIsNavMenuOpen(true)}
					variant="unstyled"
					className="group flex flex-col gap-1.5 p-2"
				>
					<svg
						className="w-6 h-6 text-lt-ink group-hover:text-lt-accent transition-colors"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</Button>

				<div className="flex items-center gap-3">
					<div className="hidden sm:block h-[1px] w-6 bg-lt-border/50" />
					<span className="font-display text-[11px] md:text-[13px] tracking-tight uppercase text-lt-ink opacity-70 whitespace-nowrap">
						{siteTitle}
					</span>
				</div>
			</nav>

			<div
				className={`fixed inset-0 bg-lt-ink/20 z-[9999] transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				onClick={() => setIsNavMenuOpen(false)}
			/>

			<aside
				className={
					"sticky top-0 left-0 h-screen w-[300px] bg-lt-ink text-lt-bg z-[10000] paper-texture flex flex-col flex-shrink-0 transition-none"
				}
			>
				<div className="py-8 border-b border-white/5">
					<div className="flex items-start gap-4 px-4">
						<div className="w-12 h-12 bg-lt-muted/20 border border-white/10 flex-shrink-0 flex items-center justify-center">
							<img
								src={avatarSrc}
								alt={siteTitle || "Avatar"}
								className="w-full h-full object-cover block no-styling"
							/>
						</div>
						<div className="min-w-0">
							<h2 className="font-display text-xl tracking-tight uppercase leading-none mb-1 text-white">
								{authorName || siteTitle}
							</h2>
							<span className="block font-mono text-[9px] text-lt-ghost tracking-[0.2em] uppercase">
								Auth_Lv
							</span>
							<a
								href="/subscribe/"
								className="mt-2 flex items-center gap-1.5 px-2 py-1 border border-white/10 text-lt-ghost hover:text-lt-accent hover:border-lt-accent/50 transition-all text-[9px] font-mono uppercase tracking-widest"
								title="Follow via RSS"
							>
								<svg
									className="w-3 h-3"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M4 11a9 9 0 0 1 9 9" />
									<path d="M4 4a16 16 0 0 1 16 16" />
									<circle cx="5" cy="19" r="1" />
								</svg>
								Follow
							</a>
						</div>
					</div>
					<div className="px-4 mt-4">
						<p className="font-cn text-[12px] text-lt-ghost leading-relaxed">
							{authorBio || "Ad Astra Per Aspera"}
							<br />
							<span className="font-mono text-[9px] opacity-40 uppercase">
								Subject_id: PTL-9348
							</span>
						</p>
					</div>
				</div>

				<nav className="flex-1 py-8 px-4 overflow-y-auto no-scrollbar">
					<div className="flex flex-col gap-1">
						{items.map((item, idx) => (
							<a
								key={item.label}
								href={item.href}
								onClick={() => setIsNavMenuOpen(false)}
								className="group flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-all duration-150"
							>
								{" "}
								<div className="flex items-center gap-5">
									<span
										className={`font-mono text-[11px] ${activePath === item.href ? "text-lt-accent" : "text-lt-ghost"}`}
									>
										{(idx + 1).toString().padStart(2, "0")}
									</span>
									<span
										className={`font-display text-xl uppercase tracking-widest ${activePath === item.href ? "text-white" : "text-white/60"} group-hover:text-white`}
									>
										{hrefLabelMap[item.href] ? i18n(hrefLabelMap[item.href]) : item.label}
									</span>
								</div>
								<span
									className={`text-[9px] font-mono ${activePath === item.href ? "text-lt-accent" : "text-white/5"} uppercase`}
								>
									● {activePath === item.href ? "Active" : "Idle"}
								</span>
							</a>
						))}
					</div>
				</nav>

				<div className="p-8 border-t border-white/5">
					<div className="flex items-center gap-4 mb-6">
						<div className="scale-90">
							<RpStamp />
						</div>
						<div className="flex flex-col">
							<span className="text-[9px] font-mono text-lt-ghost uppercase tracking-tighter">
								Rhine_Lab_Pioneer
							</span>
							<span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
								Protocol_V.4.21
							</span>
						</div>
					</div>
					<div className="h-[2px] w-full flex">
						<div className="bg-rl-teal w-1/3" />
						<div className="bg-rl-gold w-1/3" />
						<div className="bg-rl-red w-1/3" />
					</div>
				</div>
			</aside>
		</>
	);
};
