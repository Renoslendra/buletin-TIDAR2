import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStorageRootFromEnv } from "@/lib/runtime/persistence";

const ALLOWED_SCOPES = new Set(["uploads", "exports"]);
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpeg",
  "image/webp": ".webp",
};
const SAFE_FILENAME_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".pdf"]);

export function getStorageRoot() {
  return getStorageRootFromEnv();
}

function sanitizeFilename(filename: string, fallbackExt = "") {
  const rawExt = path.extname(filename).toLowerCase();
  const ext = SAFE_FILENAME_EXTENSIONS.has(rawExt) ? rawExt : fallbackExt;
  const base = path
    .basename(filename, rawExt)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${base || "file"}-${Date.now()}${ext}`;
}

function detectImageMimeType(bytes: Buffer) {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

export function getStoragePath(scope: "uploads" | "exports", filename: string) {
  if (!ALLOWED_SCOPES.has(scope)) {
    throw new Error("Scope storage tidak valid.");
  }

  const safeName = path.basename(filename);
  const scopeRoot =
    scope === "uploads"
      ? path.resolve(getStorageRoot(), "uploads")
      : path.resolve(getStorageRoot(), "exports");
  const resolved = path.resolve(scopeRoot, safeName);

  if (!resolved.startsWith(scopeRoot)) {
    throw new Error("Path storage tidak valid.");
  }

  return resolved;
}

export async function saveUploadedFile(file: File) {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Ukuran file maksimal 10 MB.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const detectedMimeType = detectImageMimeType(bytes);

  if (!detectedMimeType) {
    throw new Error("Format file harus PNG, JPG, JPEG, atau WebP.");
  }

  const filename = sanitizeFilename(file.name, IMAGE_EXTENSIONS[detectedMimeType]);
  const uploadDir = path.resolve(getStorageRoot(), "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, bytes);

  return {
    filename,
    filePath,
    url: `/api/files/uploads/${filename}`,
  };
}

export async function saveExportFile(filename: string, data: Buffer) {
  const safeName = sanitizeFilename(filename);
  const exportDir = path.resolve(getStorageRoot(), "exports");
  await mkdir(exportDir, { recursive: true });

  const filePath = path.join(exportDir, safeName);
  await writeFile(filePath, data);

  return {
    filename: safeName,
    filePath,
    url: `/api/files/exports/${safeName}`,
  };
}

export async function readStorageFile(scope: "uploads" | "exports", name: string) {
  return readFile(getStoragePath(scope, name));
}
