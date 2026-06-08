import { siteYaml } from "../config";

export class PageLifecycle {
	private static artalkAssetsPromise: Promise<void> | null = null;
	private static ensureArtalkAssets() {
		if (PageLifecycle.artalkAssetsPromise)
			return PageLifecycle.artalkAssetsPromise;
		PageLifecycle.artalkAssetsPromise = new Promise<void>((resolve, reject) => {
			if (!(window as any).Artalk) {
				const cssId = "artalk-css";
				if (!document.getElementById(cssId)) {
					const link = document.createElement("link");
					link.id = cssId;
					link.rel = "stylesheet";
					link.href =
						"https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.css";
					document.head.appendChild(link);
				}
				const script = document.createElement("script");
				script.src = "https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.js";
				script.async = true;
				script.onload = () => resolve();
				script.onerror = () => reject(new Error("Failed to load Artalk"));
				document.head.appendChild(script);
				return;
			}
			resolve();
		});
		return PageLifecycle.artalkAssetsPromise;
	}
	private static initReveal() {
		if ((window as any)._revealObserver) {
			(window as any)._revealObserver.disconnect();
		}
		const scrollDownObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						(entry.target as HTMLElement).style.animationPlayState = "running";
						scrollDownObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0, rootMargin: "0px 0px -50px 0px" },
		);
		(window as any)._revealObserver = scrollDownObserver;
		document
			.querySelectorAll(
				".onload-animation:not(.is-visible), .bubble-reveal:not(.is-visible)",
			)
			.forEach((el) => {
				(el as HTMLElement).style.animationPlayState = "paused";
				scrollDownObserver.observe(el);
			});
		PageLifecycle.checkImmediateVisibility();
	}
	private static checkImmediateVisibility() {
		requestAnimationFrame(() => {
			document
				.querySelectorAll(
					".onload-animation:not(.is-visible), .bubble-reveal:not(.is-visible)",
				)
				.forEach((el) => {
					const rect = el.getBoundingClientRect();
					if (rect.top < window.innerHeight + 100 && rect.bottom > 0) {
						el.classList.add("is-visible");
						(el as HTMLElement).style.animationPlayState = "running";
					}
				});
		});
	}
	private static lazyLoadAssets() {
		if (
			document.querySelector(".katex") &&
			!document.querySelector('link[href*="katex"]')
		) {
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = "https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css";
			document.head.appendChild(link);
		}
	}
	private static updateBodyClasses() {
		const path = window.location.pathname.replace(/\/$/, "");
		const isHome = path === "" || /^\/page\/\d+$/.test(path);
		if (isHome) {
			document.body.classList.add("is-home");
		} else {
			document.body.classList.remove("is-home");
		}
	}
	private static initArtalk() {
		const container = document.getElementById("comments");
		if (!container) return;
		const setupObserver = () => {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) return;
						observer.disconnect();
						PageLifecycle.ensureArtalkAssets()
							.then(() => PageLifecycle.mountArtalk())
							.catch((err) => console.error("[Artalk] Load failed:", err));
					});
				},
				{ rootMargin: "200px 0px" },
			);
			observer.observe(container);
		};
		setupObserver();
	}
	private static mountArtalk() {
		const container = document.getElementById("comments");
		if (!container) return;
		if ((window as any).artalkInstance) {
			try {
				(window as any).artalkInstance.destroy();
				(window as any).artalkInstance = null;
			} catch (e) {
				console.warn("[Artalk] Destroy failed:", e);
			}
		}

		const Artalk = (window as any).Artalk;
		if (Artalk) {
			try {
				(window as any).artalkInstance = Artalk.init({
					el: "#comments",
					pageKey: window.location.pathname,
					pageTitle: document.title,
					server: "https://issue.chongxi.us",
					site: siteYaml.copyright.site_name,
					darkMode: document.documentElement.classList.contains("dark"),
				});
			} catch (err) {
				console.error("[Artalk] Init failed:", err);
			}
		}
	}
	public static syncTheme() {
		const storedTheme = localStorage.getItem("theme") || "auto";
		const isDark =
			storedTheme === "dark" ||
			(storedTheme === "auto" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}
	private static initMarkdown() {
		const links = document.querySelectorAll(
			".custom-md a:not(.no-styling):not(.anchor)",
		);
		links.forEach((link) => {
			if ((link as HTMLElement).dataset.processed) return;
			const href = link.getAttribute("href");
			if (!href || href.startsWith("#")) return;

			const icon = document.createElement("img");
			icon.className = "link-icon-prefix";
			icon.alt = "";
			try {
				const url = new URL(href, window.location.origin);
				icon.src =
					url.hostname !== window.location.hostname &&
					!siteYaml.trusted_domains.some(d => url.hostname.includes(d))
						? `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`
						: "/images/14.svg";
				icon.onerror = () => icon.remove();
				link.insertBefore(icon, link.firstChild);
			} catch (_e) {
				icon.src = "/images/14.svg";
				link.insertBefore(icon, link.firstChild);
			}
			(link as HTMLElement).dataset.processed = "true";
		});
		setTimeout(() => {
			if ((window as any).initMermaid) (window as any).initMermaid();
		}, 200);
	}
	private static initLinksCopy() {
		if (!(window as any).copyText) {
			(window as any).copyText = (text: string, label: string) => {
				navigator.clipboard.writeText(text).then(() => {
					const toast = document.getElementById("copy-toast");
					if (toast) {
						const title = toast.querySelector(".toast-title");
						const sub = toast.querySelector(".toast-sub");
						if (title) (title as HTMLElement).innerText = `${label} Copied`;
						if (sub) (sub as HTMLElement).innerText = "Copied to clipboard";
						toast.classList.add("show");
						setTimeout(() => {
							toast.classList.remove("show");
						}, 2000);
					}
				});
			};
		}
		document.addEventListener("copy", (e) => {
			const selection = window.getSelection();
			if (!selection || selection.toString().length < 30) return;
			const clipboardData = e.clipboardData;
			if (!clipboardData) return;
			const author = document.body.dataset.author || "Author";
			const site = document.body.dataset.site || "Site";
			const textTail = `\n\n------------------------------\n${author}\n${window.location.href}\n${site}\n`;
			const copyText = selection.toString() + textTail;
			clipboardData.setData("text/plain", copyText);
			if (selection.rangeCount > 0) {
				const container = document.createElement("div");
				container.appendChild(selection.getRangeAt(0).cloneContents());
				const htmlTail = `<br><br>------------------------------<br>${author}<br><a href="${window.location.href}">${window.location.href}</a><br>${site}<br>`;
				clipboardData.setData("text/html", container.innerHTML + htmlTail);
			}
			e.preventDefault();
		});
	}
	private static initExpressiveCode() {
		if ((window as any)._ecCopyInitialized) return;
		document.addEventListener("click", (e) => {
			const btn = (e.target as HTMLElement).closest(".copy-btn");
			if (!btn) return;
			const codeBlock = btn.closest(".expressive-code");
			if (!codeBlock) return;
			const codeElement = codeBlock.querySelector("code");
			if (!codeElement) return;
			const text = codeElement.innerText;
			navigator.clipboard.writeText(text).then(() => {
				btn.classList.add("success");
				if ((window as any).copyText) (window as any).copyText(text, "Code");
				setTimeout(() => {
					btn.classList.remove("success");
				}, 2000);
			});
		});
		(window as any)._ecCopyInitialized = true;
	}
	private static initGoPage() {
		const targetDisplay = document.getElementById("target-url");
		if (!targetDisplay) return;
		const urlParams = new URLSearchParams(window.location.search);
		let targetUrl = urlParams.get("url");
		if (!targetUrl && urlParams.get("target")) {
			try {
				targetUrl = atob(urlParams.get("target") || "");
			} catch {
				/* expected */
			}
		}
		const continueLink = document.getElementById(
			"continue-link",
		) as HTMLAnchorElement;
		const cancelBtn = document.getElementById("cancel-btn");
		if (!targetUrl) {
			targetDisplay.innerText = "Invalid Link";
			return;
		}
		let displayUrl = targetUrl;
		try {
			displayUrl = decodeURIComponent(targetUrl);
		} catch {
			/* expected */
		}
		targetDisplay.innerText = displayUrl;
		if (continueLink) {
			continueLink.href = targetUrl;
			continueLink.target = "_blank";
			continueLink.rel = "nofollow noopener noreferrer";
		}
		if (cancelBtn) {
			cancelBtn.onclick = () => {
				if (window.history.length > 1) window.history.back();
				else window.location.href = "/";
			};
		}
		try {
			const targetObj = new URL(targetUrl);
			const targetDomain = targetObj.hostname;
			const siteDomains = siteYaml.trusted_domains;
			const trusted = siteDomains.some(
				(domain) =>
					targetDomain === domain || targetDomain.endsWith(`.${domain}`),
			);
			if (trusted) {
				targetDisplay.innerHTML = `<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Redirecting to trusted site...</span>`;
				setTimeout(() => {
					if (targetUrl) window.location.href = targetUrl;
				}, 800);
			}
		} catch {
			/* expected */
		}
	}
	private static _initializePageContent() {
		PageLifecycle.syncTheme();
		PageLifecycle.updateBodyClasses();
		PageLifecycle.initReveal();
		PageLifecycle.initMarkdown();
		PageLifecycle.initLinksCopy();
		PageLifecycle.initExpressiveCode();
		PageLifecycle.initGoPage();
		if ((window as any).initTOC) (window as any).initTOC();
		setTimeout(() => {
			PageLifecycle.initArtalk();
			PageLifecycle.lazyLoadAssets();
			if ((window as any).mermaid) {
				try {
					(window as any).mermaid.contentLoaded();
				} catch {
					/* expected */
				}
			}
			document.documentElement.classList.add("is-fully-loaded");
		}, 150);
	}
	public static init() {
		PageLifecycle._initializePageContent();
	}
	public static onPageLoad() {
		PageLifecycle._initializePageContent();
	}
}
