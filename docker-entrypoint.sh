#!/bin/sh
set -eu

DATABASE_URL="${DATABASE_URL:-${DATABASE_URL_TO_LIB:-file:/tmp/prod.db}}"
export DATABASE_URL

export DATABASE_URL_TO_LIB="${DATABASE_URL_TO_LIB:-$DATABASE_URL}"

case "$DATABASE_URL" in
  file:/data/*)
    mkdir -p /data
    chown -R nextjs:nodejs /data || true
    chmod 775 /data || true
    ;;
esac

echo "[entrypoint] Running Prisma migrate deploy..."
gosu nextjs node ./node_modules/prisma/build/index.js migrate deploy --schema=src/prisma/schema.prisma

echo "[entrypoint] Starting Next (standalone)..."
exec gosu nextjs node server.js
