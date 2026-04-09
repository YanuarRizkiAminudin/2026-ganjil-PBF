// src/pages/produk/static.tsx
import { ProductType } from '../../types/Product.type';
import TampilanProduk from '../../../views/product';

export default function StaticPage({ products }: { products: ProductType[] }) {
  return (
    <div>
      <h1>Halaman Produk - Static Site Generation (SSG)</h1>
      <TampilanProduk products={products} />
    </div>
  );
}

export async function getStaticProps() {
  // Panggil API internal (harus jalan saat build)
  const res = await fetch('http://localhost:3000/api/produk');
  const products = await res.json();

  return {
    props: { products },
    // optional: ISR (revalidate setiap 10 detik)
    revalidate: 10,
  };
}