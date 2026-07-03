import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/current-user";
import { dateStringToDate } from "@/lib/date/indonesian-date";
import { prisma } from "@/lib/db/prisma";
import { handleRouteError, jsonError } from "@/lib/http/api-response";
import {
  khotbahRowSchema,
  sekolahSabatRowSchema,
} from "@/lib/validation/schedule-schema";

const rowsSchema = z.object({
  rows: z.array(z.unknown()),
});

export async function PATCH(
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

    const body = rowsSchema.parse(await request.json());

    if (schedule.type === "sekolah_sabat") {
      const rows = z.array(sekolahSabatRowSchema).parse(body.rows);
      await prisma.$transaction([
        prisma.scheduleRowSekolahSabat.deleteMany({ where: { scheduleUploadId: id } }),
        prisma.scheduleRowSekolahSabat.createMany({
          data: rows.map((row) => ({
            scheduleUploadId: id,
            date: dateStringToDate(row.date),
            dateText: row.date_text,
            pemimpinDoaTutup: row.pemimpin_doa_tutup,
            doaBukaAyatInti: row.doa_buka_ayat_inti,
            mision: row.mision,
            promosiPpRumahTangga: row.promosi_pp_rumah_tangga,
            pembawaPersembahan: row.pembawa_persembahan,
            confidence: row.confidence,
            notes: row.notes,
          })),
        }),
      ]);
    } else {
      const rows = z.array(khotbahRowSchema).parse(body.rows);
      await prisma.$transaction([
        prisma.scheduleRowKhotbah.deleteMany({ where: { scheduleUploadId: id } }),
        prisma.scheduleRowKhotbah.createMany({
          data: rows.map((row) => ({
            scheduleUploadId: id,
            date: dateStringToDate(row.date),
            dateText: row.date_text,
            pianis: row.pianis,
            chorister: row.chorister,
            doaInvokasi: row.doa_invokasi,
            ayatBersahutan: row.ayat_bersahutan,
            laguBuka: row.lagu_buka,
            doaSyafaat: row.doa_syafaat,
            persembahanSyukur: row.persembahan_syukur,
            jemaatMemuji: row.jemaat_memuji,
            doaPersembahan: row.doa_persembahan,
            jemaatMenyambut: row.jemaat_menyambut,
            laguPujian1: row.lagu_pujian_1,
            khotbahAnak: row.khotbah_anak,
            jemaatMenyanyi: row.jemaat_menyanyi,
            scoreboardVisiMisi: row.scoreboard_visi_misi,
            ayatInti: row.ayat_inti,
            laguTema: row.lagu_tema,
            khotbah: row.khotbah,
            temaKhotbah: row.tema_khotbah,
            laguTutup: row.lagu_tutup,
            doaTutup: row.doa_tutup,
            komunikasiJemaat: row.komunikasi_jemaat,
            confidence: row.confidence,
            notes: row.notes,
          })),
        }),
      ]);
    }

    const updated = await prisma.scheduleUpload.findUnique({
      where: { id },
      include: {
        sekolahSabatRows: { orderBy: { date: "asc" } },
        khotbahRows: { orderBy: { date: "asc" } },
      },
    });

    return Response.json({ schedule: updated });
  } catch (error) {
    return handleRouteError(error);
  }
}
