import Button from "../ui/Button";
import { StripeFooter } from "../ui/StripeFooter";

interface CopyrightCardProps {
	title: string;
	published: Date;
	tags: string[];
}

export const CopyrightCard = ({ title, published }: CopyrightCardProps) => {
	const dateStr = published
		.toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		})
		.replace(/\//g, ".");

	const copyInfo = () => {
		const text = `${title}\n${dateStr}\nCC BY-NC-SA 4.0`;
		navigator.clipboard.writeText(text).then(() => alert("Copied"));
	};

	return (
		<div className="relative w-full max-w-[840px] bg-lt-bg paper-texture shadow-2xl px-6 md:px-16 py-10 md:py-12 overflow-hidden border-b border-lt-border/20">
			<div className="absolute -top-10 -right-20 pointer-events-none select-none z-0">
				<span className="font-display text-[150px] md:text-[240px] text-lt-ink opacity-[0.03] leading-none uppercase whitespace-nowrap">
					Classified
				</span>
			</div>

			<div className="relative z-10 flex justify-between items-start mb-10 md:mb-12">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<div className="w-[3px] h-[10px] bg-lt-accent" />
						<span className="text-[11px] font-mono tracking-[0.2em] font-semibold text-lt-ink uppercase">
							Chapter_06
						</span>
					</div>
					<div className="text-[11px] font-mono text-lt-ghost uppercase tracking-widest leading-none">
						Protocol_Ref: CC-BY-NC-SA-4.0
					</div>
				</div>
			</div>

			<div className="relative z-10 mb-10">
				<h3 className="font-display text-[18px] md:text-[20px] text-lt-ink uppercase tracking-tight mb-4 leading-tight">
					{title}
				</h3>
				<div className="space-y-3">
					<p className="font-mono text-[11px] text-lt-muted uppercase tracking-widest">
						Author: <span className="text-lt-ink font-bold">CHONGXI</span>
						Released: {dateStr}
					</p>
					<p className="font-cn text-[14px] text-lt-muted leading-relaxed max-w-2xl">
						Licensed under{" "}
						<span className="text-lt-ink font-bold">
							CC BY-NC-SA 4.0
						</span>
					</p>
				</div>
			</div>

			<Button
				onClick={copyInfo}
				variant="outline"
				className="relative z-10 w-full py-4 rounded-sm"
			>
				Execute_Command
			</Button>

			<StripeFooter />
		</div>
	);
};
