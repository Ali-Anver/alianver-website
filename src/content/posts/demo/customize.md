---
title: "Lonetrail Configuration Reference"
published: 2026-03-01
description: "Complete configuration guide for the Lonetrail demo site, covering site.yml structure and frontmatter syntax."
tags: ["Lonetrail", "Configuration"]
category: "Tech"
image: ""
---

## Site Configuration

All configuration lives in `src/site.yml`:

```yaml
site:
  title: "Lonetrail"
  subtitle: "Ad Astra Per Aspera"
  url: "https://lonetrail.vercel.app"
  lang: "en"
  author: "Chongxi"
  email: "qwq@chongxi.us"
  favicon: "/images/favicon.webp"
  banner: ""
  og_image: "/images/og.webp"

profile:
  avatar: "/images/chongxi-avatar.webp"
  name: "Chongxi"
  bio: "Ad Astra Per Aspera"
  links:
    - name: "GitHub"
      url: "https://github.com/ChongxiSama/Lonetrail"
    - name: "Docs"
      url: "https://github.com/ChongxiSama/Lonetrail#readme"
    - name: "Theme Gallery"
      url: "https://astro.build/themes/"

nav:
  - Home: "/"
  - Archive: "/archive/"
  - Series: "/seri/"
  - Links: "/links/"
  - About: "/about/"

features:
  breadcrumb: true
  comments: true
  search: false
  donate: false
  rss_feed: true
  sitemap: true
  related_posts: true
  series: true
  license: true

seo:
  enable_json_ld: false
  breadcrumb: true
  keywords: "astro, theme, blog, lonetrail"
  same_as: []

services:
  posthog:
    api_key: ""
    api_host: "https://app.posthog.com"
  webmention:
    url: ""
  blogsclub:
    badge_url: ""
  issue_tracker:
    url: ""

trusted_domains:
  - "lonetrail.vercel.app"

copyright:
  text: "Lonetrail Demo"
  site_name: "Lonetrail"
  license: "MIT"
  license_url: "https://opensource.org/licenses/MIT"
```

## Article Frontmatter

Articles use the following frontmatter format:

```yaml
---
title: "Article Title"
published: 2026-01-15
description: "Article description"
tags: ["tag1", "tag2"]
category: "Category"
image: ""
---
```

## Series

The "Stellar Exploration" series is defined as:

```yaml
---
title: "Stellar Exploration Project"
subtitle: "Stellar Exploration Project"
published: 2026-01-15
filter:
  tag: "Stars"
---
```

Articles tagged with the matching tag are automatically associated with the series.
