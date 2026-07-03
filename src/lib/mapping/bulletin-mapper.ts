import {
  formatDateIndonesianUpper,
  normalizeDateInput,
} from "@/lib/date/indonesian-date";
import {
  isFirstSabbathOfMonth,
  parsePromosiPpRumahTangga,
} from "@/lib/text/abbreviations";
import type {
  BulletinData,
  BulletinSettings,
  ProgramItem,
  ProgramItemSource,
} from "@/types/bulletin";

export const PLACEHOLDER = "[perlu diisi]";

export type SchoolSabbathRowLike = {
  id?: string | null;
  date: string | Date;
  dateText?: string | null;
  pemimpinDoaTutup?: string | null;
  doaBukaAyatInti?: string | null;
  mision?: string | null;
  promosiPpRumahTangga?: string | null;
  pembawaPersembahan?: string | null;
  confidence?: unknown;
};

export type SermonRowLike = {
  id?: string | null;
  date: string | Date;
  dateText?: string | null;
  pianis?: string | null;
  chorister?: string | null;
  doaInvokasi?: string | null;
  ayatBersahutan?: string | null;
  laguBuka?: string | null;
  doaSyafaat?: string | null;
  persembahanSyukur?: string | null;
  jemaatMemuji?: string | null;
  doaPersembahan?: string | null;
  jemaatMenyambut?: string | null;
  laguPujian1?: string | null;
  khotbahAnak?: string | null;
  jemaatMenyanyi?: string | null;
  scoreboardVisiMisi?: string | null;
  ayatInti?: string | null;
  laguTema?: string | null;
  khotbah?: string | null;
  temaKhotbah?: string | null;
  laguTutup?: string | null;
  doaTutup?: string | null;
  komunikasiJemaat?: string | null;
  confidence?: unknown;
};

export const defaultBulletinSettings: BulletinSettings = {
  churchName: "GMAHK Tidar 2 Surabaya",
  sabbathSchoolTime: "09.00 - 10.15 WIB",
  sermonServiceTime: "10.20 - 12.00 WIB",
  footerTagline: "Ibadah - Bertumbuh - Bersaksi",
  activeTemplate: "classic",
  defaultSongs: {
    lagu_pengantar: "LSEL No. 205",
    lagu_pembukaan_ss: "LSEL No. 12",
    lagu_penutup_ss: "LSEL No. 214",
    jemaat_menyanyi: 'LSEL No. 56 "Ya Tuhan, Iringlah Kami"',
    lsel_khotbah_buka_1: PLACEHOLDER,
    lsel_khotbah_buka_2: PLACEHOLDER,
  },
  defaultBulletinItems: {
    penerima_tamu: PLACEHOLDER,
    pianis: PLACEHOLDER,
    pemimpin_lagu: PLACEHOLDER,
    diskusi_ss: "Pemimpin UKSS masing-masing",
    penyambutan_tamu: "Dept. Sekolah Sabat",
  },
};

function valueOrPlaceholder(value: unknown) {
  if (typeof value !== "string") {
    return PLACEHOLDER;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : PLACEHOLDER;
}

function createItem(
  label: string,
  value: unknown,
  isRequired: boolean,
  source: ProgramItemSource,
): ProgramItem {
  const normalized = valueOrPlaceholder(value);

  return {
    label,
    value: normalized,
    is_required: isRequired,
    source,
    warning:
      normalized === PLACEHOLDER
        ? `${label} belum lengkap dan perlu dikoreksi.`
        : undefined,
  };
}

function collectWarnings(items: ProgramItem[]) {
  return items
    .filter((item) => item.warning || (item.is_required && item.value === PLACEHOLDER))
    .map((item) => item.warning ?? `${item.label} wajib diisi.`);
}

export function buildBulletinData(input: {
  date: string | Date;
  sekolahSabat?: SchoolSabbathRowLike | null;
  khotbah?: SermonRowLike | null;
  settings?: Partial<BulletinSettings> | null;
}): BulletinData {
  const selectedDate = normalizeDateInput(input.date);
  const settings = {
    ...defaultBulletinSettings,
    ...(input.settings ?? {}),
    defaultSongs: {
      ...defaultBulletinSettings.defaultSongs,
      ...(input.settings?.defaultSongs ?? {}),
    },
    defaultBulletinItems: {
      ...defaultBulletinSettings.defaultBulletinItems,
      ...(input.settings?.defaultBulletinItems ?? {}),
    },
  };

  const isFirstSabat = isFirstSabbathOfMonth(selectedDate);
  const promosiPpRumahTangga = parsePromosiPpRumahTangga(
    input.sekolahSabat?.promosiPpRumahTangga,
  );

  const topInfo = [
    createItem(
      "Penerima Tamu",
      settings.defaultBulletinItems.penerima_tamu,
      false,
      "default",
    ),
    createItem("Pianis", input.khotbah?.pianis ?? settings.defaultBulletinItems.pianis, false, "khotbah"),
    createItem(
      "Pemimpin Lagu",
      input.khotbah?.chorister ?? settings.defaultBulletinItems.pemimpin_lagu,
      false,
      "khotbah",
    ),
    createItem(
      "Pembawa Persembahan",
      input.sekolahSabat?.pembawaPersembahan,
      true,
      "sekolah_sabat",
    ),
  ];

  const sekolahSabatItems = [
    createItem("Lagu Pengantar", settings.defaultSongs.lagu_pengantar, false, "default"),
    createItem(
      "Pemimpin Acara SS",
      input.sekolahSabat?.pemimpinDoaTutup,
      true,
      "sekolah_sabat",
    ),
    createItem(
      "Lagu Pembukaan",
      settings.defaultSongs.lagu_pembukaan_ss,
      false,
      "default",
    ),
    createItem(
      "Ayat & Doa Pembuka",
      input.sekolahSabat?.doaBukaAyatInti,
      true,
      "sekolah_sabat",
    ),
    createItem("Berita Mision", input.sekolahSabat?.mision, true, "sekolah_sabat"),
    createItem(
      "Diskusi SS",
      settings.defaultBulletinItems.diskusi_ss,
      false,
      "default",
    ),
    createItem(
      promosiPpRumahTangga.label,
      promosiPpRumahTangga.value,
      false,
      "sekolah_sabat",
    ),
    createItem("Lagu Penutup", settings.defaultSongs.lagu_penutup_ss, false, "default"),
    createItem(
      "Doa Penutup",
      input.sekolahSabat?.pemimpinDoaTutup,
      true,
      "sekolah_sabat",
    ),
    createItem(
      "Penyambutan Tamu",
      settings.defaultBulletinItems.penyambutan_tamu,
      false,
      "default",
    ),
    ...(isFirstSabat
      ? [createItem("Perpuluhan", input.sekolahSabat?.pembawaPersembahan, true, "sekolah_sabat")]
      : []),
  ];

  const khotbahItems = [
    createItem(
      "LSEL No. 515",
      settings.defaultSongs.lsel_khotbah_buka_1 !== PLACEHOLDER
        ? settings.defaultSongs.lsel_khotbah_buka_1
        : "Tuhan ada dalam Bait Allah",
      false,
      "default",
    ),
    createItem(
      "LSEL No. 1",
      settings.defaultSongs.lsel_khotbah_buka_2 !== PLACEHOLDER
        ? settings.defaultSongs.lsel_khotbah_buka_2
        : '"Di Hadapan Hadirat-Mu" ayat 1',
      false,
      "default",
    ),
    createItem("Doa Invokasi", input.khotbah?.doaInvokasi, true, "khotbah"),
    createItem("Ayat Bersahutan", input.khotbah?.ayatBersahutan, true, "khotbah"),
    createItem("Lagu Buka", input.khotbah?.laguBuka, false, "khotbah"),
    createItem("Doa Syafaat", input.khotbah?.doaSyafaat, true, "khotbah"),
    createItem(
      "Persembahan Syukur",
      input.khotbah?.persembahanSyukur,
      true,
      "khotbah",
    ),
    createItem("Jemaat Memuji", input.khotbah?.jemaatMemuji || 'LSEL No. 260 "Bawa Persembahanmu"', false, "khotbah"),
    createItem("Doa Persembahan", input.khotbah?.doaPersembahan, true, "khotbah"),
    createItem("Jemaat Menyambut", input.khotbah?.jemaatMenyambut || 'LSEL No. 21 "Padamu Allah Kupuji"', false, "khotbah"),
    createItem("Lagu Pujian", input.khotbah?.laguPujian1, false, "khotbah"),
    createItem("Khotbah Anak", input.khotbah?.khotbahAnak, false, "khotbah"),
    createItem(
      "Scoreboard & Visi Misi",
      input.khotbah?.scoreboardVisiMisi,
      false,
      "khotbah",
    ),
    createItem("Ayat Inti", input.khotbah?.ayatInti, true, "khotbah"),
    createItem("Lagu Tema", input.khotbah?.laguTema || "Misi Kita", false, "khotbah"),
  ];

  const closingItems = [
    createItem("Lagu Tutup", input.khotbah?.laguTutup, false, "khotbah"),
    createItem("Doa Tutup", input.khotbah?.doaTutup, true, "khotbah"),
    createItem("Jemaat Menyanyi", input.khotbah?.jemaatMenyanyi || 'LSEL No. 56 "Ya Tuhan, Iringlah Kami"', false, "khotbah"),
    createItem("Komunikasi Jemaat", input.khotbah?.komunikasiJemaat, true, "khotbah"),
  ];

  const validationNotes = [
    ...(!input.sekolahSabat
      ? ["Data Sekolah Sabat untuk tanggal terpilih belum ditemukan."]
      : []),
    ...(!input.khotbah ? ["Data Khotbah untuk tanggal terpilih belum ditemukan."] : []),
    ...collectWarnings([...topInfo, ...sekolahSabatItems, ...khotbahItems, ...closingItems]),
  ];

  const preacher = valueOrPlaceholder(input.khotbah?.khotbah);
  const sermonTitle = valueOrPlaceholder(input.khotbah?.temaKhotbah);

  if (preacher === PLACEHOLDER) {
    validationNotes.push("Pembicara khotbah belum lengkap.");
  }

  if (sermonTitle === PLACEHOLDER) {
    validationNotes.push("Tema khotbah belum lengkap.");
  }

  return {
    header: {
      title: "Ibadah Sabat",
      church_name: settings.churchName,
      date: selectedDate,
      date_text: formatDateIndonesianUpper(selectedDate),
    },
    top_info: topInfo,
    sekolah_sabat_items: sekolahSabatItems,
    khotbah_items: khotbahItems,
    sermon: {
      label: "KHOTBAH",
      title: sermonTitle,
      preacher,
      verse: valueOrPlaceholder(input.khotbah?.ayatInti),
    },
    closing_items: closingItems,
    footer: {
      tagline: settings.footerTagline,
      template: settings.activeTemplate,
    },
    validation_notes: Array.from(new Set(validationNotes)),
    source_trace: {
      sekolah_sabat_row_id: input.sekolahSabat?.id ?? null,
      khotbah_row_id: input.khotbah?.id ?? null,
      selected_date: selectedDate,
    },
  };
}
