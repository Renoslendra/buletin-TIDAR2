import { BulletinEditor } from "@/components/editor/bulletin-editor";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { LinkButton } from "@/components/ui/link-button";
import { prisma } from "@/lib/db/prisma";
import type { BulletinData } from "@/types/bulletin";

export const dynamic = "force-dynamic";

export default async function EditBulletinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bulletin = await prisma.bulletin.findUnique({ where: { id } }).catch(() => null);

  if (!bulletin) {
    return (
      <AppShell>
        <Alert tone="danger">Buletin tidak ditemukan atau database belum siap.</Alert>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title={bulletin.title}
        description="Edit data di kiri dan cek preview A4 di kanan."
        actions={
          <LinkButton
            href={`/bulletins/${bulletin.id}/preview`}
            variant="secondary"
            className="hidden sm:inline-flex sm:w-auto"
          >
            Preview
          </LinkButton>
        }
      />
      <BulletinEditor
        bulletinId={bulletin.id}
        title={bulletin.title}
        initialData={bulletin.bulletinData as BulletinData}
      />
    </AppShell>
  );
}
