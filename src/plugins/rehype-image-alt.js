import { visit } from "unist-util-visit";
export function rehypeImageAlt() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName === "img") {
				const { src, alt } = node.properties;
				if (!alt || alt.trim() === "") {
					if (typeof src === "string") {
						const parts = src.split("/");
						const filename = parts[parts.length - 1];
						if (filename) {
							const nameWithoutExt = filename.split(".")[0];
							node.properties.alt = nameWithoutExt;
						} else {
							node.properties.alt = "Blog Image";
						}
					}
				}
			}
		});
	};
}
