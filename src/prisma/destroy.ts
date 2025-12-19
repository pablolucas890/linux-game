import 'dotenv/config';
import prisma from '../lib/prisma';

export async function main() {
  await prisma.guest.deleteMany();
}

main();
