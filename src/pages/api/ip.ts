import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  ip?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    if (!data?.ip) {
      throw new Error('IP not found');
    }
    res.status(200).json({ message: 'IP fetched successfully', ip: data.ip });
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    res.status(500).json({ message: 'Error getting IP' });
  }
}
