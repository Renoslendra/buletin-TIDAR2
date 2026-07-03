#!/bin/sh
set -e

export PATH="/app/node_modules/.bin:$PATH"

echo "[startup] DATABASE_URL: $DATABASE_URL"

echo "[startup] Pushing database schema..."
prisma db push --accept-data-loss --skip-generate

echo "[startup] Running seed (idempotent)..."
tsx prisma/seed.ts || echo "[startup] Seed skipped (data exists or error)"

echo "[startup] Starting Next.js server..."
exec node server.js
