import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { PersistenceNotConfiguredError } from "@/lib/runtime/persistence";

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof PersistenceNotConfiguredError) {
    return jsonError(error.message, error.status, {
      issues: error.persistence.issues,
      dataRoot: error.persistence.dataRoot,
      storageRoot: error.persistence.storageRoot,
      hasRailwayVolume: error.persistence.hasRailwayVolume,
    });
  }

  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return jsonError("Sesi tidak valid. Silakan login ulang.", 401);
  }

  if (error instanceof Error && error.message === "BAD_ORIGIN") {
    return jsonError("Request ditolak karena origin tidak valid.", 403);
  }

  if (error instanceof ZodError) {
    return jsonError("Input tidak valid.", 400, error.issues);
  }

  if (error instanceof Error) {
    return jsonError(error.message, 500);
  }

  return jsonError("Terjadi kesalahan tidak dikenal.", 500);
}
