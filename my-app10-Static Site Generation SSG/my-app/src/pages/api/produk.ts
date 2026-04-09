import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: boolean;
  status_code: number;
  data: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = [
    {
      id: "1",
      name: "Sepatu Duramo SL",
      price: 900000,
      size: "42",
      category: "Men's Shoes",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    },
    {
      id: "2",
      name: "SEPATU SAMBA OG",
      price: 2000000,
      size: "41",
      category: "Men's Shoes",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
    },
  ];
  res.status(200).json({ status: true, status_code: 200, data });
}