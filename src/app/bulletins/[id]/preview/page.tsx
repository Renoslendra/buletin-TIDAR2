import { BulletinPreviewFrame } from "@/components/bulletin/bulletin-preview-frame";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { LinkButton } from "@/components/ui/link-button";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import type { BulletinData } from "@/types/bulletin";

export const dynamic = "force-dynamic";

export default async function PreviewBulletinPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { id } = await params;
  const { print } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    const error = <Alert tone="danger">Sesi tidak valid. Silakan login ulang.</Alert>;
    return print === "1" ? <main>{error}</main> : <AppShell>{error}</AppShell>;
  }

  const bulletin = await prisma.bulletin.findUnique({ where: { id } }).catch(() => null);

  if (!bulletin) {
    const error = <Alert tone="danger">Buletin tidak ditemukan.</Alert>;
    return print === "1" ? <main>{error}</main> : <AppShell>{error}</AppShell>;
  }

  const data = bulletin.bulletinData as BulletinData;

  if (print === "1") {
    return (
      <main className="min-h-screen bg-white">
        <BulletinPreviewFrame data={data} compact />
      </main>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Preview Buletin"
        description={bulletin.title}
        actions={
          <LinkButton
            href={`/bulletins/${bulletin.id}/edit`}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Edit
          </LinkButton>
        }
      />
      <BulletinPreviewFrame data={data} />
    </AppShell>
  );
}
