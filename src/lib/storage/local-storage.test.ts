import { afterEach, describe, expect, it, vi } from "vitest";
import path from "node:path";
import { getStorageRoot } from "@/lib/storage/local-storage";

describe("getStorageRoot", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses explicit STORAGE_ROOT first", () => {
    vi.stubEnv("STORAGE_ROOT", "/custom/storage");
    vi.stubEnv("RAILWAY_VOLUME_MOUNT_PATH", "/data");

    expect(getStorageRoot()).toBe("/custom/storage");
  });

  it("uses Railway volume mount path when present", () => {
    vi.stubEnv("STORAGE_ROOT", "");
    vi.stubEnv("RAILWAY_VOLUME_MOUNT_PATH", "/data");

    expect(getStorageRoot()).toBe(path.join("/data", "storage"));
  });

  it("uses local workspace storage in development", () => {
    vi.stubEnv("STORAGE_ROOT", "");
    vi.stubEnv("RAILWAY_VOLUME_MOUNT_PATH", "");
    vi.stubEnv("NODE_ENV", "development");

    expect(getStorageRoot()).toBe(path.join(process.cwd(), "storage"));
  });
});
