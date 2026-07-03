"use client";

import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileUploadDropzone({
  file,
  onFileChange,
}: {
  file?: File | null;
  onFileChange: (file: File | null) => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-accent/50 bg-surface px-6 text-center transition hover:border-accent hover:bg-surface-dim",
        "break-words",
      )}
    >
      <UploadCloud className="h-8 w-8 text-accent" />
      <span className="text-sm font-semibold text-on-surface">
        {file ? file.name : "Pilih file jadwal"}
      </span>
      <span className="text-xs text-on-surface-variant">PNG, JPG, JPEG, atau PDF hingga 10 MB</span>
      <input
        className="sr-only"
        type="file"
        accept="image/png,image/jpeg,application/pdf"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}
