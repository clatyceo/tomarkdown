import sqlite3
import secrets
import hashlib
import time
import os
import logging
from contextlib import closing

logger = logging.getLogger(__name__)

TIER_LIMITS = {"free": 50, "pro": 500, "team": 10000}


def _db_path():
    return os.environ.get("API_KEYS_DB", "api_keys.db")


def _get_conn():
    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with closing(_get_conn()) as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS api_keys (
            key_hash TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            tier TEXT DEFAULT 'free',
            daily_limit INTEGER DEFAULT 50,
            daily_used INTEGER DEFAULT 0,
            last_reset TEXT DEFAULT '',
            created_at REAL DEFAULT 0
        )""")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_email ON api_keys (email)")
        conn.commit()
    logger.info("API keys database initialized at %s", _db_path())


def create_api_key(email: str, tier: str = "free") -> str:
    """Create a new API key for the given email and return the raw key."""
    key = f"tmd_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    daily_limit = TIER_LIMITS.get(tier, TIER_LIMITS["free"])
    with closing(_get_conn()) as conn:
        conn.execute(
            "INSERT INTO api_keys (key_hash, email, tier, daily_limit, daily_used, last_reset, created_at) VALUES (?, ?, ?, ?, 0, ?, ?)",
            (key_hash, email, tier, daily_limit, "", time.time()),
        )
        conn.commit()
    logger.info("Created API key for email=%s tier=%s", email, tier)
    return key


def validate_api_key(key: str) -> dict | None:
    """Validate an API key and decrement the daily quota.

    Returns user info dict on success, or None if the key is invalid or
    the daily limit has been exceeded.
    """
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    with closing(_get_conn()) as conn:
        # Wrap daily reset + increment in a single transaction
        row = conn.execute("SELECT * FROM api_keys WHERE key_hash = ?", (key_hash,)).fetchone()
        if not row:
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
            return None

        conn.execute(
            "UPDATE api_keys SET daily_used = daily_used + 1 WHERE key_hash = ?",
            (key_hash,),
        )
        conn.commit()

    return {
        "email": row["email"],
        "tier": row["tier"],
        "daily_limit": row["daily_limit"],
        "daily_remaining": row["daily_limit"] - daily_used - 1,
    }


def upgrade_tier(email: str, tier: str) -> bool:
    """Upgrade (or downgrade) an API key tier for the given email."""
    daily_limit = TIER_LIMITS.get(tier, TIER_LIMITS["free"])
    with closing(_get_conn()) as conn:
        cursor = conn.execute(
            "UPDATE api_keys SET tier = ?, daily_limit = ? WHERE email = ?",
            (tier, daily_limit, email),
        )
        conn.commit()
        success = cursor.rowcount > 0
    if success:
        logger.info("Upgraded email=%s to tier=%s", email, tier)
    return success


def get_user_by_email(email: str) -> dict | None:
    """Get user info by email, including API key stats."""
    with closing(_get_conn()) as conn:
        row = conn.execute(
            "SELECT email, tier, daily_limit, daily_used, last_reset, created_at FROM api_keys WHERE email = ?",
            (email,),
        ).fetchone()

    if not row:
        return None

    return {
        "email": row["email"],
        "tier": row["tier"],
        "daily_limit": row["daily_limit"],
        "daily_used": row["daily_used"],
        "created_at": row["created_at"],
    }


def regenerate_api_key(email: str) -> str:
    """Delete old key and create a new one for the given email in a single transaction."""
    new_key = f"tmd_{secrets.token_urlsafe(32)}"
    new_key_hash = hashlib.sha256(new_key.encode()).hexdigest()
    with closing(_get_conn()) as conn:
        # Get existing tier
        row = conn.execute("SELECT tier FROM api_keys WHERE email = ?", (email,)).fetchone()
        tier = row["tier"] if row else "free"
        daily_limit = TIER_LIMITS.get(tier, TIER_LIMITS["free"])
        # Delete old key and insert new one in same transaction
        conn.execute("DELETE FROM api_keys WHERE email = ?", (email,))
        conn.execute(
            "INSERT INTO api_keys (key_hash, email, tier, daily_limit, daily_used, last_reset, created_at) VALUES (?, ?, ?, ?, 0, ?, ?)",
            (new_key_hash, email, tier, daily_limit, "", time.time()),
        )
        conn.commit()
    logger.info("Regenerated API key for email=%s tier=%s", email, tier)
    return new_key


# Initialize DB on first use, not on import
try:
    init_db()
except Exception as e:
    logger.warning("Failed to initialize API keys DB: %s", e)
