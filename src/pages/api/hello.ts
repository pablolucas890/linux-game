import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
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

  res.status(200).json({ message: 'Hello from Next.js! your IP is: ' + xForwardedFor });
}
