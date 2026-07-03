import { describe, expect, it } from "vitest";
import { validateScheduleExtraction } from "@/lib/validation/schedule-schema";

describe("validateScheduleExtraction", () => {
  it("validates and normalizes a sekolah sabat extraction", () => {
    const parsed = validateScheduleExtraction(
      {
        schedule_type: "sekolah_sabat",
        period: "Triwulan 3",
        church: "GMAHK Tidar 2 Surabaya",
        rows: [
          {
            date: "04 Juli 2026",
            date_text: "04 Juli 2026",
            pemimpin_doa_tutup: "Bpk. A",
            doa_buka_ayat_inti: null,
            mision: "Ibu B",
            promosi_pp_rumah_tangga: null,
            pembawa_persembahan: "Bpk. C",
            confidence: 0.88,
          },
        ],
      },
      "sekolah_sabat",
    );

    expect(parsed.rows[0].date).toBe("2026-07-04");
  });

  it("normalizes empty optional text fields to null", () => {
    const parsed = validateScheduleExtraction(
      {
        schedule_type: "sekolah_sabat",
        rows: [
          {
            date: "2026-07-04",
            date_text: "04 Juli 2026",
            pemimpin_doa_tutup: "",
            doa_buka_ayat_inti: "  ",
            mision: null,
            promosi_pp_rumah_tangga: "",
            pembawa_persembahan: "Bpk. C",
            confidence: 0.88,
            notes: "",
          },
        ],
      },
      "sekolah_sabat",
    );

    expect(parsed.schedule_type).toBe("sekolah_sabat");
    if (parsed.schedule_type !== "sekolah_sabat") {
      throw new Error("Expected sekolah sabat extraction.");
    }
    expect(parsed.rows[0].pemimpin_doa_tutup).toBeNull();
    expect(parsed.rows[0].doa_buka_ayat_inti).toBeNull();
    expect(parsed.rows[0].notes).toBeNull();
  });

  it("rejects mismatched schedule type", () => {
    expect(() =>
      validateScheduleExtraction(
        {
          schedule_type: "sekolah_sabat",
          rows: [],
        },
        "khotbah",
      ),
    ).toThrow();
  });
});
