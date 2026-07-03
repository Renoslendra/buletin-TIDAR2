import { NextResponse } from "next/server";

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return jsonError("Sesi tidak valid. Silakan login ulang.", 401);
  }

  if (error instanceof Error) {
    return jsonError(error.message, 500);
  }

  return jsonError("Terjadi kesalahan tidak dikenal.", 500);
}
