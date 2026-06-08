import { visit } from "unist-util-visit";
export function rehypeExternalLinks() {
	const siteDomains = ["your-site.com"];
	const isExternalUrl = (href) => {
		try {
			const url = new URL(href);
			return !siteDomains.some((domain) => {
				const hostname = url.hostname;
				return hostname === domain || hostname.endsWith(`.${domain}`);
			});
		} catch {
			return false;
		}
	};
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName === "a" && node.properties && node.properties.href) {
				const href = node.properties.href;
				if (isExternalUrl(href)) {
					node.properties.rel = "noopener noreferrer";
					node.properties.target = "_blank";
					node.properties.href = `/go/?url=${encodeURIComponent(href)}`;
				}
			}
		});
	};
}
