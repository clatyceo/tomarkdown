import os

import pytest
from api_keys import create_api_key, validate_api_key, init_db, get_user_by_email, regenerate_api_key
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def _fresh_db():
    """Re-initialize the database before each test."""
    import sqlite3
    conn = sqlite3.connect(os.environ["API_KEYS_DB"])
    conn.execute("DROP TABLE IF EXISTS api_keys")
    conn.commit()
    conn.close()
    init_db()
    yield


# --- api_keys unit tests ---


def test_create_api_key_returns_prefixed_key():
    key = create_api_key("test@example.com")
    assert key.startswith("tmd_")
    assert len(key) > 10


def test_validate_valid_key():
    key = create_api_key("user@example.com")
    result = validate_api_key(key)
    assert result is not None
    assert result["email"] == "user@example.com"
    assert result["tier"] == "free"
    assert result["daily_limit"] == 50
    assert result["daily_remaining"] == 49


def test_validate_invalid_key():
    result = validate_api_key("tmd_bogus_key_that_does_not_exist")
    assert result is None


def test_daily_limit_enforcement():
    key = create_api_key("limited@example.com")
    # Override daily_limit to 2 for quick testing
    import sqlite3
    import hashlib
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    conn = sqlite3.connect(os.environ["API_KEYS_DB"])
    conn.execute("UPDATE api_keys SET daily_limit = 2 WHERE key_hash = ?", (key_hash,))
    conn.commit()
    conn.close()

    # First two calls should succeed
    assert validate_api_key(key) is not None
    assert validate_api_key(key) is not None
    # Third call should fail (limit reached)
    assert validate_api_key(key) is None


# --- API endpoint integration tests ---


def test_create_key_endpoint():
    response = client.post("/api/v1/keys", headers={"email": "api@example.com"})
    assert response.status_code == 200
    data = response.json()
    assert "api_key" in data
    assert data["api_key"].startswith("tmd_")
    assert data["tier"] == "free"
    assert data["daily_limit"] == 50


def test_convert_with_valid_key():
    # Create a key first
    key_resp = client.post("/api/v1/keys", headers={"email": "conv@example.com"})
    api_key = key_resp.json()["api_key"]

    # Convert a simple CSV file
    response = client.post(
        "/api/v1/convert",
        headers={"x-api-key": api_key},
        files={"file": ("test.csv", b"name,age\nAlice,30", "text/csv")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "markdown" in data
    assert "metadata" in data
    assert "api_usage" in data
    assert data["api_usage"]["tier"] == "free"
    assert isinstance(data["api_usage"]["daily_remaining"], int)


def test_convert_with_invalid_key():
    response = client.post(
        "/api/v1/convert",
        headers={"x-api-key": "tmd_invalid_key"},
        files={"file": ("test.csv", b"name,age\nAlice,30", "text/csv")},
    )
    assert response.status_code == 401
    assert "Invalid" in response.json()["detail"]


def test_convert_without_key():
    response = client.post(
        "/api/v1/convert",
        files={"file": ("test.csv", b"name,age\nAlice,30", "text/csv")},
    )
    assert response.status_code == 422  # Missing required header


def test_convert_no_filename():
    key_resp = client.post("/api/v1/keys", headers={"email": "noname@example.com"})
    api_key = key_resp.json()["api_key"]

    response = client.post(
        "/api/v1/convert",
        headers={"x-api-key": api_key},
        files={"file": ("", b"hello", "text/plain")},
    )
    # Empty filename results in unsupported type or bad request
    assert response.status_code in (400, 422)


def test_daily_limit_via_endpoint():
    """Exhaust the daily limit and verify the API returns 401."""
    key_resp = client.post("/api/v1/keys", headers={"email": "limit@example.com"})
    api_key = key_resp.json()["api_key"]

    # Set daily_limit to 1
    import sqlite3
    import hashlib
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()
    conn = sqlite3.connect(os.environ["API_KEYS_DB"])
    conn.execute("UPDATE api_keys SET daily_limit = 1 WHERE key_hash = ?", (key_hash,))
    conn.commit()
    conn.close()

    # First request should succeed
    resp1 = client.post(
        "/api/v1/convert",
        headers={"x-api-key": api_key},
        files={"file": ("test.csv", b"a,b\n1,2", "text/csv")},
    )
    assert resp1.status_code == 200

    # Second request should fail (limit exhausted)
    resp2 = client.post(
        "/api/v1/convert",
        headers={"x-api-key": api_key},
        files={"file": ("test.csv", b"a,b\n1,2", "text/csv")},
    )
    assert resp2.status_code == 401


# --- get_user_by_email / regenerate_api_key unit tests ---


def test_get_user_by_email_returns_user():
    create_api_key("lookup@example.com")
    user = get_user_by_email("lookup@example.com")
    assert user is not None
    assert user["email"] == "lookup@example.com"
    assert user["tier"] == "free"
    assert user["daily_limit"] == 50
    assert user["daily_used"] == 0


def test_get_user_by_email_returns_none_for_missing():
    user = get_user_by_email("nonexistent@example.com")
    assert user is None


def test_regenerate_api_key_creates_new_key():
    old_key = create_api_key("regen@example.com")
    new_key = regenerate_api_key("regen@example.com")
    assert new_key.startswith("tmd_")
    assert new_key != old_key
    # Old key should be invalid
    assert validate_api_key(old_key) is None
    # New key should be valid
    assert validate_api_key(new_key) is not None


def test_regenerate_preserves_tier():
    from api_keys import upgrade_tier
    create_api_key("pro@example.com")
    upgrade_tier("pro@example.com", "pro")
    new_key = regenerate_api_key("pro@example.com")
    result = validate_api_key(new_key)
    assert result is not None
    assert result["tier"] == "pro"
    assert result["daily_limit"] == 500


# --- Magic-link auth endpoint tests ---


def test_magic_link_flow():
    """Full magic link flow: generate -> verify -> session."""
    # Step 1: Generate magic link
    resp = client.post(
        "/api/v1/auth/magic-link",
        json={"email": "magic@example.com"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "token" in data
    assert "link" in data

    # Step 2: Verify the token
    token = data["token"]
    resp2 = client.post(
        "/api/v1/auth/verify",
        json={"token": token},
    )
    assert resp2.status_code == 200
    verify_data = resp2.json()
    assert verify_data["email"] == "magic@example.com"
    assert "session_token" in verify_data

    # Step 3: Use session token to get user info
    session_token = verify_data["session_token"]
    resp3 = client.get(
        "/api/v1/auth/me",
        headers={"x-session-token": session_token},
    )
    assert resp3.status_code == 200
    me_data = resp3.json()
    assert me_data["email"] == "magic@example.com"


def test_magic_link_requires_email():
    resp = client.post("/api/v1/auth/magic-link", json={})
    assert resp.status_code == 400


def test_verify_invalid_token():
    resp = client.post(
        "/api/v1/auth/verify",
        json={"token": "nonexistent_token"},
    )
    assert resp.status_code == 401


def test_verify_token_only_once():
    """Token should be consumed after first verification."""
    resp = client.post(
        "/api/v1/auth/magic-link",
        json={"email": "once@example.com"},
    )
    token = resp.json()["token"]

    # First verify succeeds
    resp2 = client.post("/api/v1/auth/verify", json={"token": token})
    assert resp2.status_code == 200

    # Second verify fails (token consumed)
    resp3 = client.post("/api/v1/auth/verify", json={"token": token})
    assert resp3.status_code == 401


def test_auth_me_invalid_session():
    resp = client.get(
        "/api/v1/auth/me",
        headers={"x-session-token": "bogus_session"},
    )
    assert resp.status_code == 401


def test_regenerate_key_endpoint():
    """Test key regeneration via authenticated endpoint."""
    # Create a key for the user first
    create_api_key("regen_ep@example.com")

    # Get a session
    resp = client.post(
        "/api/v1/auth/magic-link",
        json={"email": "regen_ep@example.com"},
    )
    token = resp.json()["token"]
    resp2 = client.post("/api/v1/auth/verify", json={"token": token})
    session_token = resp2.json()["session_token"]

    # Regenerate key
    resp3 = client.post(
        "/api/v1/keys/regenerate",
        headers={"x-session-token": session_token},
    )
    assert resp3.status_code == 200
    assert "api_key" in resp3.json()
    assert resp3.json()["api_key"].startswith("tmd_")


def test_regenerate_key_requires_auth():
    resp = client.post(
        "/api/v1/keys/regenerate",
        headers={"x-session-token": "invalid_session"},
    )
    assert resp.status_code == 401
