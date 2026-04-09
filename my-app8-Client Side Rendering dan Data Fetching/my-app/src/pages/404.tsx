import styles from '@/styles/404.module.scss';
import Head from 'next/head';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>404 - Halaman Tidak Ditemukan</title>
        <meta name="description" content="Halaman yang kamu cari tidak tersedia" />
      </Head>
      <div className={styles.error}>
        <img 
          src="/page-not-found.png" 
          alt="404" 
          className={styles.error__image} 
        />
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak ada.</p>
        <Link href="/">
          <button className={styles.error__button}>
            Kembali ke Home
          </button>
        </Link>
      </div>
    </>
  );
};

export default Custom404;