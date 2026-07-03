import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { dateStringToDate } from "@/lib/date/indonesian-date";
import { handleRouteError, jsonError } from "@/lib/http/api-response";
import { extractScheduleFromImage } from "@/lib/ocr/extract-schedule";

export const runtime = "nodejs";

export async function POST(
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

    await prisma.scheduleUpload.update({
      where: { id },
      data: { extractionStatus: "processing" },
    });

    console.log(`[Extract] Starting extraction for schedule ${id}, type: ${schedule.type}`);

    let extraction;
    try {
      extraction = await extractScheduleFromImage({
        fileUrl: schedule.originalFileUrl,
        type: schedule.type,
        title: schedule.title,
      });
      console.log(`[Extract] Extraction successful, provider: ${extraction.provider}`);
    } catch (extractError) {
      console.error(`[Extract] Extraction failed:`, extractError);
      throw extractError;
    }

    if (extraction.data.schedule_type === "sekolah_sabat") {
      await prisma.$transaction([
        prisma.scheduleRowSekolahSabat.deleteMany({
          where: { scheduleUploadId: id },
        }),
        prisma.scheduleRowSekolahSabat.createMany({
          data: extraction.data.rows.map((row) => ({
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
      const KHOTBAH_DEFAULTS = {
        jemaat_memuji: 'LSEL No. 260 "Bawa Persembahanmu"',
        jemaat_menyambut: 'LSEL No. 21 "Padamu Allah Kupuji"',
        jemaat_menyanyi: 'LSEL No. 56 "Ya Tuhan, Iringlah Kami"',
        lagu_tema: 'Misi Kita',
      };

      await prisma.$transaction([
        prisma.scheduleRowKhotbah.deleteMany({ where: { scheduleUploadId: id } }),
        prisma.scheduleRowKhotbah.createMany({
          data: extraction.data.rows.map((row) => ({
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
            jemaatMemuji: row.jemaat_memuji || KHOTBAH_DEFAULTS.jemaat_memuji,
            doaPersembahan: row.doa_persembahan,
            jemaatMenyambut: row.jemaat_menyambut || KHOTBAH_DEFAULTS.jemaat_menyambut,
            laguPujian1: row.lagu_pujian_1,
            khotbahAnak: row.khotbah_anak,
            jemaatMenyanyi: row.jemaat_menyanyi || KHOTBAH_DEFAULTS.jemaat_menyanyi,
            scoreboardVisiMisi: row.scoreboard_visi_misi,
            ayatInti: row.ayat_inti,
            laguTema: row.lagu_tema || KHOTBAH_DEFAULTS.lagu_tema,
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

    const updated = await prisma.scheduleUpload.update({
      where: { id },
      data: {
        period: extraction.data.period ?? schedule.period,
        extractionStatus: "success",
        extractionRawJson: extraction.raw,
      },
      include: {
        sekolahSabatRows: { orderBy: { date: "asc" } },
        khotbahRows: { orderBy: { date: "asc" } },
      },
    });

    return Response.json({ schedule: updated, provider: extraction.provider });
  } catch (error) {
    const { id } = await context.params;
    await prisma.scheduleUpload
      .update({ where: { id }, data: { extractionStatus: "failed" } })
      .catch(() => undefined);
    return handleRouteError(error);
  }
}
