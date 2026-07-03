import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { handleRouteError } from "@/lib/http/api-response";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);
    const bulletins = await prisma.bulletin.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return Response.json({ bulletins });
  } catch (error) {
    return handleRouteError(error);
  }
}
