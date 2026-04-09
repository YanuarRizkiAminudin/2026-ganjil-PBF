// src/pages/api/produk.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: string;
  image: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[]>
) {
  const data: Product[] = [
    {
      id: '1',
      name: 'Sepatu Duramo SL',
      price: '900000',
      category: "Men's Shoes",
      size: '42',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format',
    },
    {
      id: '2',
      name: 'SEPATU SAMBA OG',
      price: '2000000',
      category: "Men's Shoes",
      size: '41',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&auto=format',
    },
    // Optional tambah produk ke-3 (jika diperlukan)
    {
      id: '3',
      name: 'Sepatu Duramo SL (Ukuran 40)',
      price: '900.000',
      category: "Men's Shoes",
      size: '40',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format',
    },
    {
      id: "4",
      name: "Sepatu Baru Test",
      price: "500000",
      size: "39",
      category: "Men's Shoes",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400"
    },
  ];
  res.status(200).json(data);
}