#!/bin/sh
set -e

echo "[startup] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[startup] Running seed (idempotent)..."
npx tsx prisma/seed.ts || echo "[startup] Seed skipped (data exists or error)"

echo "[startup] Starting Next.js server..."
exec node server.js
