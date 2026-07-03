import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED_SCOPES = new Set(["uploads", "exports"]);

export function getStorageRoot() {
  const configuredRoot = process.env.STORAGE_ROOT;

  // If explicitly set to an absolute path, use it directly
  if (configuredRoot && path.isAbsolute(configuredRoot)) {
    return configuredRoot;
  }

  // In production (Docker), use the persistent volume path
  if (process.env.NODE_ENV === "production") {
    return "/app/data/storage";
  }

  // Local development: use <project>/storage
  return path.join(process.cwd(), "storage");
}

function sanitizeFilename(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  const base = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${base || "file"}-${Date.now()}${ext}`;
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

  const allowedTypes = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
  ]);

  if (!allowedTypes.has(file.type)) {
    throw new Error("Format file harus PNG, JPG, JPEG, atau WebP.");
  }

  const filename = sanitizeFilename(file.name);
  const uploadDir = path.resolve(getStorageRoot(), "uploads");
  await mkdir(uploadDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
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
