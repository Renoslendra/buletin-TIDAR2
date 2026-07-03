import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assertPersistentStorageConfigured,
  getPersistenceStatus,
  PersistenceNotConfiguredError,
} from "@/lib/runtime/persistence";

function stubRailwayProductionEnv() {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("RAILWAY_ENVIRONMENT", "production");
  vi.stubEnv("RAILWAY_PROJECT_ID", "project-id");
  vi.stubEnv("RAILWAY_SERVICE_ID", "service-id");
  vi.stubEnv("RAILWAY_PUBLIC_DOMAIN", "");
  vi.stubEnv("RAILWAY_PRIVATE_DOMAIN", "");
  vi.stubEnv("STORAGE_ROOT", "");
  vi.stubEnv("ALLOW_EPHEMERAL_PRODUCTION_STORAGE", "");
}

describe("persistence runtime guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("blocks Railway production without an attached volume", () => {
    stubRailwayProductionEnv();
    vi.stubEnv("RAILWAY_VOLUME_MOUNT_PATH", "");

    const status = getPersistenceStatus();

    expect(status.ok).toBe(false);
    expect(status.hasRailwayVolume).toBe(false);
    expect(status.issues[0]).toContain("Railway Volume belum terpasang");
    expect(() => assertPersistentStorageConfigured()).toThrow(PersistenceNotConfiguredError);
  });

  it("allows Railway production when the volume mount path is available", () => {
    stubRailwayProductionEnv();
    vi.stubEnv("RAILWAY_VOLUME_MOUNT_PATH", "/app/data");

    const status = getPersistenceStatus();

    expect(status.ok).toBe(true);
    expect(status.hasRailwayVolume).toBe(true);
    expect(status.dataRoot).toBe("/app/data");
    expect(status.storageRoot).toBe(path.join("/app/data", "storage"));
  });

  it("requires an explicit override before allowing ephemeral Railway production storage", () => {
    stubRailwayProductionEnv();
    vi.stubEnv("RAILWAY_VOLUME_MOUNT_PATH", "");
    vi.stubEnv("ALLOW_EPHEMERAL_PRODUCTION_STORAGE", "true");

    const status = getPersistenceStatus();

    expect(status.ok).toBe(true);
    expect(status.allowEphemeralProductionStorage).toBe(true);
    expect(status.hasRailwayVolume).toBe(false);
  });
});
