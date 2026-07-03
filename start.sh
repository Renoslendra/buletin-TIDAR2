#!/bin/sh
set -e

export PATH="/app/node_modules/.bin:$PATH"

IS_RAILWAY=0
if [ -n "$RAILWAY_ENVIRONMENT" ] || [ -n "$RAILWAY_PROJECT_ID" ] || [ -n "$RAILWAY_SERVICE_ID" ]; then
  IS_RAILWAY=1
fi

ALLOW_EPHEMERAL=0
case "${ALLOW_EPHEMERAL_PRODUCTION_STORAGE:-}" in
  1|true|TRUE|yes|YES|on|ON) ALLOW_EPHEMERAL=1 ;;
esac

if [ -n "$RAILWAY_VOLUME_MOUNT_PATH" ]; then
  DATA_ROOT="$RAILWAY_VOLUME_MOUNT_PATH"
else
  DATA_ROOT="/app/data"
fi

if [ "$NODE_ENV" = "production" ] && [ "$IS_RAILWAY" = "1" ] && [ -z "$RAILWAY_VOLUME_MOUNT_PATH" ] && [ "$ALLOW_EPHEMERAL" != "1" ]; then
  echo "[startup] ERROR: Railway Volume is not attached."
  echo "[startup] Data uploads and bulletins would be saved to ephemeral container storage and disappear on redeploy."
  echo "[startup] Fix: attach a Railway Volume to this web service with mount path /app/data, then redeploy."
  exit 1
fi

export DATABASE_URL="file:${DATA_ROOT}/dev.db"
export STORAGE_ROOT="${DATA_ROOT}/storage"

echo "[startup] DATABASE_URL: $DATABASE_URL"
echo "[startup] STORAGE_ROOT: $STORAGE_ROOT"

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
