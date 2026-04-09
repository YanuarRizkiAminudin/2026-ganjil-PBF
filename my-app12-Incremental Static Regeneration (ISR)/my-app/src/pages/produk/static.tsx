import { ProductType } from '../../types/Product.type';
import TampilanProduk from '../../views/product';

export default function StaticPage({ products }: { products: ProductType[] }) {
  return (
    <div>
      <h1>Halaman Produk SSG + ISR (revalidate 10 detik)</h1>
      <TampilanProduk products={products} />
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/produk');
  const products = await res.json();

  return {
    props: { products },
    revalidate: 10, // 🔁 ISR: halaman akan diperbarui setiap 10 detik
  };
}