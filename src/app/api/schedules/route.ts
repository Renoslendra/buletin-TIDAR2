import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { handleRouteError } from "@/lib/http/api-response";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);
    const schedules = await prisma.scheduleUpload.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            sekolahSabatRows: true,
            khotbahRows: true,
          },
        },
      },
    });

    return Response.json({ schedules });
  } catch (error) {
    return handleRouteError(error);
  }
}
