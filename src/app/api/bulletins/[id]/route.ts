import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/current-user";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { handleRouteError, jsonError } from "@/lib/http/api-response";
import { requireSameOrigin } from "@/lib/http/request-guard";
import { assertPersistentStorageConfigured } from "@/lib/runtime/persistence";

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  bulletinData: z.unknown().optional(),
  status: z.enum(["draft", "final", "exported"]).optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser(request);
    const { id } = await context.params;
    const bulletin = await prisma.bulletin.findUnique({ where: { id } });

    if (!bulletin) {
      return jsonError("Buletin tidak ditemukan.", 404);
    }

    return Response.json({ bulletin });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    requireSameOrigin(request);
    await requireUser(request);
    assertPersistentStorageConfigured();
    const { id } = await context.params;
    const body = patchSchema.parse(await request.json());

    const bulletin = await prisma.bulletin.update({
      where: { id },
      data: {
        title: body.title,
        bulletinData: body.bulletinData as Prisma.InputJsonValue | undefined,
        status: body.status,
      },
    });

    return Response.json({ bulletin });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
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

    await prisma.bulletin.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
