import type { NextApiRequest, NextApiResponse } from 'next';
import { ProductType } from '../../../types/Product.type';

const products: ProductType[] = [
  { id: '1', name: 'Sepatu Duramo SL', price: '900000', category: "Men's Shoes", size: '42', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { id: '2', name: 'SEPATU SAMBA OG', price: '2000000', category: "Men's Shoes", size: '41', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
  { id: '3', name: 'Sepatu Duramo SL (Ukuran 40)', price: '900.000', category: "Men's Shoes", size: '40', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const product = products.find(p => p.id === id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}