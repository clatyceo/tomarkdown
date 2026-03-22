from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from converter import convert_file, convert_url
import time

app = FastAPI(title="AllToMD API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Simple in-memory rate limiter
rate_limit_store: dict[str, list[float]] = {}
RATE_LIMIT = 20
RATE_WINDOW = 60


def check_rate_limit(ip: str):
    now = time.time()
    timestamps = rate_limit_store.get(ip, [])
    timestamps = [t for t in timestamps if now - t < RATE_WINDOW]
    if len(timestamps) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    timestamps.append(now)
    rate_limit_store[ip] = timestamps


class UrlRequest(BaseModel):
    url: str
    type: str


@app.post("/convert")
async def convert_file_endpoint(
    request: Request,
    file: UploadFile | None = File(None),
    type: str | None = Form(None),
):
    check_rate_limit(request.client.host if request.client else "unknown")

    if file is not None:
        if not type:
            raise HTTPException(status_code=400, detail="Missing 'type' field")
        content = await file.read()
        try:
            result = convert_file(content, file.filename or "unknown", type)
            return result
        except ValueError as e:
            status = 413 if "too large" in str(e).lower() else 400
            raise HTTPException(status_code=status, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Conversion failed: {e}")

    raise HTTPException(status_code=400, detail="No file provided")


@app.post("/convert/url")
async def convert_url_endpoint(request: Request, body: UrlRequest):
    check_rate_limit(request.client.host if request.client else "unknown")

    try:
        result = convert_url(body.url, body.type)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Conversion failed: {e}")


@app.get("/health")
async def health():
    return {"status": "ok"}
