import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Praktikum Next.js Pages Router</h1>
      <p>Mahasiswa D4 Pengembangan Web</p>
      <br />
      <Link href="/about" style={{ 
        padding: '10px 20px', 
        backgroundColor: '#0070f3', 
        color: 'white', 
        borderRadius: '5px', 
        textDecoration: 'none' 
      }}>
        Ke Halaman About →
      </Link>
    </div>
  )
}