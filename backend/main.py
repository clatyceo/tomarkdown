import asyncio
import logging
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from converter import convert_file, convert_url
from config import ALLOWED_ORIGINS, CONVERSION_TIMEOUT, MAX_FILE_SIZE
from rate_limiter import RateLimiter
from errors import ConversionError, ConversionTimeoutError
from api_v1 import router as api_v1_router

logger = logging.getLogger(__name__)

app = FastAPI(title="AllToMD API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST"],
    allow_headers=["*"],
)

rate_limiter = RateLimiter()

app.include_router(api_v1_router)


# --- Global Error Handlers ---

@app.exception_handler(ConversionError)
async def conversion_error_handler(request: Request, exc: ConversionError):
    logger.warning("Conversion error: %s [%s]", exc.message, request.client.host if request.client else "unknown")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message, "code": type(exc).__name__},
    )


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "code": "InternalError"},
    )


# --- Models ---

class UrlRequest(BaseModel):
    url: str
    type: str


# --- Helpers ---

async def run_conversion(func, *args):
    """Run a blocking conversion in a thread with timeout."""
    try:
        return await asyncio.wait_for(
            asyncio.to_thread(func, *args),
            timeout=CONVERSION_TIMEOUT,
        )
    except asyncio.TimeoutError:
        raise ConversionTimeoutError(CONVERSION_TIMEOUT)


# --- Endpoints ---

@app.post("/convert")
async def convert_file_endpoint(
    request: Request,
    file: UploadFile | None = File(None),
    type: str | None = Form(None),
):
    rate_limiter.check(request.client.host if request.client else "unknown")

    if file is None:
        raise HTTPException(status_code=400, detail="No file provided")

    if not type:
        raise HTTPException(status_code=400, detail="Missing 'type' field")

    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"File too large (max {MAX_FILE_SIZE // 1024 // 1024}MB)")

    logger.info("Converting file: type=%s size=%s ip=%s", type, file.size, request.client.host if request.client else "unknown")
    content = await file.read()
    return await run_conversion(convert_file, content, file.filename or "unknown", type)


@app.post("/convert/batch")
async def convert_batch_endpoint(
    request: Request,
    files: list[UploadFile] = File(...),
):
    ip = request.client.host if request.client else "unknown"
    rate_limiter.check(ip)

    if len(files) > 5:
        raise ConversionError("Maximum 5 files per batch", 400)

    results = []
    errors = []

    for file in files:
        try:
            content = await file.read()
            if not file.filename:
                errors.append({"filename": "unknown", "error": "No filename"})
                continue
            file_type = file.filename.rsplit(".", 1)[-1].lower()
            result = await run_conversion(convert_file, content, file.filename, file_type)
            result["filename"] = file.filename
            results.append(result)
        except Exception as e:
            errors.append({
                "filename": file.filename or "unknown",
                "error": str(e),
            })

    return {"results": results, "errors": errors, "total": len(files)}


@app.post("/convert/url")
async def convert_url_endpoint(request: Request, body: UrlRequest):
    rate_limiter.check(request.client.host if request.client else "unknown")
    logger.info("Converting URL: type=%s ip=%s", body.type, request.client.host if request.client else "unknown")
    return await run_conversion(convert_url, body.url, body.type)


@app.get("/health")
async def health():
    return {"status": "ok"}
