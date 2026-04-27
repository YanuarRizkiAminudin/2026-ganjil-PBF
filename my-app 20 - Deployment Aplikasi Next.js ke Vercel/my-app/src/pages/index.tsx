import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>HOME</h1>

      {session ? (
        <div style={{ marginTop: '1rem' }}>
          <p>Halo, <strong>{session.user?.name}</strong> ({session.user?.email})</p>
          <p>Role: <strong>{(session.user as any)?.role}</strong></p>
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="avatar"
              width={60}
              height={60}
              style={{ borderRadius: '50%', marginTop: '8px' }}
            />
          )}
          <br /><br />
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p style={{ marginTop: '1rem' }}>
          <Link href="/auth/login">Login</Link>
        </p>
      )}

      <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <Link href="/produk">Ke Produk (CSR)</Link>
        <Link href="/produk/server">Ke Produk (SSR)</Link>
        <Link href="/produk/static">Ke Produk (SSG)</Link>
        <Link href="/admin">Ke Halaman Admin</Link>
        <Link href="/editor">Ke Halaman Editor</Link>
        <Link href="/profile">Ke Halaman Profile</Link>
      </nav>
    </div>
  );
}
