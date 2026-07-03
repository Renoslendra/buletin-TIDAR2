import type { NextRequest } from "next/server";

function normalizeOrigin(value?: string | null) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function firstHeaderValue(value?: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function addOrigin(origins: Set<string>, value?: string | null) {
  const origin = normalizeOrigin(value);
  if (origin) {
    origins.add(origin);
  }
}

function getRequestAllowedOrigins(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const allowedOrigins = new Set<string>([requestUrl.origin]);
  const protocol =
    firstHeaderValue(request.headers.get("x-forwarded-proto")) ??
    requestUrl.protocol.replace(":", "");

  const host = firstHeaderValue(request.headers.get("host"));
  const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"));

  if (host) {
    addOrigin(allowedOrigins, `${protocol}://${host}`);
  }

  if (forwardedHost) {
    addOrigin(allowedOrigins, `${protocol}://${forwardedHost}`);
  }

  return allowedOrigins;
}

export function requireSameOrigin(request: NextRequest) {
  const origin = normalizeOrigin(request.headers.get("origin"));
  if (!origin) {
    return;
  }

  const allowedOrigins = getRequestAllowedOrigins(request);
  const appBaseUrl = normalizeOrigin(process.env.APP_BASE_URL);
  const exportBaseUrl = normalizeOrigin(process.env.EXPORT_BASE_URL);

  if (appBaseUrl) allowedOrigins.add(appBaseUrl);
  if (exportBaseUrl) allowedOrigins.add(exportBaseUrl);

  if (!allowedOrigins.has(origin)) {
    throw new Error("BAD_ORIGIN");
  }
}
