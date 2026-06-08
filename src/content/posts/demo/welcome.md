---
title: "Welcome to Lonetrail"
published: 2026-01-15
description: "Lonetrail is an Astro-based blog theme — clean, elegant, and packed with features. This article walks you through its core capabilities."
tags: ["Lonetrail", "Getting Started", "Astro"]
category: "Tech"
image: ""
---

## About Lonetrail

**Lonetrail** is a modern blog theme built with Astro. It prioritizes reading experience while retaining rich customization capabilities.

> Ad Astra Per Aspera.  
> *Through hardships to the stars.*

### Key Features

- **Blazing fast** — Astro's static generation delivers near-instant page loads
- **Responsive design** — Looks great on desktop, tablet, and mobile
- **Dark mode** — Toggle between light and dark themes
- **RSS / Atom** — Auto-generated syndication feeds
- **Series** — Organize articles into research series
- **Tags & categories** — Flexible content organization system
- **Comments** — Artalk integration for discussion
- **Links page** — Built-in friend links management

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ChongxiSama/Lonetrail.git my-blog
cd my-blog

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

### Directory Structure

```
src/
├── content/        # Article content
│   ├── posts/     # Blog posts
│   ├── seri/      # Series
│   └── spec/      # Special pages
├── components/    # Components
├── layouts/       # Layouts
├── pages/         # Page routes
├── styles/        # Styles
└── site.yml       # Site configuration
```

### Configuring Your Site

Edit `src/site.yml` to customize your site title, subtitle, author info, and more.

```yaml
site:
  title: "My Blog"
  subtitle: "A place for thoughts"
  url: "https://example.com"
```

Articles are written in Markdown and placed in `src/content/posts/`. Each article requires a frontmatter header:

```yaml
---
title: "Article Title"
published: 2026-01-15
description: "Article description"
tags: ["tag1", "tag2"]
category: "Category"
---
```

Lonetrail also supports series collections, custom pages, and more advanced features. Check out the other articles for details.
