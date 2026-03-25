# SEO/GEO Complete Fix Design

**Date:** 2026-03-25
**Approach:** A — Metadata Helper + Content Expansion
**Goal:** Fix all 27 SEO/GEO issues before IndexNow submission
**Founder:** 박감사 (Park Gamsa)

---

## Core Architecture: `generatePageMetadata` Helper

Create a shared helper function that generates complete, correct metadata for any page. Every page calls this instead of manually constructing metadata.

**File:** `frontend/lib/seo.ts`

```ts
export function generatePageMetadata({
  locale, path, title, description, keywords?, type?: "website" | "article",
  publishedTime?, authors?
}): Metadata
```

This function returns:
- `title`, `description`, `keywords`
- `alternates.canonical` → `${SITE_URL}/${locale}/${path}`
- `alternates.languages` → all 8 locales mapped to `${SITE_URL}/${l}/${path}`
- `openGraph` → page-specific title, description, url, type, siteName, images
- `twitter` → page-specific card data
- `robots` → index/follow/max-snippet/max-image-preview

Every page's `generateMetadata` calls this helper with its specific params.

---

## Changes by Category

### Group 1: Metadata Infrastructure (CRITICAL 1-3, HIGH 7-10)

**1.1 Create `lib/seo.ts` helper**
- Canonical: `${SITE_URL}/${locale}/${path}`
- Hreflang: all 8 locales + x-default → `/en/${path}`
- OG: page-specific title/description/url/type
- Twitter: mirrors OG

**1.2 Update layout.tsx**
- Remove `alternates.languages` from layout (breaks child pages)
- Keep `metadataBase`, `robots`, `verification`
- Fix Organization logo → ImageObject with width/height
- Fix founder → add url property
- Fix SearchAction → use locale variable instead of hardcoded /en

**1.3 Update ALL page generateMetadata functions**
- 20 tool pages → use helper with `tool.slug`
- about, security, blog, blog/[slug], docs/api, pricing, privacy, terms
- Blog posts → og:type "article" with publishedTime/authors

**1.4 Dashboard → noindex**
- Add `robots: { index: false, follow: false }` override

### Group 2: Schema Fixes (CRITICAL 4-5, HIGH 11-17)

**2.1 Fix seo-content.tsx**
- SoftwareApplication url: add `/${locale}/`
- JSON array → @graph wrapper

**2.2 Fix layout.tsx schemas**
- Organization logo → ImageObject
- Organization founder → add url
- WebSite SearchAction → locale-aware

**2.3 Add missing schemas**
- Pricing: BreadcrumbList + Product/Offer schema
- About: Person + AboutPage schema
- Homepage: ItemList for tools
- Privacy/Terms: BreadcrumbList
- Blog posts: add wordCount, articleSection, inLanguage
- BlogPosting publisher.logo: add width/height

**2.4 Fix problematic schemas**
- Blog index: remove FAQPage OR render FAQ content visibly
- API docs BreadcrumbList: add "Docs" intermediate level

### Group 3: Sitemap + Technical (HIGH 14-15, MEDIUM)

**3.1 Sitemap**
- Add /pricing and /docs/api entries
- Use fixed lastmod date instead of `new Date()`

**3.2 Robots.txt**
- Add explicit AI crawler rules (GPTBot, ClaudeBot, Google-Extended, etc.)

### Group 4: Content Expansion (CRITICAL 6)

**4.1 Tool page content depth**
Each of the 20 tool pages needs expansion from ~120 to 300+ words. Add to each tool's i18n:
- `definitionParagraph`: AI-citable definition (1-2 sentences)
- `detailParagraph`: Technical detail about conversion quality
- Expand FAQ answers from 1 sentence to 2-3 sentences

This requires updating:
- `frontend/components/seo-content.tsx` (render new sections)
- `frontend/messages/*.json` (8 files × new keys for 20 tools)

Focus on top 5 tools first: PDF, DOCX, XLSX, YouTube, HWP. The rest follow the same pattern.

---

## Execution Strategy

Parallel subagent groups:
- **Agent A:** Group 1 (metadata helper + all page updates)
- **Agent B:** Group 2 (schema fixes)
- **Agent C:** Group 3 (sitemap + robots) — small, can merge with A or B
- **Agent D:** Group 4 (content expansion, top 5 tools + i18n)

Groups 1-3 don't touch message files. Group 4 does. No conflicts.

---

## Verification

1. `npm run build` passes
2. curl each page type → verify canonical, hreflang, OG in HTML
3. Validate JSON-LD on each page type
4. Check sitemap URL count increased
5. Verify dashboard is noindex
6. Verify tool pages have expanded content
