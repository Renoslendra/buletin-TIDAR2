FROM node:20-slim AS base

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# --- Dependencies ---
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

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

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy full node_modules (needed for prisma + seed scripts)
COPY --from=deps /app/node_modules ./node_modules

# Copy prisma schema, source files, and start script
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Create storage and data directories
RUN mkdir -p storage/uploads storage exports data \
    && chown -R nextjs:nodejs storage data

# Database lives in /app/data (mount a Railway volume here)
ENV DATABASE_URL="file:/app/data/dev.db"

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER nextjs

CMD ["./start.sh"]
