import { useEffect, useState } from "react";
import I18nKey from "../../i18n/i18nKey";
import { i18n } from "../../i18n/translation";
import { siteConfig } from "../../config";

const PREVIEW_LINES = 120;

function highlightXml(xml: string): string {
	const escaped = xml
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
	return escaped
		.replace(
			/(&lt;\/?)([\w:-]+)([\s\S]*?)(\/?&gt;)/g,
			(_, open: string, tag: string, attrs: string, close: string) => {
				const hlAttrs = attrs.replace(
					/([\w:-]+)=(&quot;(?:[^&]|&(?!quot;))*.?&quot;)/g,
					'<span class="xml-attr">$1</span>=<span class="xml-val">$2</span>',
				);
				return `${open}<span class="xml-tag">${tag}</span>${hlAttrs}${close}`;
			},
		)
		.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="xml-comment">$1</span>');
}

export default function SubscribePage() {
	const [xml, setXml] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState(false);
	const [totalLines, setTotalLines] = useState(0);
	const feedUrl = `${siteConfig.url}/atom.xml`;

	useEffect(() => {
		fetch("/atom.xml")
			.then((r) => r.text())
			.then((text) => {
				setXml(text);
				setTotalLines(text.split("\n").length);
				setLoading(false);
			})
			.catch(() => {
				setXml("Failed to load feed.");
				setLoading(false);
			});
	}, []);

	const handleCopy = () => {
		navigator.clipboard.writeText(feedUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const lines = xml ? xml.split("\n").slice(0, PREVIEW_LINES) : [];

	return (
		<div className="w-full max-w-[840px] mx-auto px-1">
			<div className="bg-lt-bg paper-texture mb-8 p-5 md:p-8 space-y-5 shadow-md border border-lt-border/40">
				<div className="flex items-center gap-3">
					<span className="text-[10px] md:text-[11px] font-mono font-semibold text-lt-muted uppercase tracking-[0.2em]">
						Subscribe
					</span>
					<div className="flex-1 h-[1px] bg-lt-border" />
				</div>

				<h1 className="font-display text-2xl md:text-4xl text-lt-ink uppercase tracking-tight leading-none">
					{i18n(I18nKey.subscribe)}
				</h1>

				<p className="font-cn text-[13px] md:text-sm text-lt-muted leading-relaxed max-w-xl">
					{i18n(I18nKey.subscribeDesc)}
				</p>

				<div className="flex items-stretch gap-2 md:gap-3">
					<div className="flex-1 px-3 md:px-4 py-[9px] md:py-[11px] bg-lt-surface border border-lt-border font-mono text-[11px] md:text-[12px] text-lt-ink truncate flex items-center">
						{feedUrl}
					</div>
					<button
						type="button"
						onClick={handleCopy}
						className="shrink-0 px-4 md:px-5 border border-lt-ink font-mono text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-lt-ink hover:bg-lt-ink hover:text-lt-bg transition-colors duration-150"
					>
						{copied ? i18n(I18nKey.copied) : "Copy"}
					</button>
				</div>

				<div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] md:text-[10px] font-mono text-lt-ghost uppercase tracking-widest">
					<span>● XML / Atom 1.0</span>
					<span>● {loading ? "—" : `${totalLines} lines`}</span>
					<span>● Full Content</span>
				</div>
			</div>

			<div className="relative bg-lt-surface border border-lt-border shadow-2xl">
				<div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-lt-ink" />
				<div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-lt-ink" />
				<div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-lt-ink" />
				<div className="h-10 border-b border-lt-border bg-lt-bg flex items-center justify-between px-4">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-lt-accent" />
						<span className="font-mono text-[11px] text-lt-ink font-bold tracking-wide">
							atom.xml
						</span>
					</div>
					<span className="font-mono text-[9px] text-lt-ghost uppercase tracking-widest">
						{loading ? "loading..." : `${totalLines} lines`}
					</span>
				</div>

				<div className="overflow-auto h-[35vh] md:h-[40vh] min-h-[180px] md:min-h-[200px]">
					{loading ? (
						<div className="flex items-center justify-center h-[180px] md:h-[260px] text-lt-ghost font-mono text-[11px] tracking-widest animate-pulse">
							Loading feed...
						</div>
					) : (
						<div className="flex">
							<div className="w-12 shrink-0 bg-lt-border/10 border-r border-lt-border select-none text-right pr-2 text-[10px] leading-[20px] text-lt-ghost/40 font-mono">
								{lines.map((_, i) => (
									<div key={i}>{i + 1}</div>
								))}
							</div>
							<div className="flex-1 min-w-0">
								{lines.map((line, i) => (
									<div
										key={i}
										className="text-[11px] leading-[20px] text-lt-ink font-mono whitespace-pre-wrap break-all"
										dangerouslySetInnerHTML={{
											__html: highlightXml(line) || "<br/>",
										}}
									/>
								))}
							</div>
						</div>
					)}
				</div>

				{!loading && totalLines > PREVIEW_LINES && (
					<div className="px-4 py-2.5 border-t border-lt-border bg-lt-bg/80 text-[10px] font-mono text-lt-ghost text-center">
						Preview {PREVIEW_LINES} lines / {totalLines} total ·
						<a
							href={feedUrl}
							target="_blank"
							className="text-lt-accent hover:underline ml-1"
						>
							View Full File →
						</a>
					</div>
				)}

				<div className="h-8 border-t border-lt-border bg-lt-bg flex items-center px-4">
					<div className="flex items-center gap-3 text-[9px] font-mono text-lt-ghost uppercase tracking-widest">
						<span>● Feed</span>
						<span>● UTF-8</span>
						<span>● Read Only</span>
					</div>
				</div>
			</div>

			<div className="mt-4 md:mt-5 text-[9px] md:text-[10px] font-mono text-lt-ghost leading-relaxed tracking-wide px-1">
				<p>
					Copy the URL into your RSS reader. Supports Follow, Feedly, Inoreader, and more.
				</p>
			</div>

			<style>{`
				.xml-tag { color: #D4621A; }
				.xml-attr { color: #4B8D9E; }
				.xml-val { color: #C29145; }
				.xml-comment { color: #A89F90; font-style: italic; }
			`}</style>
		</div>
	);
}
