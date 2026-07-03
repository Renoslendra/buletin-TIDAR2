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
