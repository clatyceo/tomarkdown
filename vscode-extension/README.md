# tomdnow -- File to Markdown

Convert any file to clean, structured Markdown directly from VS Code.

Powered by [tomdnow.com](https://tomdnow.com) -- the universal file-to-Markdown conversion API.

## Supported Formats

| Category     | Formats                          |
| ------------ | -------------------------------- |
| Documents    | PDF, DOCX, HWP, HWPX, RTF, TXT |
| Presentations| PPTX                             |
| Spreadsheets | XLSX, XLS, CSV                   |
| Web / Data   | HTML, JSON, XML                  |
| E-books      | EPUB                             |
| Email        | MSG                              |
| Notebooks    | IPYNB                            |
| Archives     | ZIP                              |
| Images       | PNG, JPG, JPEG, GIF, WEBP       |

## Setup

1. Install the extension from the VS Code Marketplace.
2. Get a free API key at [tomdnow.com/dashboard](https://tomdnow.com/dashboard).
3. Open VS Code Settings and search for `tomdnow.apiKey`.
4. Paste your API key.

## Usage

### Right-click in Explorer

Right-click any supported file in the Explorer sidebar and select **Convert to Markdown**.

### Command Palette

1. Open a file in the editor.
2. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
3. Search for **tomdnow: Convert Current File to Markdown**.

The converted `.md` file is saved next to the original and opened automatically.

## Configuration

| Setting           | Default                        | Description                                    |
| ----------------- | ------------------------------ | ---------------------------------------------- |
| `tomdnow.apiKey`  | (empty)                        | Your API key from tomdnow.com/dashboard        |
| `tomdnow.apiUrl`  | `https://tomdnow.com/api/v1`  | API base URL (change for self-hosted instances) |

## Links

- Website: [tomdnow.com](https://tomdnow.com)
- API Docs: [tomdnow.com/docs/api](https://tomdnow.com/docs/api)
- Issues: [github.com/tomdnow/tomdnow/issues](https://github.com/tomdnow/tomdnow/issues)

## License

MIT
