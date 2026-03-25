<div align="center">
  <h1>tomdnow</h1>
  <p>Free, privacy-first file-to-Markdown converter for 20+ formats</p>

  <a href="https://tomdnow.com">Website</a> ·
  <a href="https://tomdnow.com/en/docs/api">API Docs</a> ·
  <a href="https://tomdnow.com/en/blog">Blog</a>

  ![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
  ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
  ![Tests](https://img.shields.io/badge/Tests-40%20passing-brightgreen)
  ![License](https://img.shields.io/badge/License-MIT-blue)
</div>

## What is tomdnow?

tomdnow converts 20+ file formats to clean Markdown — for free, with no sign-up, and complete privacy. Files are processed entirely in memory and never stored.

### Supported Formats

| Category | Formats |
|----------|---------|
| **Documents** | PDF, DOCX, PPTX, HWP, HWPX, RTF, TXT |
| **Spreadsheets** | XLSX, XLS, CSV |
| **Data & Code** | JSON, XML, Jupyter (.ipynb) |
| **Email** | MSG (Outlook) |
| **Media** | Image OCR (JPG, PNG, GIF, WEBP), YouTube transcripts |
| **Web & Publishing** | HTML, EPUB |
| **Archive** | ZIP |

## Why tomdnow?

| | tomdnow | Pandoc | CloudConvert | Marker |
|---|---------|--------|--------------|--------|
| **File Formats** | 20+ (web UI) | Many (CLI only) | 200+ | PDF only |
| **Privacy** | In-memory, never stored | Local | Cloud storage | Local |
| **Cost** | Free | Free (OSS) | Freemium | Free (OSS) |
| **Sign-up** | Not required | N/A | Required | N/A |
| **HWP/HWPX** | Yes | No | No | No |
| **API** | Yes (free) | CLI | Paid | No |

## Tech Stack

- **Frontend:** Next.js 16 + React 19 + Tailwind CSS — hosted on Vercel
- **Backend:** FastAPI + Microsoft MarkItDown — hosted on Railway
- **i18n:** 8 languages (EN, KO, JA, ZH, ES, PT, DE, FR)

## Self-Hosting

### Prerequisites

- Python 3.12+
- Node.js 20+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Environment Variables

**Backend** (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_FILE_SIZE` | `10485760` (10MB) | Max upload size in bytes |
| `RATE_LIMIT` | `20` | Requests per window per IP |
| `RATE_WINDOW` | `60` | Rate limit window in seconds |
| `CONVERSION_TIMEOUT` | `30` | Conversion timeout in seconds |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS origins |

**Frontend** (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:8000` | Backend API URL |
| `NEXT_PUBLIC_SITE_URL` | `https://tomdnow.com` | Public site URL (SEO) |

## API

Free API with 50 requests/day. No credit card required.

```bash
curl -X POST https://api.tomdnow.com/api/v1/convert \
  -H "X-Api-Key: tmd_your_key" \
  -F "file=@document.pdf"
```

[Full API Documentation](https://tomdnow.com/en/docs/api)

## Deployment

### Backend (Railway)

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repo
3. Set Root Directory to `backend`
4. Railway auto-detects the Dockerfile
5. Set environment variables (especially `ALLOWED_ORIGINS`)

### Frontend (Vercel)

1. Import project on [Vercel](https://vercel.com)
2. Set Root Directory to `frontend`
3. Add environment variable: `BACKEND_URL` = your Railway URL
4. Deploy

## Contributing

Contributions welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/new-format`)
3. Write tests for your changes
4. Ensure all tests pass (`pytest tests/ -v` and `npm test`)
5. Commit with conventional commits (`feat:`, `fix:`, `refactor:`)
6. Open a Pull Request

### Adding a New Format

1. **Backend:** Add file extension to `SUPPORTED_FILE_TYPES` in `converter.py`
2. **Backend:** Add pip dependency group to `requirements.txt` if needed
3. **Frontend:** Add tool config to `lib/tools.ts`
4. **Frontend:** Create route page (copy existing pattern)
5. **Tests:** Add unit test for the new type

## License

[MIT](./LICENSE)

## About

Built by [Park Gamsa](https://tomdnow.com/en/about) in South Korea.
Powered by [Microsoft MarkItDown](https://github.com/microsoft/markitdown).
