import { z } from "zod";
import { normalizeDateInput } from "@/lib/date/indonesian-date";
import type {
  KhotbahExtraction,
  ScheduleExtraction,
  ScheduleType,
  SekolahSabatExtraction,
} from "@/types/schedule";

const nullableText = z.string().trim().min(1).nullable().optional();

const normalizedDate = z
  .string()
  .trim()
  .min(1)
  .transform((value) => normalizeDateInput(value));

const confidence = z.coerce.number().min(0).max(1).default(0.5);

export const sekolahSabatRowSchema = z.object({
  date: normalizedDate,
  date_text: z.string().trim().min(1),
  pemimpin_doa_tutup: nullableText,
  doa_buka_ayat_inti: nullableText,
  mision: nullableText,
  promosi_pp_rumah_tangga: nullableText,
  pembawa_persembahan: nullableText,
  confidence,
  notes: nullableText,
});

export const khotbahRowSchema = z.object({
  date: normalizedDate,
  date_text: z.string().trim().min(1),
  pianis: nullableText,
  chorister: nullableText,
  doa_invokasi: nullableText,
  ayat_bersahutan: nullableText,
  lagu_buka: nullableText,
  doa_syafaat: nullableText,
  persembahan_syukur: nullableText,
  jemaat_memuji: nullableText,
  doa_persembahan: nullableText,
  jemaat_menyambut: nullableText,
  lagu_pujian_1: nullableText,
  khotbah_anak: nullableText,
  jemaat_menyanyi: nullableText,
  scoreboard_visi_misi: nullableText,
  ayat_inti: nullableText,
  lagu_tema: nullableText,
  khotbah: nullableText,
  tema_khotbah: nullableText,
  lagu_tutup: nullableText,
  doa_tutup: nullableText,
  komunikasi_jemaat: nullableText,
  confidence,
  notes: nullableText,
});

export const sekolahSabatExtractionSchema = z.object({
  schedule_type: z.literal("sekolah_sabat"),
  period: z.string().nullable().optional().default(null),
  church: z.string().nullable().optional().default(null),
  rows: z.array(sekolahSabatRowSchema).min(1),
});

export const khotbahExtractionSchema = z.object({
  schedule_type: z.literal("khotbah"),
  period: z.string().nullable().optional().default(null),
  church: z.string().nullable().optional().default(null),
  rows: z.array(khotbahRowSchema).min(1),
});

export function validateScheduleExtraction(
  input: unknown,
  expectedType: ScheduleType,
): ScheduleExtraction {
  const schema =
    expectedType === "sekolah_sabat"
      ? sekolahSabatExtractionSchema
      : khotbahExtractionSchema;

  const parsed = schema.parse(input) as ScheduleExtraction;
  if (parsed.schedule_type !== expectedType) {
    throw new Error(`Tipe jadwal tidak sesuai: ${parsed.schedule_type}`);
  }

  return parsed;
}

export type ParsedSekolahSabatExtraction = SekolahSabatExtraction;
export type ParsedKhotbahExtraction = KhotbahExtraction;
