FROM node:20-slim AS base

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# --- Dependencies ---
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npm install

COPY prisma ./prisma/
COPY prisma.config.mjs ./
RUN npx prisma generate --config prisma.config.mjs

# --- Build ---
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/generated ./src/generated
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:./build-placeholder.db"
RUN npm run build

# --- Production ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy full node_modules (needed for prisma + seed scripts)
COPY --from=deps /app/node_modules ./node_modules

# Install Chromium and Linux dependencies required by Playwright export routes.
RUN npx playwright install --with-deps chromium \
    && rm -rf /var/lib/apt/lists/* \
    && chown -R nextjs:nodejs /ms-playwright

# Copy prisma schema, config, source files, and start script
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.mjs ./prisma.config.mjs
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Create all necessary directories with proper permissions
# - data/ : Railway volume mount point (database + storage)
# - .next/cache : Next.js image optimization cache
RUN mkdir -p data/storage/uploads data/storage/exports .next/cache \
    && chown -R nextjs:nodejs data .next/cache

# Database lives in /app/data (mount a Railway volume here)
ENV DATABASE_URL="file:/app/data/dev.db"
# Storage also lives in /app/data so files persist across deploys
ENV STORAGE_ROOT="/app/data/storage"

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER nextjs

CMD ["./start.sh"]
