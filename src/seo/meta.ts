import { siteConfig } from "@/config";
import {
	MAX_META_DESCRIPTION_LENGTH,
	META_DESCRIPTION_TRUNCATE_AT,
} from "./config";

export function getMetaDescription(description?: string): string {
	const raw = description || siteConfig.subtitle;
	return raw.length > MAX_META_DESCRIPTION_LENGTH
		? `${raw.substring(0, META_DESCRIPTION_TRUNCATE_AT)}...`
		: raw;
}

export function getPageTitle(title: string | undefined): string {
	const base = siteConfig.title;
	if (!title || title === base) {
		return `${base} - ${siteConfig.subtitle}`;
	}
	// Remove siteConfig.title from title if it was accidentally included to prevent duplication
	const cleanTitle = title.replace(` - ${base}`, "").replace(base, "");
	return `${cleanTitle.trim()} - ${base}`;
}
