export type ScheduleType = "sekolah_sabat" | "khotbah";

export type ExtractionStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "reviewed";

export type SekolahSabatExtractionRow = {
  date: string;
  date_text: string;
  pemimpin_doa_tutup: string | null;
  doa_buka_ayat_inti: string | null;
  mision: string | null;
  promosi_pp_rumah_tangga: string | null;
  pembawa_persembahan: string | null;
  confidence: number;
  notes?: string | null;
};

export type KhotbahExtractionRow = {
  date: string;
  date_text: string;
  pianis: string | null;
  chorister: string | null;
  doa_invokasi: string | null;
  ayat_bersahutan: string | null;
  lagu_buka: string | null;
  doa_syafaat: string | null;
  persembahan_syukur: string | null;
  jemaat_memuji: string | null;
  doa_persembahan: string | null;
  jemaat_menyambut: string | null;
  lagu_pujian_1: string | null;
  khotbah_anak: string | null;
  jemaat_menyanyi: string | null;
  scoreboard_visi_misi: string | null;
  ayat_inti: string | null;
  lagu_tema: string | null;
  khotbah: string | null;
  tema_khotbah: string | null;
  lagu_tutup: string | null;
  doa_tutup: string | null;
  komunikasi_jemaat: string | null;
  confidence: number;
  notes?: string | null;
};

export type SekolahSabatExtraction = {
  schedule_type: "sekolah_sabat";
  period: string | null;
  church: string | null;
  rows: SekolahSabatExtractionRow[];
};

export type KhotbahExtraction = {
  schedule_type: "khotbah";
  period: string | null;
  church: string | null;
  rows: KhotbahExtractionRow[];
};

export type ScheduleExtraction =
  | SekolahSabatExtraction
  | KhotbahExtraction;
