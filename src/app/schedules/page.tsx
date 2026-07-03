import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ScheduleStatusBadge } from "@/components/schedules/schedule-status-badge";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { LinkButton } from "@/components/ui/link-button";
import { Tbody, Td, Th, Thead, Tr, Table } from "@/components/ui/table";
import { prisma } from "@/lib/db/prisma";
import { FadeIn } from "@/components/ui/fade-in";

export const dynamic = "force-dynamic";

export default async function SchedulesPage() {
  let schedules: Awaited<ReturnType<typeof prisma.scheduleUpload.findMany>> = [];
  let error: string | null = null;

  try {
    schedules = await prisma.scheduleUpload.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { sekolahSabatRows: true, khotbahRows: true },
        },
      },
    });
  } catch (err) {
    console.error("[Schedules] DB error:", err);
    error = "Database belum siap.";
  }

  return (
    <AppShell>
      <FadeIn>
        <PageHeader
          title="Jadwal"
          description="Daftar jadwal pelayanan yang sudah diupload dan diekstrak."
          actions={
            <LinkButton href="/schedules/new" className="w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Upload Jadwal
            </LinkButton>
          }
        />
      </FadeIn>
      
      {error ? (
        <FadeIn delay={0.1}>
          <Alert tone="warning">{error}</Alert>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.2}>
        <Card>
          <CardContent>
            {schedules.length === 0 ? (
              <EmptyState
                title="Belum ada jadwal"
                action={<LinkButton href="/schedules/new">Upload Jadwal</LinkButton>}
              />
            ) : (
              <Table>
                <Thead>
                  <tr>
                    <Th>Judul</Th>
                    <Th>Tipe</Th>
                    <Th>Periode</Th>
                    <Th>Status</Th>
                    <Th>Baris</Th>
                    <Th>Aksi</Th>
                  </tr>
                </Thead>
                <Tbody>
                  {schedules.map((schedule) => (
                    <Tr key={schedule.id} className="transition-colors hover:bg-white/5">
                      <Td label="Judul" className="font-semibold text-on-surface">{schedule.title}</Td>
                      <Td label="Tipe">{schedule.type}</Td>
                      <Td label="Periode">{schedule.period ?? "-"}</Td>
                      <Td label="Status">
                        <ScheduleStatusBadge status={schedule.extractionStatus} />
                      </Td>
                      <Td label="Baris">
                        {(() => {
                          const count = (
                            schedule as typeof schedule & {
                              _count?: {
                                sekolahSabatRows: number;
                                khotbahRows: number;
                              };
                            }
                          )._count;

                          return schedule.type === "sekolah_sabat"
                            ? count?.sekolahSabatRows ?? 0
                            : count?.khotbahRows ?? 0;
                        })()}
                      </Td>
                       <Td label="Aksi">
                         <div className="flex flex-wrap items-center gap-2">
                           <Link
                             href={`/schedules/${schedule.id}/review`}
                             className="text-sm font-semibold text-accent hover:text-accent-light"
                           >
                             Review
                           </Link>
                           <DeleteButton
                             id={schedule.id}
                             type="schedule"
                             title={schedule.title}
                           />
                         </div>
                       </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </AppShell>
  );
}
