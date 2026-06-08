#!/usr/bin/env python3
"""Inject YAML config values into Lonetrail source files."""

import re, yaml, os, shutil

ROOT = "/home/xi/WORKSPACE/Lonetrail"
BACKUP = "/tmp/lonetrail-bak"

with open(f"{ROOT}/src/site.yml") as f:
    cfg = yaml.safe_load(f)

# Backup original files
os.makedirs(BACKUP, exist_ok=True)

replacements = {
    # SEO schema
    f"{ROOT}/src/seo/schema.ts": [
        ('"https://chongxi.us/#person"', f'"{cfg["seo"]["person_id"]}"'),
        ('"https://chongxi.us/#website"', f'"{cfg["seo"]["website_id"]}"'),
        ('"https://chongxi.us/#webapp"', f'"{cfg["seo"]["website_id"]}"'),
        ('"https://chongxi.us/#personImage"', f'"{cfg["seo"]["person_id"]}"'),
        ('"https://chongxi.us/"', f'"{cfg["site"]["url"]}/"'),
        ('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"'),
        ('"https://mai.chongxi.us/"', f'"{cfg["site"]["url"]}/"'),
        ('alternateName: ["xi", "重熙", "Chongxi3555"]', f'alternateName: {cfg["seo"]["alternate_name"]}'),
    ],
    # Layout.astro
    f"{ROOT}/src/layouts/Layout.astro": [
        ('"/images/chongxi-og.webp"', f'"{cfg["site"]["og_image"]}"'),
        ('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"'),
        ('"https://webmention.io/xice.cx/webmention"', f'"{cfg["services"]["webmention"]["url"]}"'),
        ('"https://webmention.io/xice.cx/xmlrpc"', f'"{cfg["services"]["webmention"]["url"]}"'),
        ('"https://www.blogsclub.org/badge/xice.cx"', f'"{cfg["services"]["blogsclub"]["badge_url"]}"'),
        ('"/images/chongxi-about-bg.webp"', f'"{cfg["site"]["banner"]}"'),
    ],
    # page-lifecycle.ts
    f"{ROOT}/src/scripts/page-lifecycle.ts": [
        ('"https://issue.chongxi.us"', f'"{cfg["services"]["issue_tracker"]["url"]}"'),
        ('"Chongxiの咖啡屋"', f'"{cfg["copyright"]["site_name"]}"'),
        ('chongxi.us', cfg["site"]["url"].replace("https://", "")),
        ('Chongxi', cfg["copyright"]["text"]),
    ],
    # SideDrawer.tsx
    f"{ROOT}/src/components/layout/SideDrawer.tsx": [
        ('"Chongxiの咖啡屋"', f'"{cfg["copyright"]["site_name"]}"'),
        ('"/images/chongxi-avatar.webp"', f'"{cfg["profile"]["avatar"]}"'),
        ('"Chongxi"', f'"{cfg["copyright"]["text"]}"'),
        ('"循此苦旅，直抵群星。"', f'"{cfg["profile"]["bio"]}"'),
    ],
    # Footer.astro
    f"{ROOT}/src/components/layout/Footer.astro": [
        ('href="https://chongxi.us"', f'href="{cfg["site"]["url"]}"'),
        ('>CEPATO<', f'>{cfg["copyright"]["text"]}<'),
    ],
    # PostHero.astro
    f"{ROOT}/src/components/post/PostHero.astro": [
        ('"/images/chongxi-about-bg.webp"', cfg["site"]["banner"] or '""'),
        ('"/images/chongxi-avatar.webp"', cfg["profile"]["avatar"] or '""'),
        ('"Chongxi"', cfg["copyright"]["text"]),
        ('href="https://chongxi.us"', f'href="{cfg["site"]["url"]}"'),
        ('title="Jump to chongxi.us"', f'title="Jump to {cfg["site"]["url"]}"'),
    ],
    # PocketCard.tsx
    f"{ROOT}/src/components/pages/PocketCard.tsx": [
        ('"/images/chongxi-avatar.webp"', cfg["profile"]["avatar"] or '""'),
        ('href="https://chongxi.us"', f'href="{cfg["site"]["url"]}"'),
        ('title="Jump to chongxi.us"', f'title="Jump to {cfg["site"]["url"]}"'),
    ],
    # LinkManifest.tsx
    f"{ROOT}/src/components/pages/LinkManifest.tsx": [
        ('"Chongxiの咖啡屋"', f'"{cfg["site"]["title"]}"'),
        ('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"'),
        ('"https://xice.cx/images/chongxi-icon.webp"', f'"{cfg["site"]["url"]}/{cfg["site"]["favicon"]}"'),
    ],
    # SubscribePage.tsx
    f"{ROOT}/src/components/pages/SubscribePage.tsx": [
        ('"https://xice.cx/atom.xml"', f'"{cfg["site"]["url"]}/atom.xml"'),
    ],
    # SupportUs.tsx
    f"{ROOT}/src/components/pages/SupportUs.tsx": [
        ('"/reward/Chongxi-wechat.webp"', '""'),
        ('"Chongxi\'s WeChat QR Code"', '"Donation QR Code"'),
        ('"https://www.ifdian.net/a/CEPATO"', f'"{cfg["site"]["url"]}"'),
    ],
    # SpotifyStatus.tsx
    f"{ROOT}/src/components/ui/SpotifyStatus.tsx": [
        ('"https://chongxi.us/api/spotify/now-playing"', f'"{cfg["site"]["url"]}/api/spotify/now-playing"'),
    ],
    # ArchiveHeader.astro
    f"{ROOT}/src/components/pages/ArchiveHeader.astro": [
        ('Chongxi // Coffee_House', f'{cfg["copyright"]["text"]} // {cfg["site"]["title"]}'),
        ('循此苦旅 直抵群星', cfg["profile"]["bio"]),
    ],
    # AboutPage.tsx
    f"{ROOT}/src/components/pages/AboutPage.tsx": [
        ('"/images/chongxi-about-bg.webp"', cfg["site"]["banner"] or '""'),
    ],
    # about.astro
    f"{ROOT}/src/pages/about.astro": [
        ('getEntry("spec", "about-chongxi")', 'getEntry("spec", "about")'),
        ('chongxi: aboutChongxi?.body || ""', 'about: aboutEntry?.body || ""'),
    ],
    # RSS/Atom
    f"{ROOT}/src/pages/rss.xml.ts": [
        ('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"'),
        ('"Chongxi"', f'"{cfg["copyright"]["text"]}"'),
    ],
    f"{ROOT}/src/pages/atom.xml.ts": [
        ('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"'),
        ('"Chongxi"', f'"{cfg["copyright"]["text"]}"'),
        ('"qwq@chongxi.us"', f'"{cfg["feed"]["atom_email"]}"'),
    ],
    # Sitemaps
    f"{ROOT}/src/pages/sitemap-taxonomies.xml.ts": [('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"')],
    f"{ROOT}/src/pages/sitemap-pages.xml.ts": [('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"')],
    f"{ROOT}/src/pages/sitemap-series.xml.ts": [('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"')],
    f"{ROOT}/src/pages/sitemap-index.xml.ts": [('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"')],
    f"{ROOT}/src/pages/sitemap-posts.xml.ts": [('"https://xice.cx/"', f'"{cfg["site"]["url"]}/"')],
    f"{ROOT}/src/pages/robots.txt.ts": [('Sitemap: https://xice.cx/', f'Sitemap: {cfg["site"]["url"]}/')],
    # middleware
    f"{ROOT}/src/middleware.ts": [
        ('"https://xice.cx"', f'"{cfg["site"]["url"]}"'),
    ],
    # url-utils
    f"{ROOT}/src/utils/url-utils.ts": [
        ('["xice.cx", "blog.chongxi.us", "chongxi.us"]', str(cfg["trusted_domains"])),
    ],
}

count = 0
for filepath, subs in replacements.items():
    if not os.path.exists(filepath):
        print(f"  SKIP (not found): {os.path.basename(filepath)}")
        continue
    
    # Backup
    bak = f"{BACKUP}/{os.path.basename(filepath)}"
    if not os.path.exists(bak):
        shutil.copy2(filepath, bak)
    
    with open(filepath) as f:
        content = f.read()
    
    changed = False
    for old, new in subs:
        if old in content:
            content = content.replace(old, new)
            changed = True
            count += 1
        else:
            print(f"  SKIP: '{old[:40]}...' not found in {os.path.basename(filepath)}")
    
    if changed:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  OK: {os.path.basename(filepath)}")

print(f"\n=== 共替换 {count} 处，涉及 {len(replacements)} 个文件 ===")
