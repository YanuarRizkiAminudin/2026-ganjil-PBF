// src/pages/produk/static.tsx
import { ProductType } from '../../types/Product.type';
import TampilanProduk from '../../views/product';

// Data statis sebagai fallback (sama dengan API)
const staticProducts: ProductType[] = [
  { id: '1', name: 'Sepatu Duramo SL', price: '900000', category: "Men's Shoes", size: '42', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { id: '2', name: 'SEPATU SAMBA OG', price: '2000000', category: "Men's Shoes", size: '41', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
  { id: '3', name: 'Sepatu Duramo SL (Ukuran 40)', price: '900.000', category: "Men's Shoes", size: '40', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
];

export default function StaticPage({ products }: { products: ProductType[] }) {
  return (
    <div>
      <h1>Halaman Produk SSG + ISR (revalidate 10 detik)</h1>
      <TampilanProduk products={products} />
    </div>
  );
}

export async function getStaticProps() {
  // Coba fetch dari API, jika gagal pakai data statis
  let products = staticProducts;
  try {
    const res = await fetch('http://localhost:3000/api/produk');
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.log('Fetch API gagal, menggunakan data statis untuk build');
  }

  return {
    props: { products },
    revalidate: 10, // ISR: update setiap 10 detik
  };
}