# Lonetrail

<p align="center">
  <img src="public/og.webp" alt="Lonetrail" width="100%">
</p>

![Astro](https://img.shields.io/badge/Astro-6.3-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

![Astro](https://img.shields.io/badge/Astro-6.3-FF5D01?logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

极简 Astro 博客模板。YAML 全配置驱动，开箱即用。

## 功能

- **Astro v6** — Island 架构，零 JS 默认输出
- **React 19** — 按需交互组件
- **Tailwind CSS 4** — 原子化样式
- **全文归档** — 可搜索的文章列表
- **分类与标签** — 基于分类法的组织方式
- **专题系列** — 将文章归入系列
- **多语言** — 简体中文、繁体中文、英文
- **KaTeX** — 数学公式渲染
- **Mermaid** — 图表支持
- **代码高亮** — 带主题的语法着色
- **PostHog 统计** — 可选，可配置
- **RSS / Atom / Sitemap** — 自动生成
- **深色模式** — 内置主题切换
- **响应式** — 移动优先，桌面优化

## 快速开始

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # 输出: dist/
```

## 配置

所有站点设置在 `src/site.yml`：

```yaml
site:
  title: "你的博客"
  subtitle: "记录你的想法"
  url: "https://your-site.com"
  author: "你的名字"
```

功能开关：

```yaml
features:
  comments: false   # 评论区
  donate: false     # 捐赠按钮
  series: true      # 专题系列
```

## 添加内容

在 `src/content/posts/` 下创建文章：

```markdown
---
title: "第一篇文章"
published: 2025-01-01
tags: ["astro", "博客"]
category: "技术"
---

内容...
```

其他内容类型：
- `src/content/seri/` — 专题系列
- `src/content/spec/` — 独立页面（关于等）
- `src/data/links.yml` — 友链
- `src/data/essays.yml` — 微记录
- `src/data/photos.yml` — 相册

## 部署

```bash
pnpm build     # 生成 dist/
```

纯静态输出，可部署到 Cloudflare Pages、Vercel、Netlify 或任意静态托管服务。

## 许可

MIT — 自由使用，无需署名。
