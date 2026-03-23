"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ToolConfig } from "@/lib/tools";
import { convertFile, convertUrl } from "@/lib/api";
import FileUploader from "./file-uploader";
import UrlInput from "./url-input";
import MarkdownPreview from "./markdown-preview";
import DownloadButton from "./download-button";

export function sanitizeFilename(title: string, fallback: string): string {
  if (!title) return fallback;
  return title.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase() || fallback;
}

export default function ConverterPage({ tool }: { tool: ToolConfig }) {
  const t = useTranslations("common");
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async (convert: () => Promise<{ markdown: string; metadata: { title: string } }>) => {
    setIsLoading(true);
    setError("");
    setMarkdown("");
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
        {tool.h1}
      </h1>
      <p className="mt-3 text-gray-500 text-center">{tool.subtitle}</p>

      <div className="mt-10">
        {tool.inputMode === "file" ? (
          <FileUploader
            accept={tool.accept!}
            onFileSelect={(file) => handleConvert(() => convertFile(file, tool.type))}
            onError={setError}
            isLoading={isLoading}
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

      {markdown && (
        <div className="mt-8 space-y-4">
          <MarkdownPreview markdown={markdown} title={title} />
          <DownloadButton markdown={markdown} filename={sanitizeFilename(title, tool.type)} />
        </div>
      )}
    </div>
  );
}
