import pytest
from converter import convert_file, convert_url


def test_convert_file_rejects_unsupported_type():
    with pytest.raises(ValueError, match="Unsupported"):
        convert_file(b"fake content", "test.xyz", "xyz")


def test_convert_url_rejects_invalid_url():
    with pytest.raises(ValueError, match="Invalid"):
        convert_url("not-a-url", "youtube")
