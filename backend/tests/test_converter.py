import pytest
from converter import convert_file, convert_url
from errors import UnsupportedTypeError, FileTooLargeError, InvalidUrlError


def test_convert_file_rejects_unsupported_type():
    with pytest.raises(UnsupportedTypeError):
        convert_file(b"fake content", "test.xyz", "xyz")


def test_convert_url_rejects_invalid_url():
    with pytest.raises(InvalidUrlError):
        convert_url("not-a-url", "youtube")


def test_convert_url_rejects_non_youtube_host():
    with pytest.raises(InvalidUrlError):
        convert_url("https://evil.com/watch?v=test", "youtube")


def test_convert_url_rejects_file_protocol():
    with pytest.raises(InvalidUrlError):
        convert_url("file:///etc/passwd", "youtube")


def test_convert_url_rejects_internal_ip():
    with pytest.raises(InvalidUrlError):
        convert_url("http://169.254.169.254/latest/meta-data/", "youtube")


def test_convert_file_accepts_new_types():
    from converter import SUPPORTED_FILE_TYPES
    expected = {"pdf", "docx", "pptx", "xlsx", "xls", "html", "htm",
                "epub", "csv", "json", "xml", "msg", "ipynb", "zip",
                "hwp", "hwpx",
                "jpg", "jpeg", "png", "gif", "webp",
                "rtf", "txt"}
    assert expected == SUPPORTED_FILE_TYPES


def test_convert_file_rejects_oversized():
    """File exceeding MAX_FILE_SIZE should be rejected."""
    big_content = b"x" * (10 * 1024 * 1024 + 1)  # 10MB + 1 byte
    with pytest.raises(FileTooLargeError):
        convert_file(big_content, "test.pdf", "pdf")


def test_convert_file_metadata_special_chars():
    """Filename with special characters should parse title correctly."""
    import os
    title = os.path.splitext("my-report (2024).pdf")[0]
    assert title == "my-report (2024)"


def test_convert_file_no_extension():
    """Filename without extension should still produce valid metadata title."""
    import os
    title = os.path.splitext("noextension")[0]
    assert title == "noextension"


def test_convert_url_unsupported_type():
    """Non-youtube URL type should be rejected."""
    with pytest.raises(UnsupportedTypeError):
        convert_url("https://vimeo.com/123", "vimeo")


def test_convert_url_ftp_protocol():
    """ftp:// URLs should be rejected."""
    with pytest.raises(InvalidUrlError):
        convert_url("ftp://youtube.com/watch?v=test", "youtube")


def test_convert_url_no_hostname():
    """URL with no hostname should be rejected."""
    with pytest.raises(InvalidUrlError):
        convert_url("https://", "youtube")


def test_convert_url_m_youtube():
    """m.youtube.com should be in ALLOWED_YOUTUBE_HOSTS."""
    from converter import ALLOWED_YOUTUBE_HOSTS
    assert "m.youtube.com" in ALLOWED_YOUTUBE_HOSTS


def test_convert_txt_basic():
    """TXT conversion should return the plain text content as markdown."""
    content = b"Hello, world!\nThis is a test."
    result = convert_file(content, "test.txt", "txt")
    assert result["markdown"] == "Hello, world!\nThis is a test."
    assert result["metadata"]["title"] == "test"
    assert result["metadata"]["type"] == "txt"
    assert result["metadata"]["size"] == len(content)


def test_convert_txt_empty():
    """Empty TXT file should raise ConversionError."""
    from errors import ConversionError
    with pytest.raises(ConversionError):
        convert_file(b"", "empty.txt", "txt")


def test_convert_txt_whitespace_only():
    """Whitespace-only TXT file should raise ConversionError."""
    from errors import ConversionError
    with pytest.raises(ConversionError):
        convert_file(b"   \n\t  \n  ", "blank.txt", "txt")


def test_convert_txt_unicode():
    """TXT conversion should handle Unicode content correctly."""
    content = "Hello, 세계! 日本語テスト".encode("utf-8")
    result = convert_file(content, "unicode.txt", "txt")
    assert "세계" in result["markdown"]
    assert "日本語" in result["markdown"]


def test_convert_rtf_basic():
    """RTF conversion should strip RTF formatting and return plain text."""
    rtf_content = rb"{\rtf1\ansi{\fonttbl\f0\fswiss Helvetica;}\f0\pard This is a test.}"
    result = convert_file(rtf_content, "test.rtf", "rtf")
    assert "This is a test." in result["markdown"]
    assert result["metadata"]["title"] == "test"
    assert result["metadata"]["type"] == "rtf"


def test_convert_rtf_empty():
    """Empty RTF file should raise ConversionError."""
    from errors import ConversionError
    with pytest.raises(ConversionError):
        convert_file(b"", "empty.rtf", "rtf")
