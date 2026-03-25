# Product Hunt Launch Draft

## Tagline (60 chars max)

> Convert 20+ file formats to clean Markdown. Free & private.

(57 characters)

## Description (260 chars max)

> Free, open-source tool that converts PDF, Word, Excel, PowerPoint, HWP, EPUB, images (OCR), YouTube transcripts, and 13 more formats to clean Markdown. Files processed in memory only — never stored. No sign-up. 8 languages. Free API. Powered by Microsoft MarkItDown.

(269 chars — trim to 260 below)

> Free, open-source tool converting PDF, Word, Excel, HWP, images (OCR), YouTube transcripts & 14 more formats to Markdown. Files processed in memory — never stored. No sign-up. 8 languages. Free API. Powered by Microsoft MarkItDown.

(233 characters)

## Topics

- open-source
- developer-tools
- productivity
- markdown

## Pricing

Free

---

## First Comment (Maker's Story)

Hi Product Hunt! I'm Park Gamsa, a developer based in South Korea. I want to share the story behind tomdnow.

**The problem that started everything:** In Korea, government and corporate documents come in a format called HWP (Hangul Word Processor). If you've never heard of it, that's the point — it's a format almost nobody outside Korea supports. I needed to feed these documents into AI tools like ChatGPT and Claude for analysis, but there was no clean way to convert HWP files to Markdown. Pandoc doesn't support it. CloudConvert kind of does, but it's paid and lossy. I was stuck.

**So I built something.** I discovered Microsoft's open-source MarkItDown engine and started building a simple web UI around it. HWP conversion was the initial goal, but once the architecture was in place, I kept going: PDF, Word, Excel, PowerPoint, EPUB, HTML, CSV, JSON, XML, Jupyter notebooks, Outlook emails, images with OCR, even YouTube transcript extraction. It grew to 20+ formats.

**Privacy was non-negotiable from day one.** Every file is processed entirely in memory. Nothing is written to disk. Nothing is stored. When the conversion is done, the data is gone. No sign-up, no tracking of your files, no accounts required. I wanted to build the tool I'd trust with my own sensitive documents.

**The technical side:** The frontend is Next.js with React Server Components. The conversion backend runs on FastAPI with the MarkItDown engine. Everything is containerized — the backend on Railway, the frontend on Vercel. File processing happens in isolated containers with TLS 1.3 encryption in transit.

**It's open source** under AGPL, and there's a free REST API (50 requests/day) for developers who want to integrate Markdown conversion into their own workflows.

I built tomdnow because I needed it. I'm sharing it because I think others need it too — especially anyone working across languages, dealing with legacy document formats, or building AI workflows that depend on clean text input.

Would love your feedback. What formats should I add next?

Site: https://tomdnow.com
GitHub: https://github.com/clatyceo/tomdnow
API docs: https://tomdnow.com/en/docs/api

---

## 5 Gallery Image Ideas

### Image 1: Hero — The Conversion Flow
A clean screenshot or animated GIF showing a user dragging a PDF file onto the converter, the processing animation, and the resulting Markdown output displayed in the editor. Split-screen: original file on the left, clean Markdown on the right.

### Image 2: Format Grid
A visual grid showing all 20+ supported format icons (PDF, DOCX, XLSX, PPTX, HWP, EPUB, CSV, JSON, etc.) with arrows pointing to a central Markdown icon. Emphasizes breadth of support. Clean, colorful, easy to scan.

### Image 3: Privacy Architecture Diagram
A simple infographic showing the data flow: User uploads file → File processed in memory → Markdown returned → File data deleted. Highlight "zero storage" with a crossed-out database icon. Trust-building visual.

### Image 4: HWP Conversion Demo (Unique Angle)
Animated GIF showing a Korean government HWP document being converted to Markdown. This is the differentiator — show something Product Hunt users have never seen before. Include a brief caption: "Korean HWP documents, finally convertible."

### Image 5: API in Action
A terminal or code editor screenshot showing a simple cURL command hitting the tomdnow API, with the JSON response containing clean Markdown output. Demonstrates the developer experience. Could also show a Python snippet using the API.
