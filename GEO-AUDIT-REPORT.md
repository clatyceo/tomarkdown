# GEO Content Quality & E-E-A-T Audit Report (v2)

**Site:** tomdnow.com
**Audit Date:** 2026-03-25
**Scope:** AI citability, E-E-A-T signals, content gaps -- pre-IndexNow submission (432 URLs)
**Previous Audit:** 2026-03-24 (v1). This v2 audit reflects fixes already applied (SITE_URL bug, homepage definition, About page expansion, FAQPage schemas, BreadcrumbList, comparison table, OG images) and identifies remaining issues.

---

## EXECUTIVE SUMMARY

tomdnow has made significant progress since v1. The homepage now has a citable definition, the About page is rich with founder details, comparison tables exist, and structured data covers HowTo/FAQPage/BreadcrumbList. However, the site still suffers from three systemic issues that will undermine GEO performance when 432 URLs hit IndexNow:

1. **21 tool pages average ~120 words of unique content each** -- template-driven thin content
2. **Only 2 blog posts** -- insufficient for topical authority
3. **Zero quantitative proof points** -- no speed benchmarks, accuracy metrics, or real user counts

**Overall GEO Readiness: 47/100** (up from 30/100 in v1)

---

## PAGE-BY-PAGE AUDIT

### 1. Homepage (`/en`) -- Citability: 62/100

**Strengths:**
- Definitional paragraph is the strongest AI-citable asset: "tomdnow is a free web tool that converts 20+ file formats -- including PDF, Word, Excel, PowerPoint, HWP, YouTube, and more -- to clean Markdown."
- 4-way comparison table (tomdnow vs Pandoc vs CloudConvert vs Marker) on formats, privacy, cost, sign-up
- WebApplication JSON-LD, trust badges, stats (20+ formats, 8 languages, $0)
- Tool cards with unique subtitles per format

**Gaps:**
- Stats section uses "20+", "8", "$0" but has ZERO real usage numbers -- no "X conversions served," no launch date, no response time
- Comparison table lacks differentiating rows: Speed, Batch Support, API Access, Output Quality
- No testimonials, reviews, or social proof
- No "How it works" technical pipeline section
- No answer to "What is a file-to-Markdown converter?" (the generic category term AIs search for)
- Hero subtitle is marketing copy, not a citable fact

---

### 2. PDF to Markdown (`/en/pdf-to-markdown`) -- Citability: 35/100

**Strengths:**
- HowTo (3 steps) + Why Convert (4 bullets) + FAQ (4 items)
- HowTo, FAQPage, SoftwareApplication JSON-LD schemas
- BreadcrumbSchema component

**SEVERE Gaps (most important page on the site):**
- Total unique readable content: approximately **120 words**. Critically thin.
- **No definitional paragraph.** An AI cannot extract a quotable definition of "PDF to Markdown conversion"
- No before/after conversion example (the single most persuasive content type for a converter tool)
- No accuracy claims, speed claims, or technical explanation
- No mention of the MarkItDown engine (trust signal)
- No comparison with alternatives on this specific page
- No internal link to the blog post `/en/blog/pdf-to-markdown-guide`
- No API code snippet for programmatic conversion
- FAQ answers are 1 sentence each (~12 words average) -- too thin for AI citation
- Why Convert section is 4 bullet fragments (~10 words each) with no explanatory depth
- Missing: supported PDF types (text-based vs scanned), encoding support, page limit info

---

### 3. About Page (`/en/about`) -- Citability: 72/100

**Strengths -- best content page on the site:**
- Substantial multi-paragraph content across 5 sections (Story, Tech, Privacy, Mission, Founder)
- Named founder: Park Gamsa, with specific expertise and origin story
- Credible technical detail: MarkItDown engine, TLS 1.3, isolated containers, zero-storage architecture
- "Thousands of conversions daily across 8 languages" -- the only usage metric on the site
- Quotable mission: "Markdown is the universal language of documentation, note-taking, and AI"

**Gaps:**
- "Thousands of conversions daily" is vague -- "15,000+" would be far more citable
- No external links to verify founder credentials (GitHub, LinkedIn)
- No link to the MarkItDown GitHub repository (external authority signal)
- No timeline/milestones, no founding date
- No headshot of founder (trust signal per E-E-A-T studies)
- No contact email or form
- No business address or registration details

---

### 4. Blog: PDF to Markdown Guide (`/en/blog/pdf-to-markdown-guide`) -- Citability: 55/100

**Strengths:**
- ~400 words, clear 4-section structure (Why, How, Tips, When to Use)
- Practical tips section is genuinely useful
- Published date (2026-03-24) and attributed author (Park Gamsa)

**Gaps:**
- No images, screenshots, or code examples
- No before/after conversion sample
- No comparison with alternative methods
- No internal links to other tool pages or API docs
- No quantitative guidance in Tips section
- No FAQ section

---

### 5. Blog: Why Markdown Matters (`/en/blog/why-markdown-matters`) -- Citability: 58/100

**Strengths:**
- ~450 words with technically sophisticated content
- "Token efficiency" point is uniquely citable
- Names specific tools (ChatGPT, Claude, Gemini, Obsidian, Notion)
- Historical grounding (Markdown created 2004)

**Gaps:**
- No data supporting claims ("uses fewer tokens" -- how many fewer?)
- No external citations or research links
- No code examples showing token count comparison
- No links to specific tomdnow tools for formats mentioned

---

### 6. Security Page (`/en/security`) -- Citability: 60/100

**Strengths:**
- Clear, quotable claims: "Nothing is ever written to disk on our servers"
- Comparison table (tomdnow vs "Other Services")
- FAQPage JSON-LD schema
- Open-source engine mention for trust

**Gaps:**
- "Other Services" is unnamed -- naming SmallPDF, iLovePDF, CloudConvert with factual retention policies would be far more authoritative
- No link to the open-source repository
- No infrastructure provider mention (Railway/AWS)
- No GDPR, SOC 2, or compliance mention
- "Isolated containers recycled regularly" (from About) is NOT on the Security page
- No data flow diagram

---

### 7. Pricing Page (`/en/pricing`) -- Citability: 40/100

**Strengths:**
- Crystal clear: $0/forever with 8-feature list
- "Why is it free?" section provides reasoning

**Gaps:**
- Approximately **80 words** of unique text -- critically thin
- No FAQ section (every pricing page needs FAQ)
- No comparison with paid alternatives' pricing
- No explanation of business model sustainability
- No detail on what happens beyond 50 API requests/day

---

## TEMPLATE-DRIVEN TOOL PAGES -- SYSTEMIC ISSUE

All 21 tool pages use an identical skeleton:

```
[h1] -> [subtitle: 1 sentence] -> [Upload widget] ->
[How to: 3 steps, ~30 words] -> [Why: 4 bullets, ~10 words each] ->
[FAQ: 3-4 items, ~15 words per answer]
```

**Unique content per page: ~100-130 words.**

Pages with the least content (3 FAQ items): XLS, MSG, JSON, XML, TXT.
Pages with slightly more value: HWP (explains format), HWPX (compares to HWP), OCR (lists 8 languages), YouTube (URL input, timestamps).

This is a thin-content risk under Google's Helpful Content system for programmatic pages.

---

## E-E-A-T SIGNAL AUDIT

| Signal | Score | Assessment |
|--------|-------|------------|
| **Experience** | 25/100 | No case studies, no conversion examples, no user testimonials, no screenshots |
| **Expertise** | 50/100 | MarkItDown engine mentioned, TLS 1.3, zero-storage architecture. Missing: code samples, technical blog posts, OSS contributions |
| **Authoritativeness** | 30/100 | Only 2 blog posts. No external citations, no Product Hunt badges shown, no GitHub stars, no press mentions |
| **Trustworthiness** | 55/100 | HTTPS, privacy policy, security page, founder named. Missing: contact email, business address, compliance certifications |

---

## BLOG VOLUME ASSESSMENT

**Current state:** 2 posts, both published 2026-03-24 (same day -- looks like launch padding).

**Minimum needed for topical authority:** 15-20 posts.

**Missing blog posts that should exist:**
1. "PDF to Markdown: Comparing 5 Methods (tomdnow vs Pandoc vs Python vs CloudConvert vs Marker)"
2. "How to Use Markdown with ChatGPT and Claude for Better AI Results"
3. "HWP to Markdown: Converting Korean Government Documents for AI"
4. "Excel to Markdown Tables: A Complete Guide"
5. "YouTube Transcript to Markdown: A Study Hack for Students"
6. "What is MarkItDown? Microsoft's Open-Source Document Converter"
7. "Building an AI Knowledge Base with Markdown Conversion"
8. "OCR to Markdown: Digitizing Scanned Documents"
9. "Batch File Conversion: Converting Multiple Documents at Once"
10. "tomdnow API Tutorial: Automate Conversion with REST"

---

## CONSOLIDATED ISSUE LIST

```
[CRITICAL] Thin tool pages -- 21 pages with ~100-130 words unique content each
- Where: All /en/*-to-markdown pages
- What's wrong: Template skeleton with minimal unique text. Near-identical
  structure. Google's helpful content system targets low-quality programmatic pages.
- Fix: Add to EACH tool page: (1) 150-word definitional paragraph unique to
  that format, (2) before/after conversion example, (3) expand FAQ answers to
  2-3 sentences each, (4) "Limitations" section, (5) internal links to blog
  posts and API docs. Target 500+ words unique content per page.

[CRITICAL] Only 2 blog posts -- insufficient for topical authority
- Where: /en/blog/
- What's wrong: 2 posts published on the same day. Competing sites have
  50-100+ articles. No publishing cadence established.
- Fix: Publish 10+ blog posts before relying on IndexNow for authority.
  800-1500 words each. Cover top conversion use cases, comparisons, tutorials.

[CRITICAL] No quantitative data anywhere on the site
- Where: All pages
- What's wrong: Zero conversion speed benchmarks, zero accuracy metrics, zero
  user count, zero total conversions. AI systems strongly prefer citable numbers.
- Fix: Add real metrics: "Converts a 100-page PDF in under 5 seconds,"
  "Preserves 95%+ document headings and lists," "10,000+ conversions served
  daily," "Users in 140+ countries." Display on homepage, About, tool pages.

[HIGH] PDF-to-Markdown page lacks a definitional paragraph
- Where: /en/pdf-to-markdown
- What's wrong: Most important page has no paragraph an AI can cite to
  answer "How do I convert PDF to Markdown?" or "What is a PDF to Markdown
  converter?"
- Fix: Add 100-150 word paragraph: "PDF to Markdown conversion is the process
  of extracting text, headings, tables, and links from a PDF document and
  reformatting them as clean Markdown syntax. tomdnow uses Microsoft's
  open-source MarkItDown engine to parse PDFs entirely in memory..."

[HIGH] No before/after conversion examples anywhere
- Where: All tool pages, blog posts
- What's wrong: Users and AI systems cannot see what conversion output
  looks like.
- Fix: Add static "Example" section to each tool page showing sample input
  and corresponding Markdown output.

[HIGH] No contact information
- Where: Site-wide
- What's wrong: No email, no contact form, no business address.
  Direct E-E-A-T trust failure.
- Fix: Add contact email to footer, About page, and Privacy Policy.

[HIGH] Pricing page has no FAQ
- Where: /en/pricing
- What's wrong: ~80 words of content. No FAQ, no comparison, no
  API limit details.
- Fix: Add FAQ: "Will it always be free?" "What are the API rate limits?"
  "Is there a paid plan?" Add pricing comparison table.

[HIGH] Founder lacks verifiable credentials
- Where: /en/about
- What's wrong: Bio mentions expertise but provides zero verifiable proof.
- Fix: Add links to GitHub profile, LinkedIn. Add experience duration.
  Consider adding headshot.

[HIGH] Security comparison uses "Other Services" instead of named competitors
- Where: /en/security
- What's wrong: Unattributed claims are less credible and less citable.
- Fix: Name SmallPDF, iLovePDF, CloudConvert with their documented
  retention policies. Link to their security pages as sources.

[MEDIUM] No internal cross-linking between tool pages and blog posts
- Where: All tool pages, all blog posts
- What's wrong: PDF blog guide doesn't link to PDF tool page. Tool pages
  don't link to blog content.
- Fix: Add "Learn more" links from tool pages to blog posts. Add "Related
  tools" section at bottom of each tool page.

[MEDIUM] FAQ answers too short for AI citation
- Where: All tool pages, security page
- What's wrong: Most FAQ answers are 1 sentence (8-15 words). AI prefers
  self-contained 2-3 sentence answers.
- Fix: Expand every FAQ answer. Example: "Is this tool free?" -> "Yes,
  tomdnow's PDF to Markdown converter is completely free with no sign-up
  required. There are no usage limits for web conversions, and the tool
  supports files up to 10MB."

[MEDIUM] Homepage comparison table missing key rows
- Where: /en
- What's wrong: Compares formats, privacy, cost, sign-up -- but not speed,
  accuracy, batch capability, API access.
- Fix: Add rows for conversion speed, batch support, API availability,
  output quality.

[MEDIUM] Privacy Policy is too thin
- Where: /en/privacy
- What's wrong: 4 short paragraphs, ~60 words. Does not meet GDPR standard.
- Fix: Expand: data controller identity, lawful basis, retention policy,
  cookies, third-party services, user rights, international transfers.

[MEDIUM] No "Last updated" date on tool pages
- Where: All tool pages
- What's wrong: No freshness signal for AI and search systems.
- Fix: Add "Last updated" or "Content verified" date.

[MEDIUM] Blog posts have no images or visual content
- Where: Both blog posts
- What's wrong: Pure text. Lower engagement and shareability.
- Fix: Add screenshots, diagrams, or conversion examples.

[LOW] "tomdnow" brand name is not defined
- Where: All pages
- What's wrong: No explanation of name meaning or pronunciation.
- Fix: Add to About page: "tomdnow ('to Markdown now') reflects our
  mission of instant document conversion."

[LOW] No RSS feed for blog
- Where: /en/blog
- What's wrong: No syndication for aggregators and AI training pipelines.
- Fix: Add RSS/Atom feed at /blog/feed.xml.

[LOW] Duplicate FAQ "Is this tool free?" on every tool page
- Where: All 21 tool pages
- What's wrong: Identical Q&A on every page -- template padding signal.
- Fix: Customize per tool or replace with tool-specific questions on half.

[LOW] Organization schema could be richer
- Where: Homepage
- What's wrong: Missing founder as Person, foundingDate, contactPoint.
- Fix: Add these fields to Organization JSON-LD.
```

---

## INDEXNOW URL QUALITY WARNING

432 URLs = 8 locales x ~54 pages. If tool pages in non-English locales contain machine-translated versions of already-thin English content (~120 words), submitting 168 thin tool page URLs (21 tools x 8 locales) to IndexNow risks:

1. Triggering Google's helpful content classifier on the entire domain
2. Diluting crawl budget across thin pages
3. AI systems indexing low-quality locale variants instead of English originals

**Recommendation:** Only submit URLs with 300+ words of unique, human-reviewed content. Current safe subset:
- Homepage (8 locales) = 8
- About (8 locales) = 8
- Security (8 locales) = 8
- Blog posts (2 x 8 locales) = 16
- Top 5 tool pages IF expanded first = 40
- **Safe total: ~80 URLs** until content is expanded

---

## PRIORITY ACTION PLAN

### Before IndexNow Submission (1-3 days):
1. Add definitional paragraphs to top 5 tool pages (PDF, DOCX, YouTube, HWP, OCR)
2. Expand all FAQ answers to 2-3 sentences
3. Add quantitative claims to homepage and About page
4. Add contact email to footer and About page
5. Publish 3-5 additional blog posts

### Within 2 Weeks:
6. Add before/after examples to top 5 tool pages
7. Add internal cross-links between tools and blog
8. Expand Privacy Policy
9. Name competitors in Security comparison
10. Add founder credential links

### Within 1 Month:
11. Expand all 21 tool page definitional paragraphs
12. Reach 10+ total blog posts
13. Add RSS feed
14. Add case studies or testimonials
15. Create "Markdown Conversion Guide" pillar page
