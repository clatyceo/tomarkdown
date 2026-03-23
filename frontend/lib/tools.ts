export interface ToolConfig {
  key: string;
  slug: string;
  title: string;
  h1: string;
  displayName: string;
  subtitle: string;
  type: string;
  inputMode: "file" | "url";
  accept?: string;
  placeholder?: string;
  category: "documents" | "data" | "media";
  icon: string;
  color: string;
  seo: {
    description: string;
    keywords: string[];
  };
  howTo: { step: string; desc: string }[];
  whyConvert: string[];
  faq: { q: string; a: string }[];
}

export type CategoryName = "documents" | "data" | "media";

export const categoryLabels: Record<CategoryName, string> = {
  documents: "Documents",
  data: "Data",
  media: "Media",
};


export const tools: Record<string, ToolConfig> = {
  pdf: {
    key: "pdf",
    slug: "pdf-to-markdown",
    title: "PDF to Markdown — tomdnow",
    h1: "Convert PDF to Markdown",
    displayName: "PDF to Markdown",
    subtitle: "Transform your PDF documents into clean, readable Markdown files.",
    type: "pdf",
    inputMode: "file",
    accept: ".pdf",
    category: "documents",
    icon: "PDF",
    color: "#dc2626",
    seo: {
      description: "Free online PDF to Markdown converter. Upload your PDF and get clean Markdown instantly.",
      keywords: ["pdf to markdown", "convert pdf to md", "pdf markdown converter"],
    },
    howTo: [
      { step: "Upload your PDF", desc: "Drag and drop or click to select your PDF file." },
      { step: "Convert", desc: "Our tool converts the PDF to clean Markdown automatically." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Edit PDF content in any text editor",
      "Use in documentation systems like GitHub, Notion, or Obsidian",
      "Feed into AI/LLM tools for analysis",
      "Version control your documents with Git",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "What is the maximum file size?", a: "You can upload PDF files up to 10MB." },
      { q: "Does it preserve formatting?", a: "We preserve headings, lists, tables, and links. Complex layouts may be simplified for readability." },
      { q: "Is my file stored on the server?", a: "No. Your file is processed in memory and immediately deleted after conversion." },
    ],
  },
  docx: {
    key: "docx",
    slug: "docx-to-markdown",
    title: "DOCX to Markdown — tomdnow",
    h1: "Convert Word to Markdown",
    displayName: "Word to Markdown",
    subtitle: "Convert Microsoft Word documents to Markdown format instantly.",
    type: "docx",
    inputMode: "file",
    accept: ".docx",
    category: "documents",
    icon: "DOC",
    color: "#2563eb",
    seo: {
      description: "Free online Word to Markdown converter. Upload DOCX files and get clean Markdown instantly.",
      keywords: ["docx to markdown", "word to markdown", "convert word to md"],
    },
    howTo: [
      { step: "Upload your DOCX", desc: "Drag and drop or click to select your Word document." },
      { step: "Convert", desc: "Our tool converts the DOCX to Markdown automatically." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Migrate Word docs to Markdown-based systems",
      "Use in static site generators like Jekyll or Hugo",
      "Collaborate using plain text in Git repositories",
      "Prepare content for AI and LLM processing",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it support .doc files?", a: "Currently we support .docx format. Save your .doc file as .docx first." },
      { q: "Are images preserved?", a: "Images are referenced in the Markdown output but not embedded. Text content is fully preserved." },
      { q: "Is my file stored on the server?", a: "No. Your file is processed in memory and immediately deleted after conversion." },
    ],
  },
  youtube: {
    key: "youtube",
    slug: "youtube-to-markdown",
    title: "YouTube to Markdown — tomdnow",
    h1: "Convert YouTube to Markdown",
    displayName: "YouTube to Markdown",
    subtitle: "Extract YouTube video transcripts as clean Markdown files.",
    type: "youtube",
    inputMode: "url",
    placeholder: "https://www.youtube.com/watch?v=...",
    category: "media",
    icon: "YT",
    color: "#dc2626",
    seo: {
      description: "Free online YouTube to Markdown converter. Paste a URL and get the video transcript as Markdown.",
      keywords: ["youtube to markdown", "youtube transcript to markdown", "youtube transcript downloader"],
    },
    howTo: [
      { step: "Paste YouTube URL", desc: "Copy the video URL and paste it into the input field." },
      { step: "Convert", desc: "We extract the transcript and format it as Markdown." },
      { step: "Download", desc: "Preview the transcript and download your .md file." },
    ],
    whyConvert: [
      "Study video content in text form",
      "Create notes from educational videos",
      "Feed video transcripts into AI tools",
      "Archive video content as searchable text",
    ],
    faq: [
      { q: "Does every YouTube video work?", a: "Only videos with captions or auto-generated subtitles are supported." },
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "Does it include timestamps?", a: "Yes, the transcript includes timestamps for each segment." },
      { q: "Can I choose the language?", a: "Currently we extract the default transcript language available for the video." },
    ],
  },
  pptx: {
    key: "pptx",
    slug: "pptx-to-markdown",
    title: "PPTX to Markdown — tomdnow",
    h1: "Convert PowerPoint to Markdown",
    displayName: "PowerPoint to Markdown",
    subtitle: "Transform PowerPoint presentations into clean Markdown files.",
    type: "pptx",
    inputMode: "file",
    accept: ".pptx",
    category: "documents",
    icon: "PPT",
    color: "#ea580c",
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
    key: "xlsx",
    slug: "xlsx-to-markdown",
    title: "XLSX to Markdown — tomdnow",
    h1: "Convert Excel to Markdown",
    displayName: "Excel to Markdown",
    subtitle: "Convert Excel spreadsheets into Markdown tables.",
    type: "xlsx",
    inputMode: "file",
    accept: ".xlsx",
    category: "documents",
    icon: "XLS",
    color: "#16a34a",
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
    key: "xls",
    slug: "xls-to-markdown",
    title: "XLS to Markdown — tomdnow",
    h1: "Convert XLS to Markdown",
    displayName: "XLS to Markdown",
    subtitle: "Convert legacy Excel files into Markdown tables.",
    type: "xls",
    inputMode: "file",
    accept: ".xls",
    category: "documents",
    icon: "XLS",
    color: "#15803d",
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
    key: "msg",
    slug: "msg-to-markdown",
    title: "MSG to Markdown — tomdnow",
    h1: "Convert Outlook Email to Markdown",
    displayName: "Outlook Email to Markdown",
    subtitle: "Convert Outlook MSG email files into readable Markdown.",
    type: "msg",
    inputMode: "file",
    accept: ".msg",
    category: "documents",
    icon: "MSG",
    color: "#0284c7",
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
    key: "html",
    slug: "html-to-markdown",
    title: "HTML to Markdown — tomdnow",
    h1: "Convert HTML to Markdown",
    displayName: "HTML to Markdown",
    subtitle: "Convert HTML web pages into clean Markdown.",
    type: "html",
    inputMode: "file",
    accept: ".html,.htm",
    category: "media",
    icon: "HTML",
    color: "#e34f26",
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
    key: "epub",
    slug: "epub-to-markdown",
    title: "EPUB to Markdown — tomdnow",
    h1: "Convert EPUB to Markdown",
    displayName: "EPUB to Markdown",
    subtitle: "Convert eBooks into clean, readable Markdown files.",
    type: "epub",
    inputMode: "file",
    accept: ".epub",
    category: "media",
    icon: "EPUB",
    color: "#7c3aed",
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
    key: "image",
    slug: "image-to-markdown",
    title: "Image to Markdown — tomdnow",
    h1: "Convert Image to Markdown",
    displayName: "Image to Markdown",
    subtitle: "Extract EXIF metadata from images as Markdown.",
    type: "jpg",
    inputMode: "file",
    accept: ".jpg,.jpeg,.png,.gif,.webp",
    category: "media",
    icon: "IMG",
    color: "#0ea5e9",
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
    key: "csv",
    slug: "csv-to-markdown",
    title: "CSV to Markdown — tomdnow",
    h1: "Convert CSV to Markdown",
    displayName: "CSV to Markdown",
    subtitle: "Convert CSV data into formatted Markdown tables.",
    type: "csv",
    inputMode: "file",
    accept: ".csv",
    category: "data",
    icon: "CSV",
    color: "#7c3aed",
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
    key: "json",
    slug: "json-to-markdown",
    title: "JSON to Markdown — tomdnow",
    h1: "Convert JSON to Markdown",
    displayName: "JSON to Markdown",
    subtitle: "Convert JSON data into formatted Markdown.",
    type: "json",
    inputMode: "file",
    accept: ".json",
    category: "data",
    icon: "JSON",
    color: "#ca8a04",
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
    key: "xml",
    slug: "xml-to-markdown",
    title: "XML to Markdown — tomdnow",
    h1: "Convert XML to Markdown",
    displayName: "XML to Markdown",
    subtitle: "Convert XML data into readable Markdown format.",
    type: "xml",
    inputMode: "file",
    accept: ".xml",
    category: "data",
    icon: "XML",
    color: "#0891b2",
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
    key: "ipynb",
    slug: "ipynb-to-markdown",
    title: "Jupyter to Markdown — tomdnow",
    h1: "Convert Jupyter Notebook to Markdown",
    displayName: "Jupyter to Markdown",
    subtitle: "Convert Jupyter notebooks into clean Markdown files.",
    type: "ipynb",
    inputMode: "file",
    accept: ".ipynb",
    category: "data",
    icon: "NB",
    color: "#e85e0d",
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
  hwp: {
    key: "hwp",
    slug: "hwp-to-markdown",
    title: "HWP to Markdown — tomdnow",
    h1: "Convert HWP to Markdown",
    displayName: "HWP to Markdown",
    subtitle: "Convert Korean Hangul Word Processor files to clean Markdown.",
    type: "hwp",
    inputMode: "file",
    accept: ".hwp",
    category: "documents",
    icon: "HWP",
    color: "#0054a6",
    seo: {
      description: "Free online HWP to Markdown converter. Upload Korean Hangul documents and get Markdown instantly.",
      keywords: ["hwp to markdown", "hangul to markdown", "convert hwp to md"],
    },
    howTo: [
      { step: "Upload your HWP", desc: "Drag and drop or click to select your Hangul document." },
      { step: "Convert", desc: "Our tool converts the HWP file to clean Markdown automatically." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Convert Korean government and business documents to Markdown",
      "Use HWP content in GitHub, Notion, or Obsidian",
      "Feed Korean documents into AI/LLM tools for analysis",
      "Archive Hangul documents as searchable plain text",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "What is HWP?", a: "HWP is the native file format of Hangul Word Processor, widely used in South Korea." },
      { q: "Does it preserve formatting?", a: "We preserve text content, headings, and structure. Complex layouts may be simplified." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  hwpx: {
    key: "hwpx",
    slug: "hwpx-to-markdown",
    title: "HWPX to Markdown — tomdnow",
    h1: "Convert HWPX to Markdown",
    displayName: "HWPX to Markdown",
    subtitle: "Convert HWPX documents to clean, readable Markdown files.",
    type: "hwpx",
    inputMode: "file",
    accept: ".hwpx",
    category: "documents",
    icon: "HWPX",
    color: "#0072c6",
    seo: {
      description: "Free online HWPX to Markdown converter. Upload HWPX documents and get Markdown instantly.",
      keywords: ["hwpx to markdown", "hangul to markdown", "convert hwpx to md"],
    },
    howTo: [
      { step: "Upload your HWPX", desc: "Drag and drop or click to select your HWPX document." },
      { step: "Convert", desc: "Our tool converts the HWPX file to Markdown automatically." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Convert modern Hangul documents to Markdown",
      "Migrate HWPX content to cross-platform formats",
      "Feed Korean documents into AI tools for processing",
      "Version control Korean documents with Git",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, completely free with no sign-up required." },
      { q: "What is HWPX?", a: "HWPX is the modern XML-based format of Hangul Word Processor, the standard in South Korea." },
      { q: "What's the difference between HWP and HWPX?", a: "HWPX is the newer XML-based format (like DOCX vs DOC). We support both." },
      { q: "Is my file stored?", a: "No. Files are processed in memory and deleted immediately." },
    ],
  },
  zip: {
    key: "zip",
    slug: "zip-to-markdown",
    title: "ZIP to Markdown — tomdnow",
    h1: "Convert ZIP to Markdown",
    displayName: "ZIP to Markdown",
    subtitle: "Extract and convert ZIP archive contents to Markdown.",
    type: "zip",
    inputMode: "file",
    accept: ".zip",
    category: "data",
    icon: "ZIP",
    color: "#6b7280",
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
};

// Computed once at module load, reused everywhere
function _buildToolsByCategory() {
  const grouped: Record<CategoryName, ToolConfig[]> = { documents: [], data: [], media: [] };
  for (const tool of Object.values(tools)) {
    grouped[tool.category].push(tool);
  }
  return (["documents", "data", "media"] as const).map((cat) => ({
    name: categoryLabels[cat],
    tools: grouped[cat],
  }));
}

export const toolsByCategory = _buildToolsByCategory();
