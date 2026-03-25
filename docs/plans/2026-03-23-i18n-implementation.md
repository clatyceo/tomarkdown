# i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** next-intl 기반 8개 언어(en/ko/ja/zh/es/pt/de/fr) 다국어 지원. SEO 로컬라이징 포함.

**Architecture:** next-intl middleware로 로캘 감지 → `[locale]` 동적 라우트 → 언어별 JSON 번역 파일. tools.ts는 구조만 유지, 텍스트는 번역 파일에서 로드. 번역은 SEO 로컬라이징 프롬프트로 Claude 에이전트가 수행.

**Tech Stack:** next-intl, Next.js 16 App Router

**Design doc:** `docs/plans/2026-03-23-i18n-design.md`

**Project root:** `/Users/refineworld/Desktop/claude_code/alltomd/`

---

### Task 1: Install next-intl + Create i18n Config

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/i18n/config.ts`
- Create: `frontend/i18n/request.ts`
- Create: `frontend/i18n/navigation.ts`
- Create: `frontend/middleware.ts`
- Modify: `frontend/next.config.ts`

**Step 1: Install next-intl**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/frontend
npm install next-intl
```

**Step 2: Create i18n/config.ts**

```ts
export const locales = ["en", "ko", "ja", "zh", "es", "pt", "de", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

**Step 3: Create i18n/request.ts**

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./navigation";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Step 4: Create i18n/navigation.ts**

```ts
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

**Step 5: Create middleware.ts**

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/navigation";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

**Step 6: Update next.config.ts**

Add next-intl plugin:
```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

**Step 7: Commit**

```bash
git add frontend/
git commit -m "feat: install next-intl and create i18n configuration"
```

---

### Task 2: Create English Base Translation File

**Files:**
- Create: `frontend/messages/en.json`

Create the complete English translation file with ALL ~415 keys. Structure:

```json
{
  "common": { ... },
  "nav": { ... },
  "home": { ... },
  "tools": { "pdf": { ... }, "docx": { ... }, ... },
  "seo": { ... },
  "about": { ... },
  "privacy": { ... },
  "terms": { ... },
  "meta": {
    "title": "ToMarkdown — Convert Any File to Markdown",
    "description": "Free online tool to convert PDF, Word, YouTube videos and more to clean Markdown files."
  }
}
```

Extract ALL hardcoded strings from:
- `app/page.tsx` → `home.*`
- `components/header.tsx` → `nav.*`
- `components/footer.tsx` → `common.*`, `nav.*`
- `components/file-uploader.tsx` → `common.*`
- `components/url-input.tsx` → `common.*`
- `components/download-button.tsx` → `common.*`
- `components/converter-page.tsx` → `common.*`
- `components/seo-content.tsx` → `seo.*`
- `lib/tools.ts` → `tools.*` (all 15 tools: title, h1, displayName, subtitle, seo, howTo, whyConvert, faq)
- `app/about/page.tsx` → `about.*`
- `app/privacy/page.tsx` → `privacy.*`
- `app/terms/page.tsx` → `terms.*`

**Step 1: Commit**

```bash
git add frontend/messages/
git commit -m "feat: create English base translation file (en.json)"
```

---

### Task 3: Translate to 7 Languages

**Files:**
- Create: `frontend/messages/ko.json`
- Create: `frontend/messages/ja.json`
- Create: `frontend/messages/zh.json`
- Create: `frontend/messages/es.json`
- Create: `frontend/messages/pt.json`
- Create: `frontend/messages/de.json`
- Create: `frontend/messages/fr.json`

Use SEO-localization prompt (from design doc) to translate en.json into each language. Dispatch 7 parallel agents, one per language.

**Translation prompt per agent:**
```
You are a professional localization specialist for {language}.

Task: Translate the English JSON translation file for "ToMarkdown" — a free online file-to-markdown converter.

Rules:
1. SEO-first: Use actual search terms people type in {language}
2. Natural, not literal: Translate meaning, not words
3. Keep "Markdown", "ToMarkdown", file extensions as-is
4. UI brevity: Button text must be short
5. Legal pages: Formal register
6. SEO keywords: Use actual {language} search terms, not translations
7. FAQ tone: Conversational but professional

Input: {en.json}
Output: Complete translated JSON with identical structure and keys.
```

**Step 1: Commit**

```bash
git add frontend/messages/
git commit -m "feat: add translations for ko, ja, zh, es, pt, de, fr"
```

---

### Task 4: Move Routes to [locale] Directory

**Files:**
- Move all `app/*.tsx` and `app/*/` into `app/[locale]/`
- Create new root `app/layout.tsx` (minimal, for next-intl)
- Modify: `app/[locale]/layout.tsx` (moved from app/layout.tsx)

**Step 1: Restructure app directory**

```bash
cd frontend/app
mkdir -p [locale]
# Move all pages and routes into [locale]/
mv page.tsx [locale]/
mv about [locale]/
mv privacy [locale]/
mv terms [locale]/
mv pdf-to-markdown [locale]/
mv docx-to-markdown [locale]/
mv pptx-to-markdown [locale]/
mv xlsx-to-markdown [locale]/
mv xls-to-markdown [locale]/
mv msg-to-markdown [locale]/
mv html-to-markdown [locale]/
mv epub-to-markdown [locale]/
mv image-to-markdown [locale]/
mv csv-to-markdown [locale]/
mv json-to-markdown [locale]/
mv xml-to-markdown [locale]/
mv ipynb-to-markdown [locale]/
mv zip-to-markdown [locale]/
mv youtube-to-markdown [locale]/
mv globals.css [locale]/
```

Keep `app/api/` at root level (API routes don't need locale).

**Step 2: Create new root app/layout.tsx**

Minimal root layout:
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

**Step 3: Update app/[locale]/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Sora, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument", display: "swap" });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://tomarkdown.com"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tomarkdown.com/${l}`])
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${sora.variable} ${instrumentSerif.variable} font-sans antialiased bg-[#f5f5fa] text-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-15">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Step 4: Commit**

```bash
git add frontend/app/
git commit -m "feat: restructure routes under [locale] directory"
```

---

### Task 5: Update Components to Use Translations

**Files:**
- Modify: `frontend/components/header.tsx`
- Modify: `frontend/components/footer.tsx`
- Modify: `frontend/components/converter-page.tsx`
- Modify: `frontend/components/file-uploader.tsx`
- Modify: `frontend/components/url-input.tsx`
- Modify: `frontend/components/download-button.tsx`
- Modify: `frontend/components/seo-content.tsx`

Each component: replace hardcoded strings with `useTranslations()` calls.

Example for file-uploader.tsx:
```tsx
import { useTranslations } from "next-intl";
// ...
const t = useTranslations("common");
// Replace "Drag & drop your file here" with t("dragDrop")
// Replace "or click to browse" with t("orBrowse")
// etc.
```

**Step 1: Commit**

```bash
git add frontend/components/
git commit -m "feat: replace hardcoded strings with useTranslations in all components"
```

---

### Task 6: Update Pages to Use Translations

**Files:**
- Modify: `frontend/app/[locale]/page.tsx`
- Modify: `frontend/app/[locale]/about/page.tsx`
- Modify: `frontend/app/[locale]/privacy/page.tsx`
- Modify: `frontend/app/[locale]/terms/page.tsx`
- Modify: `frontend/lib/tools.ts` (remove text, keep structure + i18n key references)

Home page: use `getTranslations("home")` for hero/features.
Tool pages: use `getTranslations("tools.pdf")` etc for tool-specific text.
Static pages: use `getTranslations("about")` etc.

**tools.ts transformation:**
- Remove all text fields (title, h1, displayName, subtitle, seo, howTo, whyConvert, faq)
- Keep: slug, type, inputMode, accept, placeholder, category, icon, color
- Add: `key: string` (e.g., "pdf", "docx") for translation namespace lookup

Components use `t(`tools.${tool.key}.h1`)` pattern.

**Step 1: Commit**

```bash
git add frontend/
git commit -m "feat: update all pages and tools.ts to use i18n translations"
```

---

### Task 7: Update SEO (Sitemap, Robots, Metadata)

**Files:**
- Modify: `frontend/app/sitemap.ts`
- Modify: `frontend/app/robots.ts`

**sitemap.ts:** Generate URLs for all locales:
```ts
import { locales } from "@/i18n/config";
import { tools } from "@/lib/tools";
import { SITE_URL } from "@/lib/config";

export default function sitemap() {
  const toolSlugs = Object.values(tools).map((t) => t.slug);
  const entries = [];

  for (const locale of locales) {
    entries.push({ url: `${SITE_URL}/${locale}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 });
    for (const slug of toolSlugs) {
      entries.push({ url: `${SITE_URL}/${locale}/${slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 });
    }
    entries.push({ url: `${SITE_URL}/${locale}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 });
    entries.push({ url: `${SITE_URL}/${locale}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 });
    entries.push({ url: `${SITE_URL}/${locale}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 });
  }

  return entries;
}
```

**Step 1: Commit**

```bash
git add frontend/
git commit -m "feat: update sitemap and robots for multi-locale SEO"
```

---

### Task 8: Build Verification + Push

**Step 1: Build**
```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/frontend
npm run build
```

**Step 2: Run tests**
```bash
npm test
```

**Step 3: Push**
```bash
cd /Users/refineworld/Desktop/claude_code/alltomd
git push origin main
```

---

## Task Summary

| # | Task | Scope |
|---|------|-------|
| 1 | Install next-intl + i18n config | 설정 파일 6개 |
| 2 | Create en.json base translation | ~415키 영어 파일 |
| 3 | Translate to 7 languages | 7개 병렬 에이전트 |
| 4 | Move routes to [locale] | 디렉토리 재구성 |
| 5 | Update components with useTranslations | 컴포넌트 7개 |
| 6 | Update pages + tools.ts | 페이지 + 도구 설정 |
| 7 | Update SEO (sitemap, robots) | 다국어 URL |
| 8 | Build verification + push | 검증 |
