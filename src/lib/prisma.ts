import { PrismaClient } from '@/src/prisma/generated/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3(
  {
    url: process.env.DATABASE_URL_TO_LIB,
  },
  {
    timestampFormat: 'unixepoch-ms',
  },
);
const prisma = new PrismaClient({ adapter });

export default prisma;
