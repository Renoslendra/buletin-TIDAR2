import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { A4_VIEWPORT, PLAYWRIGHT_SETUP_ERROR } from "@/lib/export/export-constants";
import { renderBulletinWithPlaywright } from "@/lib/export/playwright-renderer";
import { handleRouteError, jsonError } from "@/lib/http/api-response";
import { requireSameOrigin } from "@/lib/http/request-guard";
import { assertPersistentStorageConfigured } from "@/lib/runtime/persistence";
import { saveExportFile } from "@/lib/storage/local-storage";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    requireSameOrigin(request);
    await requireUser(request);
    assertPersistentStorageConfigured();
    const { id } = await context.params;
    const bulletin = await prisma.bulletin.findUnique({ where: { id } });

    if (!bulletin) {
      return jsonError("Buletin tidak ditemukan.", 404);
    }

    const session = request.cookies.get(SESSION_COOKIE)?.value;

    try {
      const pdf = await renderBulletinWithPlaywright({
        requestUrl: request.url,
        bulletinId: id,
        session,
        viewport: A4_VIEWPORT,
        render: (page) =>
          page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "0", right: "0", bottom: "0", left: "0" },
          }),
      });

      const saved = await saveExportFile(`buletin-${id}.pdf`, Buffer.from(pdf));
      const updated = await prisma.bulletin.update({
        where: { id },
        data: { pdfUrl: saved.url, status: "exported" },
      });

      return Response.json({ bulletin: updated, url: saved.url });
    } catch (error) {
      return jsonError(
        `Export PDF gagal. ${PLAYWRIGHT_SETUP_ERROR}`,
        500,
        error instanceof Error ? error.message : error,
      );
    }
  } catch (error) {
    return handleRouteError(error);
  }
}
