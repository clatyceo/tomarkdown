"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ToolConfig } from "@/lib/tools";
import { convertFile, convertUrl, convertBatch, BatchResult } from "@/lib/api";
import FileUploader from "./file-uploader";
import UrlInput from "./url-input";
import MarkdownPreview from "./markdown-preview";
import DownloadButton from "./download-button";
import { AdUnit } from "./ad-unit";

export function sanitizeFilename(title: string, fallback: string): string {
  if (!title) return fallback;
  return title.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase() || fallback;
}

function downloadMarkdown(markdown: string, filename: string) {
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ConverterPage({ tool }: { tool: ToolConfig }) {
  const t = useTranslations("common");
  const tTool = useTranslations(`tools.${tool.key}`);
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Batch mode state
  const [batchMode, setBatchMode] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchResult | null>(null);

  const handleConvert = async (convert: () => Promise<{ markdown: string; metadata: { title: string } }>) => {
    setIsLoading(true);
    setError("");
    setMarkdown("");
    setBatchResults(null);
    try {
      const result = await convert();
      setMarkdown(result.markdown);
      setTitle(result.metadata.title);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("conversionFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchConvert = async (files: File[]) => {
    setIsLoading(true);
    setError("");
    setMarkdown("");
    setBatchResults(null);
    try {
      const result = await convertBatch(files);
      setBatchResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("conversionFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAll = () => {
    if (!batchResults) return;
    for (const result of batchResults.results) {
      const name = sanitizeFilename(
        result.metadata?.title || result.filename,
        result.filename.replace(/\.[^.]+$/, "")
      );
      downloadMarkdown(result.markdown, name);
    }
  };

  const toggleBatchMode = () => {
    setBatchMode(!batchMode);
    setMarkdown("");
    setTitle("");
    setBatchResults(null);
    setError("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
        {tTool("h1")}
      </h1>
      <p className="mt-3 text-gray-500 text-center">{tTool("subtitle")}</p>

      {/* Batch mode toggle - only for file-based tools */}
      {tool.inputMode === "file" && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <label htmlFor="batch-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">
            {t("batchMode")}
          </label>
          <button
            id="batch-toggle"
            role="switch"
            aria-checked={batchMode}
            onClick={toggleBatchMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              batchMode ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                batchMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          {batchMode && (
            <span className="text-xs text-gray-400">{t("batchModeDesc")}</span>
          )}
        </div>
      )}

      <div className="mt-10">
        {tool.inputMode === "file" ? (
          <FileUploader
            accept={tool.accept!}
            onFileSelect={(file) => handleConvert(() => convertFile(file, tool.type))}
            onFilesSelect={(files) => handleBatchConvert(files)}
            onError={setError}
            isLoading={isLoading}
            multiple={batchMode}
            maxFiles={5}
          />
        ) : (
          <UrlInput
            placeholder={tool.placeholder!}
            onSubmit={(url) => handleConvert(() => convertUrl(url, tool.type))}
            isLoading={isLoading}
          />
        )}
      </div>

      {error && (
        <p role="alert" aria-live="polite" className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}

      {/* Single file result */}
      {markdown && !batchMode && (
        <div className="mt-8 space-y-4">
          <MarkdownPreview markdown={markdown} title={title} />
          <DownloadButton markdown={markdown} filename={sanitizeFilename(title, tool.type)} />
          <AdUnit slot="result-bottom" format="horizontal" />
        </div>
      )}

      {/* Batch results */}
      {batchResults && (
        <div className="mt-8 space-y-6">
          {/* Errors */}
          {batchResults.errors.length > 0 && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <h3 className="text-sm font-semibold text-red-800 mb-2">{t("batchErrors")}</h3>
              <ul className="space-y-1">
                {batchResults.errors.map((err, i) => (
                  <li key={i} className="text-sm text-red-600">
                    <span className="font-medium">{err.filename}</span>: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Results */}
          {batchResults.results.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("batchResults")} ({batchResults.results.length}/{batchResults.total})
                </h3>
                <button
                  onClick={handleDownloadAll}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {t("downloadAll")}
                </button>
              </div>
              <div className="space-y-6">
                {batchResults.results.map((result, i) => {
                  const name = sanitizeFilename(
                    result.metadata?.title || result.filename,
                    result.filename.replace(/\.[^.]+$/, "")
                  );
                  return (
                    <div key={i} className="space-y-3">
                      <MarkdownPreview
                        markdown={result.markdown}
                        title={result.filename}
                      />
                      <DownloadButton markdown={result.markdown} filename={name} />
                    </div>
                  );
                })}
              </div>
              <AdUnit slot="result-bottom" format="horizontal" />
            </>
          )}
        </div>
      )}
    </div>
  );
}
