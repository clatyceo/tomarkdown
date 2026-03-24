import asyncio
import logging
from fastapi import APIRouter, File, UploadFile, Header, HTTPException
from converter import convert_file
from api_keys import validate_api_key, create_api_key, upgrade_tier
from config import CONVERSION_TIMEOUT
from errors import ConversionTimeoutError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1")


@router.post("/convert")
async def api_convert(
    file: UploadFile = File(...),
    x_api_key: str = Header(...),
):
    """Convert a file to Markdown using an API key."""
    user = validate_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired API key")

    content = await file.read()
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename")

    file_type = file.filename.rsplit(".", 1)[-1].lower()

    try:
        result = await asyncio.wait_for(
            asyncio.to_thread(convert_file, content, file.filename, file_type),
            timeout=CONVERSION_TIMEOUT,
        )
    except asyncio.TimeoutError:
        raise ConversionTimeoutError(CONVERSION_TIMEOUT)

    result["api_usage"] = {
        "tier": user["tier"],
        "daily_remaining": user["daily_remaining"],
    }

    return result


@router.post("/keys")
async def create_key(email: str = Header(...)):
    """Create a new API key for the given email."""
    key = create_api_key(email)
    return {"api_key": key, "tier": "free", "daily_limit": 50}


@router.post("/keys/upgrade")
async def upgrade_key(body: dict):
    """Upgrade a user's API key tier. Called by Stripe webhook."""
    email = body.get("email")
    tier = body.get("tier", "pro")
    if not email:
        raise HTTPException(status_code=400, detail="Email required")

    success = upgrade_tier(email, tier)
    if not success:
        raise HTTPException(status_code=404, detail="No API key found for this email")

    return {"status": "upgraded", "email": email, "tier": tier}
