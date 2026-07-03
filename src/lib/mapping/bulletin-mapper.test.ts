import { describe, expect, it } from "vitest";
import { buildBulletinData, PLACEHOLDER } from "@/lib/mapping/bulletin-mapper";

describe("buildBulletinData", () => {
  it("maps exact schedule row data into bulletin data", () => {
    const data = buildBulletinData({
      date: "2026-07-04",
      sekolahSabat: {
        id: "school-row",
        date: "2026-07-04",
        pemimpinDoaTutup: "Bpk. Agung",
        doaBukaAyatInti: "Ibu Maria",
        mision: "Bpk. Joko",
        promosiPpRumahTangga: "Bpk. Daniel",
        pembawaPersembahan: "Ibu Martha",
      },
      khotbah: {
        id: "sermon-row",
        date: "2026-07-04",
        doaInvokasi: "Bpk. Samuel",
        ayatBersahutan: "Mazmur 100",
        doaSyafaat: "Ibu Lidya",
        persembahanSyukur: "Diaken",
        doaPersembahan: "Bpk. Markus",
        ayatInti: "Yohanes 15:5",
        khotbah: "Pdt. Daniel",
        temaKhotbah: "Tinggal Di Dalam Kristus",
        doaTutup: "Pdt. Daniel",
        komunikasiJemaat: "Sekretariat",
      },
    });

    expect(data.source_trace.selected_date).toBe("2026-07-04");
    expect(data.sermon.preacher).toBe("Pdt. Daniel");
    expect(data.validation_notes).not.toContain("Data Khotbah untuk tanggal terpilih belum ditemukan.");
  });

  it("turns missing source values into placeholders and warnings", () => {
    const data = buildBulletinData({
      date: "2026-07-04",
      sekolahSabat: null,
      khotbah: null,
    });

    expect(data.sekolah_sabat_items[1].value).toBe(PLACEHOLDER);
    expect(data.sermon.preacher).toBe(PLACEHOLDER);
    expect(data.validation_notes.length).toBeGreaterThan(2);
  });
});
