import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { handleRouteError, jsonError } from "@/lib/http/api-response";
import { requireSameOrigin } from "@/lib/http/request-guard";
import { saveUploadedFile } from "@/lib/storage/local-storage";

const typeSchema = z.enum(["sekolah_sabat", "khotbah"]);

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const user = await requireUser(request);
    const form = await request.formData();
    const file = form.get("file");
    const type = typeSchema.safeParse(form.get("type"));
    const title = String(form.get("title") || "");
    const period = String(form.get("period") || "");

    if (!type.success) {
      return jsonError("Tipe jadwal wajib dipilih.", 400);
    }

    if (!(file instanceof File)) {
      return jsonError("File jadwal wajib diunggah.", 400);
    }

    const stored = await saveUploadedFile(file);
    const schedule = await prisma.scheduleUpload.create({
      data: {
        type: type.data,
        title: title.trim() || file.name,
        period: period.trim() || null,
        originalFileUrl: stored.url,
        createdBy: user.id,
      },
    });

    return Response.json({ schedule }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
