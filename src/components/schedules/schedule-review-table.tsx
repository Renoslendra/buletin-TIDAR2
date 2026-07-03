"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Plus, Save, ShieldCheck, Trash2, WandSparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tbody, Td, Th, Thead, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ScheduleType } from "@/types/schedule";

type ReviewRow = Record<string, string | number | null>;

const schoolColumns = [
  ["date", "Tanggal"],
  ["date_text", "Teks Tanggal"],
  ["pemimpin_doa_tutup", "Pemimpin/Doa Tutup"],
  ["doa_buka_ayat_inti", "Doa Buka/Ayat Inti"],
  ["mision", "Mision"],
  ["promosi_pp_rumah_tangga", "Promosi PP/RT"],
  ["pembawa_persembahan", "Persembahan"],
  ["confidence", "Confidence"],
  ["notes", "Notes"],
] as const;

const sermonColumns = [
  ["date", "Tanggal"],
  ["date_text", "Teks Tanggal"],
  ["pianis", "Pianis"],
  ["chorister", "Chorister"],
  ["doa_invokasi", "Doa Invokasi"],
  ["ayat_bersahutan", "Ayat Bersahutan"],
  ["lagu_buka", "Lagu Buka"],
  ["doa_syafaat", "Doa Syafaat"],
  ["persembahan_syukur", "Persembahan Syukur"],
  ["jemaat_memuji", "Jemaat Memuji"],
  ["doa_persembahan", "Doa Persembahan"],
  ["jemaat_menyambut", "Jemaat Menyambut"],
  ["lagu_pujian_1", "Lagu Pujian"],
  ["khotbah_anak", "Khotbah Anak"],
  ["jemaat_menyanyi", "Jemaat Menyanyi"],
  ["scoreboard_visi_misi", "Scoreboard/Visi Misi"],
  ["ayat_inti", "Ayat Inti"],
  ["lagu_tema", "Lagu Tema"],
  ["khotbah", "Khotbah"],
  ["tema_khotbah", "Tema"],
  ["lagu_tutup", "Lagu Tutup"],
  ["doa_tutup", "Doa Tutup"],
  ["komunikasi_jemaat", "Komunikasi"],
  ["confidence", "Confidence"],
  ["notes", "Notes"],
] as const;

function emptyRow(type: ScheduleType): ReviewRow {
  const columns = type === "sekolah_sabat" ? schoolColumns : sermonColumns;
  return Object.fromEntries(columns.map(([key]) => [key, key === "confidence" ? 0.5 : ""]));
}

export function ScheduleReviewTable({
  scheduleId,
  type,
  rows: initialRows,
}: {
  scheduleId: string;
  type: ScheduleType;
  rows: ReviewRow[];
}) {
  const router = useRouter();
  const columns = useMemo(
    () => (type === "sekolah_sabat" ? schoolColumns : sermonColumns),
    [type],
  );
  const [rows, setRows] = useState<ReviewRow[]>(
    initialRows.length > 0 ? initialRows : [emptyRow(type)],
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateCell(index: number, key: string, value: string) {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [key]: key === "confidence" ? Number(value) : value }
          : row,
      ),
    );
  }

  async function saveRows() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/schedules/${scheduleId}/rows`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    const body = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(body?.error ?? "Gagal menyimpan koreksi.");
      return;
    }

    setMessage("Koreksi jadwal tersimpan.");
    router.refresh();
  }

  async function extractAgain() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/schedules/${scheduleId}/extract`, {
      method: "POST",
    });
    const body = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(body?.error ?? "Ekstraksi ulang gagal.");
      return;
    }

    router.refresh();
    setMessage("Ekstraksi ulang selesai.");
  }

  async function markReviewed() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/schedules/${scheduleId}/mark-reviewed`, {
      method: "POST",
    });
    const body = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(body?.error ?? "Gagal menandai reviewed.");
      return;
    }

    setMessage("Jadwal ditandai reviewed.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {message ? <Alert tone="info">{message}</Alert> : null}
      <div className="grid gap-2 sm:flex sm:flex-wrap">
        <Button type="button" onClick={saveRows} disabled={loading} className="w-full sm:w-auto">
          <Save className="h-4 w-4" />
          Simpan Koreksi
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={markReviewed}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <ShieldCheck className="h-4 w-4" />
          Tandai Reviewed
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={extractAgain}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <WandSparkles className="h-4 w-4" />
          Ekstraksi Ulang
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setRows((current) => [...current, emptyRow(type)])}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah Baris
        </Button>
      </div>

      <div className="hidden md:block">
        <Table>
          <Thead>
          <tr>
            {columns.map(([key, label]) => (
              <Th key={key} className="min-w-44">
                {label}
              </Th>
            ))}
            <Th className="min-w-28">Aksi</Th>
          </tr>
          </Thead>
          <Tbody>
          {rows.map((row, rowIndex) => {
            const confidence = Number(row.confidence ?? 0);
            return (
              <tr key={rowIndex} className={confidence < 0.8 ? "bg-warning/10" : ""}>
                {columns.map(([key]) => (
                  <Td key={key}>
                    <Input
                      type={key === "confidence" ? "number" : "text"}
                      step={key === "confidence" ? "0.01" : undefined}
                      min={key === "confidence" ? "0" : undefined}
                      max={key === "confidence" ? "1" : undefined}
                      value={String(row[key] ?? "")}
                      onChange={(event) => updateCell(rowIndex, key, event.target.value)}
                    />
                  </Td>
                ))}
                <Td>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="Duplikat"
                      onClick={() =>
                        setRows((current) => [
                          ...current.slice(0, rowIndex + 1),
                          { ...row },
                          ...current.slice(rowIndex + 1),
                        ])
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="Hapus"
                      onClick={() =>
                        setRows((current) =>
                          current.length === 1
                            ? [emptyRow(type)]
                            : current.filter((_, index) => index !== rowIndex),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Td>
              </tr>
            );
          })}
          </Tbody>
        </Table>
      </div>

      <div className="space-y-4 md:hidden">
        {rows.map((row, rowIndex) => {
          const confidence = Number(row.confidence ?? 0);

          return (
            <section
              key={rowIndex}
              className={cn(
                "rounded-xl border border-outline bg-surface-bright p-3",
                confidence < 0.8 && "border-warning/40 bg-warning/10",
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-on-surface">Baris {rowIndex + 1}</div>
                  <div className="text-xs text-on-surface-variant">
                    Confidence: {Number.isFinite(confidence) ? confidence.toFixed(2) : "0.00"}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    title="Duplikat"
                    className="h-9 min-h-9 w-9 min-w-9"
                    onClick={() =>
                      setRows((current) => [
                        ...current.slice(0, rowIndex + 1),
                        { ...row },
                        ...current.slice(rowIndex + 1),
                      ])
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    title="Hapus"
                    className="h-9 min-h-9 w-9 min-w-9"
                    onClick={() =>
                      setRows((current) =>
                        current.length === 1
                          ? [emptyRow(type)]
                          : current.filter((_, index) => index !== rowIndex),
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                {columns.map(([key, label]) => (
                  <label key={key} className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                      {label}
                    </span>
                    <Input
                      type={key === "confidence" ? "number" : "text"}
                      step={key === "confidence" ? "0.01" : undefined}
                      min={key === "confidence" ? "0" : undefined}
                      max={key === "confidence" ? "1" : undefined}
                      value={String(row[key] ?? "")}
                      onChange={(event) => updateCell(rowIndex, key, event.target.value)}
                    />
                  </label>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
