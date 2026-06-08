import type { ExpressiveCodePlugin } from "@expressive-code/core";
import { h } from "hastscript";

export function pluginLanguageBadge(): ExpressiveCodePlugin {
	return {
		name: "Rhine Lab Language Badge",
		baseStyles: `
            .rhine-badge {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.5rem 1rem;
                background: #24221E;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            .rhine-dots {
                display: flex;
                gap: 0.25rem;
            }
            .rhine-dot {
                width: 6px;
                height: 6px;
            }
            .rhine-dot-red { background: #A33332; opacity: 0.8; }
            .rhine-dot-gold { background: #C29145; opacity: 0.8; }
            .rhine-dot-teal { background: #4B8D9E; opacity: 0.8; }
            
            .rhine-protocol {
                font-family: var(--font-mono);
                font-size: 10px;
                font-weight: 900;
                letter-spacing: 0.2em;
                color: rgba(237, 230, 214, 0.8);
                text-transform: uppercase;
            }
            .rhine-lang {
                color: #D4621A;
            }
        `,
		hooks: {
			postprocessRenderedBlock: ({ renderData, codeBlock }) => {
				const lang = codeBlock.language.toUpperCase() || "PLAINTEXT";

				const badge = h("div", { class: "rhine-badge" }, [
					h("div", { class: "rhine-dots" }, [
						h("div", { class: "rhine-dot rhine-dot-red" }),
						h("div", { class: "rhine-dot rhine-dot-gold" }),
						h("div", { class: "rhine-dot rhine-dot-teal" }),
					]),
					h("div", {
						style: "h-3 w-[1px] bg-white/10 mx-1",
					}),
					h("span", { class: "rhine-protocol" }, [
						"PRTCL // ",
						h("span", { class: "rhine-lang" }, lang),
					]),
				]);

				renderData.blockAst.children.unshift(badge);
			},
		},
	};
}
