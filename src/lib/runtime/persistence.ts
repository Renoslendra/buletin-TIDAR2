import path from "node:path";

const EPHEMERAL_OVERRIDE_ENV = "ALLOW_EPHEMERAL_PRODUCTION_STORAGE";

type EnvLike = NodeJS.ProcessEnv;

export type PersistenceStatus = {
  ok: boolean;
  isProduction: boolean;
  isRailway: boolean;
  hasRailwayVolume: boolean;
  allowEphemeralProductionStorage: boolean;
  dataRoot: string;
  storageRoot: string;
  railwayVolumeMountPath: string | null;
  issues: string[];
};

export class PersistenceNotConfiguredError extends Error {
  status = 503;
  persistence: PersistenceStatus;

  constructor(persistence: PersistenceStatus) {
    super(
      "Storage Railway belum persisten. Pasang Railway Volume ke /app/data sebelum upload jadwal atau generate buletin.",
    );
    this.name = "PersistenceNotConfiguredError";
    this.persistence = persistence;
  }
}

function isTruthy(value: string | undefined) {
  return ["1", "true", "yes", "on"].includes((value ?? "").toLowerCase());
}

function absolutePathOrNull(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed || !path.isAbsolute(trimmed)) return null;
  return trimmed;
}

export function isRailwayRuntime(env: EnvLike = process.env) {
  return Boolean(
    env.RAILWAY_ENVIRONMENT ||
      env.RAILWAY_PROJECT_ID ||
      env.RAILWAY_SERVICE_ID ||
      env.RAILWAY_PUBLIC_DOMAIN ||
      env.RAILWAY_PRIVATE_DOMAIN,
  );
}

export function getPersistenceStatus(env: EnvLike = process.env): PersistenceStatus {
  const isProduction = env.NODE_ENV === "production";
  const isRailway = isRailwayRuntime(env);
  const railwayVolumeMountPath = absolutePathOrNull(env.RAILWAY_VOLUME_MOUNT_PATH);
  const configuredStorageRoot = absolutePathOrNull(env.STORAGE_ROOT);
  const allowEphemeralProductionStorage = isTruthy(env[EPHEMERAL_OVERRIDE_ENV]);
  const dataRoot = railwayVolumeMountPath ?? (isProduction ? "/app/data" : process.cwd());
  const storageRoot = configuredStorageRoot ?? path.join(dataRoot, "storage");
  const issues: string[] = [];

  if (isProduction && isRailway && !railwayVolumeMountPath && !allowEphemeralProductionStorage) {
    issues.push(
      "Railway Volume belum terpasang. Buat/attach Volume ke service web dengan mount path /app/data.",
    );
  }

  return {
    ok: issues.length === 0,
    isProduction,
    isRailway,
    hasRailwayVolume: Boolean(railwayVolumeMountPath),
    allowEphemeralProductionStorage,
    dataRoot,
    storageRoot,
    railwayVolumeMountPath,
    issues,
  };
}

export function getStorageRootFromEnv(env: EnvLike = process.env) {
  return getPersistenceStatus(env).storageRoot;
}

export function assertPersistentStorageConfigured(env: EnvLike = process.env) {
  const persistence = getPersistenceStatus(env);
  if (!persistence.ok) {
    throw new PersistenceNotConfiguredError(persistence);
  }
  return persistence;
}
