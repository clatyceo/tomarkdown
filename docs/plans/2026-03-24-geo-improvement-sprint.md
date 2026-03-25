# GEO Improvement Sprint Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Raise tomdnow.com GEO score from 35/100 to ~60/100 in a single code sprint

**Architecture:** Fix critical bugs (SITE_URL), add AI-optimized content (homepage, about, FAQ), enrich structured data (Organization, BreadcrumbList, BlogPosting), and create llms.txt. All changes are in the Next.js frontend — no backend changes needed. Founder name: 박감사 (Park Gamsa).

**Tech Stack:** Next.js 16, React 19, next-intl (8 locales: en/ko/ja/zh/es/pt/de/fr), Tailwind CSS 4, Vercel deployment

**IMPORTANT:** Read `frontend/AGENTS.md` before writing any Next.js code — this version has breaking changes from training data. Check `node_modules/next/dist/docs/` for current API docs.

---

## Task 1: Fix SITE_URL Trailing Newline Bug

**Files:**
- Modify: `frontend/lib/config.ts:1`

**Step 1: Apply .trim() fix**

```ts
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tomdnow.com").trim();
```

**Step 2: Verify no other files directly read NEXT_PUBLIC_SITE_URL**

Run: `grep -r "NEXT_PUBLIC_SITE_URL" frontend/` — should only appear in config.ts

**Step 3: Commit**

```bash
git add frontend/lib/config.ts
git commit -m "fix: trim SITE_URL to prevent trailing newline corrupting sitemap and JSON-LD"
```

---

## Task 2: Create llms.txt

**Files:**
- Create: `frontend/public/llms.txt`

**Step 1: Create the llms.txt file**

```
# tomdnow

> Free online tool to convert 20+ file formats to clean Markdown

tomdnow converts PDF, Word (DOCX), Excel (XLSX/XLS), PowerPoint (PPTX), HTML, EPUB, CSV, JSON, XML, Jupyter notebooks, Outlook emails (MSG), images (OCR), YouTube transcripts, HWP/HWPX (Korean documents), RTF, TXT, and ZIP archives into clean, readable Markdown files.

## Key Features
- 20+ supported file formats
- In-memory processing — files are never stored on servers
- No sign-up required, 100% free
- 8-language support (English, Korean, Japanese, Chinese, Spanish, Portuguese, German, French)
- REST API available for programmatic access
- Powered by Microsoft's open-source MarkItDown engine

## Links

- Homepage: https://tomdnow.com/en
- PDF to Markdown: https://tomdnow.com/en/pdf-to-markdown
- Word to Markdown: https://tomdnow.com/en/docx-to-markdown
- Excel to Markdown: https://tomdnow.com/en/xlsx-to-markdown
- YouTube to Markdown: https://tomdnow.com/en/youtube-to-markdown
- HWP to Markdown: https://tomdnow.com/en/hwp-to-markdown
- Image OCR to Markdown: https://tomdnow.com/en/image-ocr-to-markdown
- API Documentation: https://tomdnow.com/en/docs/api
- Security: https://tomdnow.com/en/security
- Blog: https://tomdnow.com/en/blog
- About: https://tomdnow.com/en/about
```

**Step 2: Commit**

```bash
git add frontend/public/llms.txt
git commit -m "feat: add llms.txt for AI crawler discoverability"
```

---

## Task 3: Add Canonical Tags + Meta Robots

**Files:**
- Modify: `frontend/app/[locale]/layout.tsx` (generateMetadata function)

**Step 1: Add canonical and robots to metadata**

In the `generateMetadata` function, add to the returned object:

```ts
robots: {
  index: true,
  follow: true,
  "max-image-preview": "large",
  "max-snippet": -1,
  "max-video-preview": -1,
},
```

Note: Canonical URLs are auto-handled by Next.js via `metadataBase` + `alternates`. The `metadataBase: new URL(SITE_URL)` already set handles this. No additional canonical config needed.

**Step 2: Commit**

```bash
git add frontend/app/[locale]/layout.tsx
git commit -m "feat: add meta robots with max-snippet and max-image-preview for AI crawlers"
```

---

## Task 4: Convert OG Image from SVG to PNG

**Files:**
- Create: `frontend/public/og-image.png`
- Modify: `frontend/app/[locale]/layout.tsx` (OG image references)

**Step 1: Generate PNG OG image from existing SVG**

Use a tool to convert `frontend/public/og-image.svg` to PNG at 1200x630. Options:
- Use `sharp` or `svgexport` if available
- Or use `npx @vercel/og` to generate
- Or use macOS `qlmanage` / `sips` for conversion
- Simplest: use `rsvg-convert` or a Node script

If no conversion tool is available, create a simple HTML-based OG image generation script, or use `npx playwright screenshot` approach. The key is producing a 1200x630 PNG.

**Step 2: Update metadata references**

In `frontend/app/[locale]/layout.tsx`, change:
- `og-image.svg` → `og-image.png` (2 occurrences: openGraph.images and twitter.images)

```ts
// openGraph.images
images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: SITE_NAME }],
// twitter.images
images: [`${SITE_URL}/og-image.png`],
```

**Step 3: Commit**

```bash
git add frontend/public/og-image.png frontend/app/[locale]/layout.tsx
git commit -m "feat: convert OG image from SVG to PNG for social platform compatibility"
```

---

## Task 5: Enrich Organization + WebSite Schema

**Files:**
- Modify: `frontend/app/[locale]/layout.tsx` (JSON-LD scripts in body, lines 119-142)

**Step 1: Enhance Organization schema**

Replace the existing Organization JSON-LD with:

```ts
{
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Free online tool to convert any file to Markdown",
  logo: `${SITE_URL}/icon.svg`,
  founder: {
    "@type": "Person",
    name: "박감사",
    alternateName: "Park Gamsa",
  },
  sameAs: [],
}
```

Note: `sameAs` array is empty for now — will be populated as social profiles are created (GitHub, Twitter, etc.).

**Step 2: Add SearchAction to WebSite schema**

Replace the existing WebSite JSON-LD with:

```ts
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/en?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}
```

**Step 3: Commit**

```bash
git add frontend/app/[locale]/layout.tsx
git commit -m "feat: enrich Organization schema with founder/logo, add WebSite SearchAction"
```

---

## Task 6: Add BreadcrumbList Schema Site-Wide

**Files:**
- Create: `frontend/components/breadcrumb-schema.tsx`
- Modify: `frontend/app/[locale]/page.tsx` (homepage)
- Modify: `frontend/app/[locale]/about/page.tsx`
- Modify: `frontend/app/[locale]/security/page.tsx`
- Modify: `frontend/app/[locale]/blog/page.tsx`
- Modify: `frontend/app/[locale]/blog/[slug]/page.tsx`
- Modify: `frontend/app/[locale]/docs/api/page.tsx`
- Modify: each tool page layout (via seo-content.tsx)

**Step 1: Create BreadcrumbSchema component**

```tsx
// frontend/components/breadcrumb-schema.tsx
import { SITE_URL, SITE_NAME } from "@/lib/config";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function BreadcrumbSchema({ items, locale }: { items: BreadcrumbItem[]; locale: string }) {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}/${locale}`,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        ...(item.href ? { item: `${SITE_URL}/${locale}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  );
}
```

**Step 2: Add BreadcrumbSchema to each page type**

For each page, import and add `<BreadcrumbSchema>` with appropriate items. The locale param must be extracted from route params or a server-side function. Examples:

- **Homepage** (`page.tsx`): No breadcrumb needed (it IS the root)
- **About**: `items={[{ name: "About" }]}`
- **Security**: `items={[{ name: "Security" }]}`
- **Blog index**: `items={[{ name: "Blog" }]}`
- **Blog post**: `items={[{ name: "Blog", href: "/blog" }, { name: post.title }]}`
- **API docs**: `items={[{ name: "API Documentation" }]}`
- **Tool pages** (via seo-content.tsx): `items={[{ name: tool.displayName }]}`

For seo-content.tsx, add the BreadcrumbSchema import and render it with the tool name. The locale needs to be passed as a prop or obtained from server context.

**Step 3: Commit**

```bash
git add frontend/components/breadcrumb-schema.tsx frontend/app/[locale]/about/page.tsx frontend/app/[locale]/security/page.tsx frontend/app/[locale]/blog/page.tsx frontend/app/[locale]/blog/[slug]/page.tsx frontend/app/[locale]/docs/api/page.tsx frontend/components/seo-content.tsx
git commit -m "feat: add BreadcrumbList schema to all page types"
```

---

## Task 7: Homepage Content Overhaul

**Files:**
- Modify: `frontend/app/[locale]/page.tsx`
- Modify: `frontend/messages/en.json` (and all 7 other locale files)

**Step 1: Add i18n keys for new homepage content**

Add to the `"home"` section of each message file. English (`en.json`):

```json
{
  "home": {
    "definitionTitle": "What is tomdnow?",
    "definition": "tomdnow is a free web tool that converts 20+ file formats — including PDF, Word, Excel, PowerPoint, HWP, YouTube, and more — to clean Markdown. Files are processed entirely in memory and never stored on servers. No sign-up required.",
    "statsFormats": "20+",
    "statsFormatsLabel": "Supported Formats",
    "statsLanguages": "8",
    "statsLanguagesLabel": "Languages",
    "statsPrice": "$0",
    "statsPriceLabel": "Always Free",
    "comparisonTitle": "How tomdnow Compares",
    "comparisonFeature": "Feature",
    "comparisonFormats": "File Formats",
    "comparisonPrivacy": "Privacy",
    "comparisonCost": "Cost",
    "comparisonSignup": "Sign-up",
    "comparisonTomdnow": "tomdnow",
    "comparisonFormatsTomdnow": "20+ formats",
    "comparisonPrivacyTomdnow": "In-memory, never stored",
    "comparisonCostTomdnow": "Free",
    "comparisonSignupTomdnow": "Not required",
    "comparisonFormatsPandoc": "Many (CLI only)",
    "comparisonPrivacyPandoc": "Local processing",
    "comparisonCostPandoc": "Free (open source)",
    "comparisonSignupPandoc": "N/A",
    "comparisonFormatsCloudConvert": "200+ formats",
    "comparisonPrivacyCloudConvert": "Cloud storage",
    "comparisonCostCloudConvert": "Freemium",
    "comparisonSignupCloudConvert": "Required",
    "comparisonFormatsMarker": "PDF only",
    "comparisonPrivacyMarker": "Local processing",
    "comparisonCostMarker": "Free (open source)",
    "comparisonSignupMarker": "N/A"
  }
}
```

Translate these keys into ko, ja, zh, es, pt, de, fr.

**Step 2: Update homepage component**

In `frontend/app/[locale]/page.tsx`, add after the hero section and before the tool cards:

1. A definitional paragraph section with stats badges
2. A comparison table section

```tsx
{/* Definition — AI-citable content */}
<section className="pb-12">
  <h2 className="text-2xl font-bold text-gray-900 text-center">{t("definitionTitle")}</h2>
  <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
    {t("definition")}
  </p>
  <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
    {[
      { value: t("statsFormats"), label: t("statsFormatsLabel") },
      { value: t("statsLanguages"), label: t("statsLanguagesLabel") },
      { value: t("statsPrice"), label: t("statsPriceLabel") },
    ].map((stat) => (
      <div key={stat.label} className="text-center">
        <div className="text-2xl font-bold text-[#4281A4]">{stat.value}</div>
        <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
      </div>
    ))}
  </div>
</section>
```

Add comparison table after tool cards, before features section:

```tsx
{/* Comparison Table */}
<section className="pb-12">
  <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">{t("comparisonTitle")}</h2>
  <div className="overflow-x-auto rounded-xl border border-gray-200">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#f0edea]">
          <th className="text-left px-4 py-3 font-semibold text-gray-900">{t("comparisonFeature")}</th>
          <th className="text-left px-4 py-3 font-semibold text-[#4281A4]">{t("comparisonTomdnow")}</th>
          <th className="text-left px-4 py-3 font-semibold text-gray-500">Pandoc</th>
          <th className="text-left px-4 py-3 font-semibold text-gray-500">CloudConvert</th>
          <th className="text-left px-4 py-3 font-semibold text-gray-500">Marker</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="px-4 py-3 font-medium text-gray-900">{t("comparisonFormats")}</td>
          <td className="px-4 py-3 text-[#48A9A6]">{t("comparisonFormatsTomdnow")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonFormatsPandoc")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonFormatsCloudConvert")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonFormatsMarker")}</td>
        </tr>
        <tr>
          <td className="px-4 py-3 font-medium text-gray-900">{t("comparisonPrivacy")}</td>
          <td className="px-4 py-3 text-[#48A9A6]">{t("comparisonPrivacyTomdnow")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonPrivacyPandoc")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonPrivacyCloudConvert")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonPrivacyMarker")}</td>
        </tr>
        <tr>
          <td className="px-4 py-3 font-medium text-gray-900">{t("comparisonCost")}</td>
          <td className="px-4 py-3 text-[#48A9A6]">{t("comparisonCostTomdnow")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonCostPandoc")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonCostCloudConvert")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonCostMarker")}</td>
        </tr>
        <tr>
          <td className="px-4 py-3 font-medium text-gray-900">{t("comparisonSignup")}</td>
          <td className="px-4 py-3 text-[#48A9A6]">{t("comparisonSignupTomdnow")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonSignupPandoc")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonSignupCloudConvert")}</td>
          <td className="px-4 py-3 text-gray-500">{t("comparisonSignupMarker")}</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add frontend/app/[locale]/page.tsx frontend/messages/*.json
git commit -m "feat: add AI-citable definition paragraph and comparison table to homepage"
```

---

## Task 8: Expand About Page

**Files:**
- Modify: `frontend/app/[locale]/about/page.tsx`
- Modify: `frontend/messages/en.json` (and all 7 other locale files)

**Step 1: Add expanded i18n keys**

Replace the `"about"` section in each message file. English:

```json
{
  "about": {
    "title": "About tomdnow",
    "metaTitle": "About — tomdnow",
    "metaDescription": "Learn about tomdnow, the free file-to-Markdown converter built by Park Gamsa. Privacy-first, open-source powered.",
    "heroSubtitle": "A free, privacy-first tool to convert any file to Markdown",
    "storyTitle": "Our Story",
    "storyP1": "tomdnow was created by Park Gamsa (박감사), a developer based in South Korea, to solve a simple but persistent problem: converting files to Markdown shouldn't require sign-ups, subscriptions, or trusting a third party with your data.",
    "storyP2": "What started as a personal tool for converting Korean government documents (HWP/HWPX) into Markdown for AI processing quickly grew into a full-featured converter supporting 20+ file formats.",
    "techTitle": "How It Works",
    "techP1": "tomdnow is powered by Microsoft's open-source MarkItDown engine, which means your conversions benefit from enterprise-grade parsing without the enterprise price tag.",
    "techP2": "Every file is processed entirely in memory. Nothing is written to disk, nothing is stored in a database, and nothing persists after your browser tab closes. The conversion happens, you get your Markdown, and the data is gone.",
    "privacyTitle": "Privacy by Design",
    "privacyP1": "We believe privacy isn't a feature — it's a foundation. tomdnow was built from day one with a zero-storage architecture. Your files never touch a permanent storage layer.",
    "privacyP2": "All transfers are encrypted with TLS 1.3, and the conversion backend runs in isolated containers that are recycled regularly.",
    "missionTitle": "Our Mission",
    "missionP1": "Markdown is the universal language of documentation, note-taking, and AI. We want to make it effortless to get any document into Markdown — whether you're a developer, researcher, student, or office worker.",
    "missionP2": "tomdnow will always have a free tier. We believe essential document conversion should be accessible to everyone.",
    "founderTitle": "About the Founder",
    "founderName": "Park Gamsa (박감사)",
    "founderBio": "Software developer based in South Korea, specializing in web applications and document processing tools. Created tomdnow to bridge the gap between proprietary document formats and the open Markdown ecosystem."
  }
}
```

Translate for all 7 other locales.

**Step 2: Update About page component**

```tsx
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
      <p className="mt-2 text-lg text-gray-500">{t("heroSubtitle")}</p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">{t("storyTitle")}</h2>
          <div className="mt-3 space-y-3 text-gray-600 leading-relaxed">
            <p>{t("storyP1")}</p>
            <p>{t("storyP2")}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">{t("techTitle")}</h2>
          <div className="mt-3 space-y-3 text-gray-600 leading-relaxed">
            <p>{t("techP1")}</p>
            <p>{t("techP2")}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">{t("privacyTitle")}</h2>
          <div className="mt-3 space-y-3 text-gray-600 leading-relaxed">
            <p>{t("privacyP1")}</p>
            <p>{t("privacyP2")}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">{t("missionTitle")}</h2>
          <div className="mt-3 space-y-3 text-gray-600 leading-relaxed">
            <p>{t("missionP1")}</p>
            <p>{t("missionP2")}</p>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">{t("founderTitle")}</h2>
          <p className="mt-2 font-medium text-gray-900">{t("founderName")}</p>
          <p className="mt-2 text-gray-600 leading-relaxed">{t("founderBio")}</p>
        </section>
      </div>

      <BreadcrumbSchema locale={locale} items={[{ name: t("title") }]} />
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add frontend/app/[locale]/about/page.tsx frontend/messages/*.json
git commit -m "feat: expand About page with founder info, mission, and technical details"
```

---

## Task 9: Fix Blog Author + Enrich BlogPosting Schema

**Files:**
- Modify: `frontend/content/blog/en/pdf-to-markdown-guide.mdx` (frontmatter)
- Modify: `frontend/content/blog/en/why-markdown-matters.mdx` (frontmatter)
- Modify: `frontend/content/blog/ko/pdf-to-markdown-guide.mdx` (frontmatter)
- Modify: `frontend/content/blog/ko/why-markdown-matters.mdx` (frontmatter)
- Modify: `frontend/app/[locale]/blog/[slug]/page.tsx`

**Step 1: Update all blog frontmatter**

In ALL 4 MDX files, change:
```yaml
author: "tomdnow"
```
to:
```yaml
author: "박감사"
```

**Step 2: Enrich BlogPosting JSON-LD**

In `frontend/app/[locale]/blog/[slug]/page.tsx`, replace the existing JSON-LD script (lines 78-90) with:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        "@type": "Person",
        name: post.author,
        url: `${SITE_URL}/en/about`,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon.svg`,
        },
      },
      image: `${SITE_URL}/og-image.png`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${locale}/blog/${slug}`,
      },
    }),
  }}
/>
```

Note: Import `SITE_URL` — it's already imported as `SITE_NAME` from `@/lib/config`, just add `SITE_URL` to the import.

**Step 3: Add BreadcrumbSchema to blog post page**

Import and add `<BreadcrumbSchema>` with blog > post breadcrumbs.

**Step 4: Commit**

```bash
git add frontend/content/blog/ frontend/app/[locale]/blog/[slug]/page.tsx
git commit -m "feat: update blog author to real name, enrich BlogPosting schema with publisher/image"
```

---

## Task 10: Add FAQ Schema to Security, Blog Index, and API Pages

**Files:**
- Modify: `frontend/app/[locale]/security/page.tsx`
- Modify: `frontend/app/[locale]/blog/page.tsx`
- Modify: `frontend/app/[locale]/docs/api/page.tsx`
- Modify: `frontend/messages/en.json` (and all 7 other locale files)

**Step 1: Add FAQ i18n keys**

Add new keys to each message file under `"securityFaq"`, `"blogFaq"`, and `"apiFaq"` namespaces.

English example for security:
```json
{
  "securityFaq": {
    "q1": "Is my file stored on your servers?",
    "a1": "No. All files are processed entirely in memory and never written to disk. Data is discarded immediately after conversion.",
    "q2": "Is the connection encrypted?",
    "a2": "Yes. All data transfers use TLS 1.3 encryption. Your files are protected in transit between your browser and our servers.",
    "q3": "Can tomdnow employees see my files?",
    "a3": "No. Files exist only in memory during the conversion process. There is no persistent storage, logging, or access mechanism for uploaded content.",
    "q4": "Is tomdnow open source?",
    "a4": "tomdnow is powered by Microsoft's open-source MarkItDown engine. Our conversion backend uses this well-audited library for document processing."
  }
}
```

Similar FAQ keys for blog and API pages. Translate for all 7 other locales.

**Step 2: Add FAQPage schema to Security page**

In `frontend/app/[locale]/security/page.tsx`, add at the end of the component (inside the outer div), after the comparison table:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [1, 2, 3, 4].map((i) => ({
        "@type": "Question",
        name: t(`securityFaq.q${i}` as any),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(`securityFaq.a${i}` as any),
        },
      })),
    }),
  }}
/>
```

Note: The FAQ keys should be nested under the `"security"` namespace OR loaded via a separate `getTranslations("securityFaq")` call. Adapt based on how the message file is structured.

**Step 3: Repeat for Blog index and API docs**

Same pattern — add FAQ JSON-LD to each page. Use blog-relevant and API-relevant questions.

**Step 4: Also add BreadcrumbSchema to Security, Blog index, and API docs pages**

Import and add `<BreadcrumbSchema>` with appropriate items.

**Step 5: Commit**

```bash
git add frontend/app/[locale]/security/page.tsx frontend/app/[locale]/blog/page.tsx frontend/app/[locale]/docs/api/page.tsx frontend/messages/*.json
git commit -m "feat: add FAQ schema to Security, Blog, and API pages for AI citability"
```

---

## Task 11: Build and Verify

**Step 1: Run the Next.js build**

```bash
cd frontend && npm run build
```

Expected: Build should succeed with no errors. Check for any TypeScript errors related to the new components or i18n keys.

**Step 2: Verify JSON-LD output**

Start dev server and inspect page source for:
- Organization schema has logo, founder, sameAs
- WebSite schema has SearchAction
- Homepage has WebApplication schema
- Blog posts have enriched BlogPosting schema
- All pages have BreadcrumbList
- Security/Blog/API have FAQPage schema

**Step 3: Verify sitemap URLs no longer have trailing newline**

```bash
curl -s http://localhost:3000/sitemap.xml | head -20
```

All URLs should be clean without `%0A` or trailing whitespace.

**Step 4: Verify llms.txt is accessible**

```bash
curl -s http://localhost:3000/llms.txt
```

**Step 5: Final commit if any build fixes needed**

```bash
git add -A
git commit -m "fix: build fixes for GEO improvement sprint"
```

---

## Execution Strategy: Parallel Subagent Groups

These tasks can be parallelized as follows:

### Group A (Independent — no message file changes):
- Task 1: SITE_URL .trim()
- Task 2: llms.txt
- Task 3: Canonical + meta robots
- Task 4: OG image conversion
- Task 5: Organization + WebSite schema

### Group B (Message files + Components — must be sequential):
- Task 6: BreadcrumbList component
- Task 7: Homepage content overhaul
- Task 8: About page expansion
- Task 9: Blog author + BlogPosting
- Task 10: FAQ schema expansion

### Group C (After A + B complete):
- Task 11: Build and verify

**Recommended approach:** Run Group A as one subagent (worktree) and Group B as another subagent (worktree), then merge and run Group C in main.
