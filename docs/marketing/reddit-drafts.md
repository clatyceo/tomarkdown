# Reddit Post Drafts

---

## r/ObsidianMD Draft

**Title:** I built a free tool to convert PDF, Word, HWP, and 17 other formats to Markdown for Obsidian

**Body:**

Hey everyone. I've been using Obsidian as my primary knowledge base for a while, and I kept running into the same problem: I'd find a useful PDF paper, receive a Word doc, or get a government document in HWP format (Korean standard), and I'd want it in my vault as a proper Markdown note -- searchable, linkable, taggable.

So I built [tomdnow](https://tomdnow.com), a free web tool that converts 20+ file formats directly to Markdown. The formats most relevant to Obsidian users:

- **PDF** -- academic papers, reports, ebooks
- **DOCX** -- meeting notes, shared docs from colleagues
- **PPTX** -- lecture slides, presentations you want to study
- **EPUB** -- books and long-form reading
- **HTML** -- web articles you want to save permanently
- **Images (OCR)** -- handwritten notes, screenshots with text
- **YouTube** -- pulls transcript from a video URL

The output is clean Markdown with preserved headings, lists, and tables. You can copy it directly into a new Obsidian note or download the .md file into your vault folder.

**Privacy note:** Files are processed entirely in memory on the server and never stored. No sign-up required. I built this for my own documents (including tax filings), so the zero-storage architecture was non-negotiable.

**Honest limitations:** Very complex PDF layouts (multi-column academic papers) can sometimes lose structure. OCR quality depends on image resolution. Tables from Excel are clean, but heavily merged-cell spreadsheets can get messy.

It's open source: [github.com/clatyceo/tomdnow](https://github.com/clatyceo/tomdnow)

Would love to hear how other Obsidian users handle document ingestion into their vaults. What formats do you convert most often?

---

## r/Markdown Draft

**Title:** Free, open-source converter for 20+ formats to Markdown (PDF, DOCX, XLSX, YouTube, HWP, and more)

**Body:**

I built [tomdnow](https://tomdnow.com) -- a free web tool focused on converting as many file formats as possible to clean, usable Markdown.

**Currently supported (20+ formats):**

| Category | Formats |
|----------|---------|
| Documents | PDF, DOCX, PPTX, XLSX/XLS, HWP, HWPX, RTF, MSG (Outlook) |
| Data | CSV, JSON, XML, IPYNB (Jupyter), ZIP, TXT |
| Media | HTML, EPUB, Images (OCR), YouTube transcripts |

The conversion engine is Microsoft's open-source [MarkItDown](https://github.com/microsoft/markitdown) library. I've extended it with a web UI, API layer, and additional format support (especially for Korean HWP/HWPX documents, which almost no other tool handles).

**What I focused on:**

- **Output quality** -- tables should be proper Markdown tables, headings should preserve hierarchy, lists should be clean. Not just "technically Markdown" but actually readable.
- **Privacy** -- files processed in memory only, never stored. No account required.
- **Accessibility** -- 8 languages, simple drag-and-drop UI, no setup needed.

**Free API** for developers: 50 requests/day, straightforward REST endpoint. Useful for batch processing scripts or integrating conversion into your own tools.

**Limitations I'll be honest about:** PDF conversion quality varies with document complexity. Scanned-image PDFs require the OCR path and results depend on image quality. Some complex spreadsheet formatting (heavy cell merging, conditional formatting) doesn't translate perfectly.

Open source (AGPL): [github.com/clatyceo/tomdnow](https://github.com/clatyceo/tomdnow)

Feedback on conversion quality for any format is very welcome -- open an issue or comment here.

---

## r/selfhosted Draft

**Title:** Self-hostable file-to-Markdown converter -- Docker-ready, 20+ formats, free API

**Body:**

I've been building [tomdnow](https://tomdnow.com), a file-to-Markdown converter that supports 20+ formats (PDF, DOCX, XLSX, PPTX, HWP, EPUB, HTML, images via OCR, YouTube transcripts, and more). The hosted version is free, but since this is r/selfhosted, here's what matters:

**Self-hosting:**

The project is open source (AGPL) and Docker-ready. The architecture is two containers:

- **Frontend:** Next.js 16 app (React Server Components)
- **Backend:** FastAPI + Microsoft MarkItDown engine (Python)

```yaml
# docker-compose.yml (simplified)
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:8000
  backend:
    build: ./backend
    ports:
      - "8000:8000"
```

The backend does the heavy lifting. If you only want the API without the web UI, you can run just the backend container and hit the REST endpoints directly.

**Why self-host this?**

- **Document privacy** -- even though the hosted version processes files in memory and stores nothing, self-hosting means your documents never leave your network at all.
- **No rate limits** -- the hosted API has a 50 req/day free tier. Self-hosted, there are no limits.
- **Internal tooling** -- integrate the API into your document processing pipelines, CI/CD, or knowledge base workflows.

**The API is simple:**

```bash
curl -X POST http://localhost:8000/convert \
  -F "file=@document.pdf"
# Returns JSON with markdown field
```

**What it converts:** PDF, DOCX, PPTX, XLSX, XLS, HWP, HWPX, RTF, CSV, JSON, XML, IPYNB, ZIP, TXT, HTML, EPUB, MSG, images (OCR), YouTube transcripts. Basically anything text-based or document-shaped.

**Honest notes:** Resource usage depends on what you're converting. OCR and large PDFs are the most CPU-intensive. The Python backend needs a few hundred MB of RAM at minimum. Complex conversions can spike higher.

GitHub: [github.com/clatyceo/tomdnow](https://github.com/clatyceo/tomdnow)

Happy to answer questions about the architecture or self-hosting setup.
