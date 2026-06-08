// Lonetrail site config — loaded from src/site.yml
// Components should import from here instead of hardcoded values.
import type siteYaml from "./site.yml";

type SiteConfig = typeof siteYaml;

let _config: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
	if (!_config) {
		// @ts-ignore — loaded by @rollup/plugin-yaml
		_config = (await import("./site.yml")).default;
	}
	return _config;
}

// Convenience exports
export const site = (await import("./site.yml")).default;
