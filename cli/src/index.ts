import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const VERSION = "0.1.0";
const DEFAULT_API_URL = "https://tomdnow.com/api/v1";
const CONFIG_DIR = path.join(os.homedir(), ".tomd");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

const SUPPORTED_FORMATS = [
  "pdf",
  "docx",
  "pptx",
  "xlsx",
  "xls",
  "hwp",
  "hwpx",
  "rtf",
  "txt",
  "html",
  "htm",
  "epub",
  "csv",
  "json",
  "xml",
  "msg",
  "ipynb",
  "zip",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
];

// ---------------------------------------------------------------------------
// Config management
// ---------------------------------------------------------------------------

function loadConfig(): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveConfig(config: Record<string, string>): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// ---------------------------------------------------------------------------
// File conversion
// ---------------------------------------------------------------------------

async function convertFile(
  filePath: string,
  apiKey: string,
  apiUrl: string
): Promise<string> {
  const content = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  const formData = new FormData();
  formData.append("file", new Blob([content]), fileName);

  const res = await fetch(`${apiUrl}/convert`, {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: formData,
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(
      (error as Record<string, string>).error ||
        (error as Record<string, string>).detail ||
        `HTTP ${res.status}`
    );
  }

  const result = (await res.json()) as Record<string, string>;
  if (!result.markdown) {
    throw new Error("No markdown content in response");
  }
  return result.markdown;
}

// ---------------------------------------------------------------------------
// Command handlers
// ---------------------------------------------------------------------------

function handleConfig(args: string[]): void {
  const config = loadConfig();
  const action = args[0];
  const key = args[1];
  const value = args[2];

  if (action === "set" && key && value) {
    config[key] = value;
    saveConfig(config);
    console.log(`Set ${key}`);
  } else if (action === "get" && key) {
    console.log(config[key] || "(not set)");
  } else {
    console.error(
      "Usage: tomd config set <key> <value> | tomd config get <key>"
    );
    process.exit(1);
  }
}

async function handleConvert(args: string[]): Promise<void> {
  const config = loadConfig();
  const apiKey = config["api-key"];
  const apiUrl = config["api-url"] || DEFAULT_API_URL;

  if (!apiKey) {
    console.error("Error: API key not configured.");
    console.error("Run: tomd config set api-key YOUR_API_KEY");
    console.error("Get a key at: https://tomdnow.com/dashboard");
    process.exit(1);
  }

  // Parse flags
  let outputPath: string | null = null;
  let toStdout = false;
  const files: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-o" || args[i] === "--output") {
      outputPath = args[++i];
    } else if (args[i] === "--stdout") {
      toStdout = true;
    } else if (!args[i].startsWith("-")) {
      files.push(args[i]);
    }
  }

  if (files.length === 0) {
    console.error("Error: No files specified");
    process.exit(1);
  }

  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.error(`Error: File not found: ${file}`);
      continue;
    }

    try {
      process.stderr.write(`Converting ${path.basename(file)}...`);
      const markdown = await convertFile(file, apiKey, apiUrl);

      if (toStdout) {
        process.stdout.write(markdown);
      } else {
        const out = outputPath || file.replace(/\.[^.]+$/, ".md");
        fs.writeFileSync(out, markdown, "utf-8");
        process.stderr.write(` -> ${path.basename(out)}\n`);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      process.stderr.write(` Error: ${msg}\n`);
    }
  }
}

function printHelp(): void {
  console.log(`
tomd - Convert any file to Markdown (powered by tomdnow.com)

Usage:
  tomd convert <file> [options]     Convert a file to Markdown
  tomd config set <key> <value>     Set configuration
  tomd config get <key>             Get configuration
  tomd formats                      List supported formats
  tomd --version                    Show version
  tomd --help                       Show this help

Options:
  -o, --output <path>    Output file path (default: same name with .md)
  --stdout               Print to stdout instead of saving

Configuration:
  api-key    Your tomdnow API key (required)
  api-url    API base URL (default: ${DEFAULT_API_URL})

Examples:
  tomd config set api-key tmd_xxxxx
  tomd convert document.pdf
  tomd convert report.docx -o report.md
  tomd convert file.pdf --stdout | pbcopy

Get your API key at: https://tomdnow.com/dashboard
`);
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  if (args.includes("--version") || args.includes("-v")) {
    console.log(VERSION);
    return;
  }

  const command = args[0];

  if (command === "formats") {
    console.log("Supported formats:");
    console.log(SUPPORTED_FORMATS.join(", "));
    return;
  }

  if (command === "config") {
    handleConfig(args.slice(1));
    return;
  }

  if (command === "convert") {
    await handleConvert(args.slice(1));
    return;
  }

  // Default: treat as file path(s) for conversion
  await handleConvert(args);
}

main().catch((err: Error) => {
  console.error("Fatal error:", err.message || err);
  process.exit(1);
});
