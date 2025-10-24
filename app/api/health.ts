import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const isHealthy = true; 
    if (!isHealthy) {
      return res.status(503).json({ status: 'Service Unavailable' });
    }

    res.status(200).json({ 
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ status: 'Internal Server Error' });
  }
}
