import Link from 'next/link';
import styles from '../../pages/produk/Produk.module.css';

type ProductType = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: string;
  image: string;
};

const formatPrice = (price: string) => {
  const clean = price.replace(/\./g, '');
  return parseInt(clean).toLocaleString('id-ID');
};

const TampilanProduk = ({ products }: { products: ProductType[] }) => {
  return (
    <div className={styles.produk}>
      <h2 className={styles.produk__title}>Daftar Produk</h2>
      <div className={styles.produk__content}>
        {products.map((product) => (
          <Link href={`/produk/${product.id}`} key={product.id}>
            <div className={styles.produk__content__item}>
              <img src={product.image} alt={product.name} className={styles.produk__content__item__image} />
              <h4 className={styles.produk__content__item__name}>{product.name}</h4>
              <p className={styles.produk__content__item__category}>{product.category}</p>
              <p className={styles.produk__content__item__size}>Size: {product.size}</p>
              <p className={styles.produk__content__item__price}>Rp {formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TampilanProduk;