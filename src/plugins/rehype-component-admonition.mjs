import { h } from "hastscript";

export function AdmonitionComponent(properties, children, type) {
	if (!Array.isArray(children) || children.length === 0)
		return h(
			"div",
			{ class: "hidden" },
			'Invalid admonition directive. (Admonition directives must be of block type ":::note{name="name"} <content> :::")',
		);

	let label = null;

	const rest = [...children];
	if (properties?.["has-directive-label"]) {
		label = rest[0];

		rest.splice(0, 1);
		label.tagName = "div";
	} else if (
		rest.length > 0 &&
		rest[0].tagName &&
		rest[0].tagName.match(/^h[1-6]$/)
	) {
		label = rest[0];

		rest.splice(0, 1);
	}

	const finalChildren = rest;

	return h("blockquote", { class: `admonition bdm-${type}` }, [
		h("span", { class: "bdm-title" }, label ? label : type.toUpperCase()),
		...finalChildren,
	]);
}
