import { readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
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
      "pianis": "nama pianis atau null",
      "chorister": "nama pemimpin lagu/chorister atau null",
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
      "jemaat_menyanyi": "LSEL No. XXX atau null",
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

function getClient(): OpenAI {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    throw new Error(
      "MIMO_API_KEY belum dikonfigurasi di .env.local. " +
        "Dapatkan di https://platform.xiaomimimo.com",
    );
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.MIMO_BASE_URL ?? "https://token-plan-cn.xiaomimimo.com/v1",
  });
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

export const mimoProvider: AiProvider = {
  name: "mimo",
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

    let response;
    try {
      response = await client.chat.completions.create({
        model: process.env.MIMO_MODEL ?? "mimo-v2.5",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `${systemPrompt}\n\n${userMessage}` },
              {
                type: "image_url",
                image_url: {
                  url: `data:${image.mimeType};base64,${image.base64}`,
                },
              },
            ],
          },
        ],
        temperature: 0,
        max_tokens: 16384,
      });
    } catch (apiError: unknown) {
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      throw new Error(`MiMo API error: ${errorMessage}`);
    }

    const choice = response.choices[0];
    const content = choice?.message?.content;
    if (!content) {
      throw new Error("MiMo tidak mengembalikan hasil.");
    }

    if (choice?.finish_reason === "length") {
      console.warn("[MiMo] Response truncated due to max_tokens limit");
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
        `Gagal parse JSON dari MiMo. Response: ${cleaned.substring(0, 300)}...`,
      );
    }
  },
};
