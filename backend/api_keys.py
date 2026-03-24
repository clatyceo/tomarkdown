import sqlite3
import secrets
import hashlib
import time
import os
import logging

logger = logging.getLogger(__name__)

def _db_path():
    return os.environ.get("API_KEYS_DB", "api_keys.db")


def _get_conn():
    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = _get_conn()
    conn.execute("""CREATE TABLE IF NOT EXISTS api_keys (
        key_hash TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        tier TEXT DEFAULT 'free',
        daily_limit INTEGER DEFAULT 50,
        daily_used INTEGER DEFAULT 0,
        last_reset TEXT DEFAULT '',
        created_at REAL DEFAULT 0
    )""")
    conn.commit()
    conn.close()
    logger.info("API keys database initialized at %s", _db_path())


def create_api_key(email: str, tier: str = "free") -> str:
    """Create a new API key for the given email and return the raw key."""
    key = f"tmd_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    daily_limit = 50 if tier == "free" else 500
    conn = _get_conn()
    conn.execute(
        "INSERT INTO api_keys (key_hash, email, tier, daily_limit, daily_used, last_reset, created_at) VALUES (?, ?, ?, ?, 0, ?, ?)",
        (key_hash, email, tier, daily_limit, "", time.time()),
    )
    conn.commit()
    conn.close()
    logger.info("Created API key for email=%s tier=%s", email, tier)
    return key


def validate_api_key(key: str) -> dict | None:
    """Validate an API key and decrement the daily quota.

    Returns user info dict on success, or None if the key is invalid or
    the daily limit has been exceeded.
    """
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    conn = _get_conn()
    row = conn.execute("SELECT * FROM api_keys WHERE key_hash = ?", (key_hash,)).fetchone()
    if not row:
        conn.close()
        return None

    today = time.strftime("%Y-%m-%d")
    daily_used = row["daily_used"]
    if row["last_reset"] != today:
        daily_used = 0
        conn.execute(
            "UPDATE api_keys SET daily_used = 0, last_reset = ? WHERE key_hash = ?",
            (today, key_hash),
        )

    if daily_used >= row["daily_limit"]:
        conn.close()
        return None

    conn.execute(
        "UPDATE api_keys SET daily_used = daily_used + 1 WHERE key_hash = ?",
        (key_hash,),
    )
    conn.commit()
    conn.close()

    return {
        "email": row["email"],
        "tier": row["tier"],
        "daily_limit": row["daily_limit"],
        "daily_remaining": row["daily_limit"] - daily_used - 1,
    }


def upgrade_tier(email: str, tier: str) -> bool:
    """Upgrade (or downgrade) an API key tier for the given email."""
    daily_limit = 500 if tier == "pro" else 50
    conn = _get_conn()
    cursor = conn.execute(
        "UPDATE api_keys SET tier = ?, daily_limit = ? WHERE email = ?",
        (tier, daily_limit, email),
    )
    conn.commit()
    success = cursor.rowcount > 0
    conn.close()
    if success:
        logger.info("Upgraded email=%s to tier=%s", email, tier)
    return success


# Initialize DB on module import
init_db()
