import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import type { AiProvider, ExtractScheduleInput } from "@/lib/ai/types";
import { SCHOOL_SABBATH_PROMPT, SERMON_PROMPT } from "@/lib/ai/types";
import { getStorageRoot } from "@/lib/storage/local-storage";
import type { ScheduleExtraction } from "@/types/schedule";

const SEKOLAH_SABAT_JSON_SCHEMA = `{
  "schedule_type": "sekolah_sabat",
  "period": "Triwulan X - YYYY",
  "church": "nama gereja",
  "rows": [
    {
      "date": "YYYY-MM-DD",
      "date_text": "DD Bulan YYYY",
      "pemimpin_doa_tutup": "nama atau null",
      "doa_buka_ayat_inti": "nama atau null",
      "mision": "nama atau null",
      "promosi_pp_rumah_tangga": "nama atau null",
      "pembawa_persembahan": "nama atau null",
      "confidence": 0.0-1.0,
      "notes": "catatan jika ada yang tidak terbaca, atau null"
    }
  ]
}`;

const KHOTBAH_JSON_SCHEMA = `{
  "schedule_type": "khotbah",
  "period": "Triwulan X - YYYY",
  "church": "nama gereja",
  "rows": [
    {
      "date": "YYYY-MM-DD",
      "date_text": "DD Bulan YYYY",
      "doa_invokasi": "nama atau null",
      "ayat_bersahutan": "ayat atau null",
      "lagu_buka": "LSEL No. XXX atau null",
      "doa_syafaat": "nama atau null",
      "persembahan_syukur": "keterangan atau null",
      "jemaat_memuji": "LSEL No. XXX atau null",
      "doa_persembahan": "nama atau null",
      "jemaat_menyambut": "LSEL No. XXX atau null",
      "lagu_pujian_1": "keterangan atau null",
      "khotbah_anak": "nama atau null",
      "lagu_pujian_2": "keterangan atau null",
      "scoreboard_visi_misi": "keterangan atau null",
      "ayat_inti": "ayat atau null",
      "lagu_tema": "LSEL No. XXX atau null",
      "khotbah": "nama pendeta/pengkhotbah atau null",
      "tema_khotbah": "judul tema atau null",
      "lagu_tutup": "LSEL No. XXX atau null",
      "doa_tutup": "nama atau null",
      "komunikasi_jemaat": "nama atau null",
      "confidence": 0.0-1.0,
      "notes": "catatan jika ada yang tidak terbaca, atau null"
    }
  ]
}`;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY belum dikonfigurasi di .env.local. " +
        "Dapatkan gratis di https://aistudio.google.com/apikey",
    );
  }
  return new GoogleGenAI({ apiKey });
}

async function readImageFile(fileUrl: string): Promise<{ base64: string; mimeType: string }> {
  const filename = path.basename(fileUrl);
  const filePath = path.join(getStorageRoot(), "uploads", filename);
  const buffer = await readFile(filePath);

  const ext = path.extname(filename).toLowerCase();
  const mimeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };

  return {
    base64: buffer.toString("base64"),
    mimeType: mimeMap[ext] ?? "image/jpeg",
  };
}

export const geminiProvider: AiProvider = {
  name: "gemini",
  async extractSchedule(input: ExtractScheduleInput): Promise<ScheduleExtraction> {
    const client = getClient();

    const isSekolahSabat = input.type === "sekolah_sabat";
    const basePrompt = isSekolahSabat ? SCHOOL_SABBATH_PROMPT : SERMON_PROMPT;
    const jsonSchema = isSekolahSabat ? SEKOLAH_SABAT_JSON_SCHEMA : KHOTBAH_JSON_SCHEMA;

    const systemPrompt = `${basePrompt}

Format output JSON yang diharapkan:
${jsonSchema}

PENTING:
- Baca tabel BARIS per BARIS dari atas ke bawah.
- Setiap baris dalam tabel mewakili SATU TANGGAL tertentu.
- Untuk setiap baris, baca SEMUA kolom dari kiri ke kanan.
- JANGAN PERNAH menebak atau mengarang data. Jika tidak jelas, isi null.
- Pastikan setiap tanggal sesuai dengan data di baris yang sama.
- Jangan tukar data antar baris. Setiap baris harus konsisten.
- Normalisasi semua tanggal ke format YYYY-MM-DD.
- Pertahankan ejaan nama persis seperti yang tertulis di gambar.
- Jika ada sel yang kosong atau tidak terbaca, isi dengan null.
- Berikan confidence score antara 0.0-1.0 untuk setiap baris.
- Kembalikan HANYA JSON valid, tanpa markdown code fence, tanpa penjelasan.

Proses ekstraksi:
1. Identifikasi kolom tanggal (biasanya kolom pertama)
2. Untuk setiap baris, catat tanggalnya terlebih dahulu
3. Kemudian baca data di kolom lain PADA BARIS YANG SAMA
4. Jika ada kolom yang kosong atau tidak terbaca, isi dengan null`;

    const image = await readImageFile(input.fileUrl);

    const userMessage = input.title
      ? `Ekstrak jadwal dari gambar ini dengan TELITI. Judul jadwal: "${input.title}". Pastikan setiap tanggal sesuai dengan data di baris yang sama. Jangan menebak data.`
      : `Ekstrak jadwal dari gambar ini dengan TELITI. Pastikan setiap tanggal sesuai dengan data di baris yang sama. Jangan menebak data.`;

    const response = await client.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n\n${userMessage}` },
            {
              inlineData: {
                data: image.base64,
                mimeType: image.mimeType,
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0,
        maxOutputTokens: 4096,
      },
    });

    const content = response.text;
    if (!content) {
      throw new Error("Gemini tidak mengembalikan hasil.");
    }

    // Clean the response - remove possible markdown code fences
    const cleaned = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      return JSON.parse(cleaned) as ScheduleExtraction;
    } catch {
      throw new Error(
        `Gagal parse JSON dari Gemini. Response: ${cleaned.substring(0, 300)}...`,
      );
    }
  },
};
