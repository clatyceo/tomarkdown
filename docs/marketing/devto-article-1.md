---
title: "How I Built a Free File-to-Markdown Converter for 20+ Formats"
published: false
tags: opensource, webdev, markdown, productivity
---

# How I Built a Free File-to-Markdown Converter for 20+ Formats

I'm Park Gamsa, a developer based in South Korea. I built [tomdnow](https://tomdnow.com) -- a free, open-source web tool that converts 20+ file formats to clean Markdown. Here's the full story of how a frustration with Korean document formats turned into something much bigger.

## The Problem: Korean Government Docs Meet AI

In South Korea, there is a word processor called Hangul (HWP). It's everywhere. Government filings, corporate reports, university submissions, tax documents -- if it's official, it's probably HWP.

The problem? Almost nothing outside Korea can read HWP files. Pandoc doesn't support it. LibreOffice has limited, unreliable support. Google Docs can't touch it.

I was trying to feed Korean government documents into AI tools (ChatGPT, Claude) for analysis. These tools work best with plain text or Markdown. But my source material was locked in HWP format. Copy-pasting from the Hangul viewer mangled tables and formatting. I needed a real converter.

## The Solution: Microsoft MarkItDown

While researching options, I found Microsoft's open-source [MarkItDown](https://github.com/microsoft/markitdown) library. It's a Python engine that converts a wide range of file formats to Markdown. PDF, Word, Excel, PowerPoint, HTML, and more. The output quality was surprisingly good, especially for structured documents.

MarkItDown didn't support HWP out of the box, but it gave me a solid foundation. I could extend it for Korean formats and wrap the whole thing in a web interface anyone could use.

That's how tomdnow started.

## Tech Stack Deep Dive

The architecture is split into two parts:

**Frontend: Next.js 16 on Vercel**

```
Framework:  Next.js 16 (React Server Components)
Hosting:    Vercel (Edge network)
Languages:  8 (EN, KO, JA, ZH, ES, PT, DE, FR)
Styling:    Tailwind CSS
```

The frontend handles file selection, upload UI, and Markdown display/download. React Server Components let me keep the initial page load fast while handling the interactive conversion flow client-side.

Internationalization was important from the start. The tool supports 8 languages -- not as an afterthought, but because the core use case (Korean documents) already demanded multi-language thinking.

**Backend: FastAPI on Railway**

```python
from fastapi import FastAPI, UploadFile
from markitdown import MarkItDown

app = FastAPI()
md_converter = MarkItDown()

@app.post("/convert")
async def convert_file(file: UploadFile):
    content = await file.read()
    # Process entirely in memory
    result = md_converter.convert_stream(content, file.filename)
    return {"markdown": result.text_content}
    # content is garbage collected -- never written to disk
```

This is simplified, but it captures the core idea. The file goes in as bytes, gets processed by MarkItDown, and the Markdown comes back. No temp files. No disk writes.

The backend runs on Railway inside isolated containers. Each conversion request gets processed, the response is sent, and the data evaporates from memory.

## Privacy Architecture: Zero Storage

Privacy was a hard requirement, not a feature. Here's what "zero storage" actually means in practice:

1. **No disk writes.** Uploaded files are held in process memory only. They're never written to a temp directory, never saved to a database.
2. **No file logging.** I don't log filenames, file contents, or conversion results. Server logs contain only request metadata (timestamp, format type, response code).
3. **No user accounts.** There's no sign-up, so there's no user data to protect (or leak).
4. **TLS 1.3 in transit.** Files are encrypted during upload and download.
5. **Isolated containers.** Each backend instance on Railway is containerized. Even if one instance were compromised, it has no access to persistent storage.

The design principle: I built this for documents I wouldn't want anyone else to see. Tax filings. Business contracts. Medical records. The architecture should make it impossible for me to access your files, not just promise that I won't.

## Supporting 20+ Formats: The Diversity Challenge

Starting with HWP, the format list grew quickly:

| Category | Formats |
|----------|---------|
| Documents | PDF, DOCX, PPTX, XLSX/XLS, HWP, HWPX, RTF, MSG (Outlook) |
| Data | CSV, JSON, XML, IPYNB (Jupyter), ZIP, TXT |
| Media | HTML, EPUB, Images (OCR), YouTube transcripts |

Each format has its own quirks. PDFs with scanned images need OCR. Excel files have multiple sheets. PowerPoint files have speaker notes. YouTube URLs need transcript API calls instead of file parsing.

The hardest part wasn't adding formats -- MarkItDown handles most of the heavy lifting. The hard part was making the output consistently useful across all of them. A Markdown file generated from an Excel spreadsheet should have clean tables. A converted PDF should preserve heading hierarchy. A YouTube transcript should be readable, not just a wall of text.

## Going Open Source

The project is open source under AGPL. The code is on [GitHub](https://github.com/clatyceo/tomdnow).

Why AGPL specifically? I want the tool to stay free and open. AGPL means if someone takes the code and builds a hosted service from it, they need to share their modifications. Regular use, self-hosting, and integration into private tools are all fine. But if you commercialize a hosted version, the community benefits from your improvements.

There's also a free REST API (50 requests per day) for developers who want to integrate conversion into their own workflows:

```bash
curl -X POST https://api.tomdnow.com/convert \
  -F "file=@document.pdf" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## What's Next

Here's what I'm working on:

- **Batch processing** -- upload multiple files and get a ZIP of Markdown files back
- **Improved OCR** -- better handling of multi-column layouts and handwritten text
- **More format options** -- output customization (heading levels, table styles, front matter)
- **Community contributions** -- format-specific improvements from people who know those formats best

## Try It / Contribute

- **Convert a file now:** [tomdnow.com](https://tomdnow.com)
- **Star or contribute:** [GitHub](https://github.com/clatyceo/tomdnow)
- **API access:** [tomdnow.com/en/docs/api](https://tomdnow.com/en/docs/api)

If you have a file format that doesn't convert well, open an issue. If you want to improve conversion quality for a specific format, PRs are welcome. This started as a tool I built for myself, and I'd love to see it grow into something the community shapes together.
