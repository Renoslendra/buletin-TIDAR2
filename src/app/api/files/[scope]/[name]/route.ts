import type { NextRequest } from "next/server";
import { readStorageFile } from "@/lib/storage/local-storage";
import { jsonError } from "@/lib/http/api-response";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
};

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ scope: string; name: string }> },
) {
  const { scope, name } = await context.params;

  if (scope !== "uploads" && scope !== "exports") {
    return jsonError("File tidak ditemukan.", 404);
  }

  try {
    const file = await readStorageFile(scope, name);
    const extension = name.slice(name.lastIndexOf(".")).toLowerCase();

    return new Response(file, {
      headers: {
        "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return jsonError("File tidak ditemukan.", 404);
  }
}
