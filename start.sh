#!/bin/sh
set -e

export PATH="/app/node_modules/.bin:$PATH"

DATA_ROOT="${RAILWAY_VOLUME_MOUNT_PATH:-/app/data}"
export DATABASE_URL="file:${DATA_ROOT}/dev.db"
export STORAGE_ROOT="${DATA_ROOT}/storage"

echo "[startup] DATABASE_URL: $DATABASE_URL"
echo "[startup] STORAGE_ROOT: $STORAGE_ROOT"

if [ -z "$RAILWAY_VOLUME_MOUNT_PATH" ] && [ "$NODE_ENV" = "production" ]; then
  echo "[startup] WARNING: RAILWAY_VOLUME_MOUNT_PATH is not set. Data will not survive redeploys unless a Railway Volume is mounted."
fi

# Ensure data directories exist (Railway volume mount)
mkdir -p "$STORAGE_ROOT/uploads" "$STORAGE_ROOT/exports"

if ! touch "${DATA_ROOT}/.write-test" 2>/dev/null; then
  echo "[startup] ERROR: Cannot write to ${DATA_ROOT}. On Railway, attach a Volume and set RAILWAY_RUN_UID=0 if using a root-owned volume."
  exit 1
fi
rm -f "${DATA_ROOT}/.write-test"

echo "[startup] Pushing database schema..."
npx prisma db push --config prisma.config.mjs

echo "[startup] Running seed (idempotent)..."
tsx prisma/seed.ts || echo "[startup] Seed skipped (data exists or error)"

echo "[startup] Starting Next.js server..."
exec node server.js
