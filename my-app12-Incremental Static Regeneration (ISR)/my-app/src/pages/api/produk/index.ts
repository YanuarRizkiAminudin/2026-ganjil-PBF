import type { NextApiRequest, NextApiResponse } from 'next';

type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: string;
  image: string;
};

const products: Product[] = [
  {
    id: '1',
    name: 'Sepatu Duramo SL',
    price: '900000',
    category: "Men's Shoes",
    size: '42',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  },
  {
    id: '2',
    name: 'SEPATU SAMBA OG',
    price: '2000000',
    category: "Men's Shoes",
    size: '41',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
  },
  {
    id: '3',
    name: 'Sepatu Duramo SL (Ukuran 40)',
    price: '900.000',
    category: "Men's Shoes",
    size: '40',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  },
  {
  id: '4',
  name: 'Sepatu Baru Test',
  price: '750000',
  category: "Men's Shoes",
  size: '43',
  image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
},
{
  id: '5',
  name: 'Sepeda Gunung',
  price: '1500000',
  category: "Sports",
  size: 'Free',
  image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400',
},
{
  id: '6',
  name: 'Sepatu Running Pro',
  price: '1250000',
  category: "Men's Shoes",
  size: '44',
  image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
},
{
  id: '7',
  name: 'Tas Ransel',
  price: '350000',
  category: "Accessories",
  size: 'One Size',
  image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
}
];

export default function handler(req: NextApiRequest, res: NextApiResponse<Product[]>) {
  res.status(200).json(products);
}