import prisma from '@/src/lib/prisma';
import { Prisma } from '@/src/prisma/generated/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type GetResponseData = {
  message: string;
  data?: Prisma.GuestGetPayload<{
    select: {
      ip: boolean;
      entries: boolean;
    };
  }>[];
};

type PostResponseData = {
  message: string;
  data?: Prisma.GuestGetPayload<{
    select: {
      ip: boolean;
      entries: boolean;
    };
  }>;
};

type GenericResponseData = {
  message: string;
};

type PostRequestData = {
  ip: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseData | PostResponseData | GenericResponseData>,
) {
  try {
    if (req.method === 'GET') {
      const guests = await prisma.guest.findMany();
      res.status(200).json({ message: 'Guests fetched successfully', data: guests });
    } else if (req.method === 'POST') {
      const data = JSON.parse(req.body);
      const { ip } = data as PostRequestData;
      if (!ip) {
        throw new Error('IP not found');
      }
      const guest = await prisma.guest.findFirst({ where: { ip } });
      if (guest) {
        await prisma.guest.update({ where: { id: guest.id }, data: { entries: guest.entries + 1 } });
        res.status(200).json({ message: 'Guest updated successfully', data: guest });
      } else {
        await prisma.guest.create({ data: { ip, entries: 1 } });
        res.status(200).json({ message: 'Guest created successfully' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error saving guest info:', error);
    res.status(500).json({ message: 'Error saving guest info: ' + error });
  }
}
