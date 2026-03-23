import pytest
from converter import SUPPORTED_FILE_TYPES, convert_file
from errors import UnsupportedTypeError


def test_supported_types_include_hwp_and_hwpx():
    assert "hwp" in SUPPORTED_FILE_TYPES
    assert "hwpx" in SUPPORTED_FILE_TYPES


def test_hwp_does_not_raise_unsupported_type():
    """convert_file should not raise UnsupportedTypeError for hwp."""
    try:
        convert_file(b"fake content", "test.hwp", "hwp")
    except UnsupportedTypeError:
        pytest.fail("hwp should be a supported type")
    except Exception:
        # Other errors (e.g. conversion errors) are expected for fake content
        pass


def test_hwpx_does_not_raise_unsupported_type():
    """convert_file should not raise UnsupportedTypeError for hwpx."""
    try:
        convert_file(b"fake content", "test.hwpx", "hwpx")
    except UnsupportedTypeError:
        pytest.fail("hwpx should be a supported type")
    except Exception:
        # Other errors (e.g. conversion errors) are expected for fake content
        pass


def test_hwp_invalid_content_raises_error():
    """Invalid HWP binary content should raise an error during conversion."""
    with pytest.raises(Exception):
        convert_file(b"not a real hwp file", "bad.hwp", "hwp")


def test_hwpx_invalid_content_raises_error():
    """Invalid HWPX content should raise an error during conversion."""
    with pytest.raises(Exception):
        convert_file(b"not a real hwpx file", "bad.hwpx", "hwpx")


def test_hwp_empty_content_raises_error():
    """Empty HWP content should raise an error."""
    with pytest.raises(Exception):
        convert_file(b"", "empty.hwp", "hwp")


def test_hwpx_empty_content_raises_error():
    """Empty HWPX content should raise an error."""
    with pytest.raises(Exception):
        convert_file(b"", "empty.hwpx", "hwpx")
