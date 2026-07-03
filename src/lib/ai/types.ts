import type { ScheduleExtraction, ScheduleType } from "@/types/schedule";

export type ExtractScheduleInput = {
  fileUrl: string;
  type: ScheduleType;
  title?: string;
};

export type AiProvider = {
  name: string;
  extractSchedule(input: ExtractScheduleInput): Promise<ScheduleExtraction>;
};

export const SCHOOL_SABBATH_PROMPT = `Anda adalah sistem ekstraksi tabel untuk jadwal pelayanan gereja.
Baca gambar jadwal Sekolah Sabat yang diberikan dengan SANGAT TELITI.

ATURAN PENTING:
1. Baca tabel BARIS per BARIS dari atas ke bawah.
2. Setiap baris dalam tabel mewakili SATU TANGGAL tertentu.
3. Untuk setiap baris, baca SEMUA kolom dari kiri ke kanan.
4. JANGAN PERNAH menebak atau mengarang nama. Jika tidak jelas, isi null.
5. Pastikan setiap tanggal sesuai dengan data di baris yang sama.
6. Jangan tukar data antar baris. Setiap baris harus konsisten.

Proses ekstraksi:
- Identifikasi kolom tanggal (biasanya kolom pertama)
- Untuk setiap baris, catat tanggalnya terlebih dahulu
- Kemudian baca data di kolom lain PADA BARIS YANG SAMA
- Jika ada kolom yang kosong atau tidak terbaca, isi dengan null

Pertahankan ejaan nama persis seperti yang tertulis di gambar.
Normalisasi tanggal ke format YYYY-MM-DD.
Kembalikan hanya JSON valid tanpa penjelasan tambahan.`;

export const SERMON_PROMPT = `Anda adalah sistem ekstraksi tabel untuk jadwal kebaktian khotbah gereja.
Baca gambar jadwal yang diberikan dengan SANGAT TELITI.

ATURAN PENTING:
1. Baca tabel BARIS per BARIS dari atas ke bawah.
2. Setiap baris dalam tabel mewakili SATU TANGGAL tertentu.
3. Untuk setiap baris, baca SEMUA kolom dari kiri ke kanan.
4. JANGAN PERNAH menebak atau mengarang data. Jika tidak jelas, isi null.
5. Pastikan setiap tanggal sesuai dengan data di baris yang sama.
6. Jangan tukar data antar baris. Setiap baris harus konsisten.

Proses ekstraksi:
- Identifikasi kolom tanggal (biasanya kolom pertama)
- Untuk setiap baris, catat tanggalnya terlebih dahulu
- Kemudian baca data di kolom lain PADA BARIS YANG SAMA
- Jika ada kolom yang kosong atau tidak terbaca, isi dengan null

Pertahankan nama orang, judul lagu, ayat, dan tema khotbah sesuai gambar.
Normalisasi tanggal ke format YYYY-MM-DD.
Kembalikan hanya JSON valid tanpa penjelasan tambahan.`;
