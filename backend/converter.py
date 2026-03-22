import os
import tempfile
import re
from markitdown import MarkItDown

SUPPORTED_FILE_TYPES = {"pdf", "docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

md_converter = MarkItDown()


def convert_file(content: bytes, filename: str, file_type: str) -> dict:
    if file_type not in SUPPORTED_FILE_TYPES:
        raise ValueError(f"Unsupported file type: {file_type}")

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(f"File too large: {len(content)} bytes (max {MAX_FILE_SIZE})")

    suffix = f".{file_type}"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = md_converter.convert(tmp_path)
        return {
            "markdown": result.text_content,
            "metadata": {
                "title": os.path.splitext(filename)[0],
                "type": file_type,
                "size": len(content),
            },
        }
    finally:
        os.unlink(tmp_path)


def convert_url(url: str, url_type: str) -> dict:
    if url_type == "youtube":
        youtube_pattern = r"(youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)"
        if not re.search(youtube_pattern, url):
            raise ValueError(f"Invalid YouTube URL: {url}")

        result = md_converter.convert(url)
        return {
            "markdown": result.text_content,
            "metadata": {
                "title": url,
                "type": "youtube",
                "size": len(result.text_content),
            },
        }

    raise ValueError(f"Unsupported URL type: {url_type}")
