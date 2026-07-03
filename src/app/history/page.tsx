import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { LinkButton } from "@/components/ui/link-button";
import { Tbody, Td, Th, Thead, Tr, Table } from "@/components/ui/table";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  let bulletins: Awaited<ReturnType<typeof prisma.bulletin.findMany>> = [];
  let error: string | null = null;

  try {
    bulletins = await prisma.bulletin.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (err) {
    console.error("[History] DB error:", err);
    error = "Database belum siap.";
  }

  return (
    <AppShell>
      <PageHeader title="Riwayat" description="Buletin yang pernah dibuat dan diexport." />
      {error ? <Alert tone="warning">{error}</Alert> : null}
      <Card>
        <CardContent>
          {bulletins.length === 0 ? (
            <EmptyState
              title="Belum ada buletin"
              action={<LinkButton href="/bulletins/new">Buat Buletin</LinkButton>}
            />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Tanggal</Th>
                  <Th>Judul</Th>
                  <Th>Status</Th>
                  <Th>Export</Th>
                  <Th>Aksi</Th>
                </tr>
              </Thead>
              <Tbody>
                {bulletins.map((bulletin) => (
                  <Tr key={bulletin.id}>
                    <Td label="Tanggal">{bulletin.date.toISOString().slice(0, 10)}</Td>
                    <Td label="Judul" className="font-semibold text-on-surface">{bulletin.title}</Td>
                    <Td label="Status">
                      <Badge tone={bulletin.status === "exported" ? "success" : "neutral"}>
                        {bulletin.status}
                      </Badge>
                    </Td>
                    <Td label="Export">
                      <div className="flex gap-3 text-sm">
                        {bulletin.pdfUrl ? <a href={bulletin.pdfUrl}>PDF</a> : null}
                        {bulletin.pngUrl ? <a href={bulletin.pngUrl}>PNG</a> : null}
                      </div>
                    </Td>
                    <Td label="Aksi">
                       <div className="flex flex-wrap items-center gap-2">
                         <Link
                           href={`/bulletins/${bulletin.id}/edit`}
                           className="text-sm font-semibold text-accent hover:text-accent-light"
                         >
                           Edit
                         </Link>
                         <DeleteButton
                           id={bulletin.id}
                           type="bulletin"
                           title={bulletin.title}
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
    </AppShell>
  );
}
