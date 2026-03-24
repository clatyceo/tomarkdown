# tomd

Convert any file to Markdown from the terminal. Powered by [tomdnow.com](https://tomdnow.com).

## Install

```bash
npm install -g tomd
```

Requires **Node.js 18+** (uses native `fetch`).

## Setup

Get an API key from [tomdnow.com/dashboard](https://tomdnow.com/dashboard), then configure:

```bash
tomd config set api-key tmd_your_api_key
```

## Usage

```bash
# Convert a single file
tomd convert document.pdf          # creates document.md

# Specify output path
tomd convert report.docx -o out.md

# Print to stdout (pipe-friendly)
tomd convert file.pdf --stdout | pbcopy

# Convert multiple files
tomd convert *.pdf

# List supported formats
tomd formats
```

## Supported Formats

pdf, docx, pptx, xlsx, xls, hwp, hwpx, rtf, txt, html, htm, epub, csv, json, xml, msg, ipynb, zip, jpg, jpeg, png, gif, webp

## Configuration

Settings are stored in `~/.tomd/config.json`.

| Key       | Description                              | Required |
| --------- | ---------------------------------------- | -------- |
| api-key   | Your tomdnow API key                    | Yes      |
| api-url   | Custom API base URL (advanced)           | No       |

```bash
tomd config set api-key YOUR_KEY
tomd config get api-key
tomd config set api-url https://custom.endpoint.com/api/v1
```

## How It Works

1. Reads the file from disk
2. Sends it to the tomdnow conversion API
3. Writes the resulting Markdown to a file (or stdout)

Progress messages go to stderr; Markdown content goes to stdout. This follows Unix conventions so you can safely pipe output.

## License

MIT
