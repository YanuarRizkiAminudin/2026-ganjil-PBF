import useSWR from "swr";
import TampilanProduk from "../../../views/product";
import { ProductType } from "../../types/Product.type";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProdukPageCSR() {
  const { data, error } = useSWR<ProductType[]>("/api/produk", fetcher);

  if (error) return <div>Error loading</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Halaman Produk CSR</h1>
      <TampilanProduk products={data} />
    </div>
  );
}