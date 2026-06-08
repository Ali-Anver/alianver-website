import { profileConfig, siteConfig } from "../../config";
import Button from "../ui/Button";
import I18nKey from "../../i18n/i18nKey";
import { i18n } from "../../i18n/translation";

export const LinkManifest = () => {
	const siteInfo = {
		name: siteConfig.title,
		url: siteConfig.url + "/",
		avatar: profileConfig.avatar || `${siteConfig.url}/images/favicon.webp`,
		description: profileConfig.bio || siteConfig.subtitle,
	};

	const copyMd = () => {
		const md = `- Name: ${siteInfo.name}\n- URL: ${siteInfo.url}\n- Icon: ${siteInfo.avatar}\n- Desc: ${siteInfo.description}`;
		navigator.clipboard.writeText(md);
	};

	return (
		<div className="relative w-full max-w-[840px] bg-lt-bg paper-texture shadow-2xl p-8 md:p-16 overflow-hidden">
			<div className="absolute -top-10 -right-20 pointer-events-none select-none z-0">
				<span className="font-display text-[150px] md:text-[320px] text-lt-ink opacity-[0.03] leading-none uppercase">
					Protocol
				</span>
			</div>

			<div className="relative z-10 flex justify-between items-start mb-16 border-b border-lt-border pb-4">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<div className="w-[3px] h-[10px] bg-lt-accent" />
						<span className="text-[11px] font-mono tracking-[0.2em] font-semibold text-lt-ink uppercase">
							Chapter_05
						</span>
					</div>
					<div className="text-[11px] font-mono text-lt-ghost uppercase tracking-widest">
						Protocol_Ref: RL-SYNC-P12
					</div>
				</div>
				<div className="text-right">
					<span className="text-[9px] font-mono text-lt-muted font-bold uppercase tracking-widest italic">
						Manual_Input
					</span>
				</div>
			</div>

			<div className="relative z-10 flex flex-col items-center">
				<div className="relative mb-12">
					<div className="relative w-32 h-32 bg-lt-surface border border-lt-border p-1">
						<div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-lt-ink" />
						<div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-lt-ink" />
						<div className="w-full h-full bg-neutral-200 overflow-hidden flex items-center justify-center">
							<img
								src={siteInfo.avatar}
								alt="sampling"
								className="w-full h-full object-contain"
							/>
						</div>
					</div>
					<span className="absolute -right-12 top-0 rotate-90 text-[8px] font-mono text-lt-ghost tracking-[0.4em] uppercase">
						Visual_Sample
					</span>
				</div>

				<div className="w-full space-y-6 mb-12">
					<h2 className="font-display text-2xl text-lt-ink uppercase tracking-tight border-b border-lt-ink pb-2 mb-8">
						{i18n(I18nKey.exchangeLinks)}
					</h2>

					<div className="space-y-4">
						{[
							{ label: "Site_Name", val: siteInfo.name },
							{ label: "Source_URL", val: siteInfo.url },
							{ label: "Manifesto", val: siteInfo.description },
							{ label: "Visual_URI", val: siteInfo.avatar },
						].map((item) => (
							<div
								key={item.label}
								className="flex flex-col md:flex-row md:items-end justify-between gap-1 group"
							>
								<span className="text-[11px] font-mono text-lt-ghost uppercase font-bold shrink-0">
									{item.label}
								</span>
								<div className="hidden md:block flex-1 mx-4 border-b border-lt-border border-dashed mb-1.5 opacity-50" />
								<span className="font-cn text-[15px] font-black text-lt-ink">
									{item.val}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="w-full flex flex-col md:flex-row gap-4 pt-8 border-t border-lt-border">
					<Button
						onClick={copyMd}
						variant="solid"
						className="flex-1 py-4 rounded-sm gap-3"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
						>
							<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
							<rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
						</svg>
						Copy_Markdown (RAW)
					</Button>
					<div className="flex-1 border border-lt-border px-4 py-4 flex items-center justify-center text-center">
						<span className="text-[10px] font-mono text-lt-muted uppercase tracking-widest leading-relaxed">
							Request Queue: Please leave a comment for synchronization.
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
