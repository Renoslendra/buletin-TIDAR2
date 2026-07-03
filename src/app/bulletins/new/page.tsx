import { BulletinNewForm } from "@/components/bulletin/bulletin-new-form";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function NewBulletinPage() {
  let schedules: {
    id: string;
    title: string;
    type: "sekolah_sabat" | "khotbah";
    dates: string[];
  }[] = [];
  let error: string | null = null;

  try {
    const rows = await prisma.scheduleUpload.findMany({
      where: { extractionStatus: "reviewed" },
      orderBy: { createdAt: "desc" },
      include: {
        sekolahSabatRows: { orderBy: { date: "asc" } },
        khotbahRows: { orderBy: { date: "asc" } },
      },
    });

    schedules = rows.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      type: schedule.type,
      dates:
        schedule.type === "sekolah_sabat"
          ? schedule.sekolahSabatRows.map((row) => row.date.toISOString().slice(0, 10))
          : schedule.khotbahRows.map((row) => row.date.toISOString().slice(0, 10)),
    }));
  } catch (err) {
    console.error("[NewBulletin] DB error:", err);
    error = "Database belum siap.";
  }

  return (
    <AppShell>
      <PageHeader
        title="Buletin Baru"
        description="Pilih jadwal reviewed dan tanggal Sabat untuk membuat draft buletin editable."
      />
      {error ? <Alert tone="warning">{error}</Alert> : null}
      <Card className="mx-auto max-w-3xl">
        <CardContent>
          <BulletinNewForm schedules={schedules} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
