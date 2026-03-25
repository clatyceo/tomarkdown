# Full Format Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand tomarkdown.com from 3 formats (PDF, DOCX, YouTube) to 15 formats, with category-based navigation and SEO pages for each.

**Architecture:** Backend: expand SUPPORTED_FILE_TYPES and pip dependencies. Frontend: add 12 tool configs, extract shared ToolPage component (DRY), rewrite header with category dropdowns, create 12 new landing pages, update home page with category grid.

**Tech Stack:** Python markitdown (extended deps), Next.js 16, Tailwind CSS 4, TypeScript

**Design doc:** `docs/plans/2026-03-23-full-format-expansion-design.md`

**Project root:** `/Users/refineworld/Desktop/claude_code/alltomd/`

---

### Task 1: Backend — Expand Supported Formats

**Files:**
- Modify: `backend/requirements.txt`
- Modify: `backend/converter.py`
- Modify: `backend/tests/test_converter.py`

**Step 1: Update requirements.txt**

Replace line 4 in `backend/requirements.txt`:
```
markitdown[pdf,docx,pptx,xlsx,xls,outlook,youtube-transcription]>=0.1.0
```

**Step 2: Update converter.py SUPPORTED_FILE_TYPES**

Replace `SUPPORTED_FILE_TYPES = {"pdf", "docx"}` with:
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

**Step 3: Add tests for new types**

Add to `backend/tests/test_converter.py`:
```python
def test_convert_file_accepts_new_types():
    """Verify all new types are in SUPPORTED_FILE_TYPES."""
    from converter import SUPPORTED_FILE_TYPES
    expected = {"pdf", "docx", "pptx", "xlsx", "xls", "html", "htm",
                "epub", "csv", "json", "xml", "msg", "ipynb", "zip",
                "jpg", "jpeg", "png", "gif", "webp"}
    assert expected == SUPPORTED_FILE_TYPES
```

**Step 4: Reinstall deps and run tests**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/backend
source venv/bin/activate
pip install -r requirements.txt
pytest tests/ -v
```
Expected: All pass

**Step 5: Commit**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd
git add backend/
git commit -m "feat: expand backend to support 15 file formats"
```

---

### Task 2: Frontend — Add 12 Tool Configs + Refactor SeoContent

**Files:**
- Modify: `frontend/lib/tools.ts` (add 12 tool configs)
- Create: `frontend/components/seo-content.tsx` (extract shared SEO component)
- Create: `frontend/components/tool-page.tsx` (shared page wrapper)

**Step 1: Add all 12 new tools to `frontend/lib/tools.ts`**

Add a `category` field to `ToolConfig`:
```ts
export interface ToolConfig {
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  type: string;
  inputMode: "file" | "url";
  accept?: string;
  placeholder?: string;
  category: "documents" | "data" | "media";
  seo: {
    description: string;
    keywords: string[];
  };
  howTo: { step: string; desc: string }[];
  whyConvert: string[];
  faq: { q: string; a: string }[];
}
```

Add `category` to existing 3 tools:
- pdf: `category: "documents"`
- docx: `category: "documents"`
- youtube: `category: "media"`

Then add these 12 new entries to the `tools` object:

```ts
  pptx: {
    slug: "pptx-to-markdown",
    title: "PPTX to Markdown — ToMarkdown",
    h1: "Convert PowerPoint to Markdown",
    subtitle: "Transform PowerPoint presentations into clean Markdown files.",
    type: "pptx",
    inputMode: "file",
    accept: ".pptx",
    category: "documents",
    seo: {
      description: "Free online PowerPoint to Markdown converter. Upload PPTX and get Markdown instantly.",
      keywords: ["pptx to markdown", "powerpoint to markdown", "convert pptx to md"],
    },
    howTo: [
      { step: "Upload your PPTX", desc: "Drag and drop or click to select your PowerPoint file." },
      { step: "Convert", desc: "Our tool extracts text from each slide and formats it as Markdown." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Extract slide content for documentation",
      "Repurpose presentation text for blogs or wikis",
      "Feed slide content into AI tools for summarization",
      "Archive presentations as searchable plain text",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it preserve slide layouts?", a: "We extract text content and headings. Visual layouts are simplified into readable Markdown." },
      { q: "What about speaker notes?", a: "Speaker notes are included in the Markdown output when available." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  xlsx: {
    slug: "xlsx-to-markdown",
    title: "XLSX to Markdown — ToMarkdown",
    h1: "Convert Excel to Markdown",
    subtitle: "Convert Excel spreadsheets into Markdown tables.",
    type: "xlsx",
    inputMode: "file",
    accept: ".xlsx",
    category: "documents",
    seo: {
      description: "Free online Excel to Markdown converter. Upload XLSX and get Markdown tables instantly.",
      keywords: ["xlsx to markdown", "excel to markdown", "convert excel to md"],
    },
    howTo: [
      { step: "Upload your XLSX", desc: "Drag and drop or click to select your Excel file." },
      { step: "Convert", desc: "Our tool converts spreadsheet data into Markdown tables." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Embed spreadsheet data in Markdown documents",
      "Create GitHub-friendly data tables",
      "Feed tabular data into AI tools",
      "Include data tables in static sites or wikis",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it support multiple sheets?", a: "Yes, all sheets are converted and separated in the output." },
      { q: "Are formulas preserved?", a: "Formulas are evaluated and the resulting values are included." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  xls: {
    slug: "xls-to-markdown",
    title: "XLS to Markdown — ToMarkdown",
    h1: "Convert XLS to Markdown",
    subtitle: "Convert legacy Excel files into Markdown tables.",
    type: "xls",
    inputMode: "file",
    accept: ".xls",
    category: "documents",
    seo: {
      description: "Free online XLS to Markdown converter. Upload legacy Excel files and get Markdown tables.",
      keywords: ["xls to markdown", "excel to markdown", "convert xls to md"],
    },
    howTo: [
      { step: "Upload your XLS", desc: "Drag and drop or click to select your Excel file." },
      { step: "Convert", desc: "Our tool converts the spreadsheet into Markdown tables." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Migrate legacy Excel data to modern formats",
      "Create Markdown tables from old spreadsheets",
      "Archive legacy data as plain text",
      "Feed old spreadsheet data into AI tools",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "What's the difference from XLSX?", a: "XLS is the older Excel format (pre-2007). We support both." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  msg: {
    slug: "msg-to-markdown",
    title: "MSG to Markdown — ToMarkdown",
    h1: "Convert Outlook Email to Markdown",
    subtitle: "Convert Outlook MSG email files into readable Markdown.",
    type: "msg",
    inputMode: "file",
    accept: ".msg",
    category: "documents",
    seo: {
      description: "Free online Outlook MSG to Markdown converter. Upload email files and get Markdown instantly.",
      keywords: ["msg to markdown", "outlook to markdown", "convert email to md"],
    },
    howTo: [
      { step: "Upload your MSG", desc: "Drag and drop or click to select your Outlook email file." },
      { step: "Convert", desc: "Our tool extracts email content and formats it as Markdown." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Archive emails as searchable plain text",
      "Extract email content for documentation",
      "Feed email data into AI tools for analysis",
      "Store email records in version-controlled repos",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it include attachments?", a: "Email body and metadata are extracted. Attachments are listed but not converted." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  html: {
    slug: "html-to-markdown",
    title: "HTML to Markdown — ToMarkdown",
    h1: "Convert HTML to Markdown",
    subtitle: "Convert HTML web pages into clean Markdown.",
    type: "html",
    inputMode: "file",
    accept: ".html,.htm",
    category: "media",
    seo: {
      description: "Free online HTML to Markdown converter. Upload HTML files and get clean Markdown instantly.",
      keywords: ["html to markdown", "convert html to md", "html markdown converter"],
    },
    howTo: [
      { step: "Upload your HTML", desc: "Drag and drop or click to select your HTML file." },
      { step: "Convert", desc: "Our tool converts HTML tags into clean Markdown syntax." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Migrate web content to Markdown-based CMS",
      "Clean up HTML into readable plain text",
      "Prepare web content for AI processing",
      "Convert saved web pages for offline reading",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it handle complex HTML?", a: "We convert headings, lists, tables, links, and emphasis. Scripts and styles are stripped." },
      { q: "Can I convert a URL instead?", a: "Currently we support file upload only. Save the page as HTML first." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  epub: {
    slug: "epub-to-markdown",
    title: "EPUB to Markdown — ToMarkdown",
    h1: "Convert EPUB to Markdown",
    subtitle: "Convert eBooks into clean, readable Markdown files.",
    type: "epub",
    inputMode: "file",
    accept: ".epub",
    category: "media",
    seo: {
      description: "Free online EPUB to Markdown converter. Upload eBooks and get Markdown instantly.",
      keywords: ["epub to markdown", "ebook to markdown", "convert epub to md"],
    },
    howTo: [
      { step: "Upload your EPUB", desc: "Drag and drop or click to select your eBook file." },
      { step: "Convert", desc: "Our tool extracts the book content and formats it as Markdown." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Read eBook content in any text editor",
      "Feed book content into AI tools for summarization",
      "Convert eBooks for use in note-taking apps",
      "Archive book content as searchable plain text",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it preserve chapters?", a: "Yes, chapter headings and structure are preserved in the Markdown output." },
      { q: "Are images included?", a: "Images are referenced but not embedded. Text content is fully preserved." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  image: {
    slug: "image-to-markdown",
    title: "Image to Markdown — ToMarkdown",
    h1: "Convert Image to Markdown",
    subtitle: "Extract EXIF metadata from images as Markdown.",
    type: "jpg",
    inputMode: "file",
    accept: ".jpg,.jpeg,.png,.gif,.webp",
    category: "media",
    seo: {
      description: "Free online Image to Markdown converter. Extract EXIF metadata from photos as Markdown.",
      keywords: ["image to markdown", "exif to markdown", "photo metadata to md"],
    },
    howTo: [
      { step: "Upload your image", desc: "Drag and drop or click to select a JPG, PNG, GIF, or WebP file." },
      { step: "Extract", desc: "Our tool reads the image metadata and formats it as Markdown." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Document photo metadata for cataloging",
      "Extract camera settings and GPS data",
      "Create Markdown records of image collections",
      "Feed image metadata into AI tools",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it do OCR?", a: "Currently we extract EXIF metadata only. OCR support is planned for the future." },
      { q: "What metadata is extracted?", a: "Camera model, date, GPS coordinates, resolution, and other EXIF fields when available." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  csv: {
    slug: "csv-to-markdown",
    title: "CSV to Markdown — ToMarkdown",
    h1: "Convert CSV to Markdown",
    subtitle: "Convert CSV data into formatted Markdown tables.",
    type: "csv",
    inputMode: "file",
    accept: ".csv",
    category: "data",
    seo: {
      description: "Free online CSV to Markdown table converter. Upload CSV and get formatted Markdown tables.",
      keywords: ["csv to markdown", "csv to md table", "convert csv to markdown table"],
    },
    howTo: [
      { step: "Upload your CSV", desc: "Drag and drop or click to select your CSV file." },
      { step: "Convert", desc: "Our tool formats the data as a clean Markdown table." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Create GitHub-friendly data tables from CSV",
      "Embed data in Markdown documentation",
      "Convert datasets for use in static sites",
      "Create readable data summaries",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it handle large files?", a: "Files up to 10MB are supported." },
      { q: "What delimiters are supported?", a: "Standard comma-separated values. For other delimiters, convert to CSV first." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  json: {
    slug: "json-to-markdown",
    title: "JSON to Markdown — ToMarkdown",
    h1: "Convert JSON to Markdown",
    subtitle: "Convert JSON data into formatted Markdown.",
    type: "json",
    inputMode: "file",
    accept: ".json",
    category: "data",
    seo: {
      description: "Free online JSON to Markdown converter. Upload JSON files and get formatted Markdown.",
      keywords: ["json to markdown", "convert json to md", "json markdown converter"],
    },
    howTo: [
      { step: "Upload your JSON", desc: "Drag and drop or click to select your JSON file." },
      { step: "Convert", desc: "Our tool formats the JSON structure as readable Markdown." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Create human-readable docs from JSON configs",
      "Document API responses in Markdown",
      "Convert JSON data for wikis and READMEs",
      "Feed structured data into AI tools as text",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it handle nested JSON?", a: "Yes, nested structures are formatted with proper indentation." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  xml: {
    slug: "xml-to-markdown",
    title: "XML to Markdown — ToMarkdown",
    h1: "Convert XML to Markdown",
    subtitle: "Convert XML data into readable Markdown format.",
    type: "xml",
    inputMode: "file",
    accept: ".xml",
    category: "data",
    seo: {
      description: "Free online XML to Markdown converter. Upload XML files and get formatted Markdown.",
      keywords: ["xml to markdown", "convert xml to md", "xml markdown converter"],
    },
    howTo: [
      { step: "Upload your XML", desc: "Drag and drop or click to select your XML file." },
      { step: "Convert", desc: "Our tool parses the XML and formats it as readable Markdown." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Create readable docs from XML configs",
      "Convert XML feeds to Markdown articles",
      "Document XML schemas in plain text",
      "Feed XML data into AI tools as text",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it handle namespaces?", a: "XML namespaces are preserved in the output." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  ipynb: {
    slug: "ipynb-to-markdown",
    title: "Jupyter to Markdown — ToMarkdown",
    h1: "Convert Jupyter Notebook to Markdown",
    subtitle: "Convert Jupyter notebooks into clean Markdown files.",
    type: "ipynb",
    inputMode: "file",
    accept: ".ipynb",
    category: "data",
    seo: {
      description: "Free online Jupyter Notebook to Markdown converter. Upload .ipynb and get Markdown instantly.",
      keywords: ["ipynb to markdown", "jupyter to markdown", "convert notebook to md"],
    },
    howTo: [
      { step: "Upload your notebook", desc: "Drag and drop or click to select your .ipynb file." },
      { step: "Convert", desc: "Our tool extracts code cells, outputs, and text into Markdown." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Share notebook content without Jupyter",
      "Create blog posts from research notebooks",
      "Document experiments in plain Markdown",
      "Feed notebook content into AI tools",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Are code outputs included?", a: "Yes, both code cells and their outputs are included in the Markdown." },
      { q: "Are images preserved?", a: "Plot outputs are referenced but not embedded as images." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  zip: {
    slug: "zip-to-markdown",
    title: "ZIP to Markdown — ToMarkdown",
    h1: "Convert ZIP to Markdown",
    subtitle: "Extract and convert ZIP archive contents to Markdown.",
    type: "zip",
    inputMode: "file",
    accept: ".zip",
    category: "data",
    seo: {
      description: "Free online ZIP to Markdown converter. Upload ZIP archives and get contents as Markdown.",
      keywords: ["zip to markdown", "extract zip to md", "archive to markdown"],
    },
    howTo: [
      { step: "Upload your ZIP", desc: "Drag and drop or click to select your ZIP archive." },
      { step: "Convert", desc: "Our tool extracts and converts each supported file inside the archive." },
      { step: "Download", desc: "Preview the combined result and download your .md file." },
    ],
    whyConvert: [
      "Convert multiple documents in one step",
      "Extract text from archived files",
      "Process bulk documents for AI analysis",
      "Create a single Markdown from multiple files",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "What files inside ZIP are supported?", a: "All formats we support (PDF, DOCX, PPTX, etc.) are converted. Unsupported files are skipped." },
      { q: "Is there a size limit?", a: "The ZIP file must be under 10MB total." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
```

**Step 2: Create shared SeoContent component**

Create `frontend/components/seo-content.tsx`:
```tsx
import { ToolConfig } from "@/lib/tools";

export default function SeoContent({ tool }: { tool: ToolConfig }) {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-gray-900">How to {tool.h1.replace("Convert ", "Convert ")}</h2>
        <ol className="mt-4 space-y-3">
          {tool.howTo.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <div>
                <p className="font-medium text-gray-900">{step.step}</p>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Why {tool.h1.replace("Convert ", "Convert ")}?</h2>
        <ul className="mt-4 space-y-2">
          {tool.whyConvert.map((reason, i) => (
            <li key={i} className="flex gap-2 text-gray-600">
              <span className="text-blue-500">-</span> {reason}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
        <div className="mt-4 space-y-4">
          {tool.faq.map((item, i) => (
            <div key={i}>
              <h3 className="font-medium text-gray-900">{item.q}</h3>
              <p className="mt-1 text-sm text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: tool.h1,
              step: tool.howTo.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.step,
                text: s.desc,
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: tool.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]),
        }}
      />
    </div>
  );
}
```

**Step 3: Create shared ToolPage wrapper**

Create `frontend/components/tool-page.tsx`:
```tsx
import { ToolConfig } from "@/lib/tools";
import ConverterPage from "./converter-page";
import SeoContent from "./seo-content";

export default function ToolPage({ tool }: { tool: ToolConfig }) {
  return (
    <>
      <ConverterPage tool={tool} />
      <SeoContent tool={tool} />
    </>
  );
}
```

**Step 4: Verify build**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/frontend
npm run build
```

**Step 5: Commit**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd
git add frontend/lib/tools.ts frontend/components/seo-content.tsx frontend/components/tool-page.tsx
git commit -m "feat: add 12 tool configs and shared ToolPage/SeoContent components"
```

---

### Task 3: Frontend — Refactor Existing Pages to Use ToolPage

**Files:**
- Modify: `frontend/app/pdf-to-markdown/page.tsx`
- Modify: `frontend/app/docx-to-markdown/page.tsx`
- Modify: `frontend/app/youtube-to-markdown/page.tsx`

**Step 1: Refactor all 3 existing pages**

Each page becomes thin — same pattern. Example for `pdf-to-markdown/page.tsx`:
```tsx
import { Metadata } from "next";
import { tools } from "@/lib/tools";
import ToolPage from "@/components/tool-page";

const tool = tools.pdf;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.seo.description,
  keywords: tool.seo.keywords,
};

export default function PdfToMarkdown() {
  return <ToolPage tool={tool} />;
}
```

Apply same pattern to `docx-to-markdown/page.tsx` (using `tools.docx`) and `youtube-to-markdown/page.tsx` (using `tools.youtube`).

**Step 2: Verify build**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/frontend
npm run build
```

**Step 3: Commit**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd
git add frontend/app/pdf-to-markdown/ frontend/app/docx-to-markdown/ frontend/app/youtube-to-markdown/
git commit -m "refactor: simplify existing tool pages with shared ToolPage component"
```

---

### Task 4: Frontend — Create 12 New Landing Pages

**Files:**
- Create: `frontend/app/pptx-to-markdown/page.tsx`
- Create: `frontend/app/xlsx-to-markdown/page.tsx`
- Create: `frontend/app/xls-to-markdown/page.tsx`
- Create: `frontend/app/msg-to-markdown/page.tsx`
- Create: `frontend/app/html-to-markdown/page.tsx`
- Create: `frontend/app/epub-to-markdown/page.tsx`
- Create: `frontend/app/image-to-markdown/page.tsx`
- Create: `frontend/app/csv-to-markdown/page.tsx`
- Create: `frontend/app/json-to-markdown/page.tsx`
- Create: `frontend/app/xml-to-markdown/page.tsx`
- Create: `frontend/app/ipynb-to-markdown/page.tsx`
- Create: `frontend/app/zip-to-markdown/page.tsx`

**Step 1: Create all 12 pages**

Each page follows this exact template (only the tool key and function name change):

```tsx
import { Metadata } from "next";
import { tools } from "@/lib/tools";
import ToolPage from "@/components/tool-page";

const tool = tools.TOOL_KEY;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.seo.description,
  keywords: tool.seo.keywords,
};

export default function FUNCTION_NAME() {
  return <ToolPage tool={tool} />;
}
```

Mapping:
| File | TOOL_KEY | FUNCTION_NAME |
|------|----------|---------------|
| pptx-to-markdown/page.tsx | pptx | PptxToMarkdown |
| xlsx-to-markdown/page.tsx | xlsx | XlsxToMarkdown |
| xls-to-markdown/page.tsx | xls | XlsToMarkdown |
| msg-to-markdown/page.tsx | msg | MsgToMarkdown |
| html-to-markdown/page.tsx | html | HtmlToMarkdown |
| epub-to-markdown/page.tsx | epub | EpubToMarkdown |
| image-to-markdown/page.tsx | image | ImageToMarkdown |
| csv-to-markdown/page.tsx | csv | CsvToMarkdown |
| json-to-markdown/page.tsx | json | JsonToMarkdown |
| xml-to-markdown/page.tsx | xml | XmlToMarkdown |
| ipynb-to-markdown/page.tsx | ipynb | IpynbToMarkdown |
| zip-to-markdown/page.tsx | zip | ZipToMarkdown |

**Step 2: Verify build**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/frontend
npm run build
```

**Step 3: Commit**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd
git add frontend/app/
git commit -m "feat: add 12 new tool landing pages"
```

---

### Task 5: Frontend — Header with Category Dropdowns

**Files:**
- Modify: `frontend/components/header.tsx`

**Step 1: Rewrite header.tsx**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    name: "Documents",
    tools: [
      { name: "PDF to Markdown", href: "/pdf-to-markdown" },
      { name: "DOCX to Markdown", href: "/docx-to-markdown" },
      { name: "PPTX to Markdown", href: "/pptx-to-markdown" },
      { name: "XLSX to Markdown", href: "/xlsx-to-markdown" },
      { name: "XLS to Markdown", href: "/xls-to-markdown" },
      { name: "MSG to Markdown", href: "/msg-to-markdown" },
    ],
  },
  {
    name: "Data",
    tools: [
      { name: "CSV to Markdown", href: "/csv-to-markdown" },
      { name: "JSON to Markdown", href: "/json-to-markdown" },
      { name: "XML to Markdown", href: "/xml-to-markdown" },
      { name: "Jupyter to Markdown", href: "/ipynb-to-markdown" },
      { name: "ZIP to Markdown", href: "/zip-to-markdown" },
    ],
  },
  {
    name: "Media",
    tools: [
      { name: "YouTube to Markdown", href: "/youtube-to-markdown" },
      { name: "HTML to Markdown", href: "/html-to-markdown" },
      { name: "EPUB to Markdown", href: "/epub-to-markdown" },
      { name: "Image to Markdown", href: "/image-to-markdown" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-15 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          ToMarkdown
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {categories.map((cat) => (
            <div key={cat.name} className="relative group">
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {cat.name}
              </button>
              <div className="absolute top-full left-0 pt-1 hidden group-hover:block">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-48">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 max-h-[80vh] overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.name} className="border-t border-gray-100">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">{cat.name}</p>
              {cat.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
```

**Step 2: Verify build**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/frontend
npm run build
```

**Step 3: Commit**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd
git add frontend/components/header.tsx
git commit -m "feat: rewrite header with category dropdown navigation"
```

---

### Task 6: Frontend — Home Page with Category Grid

**Files:**
- Modify: `frontend/app/page.tsx`

**Step 1: Rewrite home page**

```tsx
import ToolCard from "@/components/tool-card";

const categories = [
  {
    name: "Documents",
    tools: [
      { title: "PDF to Markdown", description: "Convert PDF documents to Markdown.", href: "/pdf-to-markdown", icon: "PDF", color: "#dc2626" },
      { title: "DOCX to Markdown", description: "Convert Word documents to Markdown.", href: "/docx-to-markdown", icon: "DOC", color: "#2563eb" },
      { title: "PPTX to Markdown", description: "Convert PowerPoint slides to Markdown.", href: "/pptx-to-markdown", icon: "PPT", color: "#ea580c" },
      { title: "XLSX to Markdown", description: "Convert Excel spreadsheets to Markdown.", href: "/xlsx-to-markdown", icon: "XLS", color: "#16a34a" },
      { title: "XLS to Markdown", description: "Convert legacy Excel files to Markdown.", href: "/xls-to-markdown", icon: "XLS", color: "#15803d" },
      { title: "MSG to Markdown", description: "Convert Outlook emails to Markdown.", href: "/msg-to-markdown", icon: "MSG", color: "#0284c7" },
    ],
  },
  {
    name: "Data",
    tools: [
      { title: "CSV to Markdown", description: "Convert CSV data to Markdown tables.", href: "/csv-to-markdown", icon: "CSV", color: "#7c3aed" },
      { title: "JSON to Markdown", description: "Convert JSON data to Markdown.", href: "/json-to-markdown", icon: "JSON", color: "#ca8a04" },
      { title: "XML to Markdown", description: "Convert XML data to Markdown.", href: "/xml-to-markdown", icon: "XML", color: "#0891b2" },
      { title: "Jupyter to Markdown", description: "Convert Jupyter notebooks to Markdown.", href: "/ipynb-to-markdown", icon: "NB", color: "#e85e0d" },
      { title: "ZIP to Markdown", description: "Extract and convert ZIP contents.", href: "/zip-to-markdown", icon: "ZIP", color: "#6b7280" },
    ],
  },
  {
    name: "Media",
    tools: [
      { title: "YouTube to Markdown", description: "Extract YouTube transcripts as Markdown.", href: "/youtube-to-markdown", icon: "YT", color: "#dc2626" },
      { title: "HTML to Markdown", description: "Convert web pages to Markdown.", href: "/html-to-markdown", icon: "HTML", color: "#e34f26" },
      { title: "EPUB to Markdown", description: "Convert eBooks to Markdown.", href: "/epub-to-markdown", icon: "EPUB", color: "#7c3aed" },
      { title: "Image to Markdown", description: "Extract image EXIF metadata.", href: "/image-to-markdown", icon: "IMG", color: "#0ea5e9" },
    ],
  },
];

const features = [
  { title: "100% Free", desc: "No sign-up, no limits, no hidden fees." },
  { title: "Fast Conversion", desc: "Convert files in seconds, not minutes." },
  { title: "Instant Download", desc: "Download or copy your Markdown right away." },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero */}
      <section className="text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Convert Any File to{" "}
          <span className="font-serif italic text-blue-600">Markdown</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          PDF, Word, Excel, PowerPoint, YouTube and more — converted to clean Markdown files for free.
        </p>
      </section>

      {/* Category Grids */}
      {categories.map((cat) => (
        <section key={cat.name} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </section>
      ))}

      {/* Features */}
      <section className="py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {features.map((f) => (
            <div key={f.title}>
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "ToMarkdown",
            description: "Free online tool to convert any file to Markdown",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  );
}
```

**Step 2: Verify build**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/frontend
npm run build
```

**Step 3: Commit**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd
git add frontend/app/page.tsx
git commit -m "feat: rewrite home page with category-grouped tool grid"
```

---

### Task 7: Frontend — Update Sitemap

**Files:**
- Modify: `frontend/app/sitemap.ts`

**Step 1: Add 12 new URLs**

Replace `frontend/app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tomarkdown.com";

  const toolSlugs = [
    "pdf-to-markdown",
    "docx-to-markdown",
    "pptx-to-markdown",
    "xlsx-to-markdown",
    "xls-to-markdown",
    "msg-to-markdown",
    "youtube-to-markdown",
    "html-to-markdown",
    "epub-to-markdown",
    "image-to-markdown",
    "csv-to-markdown",
    "json-to-markdown",
    "xml-to-markdown",
    "ipynb-to-markdown",
    "zip-to-markdown",
  ];

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...toolSlugs.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
  ];
}
```

**Step 2: Verify build**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/frontend
npm run build
```

**Step 3: Commit**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd
git add frontend/app/sitemap.ts
git commit -m "feat: expand sitemap with all 15 tool URLs"
```

---

### Task 8: Final Build Verification + Push

**Step 1: Full frontend build**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/frontend
npm run build
```
Expected: Build succeeds with 15 tool pages + static pages

**Step 2: Backend tests**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd/backend
source venv/bin/activate
pytest tests/ -v
```
Expected: All pass

**Step 3: Push to GitHub**

```bash
cd /Users/refineworld/Desktop/claude_code/alltomd
git push origin main
```

---

## Task Summary

| # | Task | Scope |
|---|------|-------|
| 1 | Backend: expand formats | requirements.txt + converter.py |
| 2 | Frontend: 12 tool configs + shared components | tools.ts + seo-content.tsx + tool-page.tsx |
| 3 | Frontend: refactor existing 3 pages | pdf/docx/youtube page.tsx (simplify) |
| 4 | Frontend: create 12 new pages | 12 new page.tsx files |
| 5 | Frontend: header with dropdowns | header.tsx rewrite |
| 6 | Frontend: home page category grid | page.tsx rewrite |
| 7 | Frontend: expand sitemap | sitemap.ts |
| 8 | Final verification + push | build + test + push |
