FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p ./public && \
    if [ ! "$(ls -A ./public 2>/dev/null)" ]; then \
        touch ./public/.gitkeep; \
    fi

ENV NEXT_TELEMETRY_DISABLED 1

ENV DATABASE_URL="file:/tmp/prisma-build.db"

RUN ./node_modules/.bin/prisma generate --schema=src/prisma/schema.prisma

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/src/prisma ./src/prisma

RUN apk add --no-cache openssl ca-certificates

RUN mkdir -p /data && chown -R nextjs:nodejs /data

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
