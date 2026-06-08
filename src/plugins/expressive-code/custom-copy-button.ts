import type { ExpressiveCodePlugin } from "@expressive-code/core";
import { h } from "hastscript";

export function pluginCustomCopyButton(): ExpressiveCodePlugin {
	return {
		name: "Rhine Lab Copy Button",
		baseStyles: `
            .rhine-copy-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 0.8rem;
                background: #D4621A;
                border: none;
                cursor: pointer;
                transition: all 0.2s ease;
                height: 1.4rem;
                min-width: 50px;
                box-sizing: border-box;
                border-radius: 0;
            }
            .rhine-copy-btn:hover {
                background: #F07522;
                box-shadow: 0 0 10px rgba(212, 98, 26, 0.4);
            }
            .rhine-copy-btn:active {
                transform: scale(0.95);
            }
            .rhine-copy-text {
                font-family: var(--font-mono);
                font-size: 10px;
                font-weight: 900;
                color: #EDE6D6;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
        `,
		hooks: {
			postprocessRenderedBlock: ({ renderData }) => {
				const copyButton = h(
					"button",
					{
						class: "rhine-copy-btn copy-btn",
						"aria-label": "Copy",
						style: "position: absolute; top: 0.6rem; right: 1rem; z-index: 30;",
					},
					[h("span", { class: "rhine-copy-text" }, "COPY")],
				);

				renderData.blockAst.children.push(copyButton);
			},
		},
	};
}
