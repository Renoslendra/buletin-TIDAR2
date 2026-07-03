"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WandSparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileUploadDropzone } from "@/components/ui/file-upload-dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

async function readErrorMessage(response: Response, fallback: string) {
  const statusSuffix = response.status ? ` (HTTP ${response.status})` : "";
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return body?.error ?? `${fallback}${statusSuffix}`;
  }

  const text = (await response.text().catch(() => "")).trim();
  return text ? `${fallback} ${text.slice(0, 240)}` : `${fallback}${statusSuffix}`;
}

function validateFile(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Ukuran file maksimal 10 MB.";
  }

  if (file.type && !ALLOWED_UPLOAD_TYPES.has(file.type)) {
    return "Format file harus PNG, JPG, JPEG, atau WebP.";
  }

  return null;
}

export function ScheduleUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("sekolah_sabat");
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("File jadwal wajib dipilih.");
      return;
    }

    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.set("file", file);
      form.set("type", type);
      form.set("title", title);
      form.set("period", period);

      const uploadResponse = await fetch("/api/schedules/upload", {
        method: "POST",
        body: form,
      });

      if (!uploadResponse.ok) {
        const message = await readErrorMessage(uploadResponse, "Upload jadwal gagal.");
        setError(message);
        if (uploadResponse.status === 401) {
          router.push(`/login?next=${encodeURIComponent("/schedules/new")}`);
        }
        return;
      }

      const uploadBody = await uploadResponse.json().catch(() => null);
      const scheduleId = uploadBody?.schedule?.id;
      if (typeof scheduleId !== "string") {
        setError("Upload jadwal gagal. Respons server tidak valid.");
        return;
      }

      const extractResponse = await fetch(`/api/schedules/${scheduleId}/extract`, {
        method: "POST",
      });

      if (!extractResponse.ok) {
        const message = await readErrorMessage(extractResponse, "Ekstraksi jadwal gagal.");
        setError(message);
        if (extractResponse.status === 401) {
          router.push(`/login?next=${encodeURIComponent(`/schedules/${scheduleId}/review`)}`);
          return;
        }
        router.push(`/schedules/${scheduleId}/review`);
        return;
      }

      router.push(`/schedules/${scheduleId}/review`);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof TypeError
          ? "Tidak bisa menghubungi server. Periksa koneksi atau jalankan ulang aplikasi."
          : "Upload jadwal gagal.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-on-surface">Tipe Jadwal</span>
          <Select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="sekolah_sabat">Jadwal Sekolah Sabat</option>
            <option value="khotbah">Jadwal Khotbah</option>
          </Select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-on-surface">Periode</span>
          <Input
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            placeholder="Triwulan 3 - 2026"
          />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-on-surface">Judul</span>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Jadwal pelayanan Juli 2026"
        />
      </label>
      <FileUploadDropzone file={file} onFileChange={setFile} />
      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        <WandSparkles className="h-4 w-4" />
        {loading ? "Memproses" : "Upload dan Ekstrak"}
      </Button>
    </form>
  );
}
