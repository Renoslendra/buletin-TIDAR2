"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { WandSparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type ScheduleOption = {
  id: string;
  title: string;
  type: "sekolah_sabat" | "khotbah";
  dates: string[];
};

export function BulletinNewForm({ schedules }: { schedules: ScheduleOption[] }) {
  const router = useRouter();
  const schoolSchedules = schedules.filter((schedule) => schedule.type === "sekolah_sabat");
  const sermonSchedules = schedules.filter((schedule) => schedule.type === "khotbah");
  const [schoolScheduleId, setSchoolScheduleId] = useState(schoolSchedules[0]?.id ?? "");
  const [sermonScheduleId, setSermonScheduleId] = useState(sermonSchedules[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const availableDates = useMemo(() => {
    const selected = schedules.filter(
      (schedule) => schedule.id === schoolScheduleId || schedule.id === sermonScheduleId,
    );
    return Array.from(new Set(selected.flatMap((schedule) => schedule.dates))).sort();
  }, [schedules, schoolScheduleId, sermonScheduleId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedDate = date || availableDates[0];
    if (!selectedDate) {
      setError("Tanggal Sabat wajib dipilih.");
      return;
    }

    setLoading(true);
    setError(null);
    const response = await fetch("/api/bulletins/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schoolScheduleId: schoolScheduleId || null,
        sermonScheduleId: sermonScheduleId || null,
        date: selectedDate,
      }),
    });
    const body = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(body?.error ?? "Generate buletin gagal.");
      return;
    }

    router.push(`/bulletins/${body.bulletin.id}/edit`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-on-surface">Jadwal Sekolah Sabat</span>
        <Select value={schoolScheduleId} onChange={(event) => setSchoolScheduleId(event.target.value)}>
          <option value="">Tidak tersedia</option>
          {schoolSchedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
              {schedule.title}
            </option>
          ))}
        </Select>
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-on-surface">Jadwal Khotbah</span>
        <Select value={sermonScheduleId} onChange={(event) => setSermonScheduleId(event.target.value)}>
          <option value="">Tidak tersedia</option>
          {sermonSchedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
              {schedule.title}
            </option>
          ))}
        </Select>
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-on-surface">Tanggal Sabat</span>
        <Select value={date} onChange={(event) => setDate(event.target.value)}>
          <option value="">Pilih tanggal</option>
          {availableDates.map((availableDate) => (
            <option key={availableDate} value={availableDate}>
              {availableDate}
            </option>
          ))}
        </Select>
      </label>
      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        <WandSparkles className="h-4 w-4" />
        {loading ? "Membuat Draft" : "Generate Draft"}
      </Button>
    </form>
  );
}
