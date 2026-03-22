"use client";

import { useCallback, useState } from "react";
import { MAX_FILE_SIZE } from "@/lib/config";

interface FileUploaderProps {
  accept: string;
  onFileSelect: (file: File) => void;
  onError?: (msg: string) => void;
  isLoading: boolean;
}

export default function FileUploader({ accept, onFileSelect, onError, isLoading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        onError?.("File too large (max 10MB)");
        return;
      }
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const accepted = accept.split(",").map((a) => a.trim().toLowerCase());
      if (!accepted.some((a) => ext === a || ext.endsWith(a))) return;
      onFileSelect(file);
    },
    [onFileSelect, accept]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        onError?.("File too large (max 10MB)");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
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
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={isLoading}
      />
      {isLoading ? (
        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <>
          <p className="text-gray-600 font-medium">
            Drag & drop your file here
          </p>
          <p className="mt-1 text-sm text-gray-400">or click to browse</p>
        </>
      )}
    </div>
  );
}
