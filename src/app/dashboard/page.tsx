import Link from "next/link";
import { CalendarPlus, FileText, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { LinkButton } from "@/components/ui/link-button";
import { ScheduleStatusBadge } from "@/components/schedules/schedule-status-badge";
import { prisma } from "@/lib/db/prisma";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let data:
    | {
        scheduleCount: number;
        bulletinCount: number;
        latestSchedules: Awaited<ReturnType<typeof prisma.scheduleUpload.findMany>>;
        latestBulletins: Awaited<ReturnType<typeof prisma.bulletin.findMany>>;
      }
    | null = null;
  let error: string | null = null;

  try {
    const [scheduleCount, bulletinCount, latestSchedules, latestBulletins] =
      await Promise.all([
        prisma.scheduleUpload.count(),
        prisma.bulletin.count(),
        prisma.scheduleUpload.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
        prisma.bulletin.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      ]);
    data = { scheduleCount, bulletinCount, latestSchedules, latestBulletins };
  } catch {
    error = "Database belum siap. Jalankan migrasi dan seed sesuai README.";
  }

  return (
    <AppShell>
      <FadeIn>
        <PageHeader
          title="Dashboard"
          description="Ringkasan workflow upload jadwal, review ekstraksi, dan draft buletin."
          actions={
            <>
              <LinkButton href="/schedules/new" className="w-full sm:w-auto">
                <UploadCloud className="h-4 w-4" />
                Upload Jadwal
              </LinkButton>
              <LinkButton href="/bulletins/new" variant="secondary" className="w-full sm:w-auto">
                <CalendarPlus className="h-4 w-4" />
                Buletin Baru
              </LinkButton>
            </>
          }
        />
      </FadeIn>
      
      {error ? (
        <FadeIn delay={0.1}>
          <Alert tone="warning">{error}</Alert>
        </FadeIn>
      ) : null}

      <StaggerContainer className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <Card>
            <CardContent>
              <div className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Jadwal Upload</div>
              <div className="mt-3 text-4xl font-black bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                {data?.scheduleCount ?? 0}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent>
              <div className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Buletin</div>
              <div className="mt-3 text-4xl font-black bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                {data?.bulletinCount ?? 0}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      <StaggerContainer className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
        <StaggerItem>
          <Card className="h-full">
            <CardContent>
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-on-surface">
                <UploadCloud className="h-5 w-5 text-accent" />
                Jadwal Terbaru
              </h2>
              <div className="space-y-3">
                {data?.latestSchedules.map((schedule) => (
                  <Link
                    key={schedule.id}
                    href={`/schedules/${schedule.id}/review`}
                    className="group flex flex-col items-start gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all duration-300 hover:border-primary/50 hover:bg-white/10 hover:shadow-glow sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-on-surface transition-colors group-hover:text-primary-light">{schedule.title}</div>
                      <div className="text-xs text-on-surface-variant">{schedule.type}</div>
                    </div>
                    <ScheduleStatusBadge status={schedule.extractionStatus} />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        
        <StaggerItem>
          <Card className="h-full">
            <CardContent>
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-on-surface">
                <FileText className="h-5 w-5 text-accent" />
                Buletin Terbaru
              </h2>
              <div className="space-y-3">
                 {data?.latestBulletins.map((bulletin) => (
                   <div
                     key={bulletin.id}
                     className="group flex flex-col gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all duration-300 hover:border-primary/50 hover:bg-white/10 hover:shadow-glow sm:flex-row sm:items-center sm:justify-between"
                   >
                     <Link href={`/bulletins/${bulletin.id}/edit`} className="min-w-0 flex-1">
                       <div className="font-semibold text-on-surface transition-colors group-hover:text-primary-light">{bulletin.title}</div>
                       <div className="text-xs text-on-surface-variant">{bulletin.churchName}</div>
                     </Link>
                     <div className="flex items-center justify-between gap-3 sm:justify-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent/80">
                         {bulletin.status}
                       </span>
                       <DeleteButton
                         id={bulletin.id}
                         type="bulletin"
                         title={bulletin.title}
                       />
                     </div>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </AppShell>
  );
}
