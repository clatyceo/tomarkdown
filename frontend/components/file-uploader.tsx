"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { MAX_FILE_SIZE } from "@/lib/config";

interface FileUploaderProps {
  accept: string;
  onFileSelect: (file: File) => void;
  onError?: (msg: string) => void;
  isLoading: boolean;
}

export default function FileUploader({ accept, onFileSelect, onError, isLoading }: FileUploaderProps) {
  const t = useTranslations("common");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 1) {
        onError?.(t("oneFileOnly"));
        return;
      }
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        onError?.(t("fileTooLarge"));
        return;
      }
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const accepted = accept.split(",").map((a) => a.trim().toLowerCase());
      if (!accepted.some((a) => ext === a || ext.endsWith(a))) {
        onError?.(t("unsupportedType"));
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect, onError, accept, t]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        onError?.(t("fileTooLarge"));
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect, onError, t]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      role="button"
      aria-label={t("uploadArea")}
      className={`relative flex flex-col items-center justify-center w-full h-52 rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        aria-label={t("fileInputLabel")}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={isLoading}
      />
      {isLoading ? (
        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <>
          <p className="text-gray-600 font-medium">
            {t("dragDrop")}
          </p>
          <p className="mt-1 text-sm text-gray-400">{t("orBrowse")}</p>
        </>
      )}
    </div>
  );
}
