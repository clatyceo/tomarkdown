# GEO Improvement Sprint Design

**Date:** 2026-03-24
**Approach:** Full Sprint (Approach B)
**Target:** GEO Score 35/100 → ~60/100
**Founder Name:** 박감사 (Park Gamsa)

---

## Phase 1: Critical Bug Fixes (5 min)

### 1-1. SITE_URL .trim()
- File: `frontend/lib/config.ts`
- Add `.trim()` to SITE_URL export
- Fixes 432 sitemap URLs + all JSON-LD structured data

### 1-2. llms.txt
- File: `frontend/public/llms.txt`
- Describe tool, supported formats, API, key pages
- Follow llms.txt spec

---

## Phase 2: Content Overhaul (core work)

### 2-1. Homepage Definitional Paragraph + Comparison Table
- Add AI-citable definitional paragraph
- Add competitor comparison table (tomdnow vs Pandoc vs CloudConvert vs Marker)
- Add quantitative data: 20+ formats, in-memory processing, zero server storage
- Location: homepage component + i18n messages

### 2-2. About Page Expansion (85 words → 500+)
- Founder: 박감사 (Park Gamsa)
- Background, development motivation, technical approach
- Privacy-first philosophy, mission, vision
- Location: `frontend/app/[locale]/about/page.tsx` + i18n messages

### 2-3. Blog Author → Real Person
- Change author from "tomdnow" to "박감사"
- Update BlogPosting schema: Person with name, url
- Files: blog MDX frontmatter + blog post page component

### 2-4. Tool Page Quantitative Data
- Add specific numbers: format count, processing method
- Strengthen citable content on tool pages

---

## Phase 3: Schema Enrichment

### 3-1. BreadcrumbList (site-wide)
- Add to layout.tsx for all pages
- Structure: Home > Category > Page

### 3-2. Organization Schema Enhancement
- Add: logo, sameAs (GitHub repo), contactPoint (email)
- File: `frontend/app/[locale]/layout.tsx`

### 3-3. BlogPosting Enhancement
- Add: publisher (Organization), image, dateModified
- File: `frontend/app/[locale]/blog/[slug]/page.tsx`

### 3-4. WebSite SearchAction
- Add potentialAction with search URL template
- File: `frontend/app/[locale]/layout.tsx`

### 3-5. FAQ Schema Expansion
- Add FAQPage schema to: Security, Blog index, API docs
- Currently only on tool pages

---

## Phase 4: Technical GEO

### 4-1. Canonical Tags
- Add canonical URL to all page metadata
- Use absolute URLs with correct locale prefix

### 4-2. OG Image SVG → PNG
- Convert `frontend/public/og-image.svg` to PNG (1200x630)
- Update all metadata references

### 4-3. Meta Robots
- Add `index, follow` to main pages via metadata

---

## Phase 5: i18n Sync

- Update all 8 locale message files (en, ko, ja, zh, es, pt, de, fr)
- Homepage definitional paragraph + comparison table
- About page expanded content
- Any new FAQ content

---

## Expected Score Improvement

| Category | Current | Target | Delta |
|----------|---------|--------|-------|
| AI Citability (25%) | 42 | 65 | +23 |
| Brand Authority (20%) | 3 | 8 | +5 |
| Content E-E-A-T (20%) | 28 | 52 | +24 |
| Technical GEO (15%) | 62 | 82 | +20 |
| Schema (10%) | 38 | 72 | +34 |
| Platform (10%) | 5 | 5 | 0 |
| **Overall** | **35** | **~60** | **+25** |

---

## Execution Strategy

Parallel subagent execution:
- **Agent A:** Phase 1 + Phase 4 (bug fixes + technical GEO)
- **Agent B:** Phase 2 (content overhaul)
- **Agent C:** Phase 3 (schema enrichment)
- **Agent D:** Phase 5 (i18n sync, after Phase 2 completes)
