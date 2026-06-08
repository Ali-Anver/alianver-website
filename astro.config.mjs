import react from "@astrojs/react";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import yaml from "@rollup/plugin-yaml";
import { defineConfig, fontProviders } from "astro/config";
import compress from "astro-compress";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";

import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { rehypeExternalLinks } from "./src/plugins/rehype-external-links.js";
import { rehypeOptimizeImages } from "./src/plugins/rehype-optimize-images.js";
import { rehypePangu } from "./src/plugins/rehype-pangu.js";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.mjs";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

const isCI = true;

export default defineConfig({
    site: "https://lonetrail.vercel.app",
    base: "/",
    trailingSlash: "always",
    prefetch: true,
    fonts: [
        {
            name: "Fira Code",
            provider: fontProviders.fontsource("fira-code"),
            cssVariable: "--font-mono-var",
        },
        {
            name: "Noto Serif SC",
            provider: fontProviders.fontsource("noto-serif-sc"),
            cssVariable: "--font-serif",
            options: {
                weights: [400, 900],
            }
        },
        {
            name: "Plus Jakarta Sans",
            provider: fontProviders.local(),
            cssVariable: "--font-sans-pj",
            options: {
                variants: [
                    {
                        src: ["./public/fonts/PlusJakartaSans.woff2"],
                        weight: "200 800",
                        style: "normal",
                    },
                ],
            },
        },
    ],
    image: {
        domains: ["xice.cx", "blog.chongxi.us", "chongxi.us"],
        format: ["avif", "webp"],
        service: isCI
            ? { entrypoint: "astro/assets/services/sharp" }
            : { entrypoint: "astro/assets/services/noop" },
    },
    integrations: [react(), icon({}), expressiveCode({
        themes: ["github-dark"],
        useVariableFonts: true,
        plugins: [
            pluginCollapsibleSections(),
            pluginLineNumbers(),
            pluginLanguageBadge(),
            pluginCustomCopyButton(),
        ],
        defaultProps: {
            wrap: false,
            showLineNumbers: true,
            overridesByLang: {
                shellsession: {
                    showLineNumbers: false,
                },
            },
        },
        styleOverrides: {
            codeBackground: "#1A1814",
            borderRadius: "0px",
            borderColor: "rgba(255, 255, 255, 0.05)",
            codeFontSize: "13px",
            codeFontFamily:
                "'Fira Code', 'Fira Code Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            codeLineHeight: "1.7",
            uiLineHeight: "1.7",
            frames: {
                editorBackground: "#1A1814",
                terminalBackground: "#1A1814",
                terminalTitlebarBackground: "none",
                editorTabBarBackground: "none",
                editorActiveTabBackground: "none",
                editorActiveTabIndicatorBottomColor: "#D4621A",
                editorActiveTabIndicatorTopColor: "none",
                editorTabBarBorderBottomColor: "transparent",
                terminalTitlebarBorderBottomColor: "transparent",
                showCopyToClipboardButton: false,
                inlineButtonForeground: "transparent",
            },
        },
        frames: {
            showCopyToClipboardButton: false,
        },
        }), 
        compress({
        CSS: isCI,
        HTML: isCI,
        Image: false,
        JavaScript: isCI,
        SVG: isCI,
        Logger: 1,
        })],
    markdown: {
        remarkPlugins: [
            remarkMermaid,
            remarkMath,
            remarkReadingTime,
            remarkExcerpt,
            remarkGithubAdmonitionsToDirectives,
            remarkDirective,
            parseDirectiveNode,
        ],
        rehypePlugins: [
            rehypePangu,
            rehypeKatex,
            rehypeSlug,
            rehypeOptimizeImages,
            rehypeExternalLinks,
            [
                rehypeComponents,
                {
                    components: {
                        github: GithubCardComponent,
                        note: (x, y) => AdmonitionComponent(x, y, "note"),
                        tip: (x, y) => AdmonitionComponent(x, y, "tip"),
                        important: (x, y) => AdmonitionComponent(x, y, "important"),
                        caution: (x, y) => AdmonitionComponent(x, y, "caution"),
                        warning: (x, y) => AdmonitionComponent(x, y, "warning"),
                        red: (x, y) => AdmonitionComponent(x, y, "caution"),
                        blue: (x, y) => AdmonitionComponent(x, y, "note"),
                        green: (x, y) => AdmonitionComponent(x, y, "tip"),
                        yellow: (x, y) => AdmonitionComponent(x, y, "warning"),
                        cyan: (x, y) => AdmonitionComponent(x, y, "important"),
                    },
                },
            ],
            [
                rehypeAutolinkHeadings,
                {
                    behavior: "append",
                    properties: {
                        className: ["anchor"],
                    },
                    content: {
                        type: "element",
                        tagName: "span",
                        properties: {
                            className: ["anchor-icon"],
                            "data-pagefind-ignore": true,
                        },
                        children: [
                            {
                                type: "text",
                                value: "#",
                            },
                        ],
                    },
                },
            ],
        ],
    },
    vite: {
        plugins: [
            yaml(),
        ],
        build: {
            cssCodeSplit: true,
            cssMinify: isCI ? "lightningcss" : false,
            minify: isCI ? "esbuild" : false,
            rollupOptions: {
                onwarn(warning, warn) {

                    if (
                        warning.message.includes("is dynamically imported by") &&
                        warning.message.includes("but also statically imported by")
                    ) {
                        return;
                    }
                    warn(warning);
                },
            },
        },
        esbuild: {
            drop: isCI ? ['console', 'debugger'] : [],
        },
    },
});
