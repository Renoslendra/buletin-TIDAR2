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

  it.each([
    ["Bpk. Jonner.P (PP)", "Pelayanan Perorangan", "Bpk. Jonner.P"],
    ["Ibu Mulyono (RT)", "Rumah Tangga", "Ibu Mulyono"],
    ["ibu yuni.p (rt)", "Rumah Tangga", "ibu yuni.p"],
    ["PP: Bpk. Agung Wijaya", "Pelayanan Perorangan", "Bpk. Agung Wijaya"],
    ["Ibu Martha", "Pelayanan Perorangan", "Ibu Martha"],
  ])(
    "maps the promotion marker in %s to the correct bulletin label",
    (promotion, expectedLabel, expectedValue) => {
      const data = buildBulletinData({
        date: "2026-07-11",
        sekolahSabat: {
          date: "2026-07-11",
          promosiPpRumahTangga: promotion,
        },
      });

      const promotionItem = data.sekolah_sabat_items.find(
        (item) => item.label === expectedLabel && item.source === "sekolah_sabat",
      );

      expect(promotionItem?.value).toBe(expectedValue);
    },
  );
});
