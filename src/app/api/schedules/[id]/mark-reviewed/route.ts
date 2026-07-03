import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { handleRouteError, jsonError } from "@/lib/http/api-response";
import { requireSameOrigin } from "@/lib/http/request-guard";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    requireSameOrigin(request);
    await requireUser(request);
    const { id } = await context.params;
    const schedule = await prisma.scheduleUpload.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            sekolahSabatRows: true,
            khotbahRows: true,
          },
        },
      },
    });

    if (!schedule) {
      return jsonError("Jadwal tidak ditemukan.", 404);
    }

    const rowCount =
      schedule.type === "sekolah_sabat"
        ? schedule._count.sekolahSabatRows
        : schedule._count.khotbahRows;

    if (rowCount === 0) {
      return jsonError("Minimal satu baris jadwal harus tersedia.", 400);
    }

    const updated = await prisma.scheduleUpload.update({
      where: { id },
      data: { extractionStatus: "reviewed" },
    });

    return Response.json({ schedule: updated });
  } catch (error) {
    return handleRouteError(error);
  }
}
