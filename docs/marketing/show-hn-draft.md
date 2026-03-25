# Show HN Draft

## Title

Show HN: tomdnow -- Convert 20+ file formats to Markdown (free, open source)

## Body

I built a web tool that converts 20+ file formats to clean Markdown: PDF, Word, Excel, PowerPoint, HWP/HWPX (Korean documents), EPUB, HTML, CSV, JSON, XML, Jupyter notebooks, Outlook emails, images via OCR, YouTube transcripts, RTF, ZIP archives, and plain text. It's free, requires no sign-up, and files are processed entirely in memory -- nothing is stored on the server. https://tomdnow.com

The conversion engine is Microsoft's open-source MarkItDown library. The backend is FastAPI running on Railway inside isolated containers. The frontend is Next.js 16 with React Server Components on Vercel. File uploads go through TLS 1.3, get processed in memory by the Python backend, and the Markdown result is returned directly. No temp files, no disk writes, no database entries for uploaded content. The API is also free (50 req/day) if you want to integrate it into your own toolchain.

One format I'm particularly interested in getting feedback on: HWP and HWPX support. These are the native formats of Hangul Word Processor, which is essentially mandatory in South Korea -- government filings, corporate reports, academic submissions all use it. Outside Korea, almost no tool supports it (Pandoc doesn't, LibreOffice has limited support). If you've ever worked with Korean organizations, you've probably hit this wall. tomdnow handles both legacy HWP and the newer XML-based HWPX format.

On privacy: I wanted to build something I'd trust with my own tax documents. Files exist only in process memory during conversion. There's no queue, no storage layer, no logging of file contents. The container processes the request and the data is gone. I can't recover your files even if I wanted to. This is a deliberate architectural choice, not just a policy.

Known limitations: very large files (100MB+) can be slow or time out; OCR quality depends on image resolution; some complex Excel formatting doesn't survive the conversion cleanly. I'm working on all of these.

- Site: https://tomdnow.com
- GitHub: https://github.com/clatyceo/tomdnow
- API docs: https://tomdnow.com/en/docs/api
- Supported in 8 languages: EN, KO, JA, ZH, ES, PT, DE, FR
