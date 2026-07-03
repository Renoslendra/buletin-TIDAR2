import { afterEach, describe, expect, it, vi } from "vitest";
import { getExportRenderOrigin } from "@/lib/export/render-origin";

describe("getExportRenderOrigin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses EXPORT_BASE_URL when explicitly configured", () => {
    vi.stubEnv("EXPORT_BASE_URL", "https://buletin-tidar2.my.id/path");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PORT", "3000");

    expect(getExportRenderOrigin("https://ignored.example.com/api/export")).toBe(
      "https://buletin-tidar2.my.id",
    );
  });

  it("uses loopback in production when no explicit export URL exists", () => {
    vi.stubEnv("EXPORT_BASE_URL", "");
    vi.stubEnv("APP_BASE_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PORT", "8080");

    expect(getExportRenderOrigin("https://buletin-tidar2.my.id/api/export")).toBe(
      "http://127.0.0.1:8080",
    );
  });

  it("falls back to the request origin in development", () => {
    vi.stubEnv("EXPORT_BASE_URL", "");
    vi.stubEnv("APP_BASE_URL", "");
    vi.stubEnv("NODE_ENV", "development");

    expect(getExportRenderOrigin("http://127.0.0.1:3000/api/export")).toBe(
      "http://127.0.0.1:3000",
    );
  });
});
