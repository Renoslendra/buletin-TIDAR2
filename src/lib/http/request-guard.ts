import type { NextRequest } from "next/server";

function normalizeOrigin(value?: string | null) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function requireSameOrigin(request: NextRequest) {
  const origin = normalizeOrigin(request.headers.get("origin"));
  if (!origin) {
    return;
  }

  const allowedOrigins = new Set<string>([new URL(request.url).origin]);
  const appBaseUrl = normalizeOrigin(process.env.APP_BASE_URL);
  const exportBaseUrl = normalizeOrigin(process.env.EXPORT_BASE_URL);

  if (appBaseUrl) allowedOrigins.add(appBaseUrl);
  if (exportBaseUrl) allowedOrigins.add(exportBaseUrl);

  if (!allowedOrigins.has(origin)) {
    throw new Error("BAD_ORIGIN");
  }
}
