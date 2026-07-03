import type { NextRequest } from "next/server";
import { chromium } from "playwright";
import { requireUser } from "@/lib/auth/current-user";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { handleRouteError, jsonError } from "@/lib/http/api-response";
import { requireSameOrigin } from "@/lib/http/request-guard";
import { saveExportFile } from "@/lib/storage/local-storage";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    requireSameOrigin(request);
    await requireUser(request);
    const { id } = await context.params;
    const bulletin = await prisma.bulletin.findUnique({ where: { id } });

    if (!bulletin) {
      return jsonError("Buletin tidak ditemukan.", 404);
    }

    const baseUrl =
      process.env.EXPORT_BASE_URL ?? process.env.APP_BASE_URL ?? new URL(request.url).origin;
    const renderOrigin = new URL(baseUrl).origin;
    const session = request.cookies.get(SESSION_COOKIE)?.value;

    try {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage({ viewport: { width: 1080, height: 1530 } });

      if (session) {
        await page.context().addCookies([
          {
            name: SESSION_COOKIE,
            value: session,
            url: renderOrigin,
            httpOnly: true,
            sameSite: "Lax",
          },
        ]);
      }

      await page.goto(`${renderOrigin}/bulletins/${id}/preview?print=1`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });
      // Wait for fonts and rendering to complete
      await page.waitForTimeout(3000);

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      });
      await browser.close();

      const saved = await saveExportFile(`buletin-${id}.pdf`, Buffer.from(pdf));
      const updated = await prisma.bulletin.update({
        where: { id },
        data: { pdfUrl: saved.url, status: "exported" },
      });

      return Response.json({ bulletin: updated, url: saved.url });
    } catch (error) {
      return jsonError(
        "Export PDF gagal. Pastikan dev server berjalan dan browser Playwright sudah terpasang.",
        500,
        error instanceof Error ? error.message : error,
      );
    }
  } catch (error) {
    return handleRouteError(error);
  }
}
