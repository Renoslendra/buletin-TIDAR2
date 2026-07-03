import type { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { requireSameOrigin } from "@/lib/http/request-guard";

function requestWithHeaders(headers: Record<string, string>) {
  return new Request("http://localhost:3000/api/auth/login", {
    headers,
  }) as NextRequest;
}

describe("requireSameOrigin", () => {
  it("allows the browser origin when it matches the Host header", () => {
    expect(() =>
      requireSameOrigin(
        requestWithHeaders({
          origin: "http://127.0.0.1:3000",
          host: "127.0.0.1:3000",
        }),
      ),
    ).not.toThrow();
  });

  it("allows LAN access when browser origin and Host header match", () => {
    expect(() =>
      requireSameOrigin(
        requestWithHeaders({
          origin: "http://192.168.1.7:3000",
          host: "192.168.1.7:3000",
        }),
      ),
    ).not.toThrow();
  });

  it("allows the browser origin when it matches forwarded host headers", () => {
    expect(() =>
      requireSameOrigin(
        requestWithHeaders({
          origin: "https://tidar2.example.com",
          host: "internal:3000",
          "x-forwarded-host": "tidar2.example.com",
          "x-forwarded-proto": "https",
        }),
      ),
    ).not.toThrow();
  });

  it("rejects a foreign browser origin", () => {
    expect(() =>
      requireSameOrigin(
        requestWithHeaders({
          origin: "https://evil.example.com",
          host: "tidar2.example.com",
          "x-forwarded-proto": "https",
        }),
      ),
    ).toThrow("BAD_ORIGIN");
  });
});
