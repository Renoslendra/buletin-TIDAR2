#!/bin/sh
set -e

export PATH="/app/node_modules/.bin:$PATH"

echo "[startup] DATABASE_URL: $DATABASE_URL"

# Ensure data directories exist (Railway volume mount)
mkdir -p /app/data/storage/uploads /app/data/storage/exports

echo "[startup] Pushing database schema..."
npx prisma db push --accept-data-loss --config prisma.config.mjs

echo "[startup] Running seed (idempotent)..."
tsx prisma/seed.ts || echo "[startup] Seed skipped (data exists or error)"

echo "[startup] Starting Next.js server..."
exec node server.js
