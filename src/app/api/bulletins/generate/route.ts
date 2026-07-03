import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/current-user";
import { dateStringToDate, normalizeDateInput } from "@/lib/date/indonesian-date";
import { prisma } from "@/lib/db/prisma";
import { handleRouteError, jsonError } from "@/lib/http/api-response";
import { requireSameOrigin } from "@/lib/http/request-guard";
import { buildBulletinData, defaultBulletinSettings } from "@/lib/mapping/bulletin-mapper";

const generateSchema = z.object({
  schoolScheduleId: z.string().uuid().optional().nullable(),
  sermonScheduleId: z.string().uuid().optional().nullable(),
  date: z.string().min(1).transform((value) => normalizeDateInput(value)),
});

async function loadSettings() {
  const row = await prisma.appSettings.findFirst();
  if (!row) return defaultBulletinSettings;

  return {
    churchName: row.churchName,
    sabbathSchoolTime: row.sabbathSchoolTime,
    sermonServiceTime: row.sermonServiceTime,
    footerTagline: row.footerTagline,
    activeTemplate: row.activeTemplate,
    defaultSongs: row.defaultSongs as Record<string, string>,
    defaultBulletinItems: row.defaultBulletinItems as Record<string, string>,
  };
}

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const user = await requireUser(request);
    const body = generateSchema.parse(await request.json());
    const date = dateStringToDate(body.date);

    const [schoolRow, sermonRow, settings] = await Promise.all([
      body.schoolScheduleId
        ? prisma.scheduleRowSekolahSabat.findFirst({
            where: { scheduleUploadId: body.schoolScheduleId, date },
          })
        : Promise.resolve(null),
      body.sermonScheduleId
        ? prisma.scheduleRowKhotbah.findFirst({
            where: { scheduleUploadId: body.sermonScheduleId, date },
          })
        : Promise.resolve(null),
      loadSettings(),
    ]);

    if (!schoolRow && !sermonRow) {
      return jsonError("Tanggal tidak ditemukan pada jadwal yang dipilih.", 400);
    }

    const bulletinData = buildBulletinData({
      date: body.date,
      sekolahSabat: schoolRow,
      khotbah: sermonRow,
      settings,
    });

    const bulletin = await prisma.bulletin.create({
      data: {
        date,
        title: `Ibadah Sabat - ${bulletinData.header.date_text}`,
        churchName: settings.churchName,
        schoolSabbathRowId: schoolRow?.id ?? null,
        sermonRowId: sermonRow?.id ?? null,
        bulletinData,
        status: "draft",
        createdBy: user.id,
      },
    });

    return Response.json({ bulletin }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
