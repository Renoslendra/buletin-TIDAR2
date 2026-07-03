import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { handleRouteError, jsonError } from "@/lib/http/api-response";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser(request);
    const { id } = await context.params;
    const schedule = await prisma.scheduleUpload.findUnique({
      where: { id },
      include: {
        sekolahSabatRows: { orderBy: { date: "asc" } },
        khotbahRows: { orderBy: { date: "asc" } },
      },
    });

    if (!schedule) {
      return jsonError("Jadwal tidak ditemukan.", 404);
    }

    return Response.json({ schedule });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser(request);
    const { id } = await context.params;

    const schedule = await prisma.scheduleUpload.findUnique({ where: { id } });
    if (!schedule) {
      return jsonError("Jadwal tidak ditemukan.", 404);
    }

    await prisma.scheduleUpload.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
