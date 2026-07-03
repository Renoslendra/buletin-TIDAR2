import { describe, expect, it } from "vitest";
import { normalizeDateInput } from "@/lib/date/indonesian-date";

describe("normalizeDateInput", () => {
  it("parses full Indonesian month names", () => {
    expect(normalizeDateInput("04 Juli 2026")).toBe("2026-07-04");
  });

  it("parses Ags abbreviation", () => {
    expect(normalizeDateInput("01 Ags 2026")).toBe("2026-08-01");
  });

  it("parses Sept abbreviation", () => {
    expect(normalizeDateInput("26 Sept 2026")).toBe("2026-09-26");
  });
});
