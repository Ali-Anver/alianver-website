import { visit } from "unist-util-visit";
export function rehypeOptimizeImages() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName === "img") {
				if (!node.properties.loading) {
					node.properties.loading = "lazy";
				}
				if (!node.properties.decoding) {
					node.properties.decoding = "async";
				}
				if (!node.properties.alt || node.properties.alt.trim() === "") {
					const src = node.properties.src;
					if (typeof src === "string") {
						const parts = src.split("/");
						const filename = parts[parts.length - 1];
						if (filename) {
							node.properties.alt = filename.split(".")[0];
						} else {
							node.properties.alt = "Blog Image";
						}
					}
				}
				if (!node.properties.className) {
					node.properties.className = [];
				}
				if (Array.isArray(node.properties.className)) {
					node.properties.className.push("content-img");
				}
			}
		});
	};
}
