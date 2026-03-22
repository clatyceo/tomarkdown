from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_convert_no_file():
    response = client.post("/convert")
    assert response.status_code == 400


def test_convert_url_invalid():
    response = client.post("/convert/url", json={"url": "not-a-url", "type": "youtube"})
    assert response.status_code == 400
