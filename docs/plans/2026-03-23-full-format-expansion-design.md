# Full Format Expansion Design

> Date: 2026-03-23
> Status: Approved

## Overview

tomarkdown.com MVP(PDF, DOCX, YouTube 3개)에서 markitdown이 지원하는 전체 포맷으로 확장.
오디오(음성인식)만 제외하고 15개 포맷 지원.

## Format List

### Existing (3)
| # | Format | Type | Dependency |
|---|--------|------|-----------|
| 1 | PDF | file | `[pdf]` |
| 2 | DOCX | file | `[docx]` |
| 3 | YouTube | url | `[youtube-transcription]` |

### New (12)
| # | Format | Extension | Dependency | Category |
|---|--------|-----------|-----------|----------|
| 4 | PPTX | .pptx | `[pptx]` | Documents |
| 5 | XLSX | .xlsx | `[xlsx]` | Documents |
| 6 | XLS | .xls | `[xls]` | Documents |
| 7 | MSG | .msg | `[outlook]` | Documents |
| 8 | HTML | .html, .htm | built-in | Media |
| 9 | EPUB | .epub | built-in | Media |
| 10 | Image | .jpg, .jpeg, .png, .gif, .webp | built-in | Media |
| 11 | CSV | .csv | built-in | Data |
| 12 | JSON | .json | built-in | Data |
| 13 | XML | .xml | built-in | Data |
| 14 | Jupyter | .ipynb | built-in | Data |
| 15 | ZIP | .zip | built-in | Data |

### Excluded
- Audio (.mp3, .wav etc.) — heavy dependencies (SpeechRecognition, pydub, ffmpeg), deferred

## Backend Changes

### requirements.txt
```
markitdown[pdf,docx,pptx,xlsx,xls,outlook,youtube-transcription]>=0.1.0
```

### converter.py
Expand `SUPPORTED_FILE_TYPES`:
```python
SUPPORTED_FILE_TYPES = {
    "pdf", "docx", "pptx", "xlsx", "xls",
    "html", "htm",
    "epub",
    "csv", "json", "xml",
    "msg",
    "ipynb",
    "zip",
    "jpg", "jpeg", "png", "gif", "webp",
}
```
No conversion logic changes — `md_converter.convert(tmp_path)` handles all formats.

## Frontend Changes

### Header Navigation
Category dropdown (iLoveIMG style):

| Category | Tools |
|----------|-------|
| Documents | PDF, DOCX, PPTX, XLSX, XLS, MSG |
| Data | CSV, JSON, XML, Jupyter, ZIP |
| Media | YouTube, HTML, EPUB, Image |

- Hover to open dropdown on desktop
- Hamburger → accordion on mobile

### Home Page
Category-grouped card grid:
```
Documents: [PDF] [DOCX] [PPTX] [XLSX] [XLS] [MSG]
Data:      [CSV] [JSON] [XML] [Jupyter] [ZIP]
Media:     [YouTube] [HTML] [EPUB] [Image]
```

### New URLs (12)
```
/pptx-to-markdown
/xlsx-to-markdown
/xls-to-markdown
/html-to-markdown
/epub-to-markdown
/csv-to-markdown
/json-to-markdown
/xml-to-markdown
/msg-to-markdown
/ipynb-to-markdown
/zip-to-markdown
/image-to-markdown
```

### Each Landing Page
Same pattern as existing: ConverterPage component + SEO content (HowTo, Why, FAQ) + JSON-LD.

### SEO
- sitemap.ts: add 12 new URLs (priority 0.9)
- Each page: HowTo + FAQPage JSON-LD
- Target keywords per page (e.g., "pptx to markdown", "excel to markdown")

## Files to Change

| File | Change |
|------|--------|
| `backend/requirements.txt` | Add dependency groups |
| `backend/converter.py` | Expand SUPPORTED_FILE_TYPES |
| `frontend/lib/tools.ts` | Add 12 tool configs |
| `frontend/components/header.tsx` | Rewrite with category dropdown |
| `frontend/app/page.tsx` | Category-grouped card grid |
| `frontend/app/sitemap.ts` | Add 12 URLs |
| `frontend/app/[12 dirs]/page.tsx` | 12 new landing pages |
