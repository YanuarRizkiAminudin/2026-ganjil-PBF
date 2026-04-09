// src/pages/index.tsx

export default function Home() {
  return (
    <div>
      <h1>HOME</h1>
      <a href="/produk">Ke Produk (CSR)</a><br />
      <a href="/produk/server">Ke Produk (SSR)</a><br />
      <a href="/produk/static">Ke Produk (SSG)</a>
    </div>
  )
}