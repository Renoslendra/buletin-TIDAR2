"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WandSparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileUploadDropzone } from "@/components/ui/file-upload-dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

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

    setLoading(true);
    setError(null);

    const form = new FormData();
    form.set("file", file);
    form.set("type", type);
    form.set("title", title);
    form.set("period", period);

    const uploadResponse = await fetch("/api/schedules/upload", {
      method: "POST",
      body: form,
    });

    const uploadBody = await uploadResponse.json().catch(() => null);

    if (!uploadResponse.ok) {
      setLoading(false);
      setError(uploadBody?.error ?? "Upload jadwal gagal.");
      return;
    }

    const scheduleId = uploadBody.schedule.id;
    const extractResponse = await fetch(`/api/schedules/${scheduleId}/extract`, {
      method: "POST",
    });
    const extractBody = await extractResponse.json().catch(() => null);
    setLoading(false);

    if (!extractResponse.ok) {
      setError(extractBody?.error ?? "Ekstraksi jadwal gagal.");
      router.push(`/schedules/${scheduleId}/review`);
      return;
    }

    router.push(`/schedules/${scheduleId}/review`);
    router.refresh();
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
