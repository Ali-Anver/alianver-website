import { visit } from "unist-util-visit";

export function remarkMermaid() {
	return (tree) => {
		visit(tree, "code", (node, index, parent) => {
			if (node.lang === "mermaid") {
				const html = {
					type: "html",
					value: `<pre class="mermaid-src" data-processed="false">${node.value}</pre>`,
				};
				parent.children.splice(index, 1, html);
			}
		});
	};
}
