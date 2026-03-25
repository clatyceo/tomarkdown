# SEO/GEO Complete Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all 27 SEO/GEO issues found by 4-agent audit before IndexNow submission

**Architecture:** Create a shared `generatePageMetadata()` helper in `lib/seo.ts` that generates correct canonical, hreflang, OG, and twitter metadata. Every page calls this helper. Fix all schema issues in layout.tsx and seo-content.tsx. Expand tool page content depth. Founder: 박감사 (Park Gamsa).

**Tech Stack:** Next.js 16, React 19, next-intl, TypeScript. Read `frontend/AGENTS.md` before any Next.js code.

---

### Task 1: Create Metadata Helper (`lib/seo.ts`)

**Files:**
- Create: `frontend/lib/seo.ts`

**Step 1: Create the helper**

```ts
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/config";
import { routing } from "@/i18n/navigation";

interface PageMetadataOptions {
  locale: string;
  path: string;           // e.g. "" for homepage, "pdf-to-markdown", "about", "blog/slug"
  title: string;
  description: string;
  keywords?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generatePageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
}: PageMetadataOptions): Metadata {
  const fullPath = path ? `/${locale}/${path}` : `/${locale}`;
  const canonicalUrl = `${SITE_URL}${fullPath}`;

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}${path ? `/${l}/${path}` : `/${l}`}`;
  }
  languages["x-default"] = `${SITE_URL}${path ? `/en/${path}` : "/en"}`;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: SITE_NAME }],
      type: ogType,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}
```

**Step 2: Commit**

```bash
git add frontend/lib/seo.ts
git commit -m "feat: create generatePageMetadata helper for correct canonical/hreflang/OG"
```

---

### Task 2: Fix Layout Metadata + Schemas

**Files:**
- Modify: `frontend/app/[locale]/layout.tsx`

**Step 1: Fix generateMetadata — remove broken alternates, keep base config only**

The layout's generateMetadata should ONLY contain base-level metadata that ALL pages share. Remove `alternates` (it's broken — points all pages to homepage). Remove `openGraph` and `twitter` (child pages will set their own via the helper). Keep: `metadataBase`, `manifest`, `appleWebApp`, `icons`, `robots`, `verification`.

Replace the current `generateMetadata` return (lines 41-95) with:

```ts
return {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: SITE_NAME },
  icons: { apple: "/icon.svg" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "cAFel1q5yzf4Knl40SDWzJpyi2HdqSHFwPSGT41vHSk",
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "af8e8f101e535050dc50619a9b6216dec0a8d5e6",
      "google-adsense-account": "ca-pub-9136783850079430",
    },
  },
};
```

**Step 2: Fix Organization schema (logo → ImageObject, founder → add url)**

Replace the Organization JSON-LD (lines 129-149) with:

```ts
{
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Free online tool to convert any file to Markdown",
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon.svg`,
    width: 512,
    height: 512,
  },
  founder: {
    "@type": "Person",
    name: "박감사",
    alternateName: "Park Gamsa",
    url: `${SITE_URL}/${locale}/about`,
  },
  sameAs: [
    "https://github.com/clatyceo/tomarkdown",
    "https://x.com/tomdnow",
    "https://www.linkedin.com/in/%EA%B0%90%EC%82%AC-%EB%B0%95-8750443ba/",
    "https://www.producthunt.com/@clatyceo",
    "https://dev.to/tomdnow",
  ],
}
```

**Step 3: Fix WebSite SearchAction — use locale variable**

Replace hardcoded `/en` in SearchAction (line 164) with `/${locale}`:

```ts
urlTemplate: `${SITE_URL}/${locale}?q={search_term_string}`,
```

**Step 4: Commit**

```bash
git add frontend/app/[locale]/layout.tsx
git commit -m "fix: remove broken layout alternates, fix Organization logo/founder, fix SearchAction locale"
```

---

### Task 3: Update Homepage Metadata

**Files:**
- Modify: `frontend/app/[locale]/page.tsx`

**Step 1: Add generateMetadata using the helper**

The homepage currently has NO generateMetadata. Add one:

```ts
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return generatePageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
  });
}
```

Note: the homepage component is currently a client-like component using `useTranslations`. The `generateMetadata` is a separate server export — this is valid in Next.js 16.

**Step 2: Commit**

```bash
git add frontend/app/[locale]/page.tsx
git commit -m "feat: add complete metadata with canonical/hreflang/OG to homepage"
```

---

### Task 4: Update All 20 Tool Pages Metadata

**Files:**
- Modify: ALL 20 tool page files in `frontend/app/[locale]/*/page.tsx`

**Step 1: Update each tool page's generateMetadata**

Each tool page currently has:
```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `tools.${tool.key}` });
  return { title: t("title"), description: t("seoDescription"), keywords: t("seoKeywords") };
}
```

Change each to:
```ts
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `tools.${tool.key}` });
  return generatePageMetadata({
    locale,
    path: tool.slug,
    title: t("title"),
    description: t("seoDescription"),
    keywords: t("seoKeywords"),
  });
}
```

Apply to ALL 20 files:
- pdf-to-markdown, docx-to-markdown, xlsx-to-markdown, xls-to-markdown, pptx-to-markdown
- msg-to-markdown, html-to-markdown, epub-to-markdown, image-to-markdown, csv-to-markdown
- json-to-markdown, xml-to-markdown, ipynb-to-markdown, hwp-to-markdown, hwpx-to-markdown
- image-ocr-to-markdown, zip-to-markdown, youtube-to-markdown, txt-to-markdown, rtf-to-markdown

**Step 2: Commit**

```bash
git add frontend/app/[locale]/*/page.tsx
git commit -m "feat: add canonical/hreflang/OG to all 20 tool pages via metadata helper"
```

---

### Task 5: Update Non-Tool Pages Metadata

**Files:**
- Modify: `frontend/app/[locale]/about/page.tsx`
- Modify: `frontend/app/[locale]/security/page.tsx`
- Modify: `frontend/app/[locale]/blog/page.tsx`
- Modify: `frontend/app/[locale]/blog/[slug]/page.tsx`
- Modify: `frontend/app/[locale]/docs/api/page.tsx`
- Modify: `frontend/app/[locale]/pricing/page.tsx`
- Modify: `frontend/app/[locale]/privacy/page.tsx`
- Modify: `frontend/app/[locale]/terms/page.tsx`

**Step 1: Update each page's generateMetadata to use the helper**

For each page, import and use `generatePageMetadata`. Examples:

**About:**
```ts
import { generatePageMetadata } from "@/lib/seo";
// In generateMetadata:
return generatePageMetadata({
  locale, path: "about",
  title: t("metaTitle"), description: t("metaDescription"),
});
```

**Security:**
```ts
return generatePageMetadata({
  locale, path: "security",
  title: t("title"), description: t("subtitle"),
});
```

**Blog index:**
```ts
return generatePageMetadata({
  locale, path: "blog",
  title: t("title"), description: t("subtitle"),
});
```

**Blog post** (og:type "article"):
```ts
return generatePageMetadata({
  locale, path: `blog/${slug}`,
  title: `${post.title} — ${SITE_NAME}`, description: post.description,
  ogType: "article", publishedTime: post.date, modifiedTime: post.date,
  authors: [post.author],
});
```

**API docs:**
```ts
return generatePageMetadata({
  locale, path: "docs/api",
  title: t("title"), description: t("subtitle"),
});
```

**Pricing:**
```ts
return generatePageMetadata({
  locale, path: "pricing",
  title: t("title"), description: t("subtitle"),
});
```

**Privacy** (also add description i18n key or inline):
```ts
return generatePageMetadata({
  locale, path: "privacy",
  title: t("metaTitle"),
  description: "Learn how tomdnow handles your data. No files stored, no accounts required.",
});
```

**Terms:**
```ts
return generatePageMetadata({
  locale, path: "terms",
  title: t("metaTitle"),
  description: "Terms of service for using the tomdnow file conversion tool.",
});
```

For pages that don't currently accept `params` (privacy, terms, security), add the params pattern:
```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // ...
}
```

**Step 2: Commit**

```bash
git add frontend/app/[locale]/about/page.tsx frontend/app/[locale]/security/page.tsx frontend/app/[locale]/blog/page.tsx frontend/app/[locale]/blog/[slug]/page.tsx frontend/app/[locale]/docs/api/page.tsx frontend/app/[locale]/pricing/page.tsx frontend/app/[locale]/privacy/page.tsx frontend/app/[locale]/terms/page.tsx
git commit -m "feat: add canonical/hreflang/OG to all non-tool pages"
```

---

### Task 6: Dashboard Noindex

**Files:**
- Create: `frontend/app/[locale]/dashboard/layout.tsx`

**Step 1: Create a server layout with noindex metadata**

Dashboard is "use client" so it can't export metadata. Create a layout wrapper:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

**Step 2: Commit**

```bash
git add frontend/app/[locale]/dashboard/layout.tsx
git commit -m "feat: add noindex to dashboard page"
```

---

### Task 7: Fix Schema Issues

**Files:**
- Modify: `frontend/components/seo-content.tsx`
- Modify: `frontend/app/[locale]/blog/[slug]/page.tsx`
- Modify: `frontend/app/[locale]/blog/page.tsx`
- Modify: `frontend/app/[locale]/about/page.tsx`
- Modify: `frontend/app/[locale]/pricing/page.tsx`
- Modify: `frontend/app/[locale]/docs/api/page.tsx`
- Modify: `frontend/app/[locale]/page.tsx` (homepage)
- Modify: `frontend/app/[locale]/privacy/page.tsx`
- Modify: `frontend/app/[locale]/terms/page.tsx`

**Step 1: Fix seo-content.tsx**

a) Fix SoftwareApplication URL — add locale:
```ts
// The component already has access to locale via getLocale()
url: `${SITE_URL}/${locale}/${tool.slug}`,
```

b) Wrap JSON array in @graph:
```ts
JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "HowTo", ... },
    { "@type": "FAQPage", ... },
    { "@type": "SoftwareApplication", ... },
  ],
})
```
Remove individual `@context` from each item inside @graph.

**Step 2: Fix BlogPosting publisher.logo — add width/height**

In `blog/[slug]/page.tsx`, update publisher.logo:
```ts
logo: {
  "@type": "ImageObject",
  url: `${SITE_URL}/icon.svg`,
  width: 512,
  height: 512,
},
```

Add `wordCount`, `articleSection`, `inLanguage`:
```ts
wordCount: post.content.split(/\s+/).length,
articleSection: post.tags[0] || "Markdown",
inLanguage: locale,
```

**Step 3: Fix blog index — render FAQ visibly OR remove FAQPage schema**

The blog index has FAQPage schema but FAQ is not rendered on the page. Either:
- Add visible FAQ section to the blog index page, OR
- Remove the FAQPage JSON-LD from blog/page.tsx

Recommendation: Remove the FAQPage schema from blog/page.tsx since blog index is a listing page. Keep FAQPage only on pages where FAQ is visually rendered (tool pages, security, API).

**Step 4: Add Person schema to About page**

In `about/page.tsx`, add after BreadcrumbSchema:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: t("title"),
      description: t("metaDescription"),
      mainEntity: {
        "@type": "Person",
        name: "박감사",
        alternateName: "Park Gamsa",
        url: `${SITE_URL}/${locale}/about`,
        jobTitle: "Software Developer",
        knowsAbout: ["Markdown", "Document Conversion", "Web Development"],
      },
    }),
  }}
/>
```

**Step 5: Add BreadcrumbList to pricing, privacy, terms**

Import and add `<BreadcrumbSchema>` to:
- `pricing/page.tsx`: `items={[{ name: "Pricing" }]}`
- `privacy/page.tsx`: `items={[{ name: "Privacy Policy" }]}`
- `terms/page.tsx`: `items={[{ name: "Terms of Service" }]}`

Each needs locale from params (add params if not present).

**Step 6: Fix API docs BreadcrumbList — add Docs level**

In `docs/api/page.tsx`, change BreadcrumbSchema items:
```tsx
<BreadcrumbSchema locale={locale} items={[{ name: "Docs", href: "/docs" }, { name: "API" }]} />
```

**Step 7: Add ItemList schema to homepage**

In `page.tsx` (homepage), add after WebApplication JSON-LD:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "File to Markdown Converters",
      numberOfItems: Object.keys(tools).length,
      itemListElement: Object.values(tools).map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tool.displayName,
        url: `${SITE_URL}/${locale}/${tool.slug}`,
      })),
    }),
  }}
/>
```

Note: homepage needs locale. It's currently a client component using `useTranslations`. For the JSON-LD, wrap in a server component or pass locale. The simplest approach: since we added `generateMetadata` in Task 3 which is server-side, we can get locale there. But for the JSX, we need locale in the component. Check if the component already receives locale or if we need to convert it.

Alternative: create a separate `HomeSchemas` server component that renders the JSON-LD.

**Step 8: Commit**

```bash
git add frontend/components/seo-content.tsx frontend/app/[locale]/blog/[slug]/page.tsx frontend/app/[locale]/blog/page.tsx frontend/app/[locale]/about/page.tsx frontend/app/[locale]/pricing/page.tsx frontend/app/[locale]/docs/api/page.tsx frontend/app/[locale]/page.tsx frontend/app/[locale]/privacy/page.tsx frontend/app/[locale]/terms/page.tsx
git commit -m "fix: fix all schema issues — locale URLs, @graph, BlogPosting, BreadcrumbList, AboutPage, ItemList"
```

---

### Task 8: Sitemap + Robots.txt

**Files:**
- Modify: `frontend/app/sitemap.ts`
- Modify: `frontend/app/robots.ts`

**Step 1: Add missing pages to sitemap**

In `sitemap.ts`, add after the existing entries inside the locale loop:
```ts
entries.push({ url: `${prefix}/pricing`, lastModified: LAST_UPDATE, changeFrequency: "monthly", priority: 0.4 });
entries.push({ url: `${prefix}/docs/api`, lastModified: LAST_UPDATE, changeFrequency: "monthly", priority: 0.7 });
```

Replace `new Date()` calls with a fixed date:
```ts
const LAST_UPDATE = new Date("2026-03-25");
```

**Step 2: Add explicit AI crawler rules to robots.ts**

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

**Step 3: Commit**

```bash
git add frontend/app/sitemap.ts frontend/app/robots.ts
git commit -m "feat: add pricing/docs/api to sitemap, add AI crawler rules to robots.txt"
```

---

### Task 9: Expand Tool Page Content (Top 5)

**Files:**
- Modify: `frontend/components/seo-content.tsx`
- Modify: ALL 8 `frontend/messages/{locale}.json`

**Step 1: Add new i18n keys for content expansion**

For each of the top 5 tools (pdf, docx, xlsx, youtube, hwp), add to the `"tools"` section in each message file:

- `definitionParagraph`: 2-3 sentence AI-citable definition
- `detailParagraph`: Technical detail about conversion quality/approach

Example for `en.json` → `tools.pdf`:
```json
"definitionParagraph": "tomdnow's PDF to Markdown converter transforms PDF documents into clean, structured Markdown files. It preserves headings, lists, tables, and links while simplifying complex layouts for readability. Files are processed entirely in memory and never stored on servers.",
"detailParagraph": "Powered by Microsoft's MarkItDown engine, the converter handles multi-page PDFs with mixed content — text, tables, headers, and lists. Output is compatible with GitHub, Obsidian, Notion, and any Markdown editor. The tool supports files up to 10MB and works in seconds without requiring sign-up."
```

Also expand FAQ answers from 1 sentence to 2-3 sentences for the top 5 tools.

Translate for all 8 locales (en, ko, ja, zh, es, pt, de, fr).

**Step 2: Render new content in seo-content.tsx**

Add a definition section before the HowTo section:

```tsx
{/* Definition — AI-citable */}
<section>
  <p className="text-gray-600 leading-relaxed">{tTool("definitionParagraph")}</p>
  <p className="mt-3 text-gray-600 leading-relaxed">{tTool("detailParagraph")}</p>
</section>
```

Use try/catch or conditional rendering for tools that don't have these keys yet (the other 15 tools).

**Step 3: Commit**

```bash
git add frontend/components/seo-content.tsx frontend/messages/*.json
git commit -m "feat: expand tool page content depth for top 5 tools (PDF, DOCX, XLSX, YouTube, HWP)"
```

---

### Task 10: Build + Verify

**Step 1: Build**
```bash
cd frontend && npm run build
```
Expected: Success, no errors.

**Step 2: Verify canonical tags**
```bash
curl -s https://tomdnow.com/en | grep 'rel="canonical"'
curl -s https://tomdnow.com/en/pdf-to-markdown | grep 'rel="canonical"'
curl -s https://tomdnow.com/en/about | grep 'rel="canonical"'
```
Expected: Each page has its own canonical URL.

**Step 3: Verify hreflang**
```bash
curl -s https://tomdnow.com/en/pdf-to-markdown | grep 'hreflang'
```
Expected: 8 locales + x-default, all pointing to `/*/pdf-to-markdown`.

**Step 4: Verify OG tags**
```bash
curl -s https://tomdnow.com/en/pdf-to-markdown | grep 'og:title\|og:url'
```
Expected: og:title = "PDF to Markdown — tomdnow", og:url contains `/en/pdf-to-markdown`.

**Step 5: Verify schemas**
```bash
curl -s https://tomdnow.com/en/pdf-to-markdown | grep -o '"@type":"[^"]*"' | sort -u
```
Expected: BreadcrumbList, FAQPage, HowTo, ListItem, Organization, Person, SearchAction, SoftwareApplication, WebSite + more.

**Step 6: Verify sitemap**
```bash
curl -s https://tomdnow.com/sitemap.xml | grep -c '<url>'
```
Expected: 240+ URLs (increased from 224).

**Step 7: Verify dashboard noindex**
```bash
curl -s https://tomdnow.com/en/dashboard | grep 'noindex'
```
Expected: Contains noindex.

---

## Execution Strategy

**Parallel Groups:**
- **Agent A:** Tasks 1-6 (metadata helper + all page updates) — sequential, each depends on Task 1
- **Agent B:** Task 7 (schema fixes) — independent of metadata changes
- **Agent C:** Task 8 (sitemap + robots) — independent
- **Agent D:** Task 9 (content expansion) — touches message files only

Agent A must complete Task 1 first. Tasks 2-6 follow sequentially. Agents B, C, D can run in parallel with Agent A (different files).

Task 10 runs after all agents complete.
