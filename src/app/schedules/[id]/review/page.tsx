import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ScheduleReviewTable } from "@/components/schedules/schedule-review-table";
import { ScheduleStatusBadge } from "@/components/schedules/schedule-status-badge";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function toSchoolRows(rows: Awaited<ReturnType<typeof prisma.scheduleRowSekolahSabat.findMany>>) {
  return rows.map((row) => ({
    date: row.date.toISOString().slice(0, 10),
    date_text: row.dateText,
    pemimpin_doa_tutup: row.pemimpinDoaTutup,
    doa_buka_ayat_inti: row.doaBukaAyatInti,
    mision: row.mision,
    promosi_pp_rumah_tangga: row.promosiPpRumahTangga,
    pembawa_persembahan: row.pembawaPersembahan,
    confidence: Number(row.confidence),
    notes: row.notes,
  }));
}

function toSermonRows(rows: Awaited<ReturnType<typeof prisma.scheduleRowKhotbah.findMany>>) {
  return rows.map((row) => ({
    date: row.date.toISOString().slice(0, 10),
    date_text: row.dateText,
    pianis: row.pianis,
    chorister: row.chorister,
    doa_invokasi: row.doaInvokasi,
    ayat_bersahutan: row.ayatBersahutan,
    lagu_buka: row.laguBuka,
    doa_syafaat: row.doaSyafaat,
    persembahan_syukur: row.persembahanSyukur,
    jemaat_memuji: row.jemaatMemuji,
    doa_persembahan: row.doaPersembahan,
    jemaat_menyambut: row.jemaatMenyambut,
    lagu_pujian_1: row.laguPujian1,
    khotbah_anak: row.khotbahAnak,
    jemaat_menyanyi: row.jemaatMenyanyi,
    scoreboard_visi_misi: row.scoreboardVisiMisi,
    ayat_inti: row.ayatInti,
    lagu_tema: row.laguTema,
    khotbah: row.khotbah,
    tema_khotbah: row.temaKhotbah,
    lagu_tutup: row.laguTutup,
    doa_tutup: row.doaTutup,
    komunikasi_jemaat: row.komunikasiJemaat,
    confidence: Number(row.confidence),
    notes: row.notes,
  }));
}

export default async function ReviewSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const schedule = await prisma.scheduleUpload
    .findUnique({
      where: { id },
      include: {
        sekolahSabatRows: { orderBy: { date: "asc" } },
        khotbahRows: { orderBy: { date: "asc" } },
      },
    })
    .catch(() => null);

  if (!schedule) {
    return (
      <AppShell>
        <Alert tone="danger">Jadwal tidak ditemukan atau database belum siap.</Alert>
      </AppShell>
    );
  }

  const rows =
    schedule.type === "sekolah_sabat"
      ? toSchoolRows(schedule.sekolahSabatRows)
      : toSermonRows(schedule.khotbahRows);

  const isImage = /\.(png|jpg|jpeg|webp)$/i.test(schedule.originalFileUrl);

  return (
    <AppShell>
      <PageHeader
        title={schedule.title}
        description="Review hasil ekstraksi, koreksi nama/tanggal, lalu tandai jadwal sebagai reviewed."
        actions={<ScheduleStatusBadge status={schedule.extractionStatus} />}
      />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="min-w-0">
          <CardContent>
            <div className="mb-3 text-sm font-bold text-on-surface">File Asli</div>
            {isImage ? (
              <div className="overflow-hidden rounded-xl border border-outline bg-surface-dim">
                <Image
                  src={schedule.originalFileUrl}
                  alt={schedule.title}
                  width={700}
                  height={900}
                  className="h-auto max-h-[70vh] w-full object-contain"
                />
              </div>
            ) : (
              <a
                href={schedule.originalFileUrl}
                className="text-sm font-semibold text-accent hover:text-accent-light"
                target="_blank"
              >
                Buka file PDF
              </a>
            )}
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardContent>
            <ScheduleReviewTable
              scheduleId={schedule.id}
              type={schedule.type}
              rows={rows}
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
