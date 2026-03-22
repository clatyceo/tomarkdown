# ToMarkdown

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-40%20passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

Free online tool to convert any file to Markdown. Powered by Microsoft's [MarkItDown](https://github.com/microsoft/markitdown).

## Supported Formats

| Category | Formats |
|----------|---------|
| **Documents** | PDF, DOCX, PPTX, XLSX, XLS, MSG |
| **Data** | CSV, JSON, XML, Jupyter (.ipynb), ZIP |
| **Media** | YouTube (transcript), HTML, EPUB, Image (EXIF) |

## Architecture

```
[Vercel] Next.js Frontend
    |
    | POST /api/convert (proxy)
    v
[Railway] FastAPI Backend + markitdown
```

- Frontend proxies requests to backend (no direct backend exposure)
- Files processed in memory, deleted immediately after conversion
- Rate limiting: 20 requests/min per IP

## Installation

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_FILE_SIZE` | `10485760` (10MB) | Max upload size in bytes |
| `RATE_LIMIT` | `20` | Requests per window per IP |
| `RATE_WINDOW` | `60` | Rate limit window in seconds |
| `CONVERSION_TIMEOUT` | `30` | Conversion timeout in seconds |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS origins |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:8000` | Backend API URL |
| `NEXT_PUBLIC_SITE_URL` | `https://tomarkdown.com` | Public site URL (SEO) |

## Usage

Start both servers:

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn main:app --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

Open http://localhost:3000

## API Documentation

### POST /convert

Convert a file to Markdown.

**Request:** `multipart/form-data`
- `file` - The file to convert
- `type` - File type (`pdf`, `docx`, `pptx`, `xlsx`, `xls`, `html`, `csv`, `json`, `xml`, `msg`, `epub`, `ipynb`, `zip`, `jpg`, `png`, `gif`, `webp`)

**Response:**
```json
{
  "markdown": "# Converted content...",
  "metadata": {
    "title": "filename",
    "type": "pdf",
    "size": 125000
  }
}
```

### POST /convert/url

Convert a YouTube URL to Markdown transcript.

**Request:** `application/json`
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "type": "youtube"
}
```

**Response:** Same format as `/convert`

### GET /health

Health check endpoint.

**Response:** `{"status": "ok"}`

### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Invalid request (missing fields, unsupported type) |
| 413 | File too large (>10MB) |
| 422 | Conversion failed or timed out |
| 429 | Rate limit exceeded |

## Testing

### Backend

```bash
cd backend
source venv/bin/activate

# Run tests
pytest tests/ -v

# Run with coverage
pip install pytest-cov
pytest --cov=. --cov-report=term-missing tests/
```

### Frontend

```bash
cd frontend
npm test
```

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

### Domain (Cloudflare)

1. Register domain on Cloudflare
2. Add CNAME record pointing to `cname.vercel-dns.com`
3. Set Proxy to "DNS only" (grey cloud)

## Contributing

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
4. **Frontend:** Create `app/{slug}/page.tsx` (copy existing pattern)
5. **Tests:** Add unit test for the new type

## License

MIT
