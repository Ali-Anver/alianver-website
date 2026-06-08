import { visit } from "unist-util-visit";

const CJK =
	"\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff";
const ANY_CJK = new RegExp(`[${CJK}]`);
const CONVERT_LIST = [
	{ reg: new RegExp(`([${CJK}])([a-zA-Z0-9])`, "g"), replace: "$1\u200a$2" },
	{ reg: new RegExp(`([a-zA-Z0-9])([${CJK}])`, "g"), replace: "$1\u200a$2" },
	{ reg: new RegExp(`([${CJK}])([$@%^&-*+/=<>])`, "g"), replace: "$1\u200a$2" },
	{ reg: new RegExp(`([$@%^&-*+/=<>])([${CJK}])`, "g"), replace: "$1\u200a$2" },
];
export function rehypePangu() {
	return (tree) => {
		visit(tree, "text", (node) => {
			let value = node.value;
			if (ANY_CJK.test(value)) {
				for (const item of CONVERT_LIST) {
					value = value.replace(item.reg, item.replace);
				}
				node.value = value;
			}
		});
	};
}
