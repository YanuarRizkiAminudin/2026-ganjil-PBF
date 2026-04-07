import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: boolean;
  status_code: number;
  data: {
    id: string;
    nama: string;
    harga: number;
    ukuran: string;
    warna: string;
  }[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = [
    {
      id: "1",
      nama: "Kaos Polos",
      harga: 10000,
      ukuran: "L",
      warna: "merah",
    },
    {
      id: "2",
      nama: "Kaos Berlengan Panjang",
      harga: 15000,
      ukuran: "M",
      warna: "biru",
    },
  ];
  res.status(200).json({ status: true, status_code: 200, data: data });
}