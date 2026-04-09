import useSWR from "swr";
import Link from "next/link";

type ProductType = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: string;
  image: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formatPrice = (price: string) => {
  const cleanPrice = price.replace(/\./g, '');
  const numPrice = parseInt(cleanPrice);
  return numPrice.toLocaleString('id-ID');
};

export default function ProdukPage() {
  const { data, error } = useSWR<ProductType[]>("/api/produk", fetcher);

  if (error) return <div>Gagal memuat data: {error.message}</div>;
  if (!data) return <div>Loading produk...</div>;

  // Pastikan data adalah array
  if (!Array.isArray(data)) {
    return <div>Data produk tidak valid (bukan array)</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Daftar Produk</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {data.map((product) => (
          <Link href={`/produk/${product.id}`} key={product.id}>
            <div style={{
              width: '220px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: '0.3s'
            }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} />
              <h3 style={{ fontSize: '18px', margin: '10px 0' }}>{product.name}</h3>
              <p style={{ color: '#666', margin: '5px 0' }}>{product.category}</p>
              <p style={{ margin: '5px 0' }}>Ukuran: {product.size}</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff5722', marginTop: '8px' }}>
                Rp {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}