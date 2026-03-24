import asyncio
import logging
import secrets
import time
from fastapi import APIRouter, File, UploadFile, Header, HTTPException
from converter import convert_file
from api_keys import validate_api_key, create_api_key, upgrade_tier, get_user_by_email, regenerate_api_key
from config import CONVERSION_TIMEOUT
from errors import ConversionTimeoutError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1")

# In-memory token store (for simplicity; upgrade to DB later)
_magic_tokens: dict[str, dict] = {}


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


# --- Magic-link authentication endpoints ---


@router.post("/auth/magic-link")
async def send_magic_link(body: dict):
    """Generate a magic link token for email-based login."""
    email = body.get("email")
    if not email:
        raise HTTPException(400, "Email required")

    token = secrets.token_urlsafe(32)
    _magic_tokens[token] = {"email": email, "created": time.time()}

    # In production, send email with the link
    # For now, return the token directly (development mode)
    magic_link = f"{body.get('redirect_url', '')}/dashboard?token={token}"

    return {"message": "Magic link generated", "token": token, "link": magic_link}


@router.post("/auth/verify")
async def verify_magic_link(body: dict):
    """Verify a magic link token and return user info."""
    token = body.get("token")
    if not token or token not in _magic_tokens:
        raise HTTPException(401, "Invalid or expired token")

    token_data = _magic_tokens.pop(token)
    # Token expires after 15 minutes
    if time.time() - token_data["created"] > 900:
        raise HTTPException(401, "Token expired")

    email = token_data["email"]

    # Get or create API key info
    user = get_user_by_email(email)

    # Generate a session token
    session_token = secrets.token_urlsafe(32)
    _magic_tokens[f"session_{session_token}"] = {
        "email": email,
        "created": time.time(),
        "type": "session",
    }

    return {"email": email, "session_token": session_token, "user": user}


@router.get("/auth/me")
async def get_current_user(x_session_token: str = Header(...)):
    """Get current user info from session token."""
    session_key = f"session_{x_session_token}"
    if session_key not in _magic_tokens:
        raise HTTPException(401, "Invalid session")

    session = _magic_tokens[session_key]
    # Sessions expire after 24 hours
    if time.time() - session["created"] > 86400:
        del _magic_tokens[session_key]
        raise HTTPException(401, "Session expired")

    email = session["email"]
    user = get_user_by_email(email)

    return {"email": email, "user": user}


@router.post("/keys/regenerate")
async def regenerate_key(x_session_token: str = Header(...)):
    """Regenerate API key for authenticated user."""
    session_key = f"session_{x_session_token}"
    if session_key not in _magic_tokens:
        raise HTTPException(401, "Invalid session")

    email = _magic_tokens[session_key]["email"]
    new_key = regenerate_api_key(email)

    return {"api_key": new_key}
