import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, data } = req.query;

  // Cek token dari .env.local
  if (token !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (data !== 'produk') {
    return res.status(400).json({ message: 'Parameter data harus "produk"' });
  }

  try {
    await res.revalidate('/produk/static');
    return res.status(200).json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ revalidated: false, message: 'Error revalidating' });
  }
}