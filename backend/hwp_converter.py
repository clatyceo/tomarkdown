import logging
import os
import tempfile

logger = logging.getLogger(__name__)


def convert_hwpx_to_markdown(content: bytes) -> str:
    """Convert HWPX file to Markdown using python-hwpx."""
    from hwpx import HwpxDocument

    with tempfile.NamedTemporaryFile(suffix=".hwpx", delete=False) as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    try:
        doc = HwpxDocument.open(tmp_path)
        try:
            markdown = doc.export_markdown()
        except Exception:
            # Fallback: extract plain text
            markdown = doc.export_text()
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            logger.warning("Failed to cleanup temp file: %s", tmp_path)

    if not markdown or not markdown.strip():
        raise ValueError("Empty content after HWPX conversion")
    return markdown


def convert_hwp_to_markdown(content: bytes) -> str:
    """Convert HWP (binary) file to Markdown using pyhwp2md."""
    from pyhwp2md import convert as hwp2md_convert

    with tempfile.NamedTemporaryFile(suffix=".hwp", delete=False) as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    try:
        markdown = hwp2md_convert(tmp_path)
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            logger.warning("Failed to cleanup temp file: %s", tmp_path)

    if not markdown or not markdown.strip():
        raise ValueError("Empty content after HWP conversion")
    return markdown
