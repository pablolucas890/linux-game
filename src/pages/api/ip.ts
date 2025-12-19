import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  ip?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const xForwardedForRaw = req.headers['x-forwarded-for'];
    const xForwardedFor =
      typeof xForwardedForRaw === 'string'
        ? xForwardedForRaw
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .join(', ')
        : Array.isArray(xForwardedForRaw)
          ? xForwardedForRaw.join(', ')
          : undefined;

    if (!xForwardedFor) {
      throw new Error('IP not found');
    }
    res.status(200).json({ message: 'IP fetched successfully', ip: xForwardedFor });
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    res.status(500).json({ message: 'Error getting IP' });
  }
}
