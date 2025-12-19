import { Prisma } from '@/src/prisma/generated/client';
import 'dotenv/config';
import prisma from '../lib/prisma';

const guestData: Prisma.GuestCreateInput[] = [
  {
    ip: '172.168.78.90',
    entries: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    ip: '189.168.78.91',
    entries: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    ip: '160.168.55.92',
    entries: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    ip: '78.89.78.93',
    entries: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function main() {
  await prisma.guest.deleteMany();

  for (const u of guestData) {
    await prisma.guest.create({ data: u });
  }
}

main();
