"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { BulletinPreviewFrame } from "@/components/bulletin/bulletin-preview-frame";
import { ValidationWarnings } from "@/components/editor/validation-warnings";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PLACEHOLDER } from "@/lib/mapping/bulletin-mapper";
import type { BulletinData, ProgramItem } from "@/types/bulletin";

function cloneData(data: BulletinData): BulletinData {
  return JSON.parse(JSON.stringify(data)) as BulletinData;
}

function updateItem(items: ProgramItem[], index: number, value: string) {
  return items.map((item, itemIndex) =>
    itemIndex === index
      ? {
          ...item,
          value,
          source: "manual" as const,
          warning: value.includes(PLACEHOLDER) ? item.warning : undefined,
        }
      : item,
  );
}

const SECTIONS: { key: keyof BulletinData; label: string }[] = [
  { key: "top_info", label: "Info Awal" },
  { key: "sekolah_sabat_items", label: "Ibadah Sekolah Sabat" },
  { key: "khotbah_items", label: "Ibadah Khotbah" },
  { key: "closing_items", label: "Penutup" },
];

export function BulletinEditor({
  bulletinId,
  title,
  initialData,
}: {
  bulletinId: string;
  title: string;
  initialData: BulletinData;
}) {
  const router = useRouter();
  const [data, setData] = useState<BulletinData>(() => cloneData(initialData));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const warnings = useMemo(() => {
    const placeholderWarnings = JSON.stringify(data).includes(PLACEHOLDER)
      ? ["Masih ada field dengan placeholder [perlu diisi]."]
      : [];
    const lengthWarnings =
      JSON.stringify(data).length > 6200
        ? ["Konten cukup panjang dan berisiko overflow pada satu halaman A4."]
        : [];

    return Array.from(
      new Set([...data.validation_notes, ...placeholderWarnings, ...lengthWarnings]),
    );
  }, [data]);

  function addItem(sectionKey: keyof BulletinData) {
    const newLabel = prompt("Nama item baru:");
    if (!newLabel?.trim()) return;

    setData((current) => ({
      ...current,
      [sectionKey]: [
        ...(current[sectionKey] as ProgramItem[]),
        {
          label: newLabel.trim(),
          value: "",
          is_required: false,
          source: "manual" as const,
        },
      ],
    }));
  }

  function removeItem(sectionKey: keyof BulletinData, index: number) {
    setData((current) => ({
      ...current,
      [sectionKey]: (current[sectionKey] as ProgramItem[]).filter((_, i) => i !== index),
    }));
  }

  function moveItem(
    sectionKey: keyof BulletinData,
    fromIndex: number,
    toIndex: number,
  ) {
    setData((current) => {
      const items = [...(current[sectionKey] as ProgramItem[])];
      if (toIndex < 0 || toIndex >= items.length) return current;
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { ...current, [sectionKey]: items };
    });
  }

  function moveItemToSection(
    fromSection: keyof BulletinData,
    fromIndex: number,
    toSection: keyof BulletinData,
  ) {
    setData((current) => {
      const fromItems = [...(current[fromSection] as ProgramItem[])];
      const toItems = [...(current[toSection] as ProgramItem[])];
      const [moved] = fromItems.splice(fromIndex, 1);
      toItems.push(moved);
      return {
        ...current,
        [fromSection]: fromItems,
        [toSection]: toItems,
      };
    });
  }

  async function saveDraft(): Promise<boolean> {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/bulletins/${bulletinId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, bulletinData: data, status: "draft" }),
    });
    const body = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(body?.error ?? "Draft gagal disimpan.");
      return false;
    }

    setMessage("Draft tersimpan.");
    router.refresh();
    return true;
  }

  async function exportFile(kind: "pdf" | "png") {
    if (warnings.length > 0 && !window.confirm("Buletin masih memiliki warning. Lanjut export?")) {
      return;
    }

    const saved = await saveDraft();
    if (!saved) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`/api/bulletins/${bulletinId}/export/${kind}`, {
        method: "POST",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const body = await response.json().catch(() => null);
      setLoading(false);

      if (!response.ok) {
        setError(body?.error ?? `Export ${kind.toUpperCase()} gagal.`);
        return;
      }

      setMessage(`Export ${kind.toUpperCase()} selesai.`);
      if (body?.url) {
        window.open(body.url, "_blank");
      }
      router.refresh();
    } catch (err) {
      setLoading(false);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Export timeout setelah 60 detik. Coba lagi.");
      } else {
        setError(`Export ${kind.toUpperCase()} gagal: koneksi terputus.`);
      }
    }
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,620px)_1fr]">
      <div className="space-y-4">
        {error ? <Alert tone="danger">{error}</Alert> : null}
        {message ? <Alert tone="info">{message}</Alert> : null}
        <section className="space-y-3 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-on-surface">Preview A4</h2>
            <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Live
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={saveDraft}
              disabled={loading}
              className="w-full px-3"
            >
              <Save className="h-4 w-4" />
              Simpan
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => exportFile("pdf")}
              disabled={loading}
              className="w-full px-3"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => exportFile("png")}
              disabled={loading}
              className="w-full px-3"
            >
              <Download className="h-4 w-4" />
              PNG
            </Button>
          </div>
          <BulletinPreviewFrame data={data} />
        </section>
        <ValidationWarnings warnings={warnings} />
        <Card>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-on-surface">Judul</span>
                <Input
                  value={data.header.title}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      header: { ...current.header, title: event.target.value },
                    }))
                  }
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-on-surface">Tanggal</span>
                <Input
                  value={data.header.date_text}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      header: { ...current.header, date_text: event.target.value },
                    }))
                  }
                />
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-on-surface">Nama Gereja</span>
              <Input
                value={data.header.church_name}
                onChange={(event) =>
                  setData((current) => ({
                    ...current,
                    header: { ...current.header, church_name: event.target.value },
                  }))
                }
              />
            </label>
          </CardContent>
        </Card>

        {SECTIONS.map(({ key, label }) => (
          <Card key={key}>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-on-surface">{label}</h2>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => addItem(key)}
                >
                  <Plus className="h-4 w-4" />
                  Tambah
                </Button>
              </div>
              {(data[key] as ProgramItem[]).map((item, index) => (
                <div
                  key={`${key}-${item.label}-${index}`}
                  className="grid gap-2 rounded-xl border border-outline bg-surface-dim p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:border-0 sm:bg-transparent sm:p-0"
                >
                  <div className="flex gap-1 sm:flex-col">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 min-h-8 w-8 min-w-8"
                      disabled={index === 0}
                      onClick={() => moveItem(key, index, index - 1)}
                      title="Pindah atas"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 min-h-8 w-8 min-w-8"
                      disabled={index === (data[key] as ProgramItem[]).length - 1}
                      onClick={() => moveItem(key, index, index + 1)}
                      title="Pindah bawah"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="min-w-0 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                      {item.label}
                    </span>
                    <Input
                      value={item.value}
                      onChange={(event) =>
                        setData((current) => ({
                          ...current,
                          [key]: updateItem(
                            current[key] as ProgramItem[],
                            index,
                            event.target.value,
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="flex gap-2 sm:flex-col sm:gap-1">
                    <select
                      className="min-h-9 min-w-0 flex-1 rounded-lg border border-outline bg-surface-bright px-2 text-xs text-on-surface outline-none focus:border-primary-light sm:w-28"
                      value=""
                      onChange={(e) => {
                        const toSection = e.target.value as keyof BulletinData;
                        if (toSection && toSection !== key) {
                          moveItemToSection(key, index, toSection);
                        }
                        e.target.value = "";
                      }}
                      title="Pindah ke section"
                    >
                      <option value="">Pindah...</option>
                      {SECTIONS.filter((s) => s.key !== key).map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-9 min-h-9 w-9 min-w-9"
                      onClick={() => removeItem(key, index)}
                      title="Hapus"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-bold text-on-surface">Khotbah</h2>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-on-surface">Tema</span>
              <Textarea
                value={data.sermon.title}
                onChange={(event) =>
                  setData((current) => ({
                    ...current,
                    sermon: { ...current.sermon, title: event.target.value },
                  }))
                }
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-on-surface">Pembicara</span>
              <Input
                value={data.sermon.preacher}
                onChange={(event) =>
                  setData((current) => ({
                    ...current,
                    sermon: { ...current.sermon, preacher: event.target.value },
                  }))
                }
              />
            </label>
          </CardContent>
        </Card>

        <div className="hidden gap-2 rounded-xl border border-outline bg-background/95 p-3 shadow-md backdrop-blur-xl sm:sticky sm:bottom-4 sm:flex sm:flex-wrap">
          <Button type="button" onClick={saveDraft} disabled={loading} className="w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Simpan Draft
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setData(cloneData(initialData))}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button type="button" variant="secondary" onClick={() => exportFile("pdf")} className="w-full sm:w-auto">
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button type="button" variant="secondary" onClick={() => exportFile("png")} className="w-full sm:w-auto">
            <Download className="h-4 w-4" />
            PNG
          </Button>
        </div>
      </div>
      <div className="hidden lg:sticky lg:top-20 lg:block lg:h-[calc(100vh-6rem)]">
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-outline bg-surface-dim p-3">
          <div>
            <h2 className="text-sm font-bold text-on-surface">Preview A4</h2>
            <p className="text-xs text-on-surface-variant">Cek hasil dan export dari panel ini.</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => exportFile("pdf")}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => exportFile("png")}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              PNG
            </Button>
          </div>
        </div>
        <BulletinPreviewFrame data={data} />
      </div>
    </div>
  );
}
