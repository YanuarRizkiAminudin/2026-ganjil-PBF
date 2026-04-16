import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>HOME</h1>
      <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <Link href="/produk">Ke Produk (CSR)</Link>
        <Link href="/produk/server">Ke Produk (SSR)</Link>
        <Link href="/produk/static">Ke Produk (SSG)</Link>
      </nav>
    </div>
  );
}