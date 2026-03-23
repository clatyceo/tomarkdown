import io
import logging

logger = logging.getLogger(__name__)

# Language code mapping (ISO 639-1 to Tesseract)
LANG_MAP = {
    "en": "eng",
    "ko": "kor",
    "ja": "jpn",
    "zh": "chi_sim",
    "de": "deu",
    "fr": "fra",
    "es": "spa",
    "pt": "por",
}

VALID_LANGS = set(LANG_MAP.values())


def get_tesseract_lang(locale: str) -> str:
    """Convert locale code to Tesseract language code."""
    return LANG_MAP.get(locale, "eng")


def ocr_image_to_markdown(content: bytes, lang: str = "eng") -> dict:
    """Extract text from image using Tesseract OCR and format as Markdown.

    Returns a dict matching the convert_file return format:
        {"markdown": ..., "metadata": {...}}
    """
    try:
        import pytesseract
    except ImportError:
        raise RuntimeError(
            "pytesseract is not installed. Install it with: pip install pytesseract"
        )

    from PIL import Image

    if lang not in VALID_LANGS:
        lang = "eng"

    image = Image.open(io.BytesIO(content))
    raw = pytesseract.image_to_string(image, lang=lang)
    text = str(raw) if raw else ""

    if not text.strip():
        from errors import ConversionError
        raise ConversionError("No text detected in image. The image may not contain readable text.")

    # Clean up and format as markdown
    lines = text.strip().split("\n")
    markdown_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped:
            markdown_lines.append(stripped)
        else:
            markdown_lines.append("")

    markdown = "\n".join(markdown_lines)

    return {
        "markdown": markdown,
        "metadata": {
            "title": "ocr-result",
            "type": "ocr",
            "size": len(content),
            "lang": lang,
        },
    }
