import styles from '@/pages/produk/Produk.module.css';

type ProductType = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: string;
  image: string;
};

const TampilanProduk = ({ products }: { products: ProductType[] }) => {
  const formatPrice = (price: string) => {
    const cleanPrice = price.replace(/\./g, '');
    const numPrice = parseInt(cleanPrice);
    return numPrice.toLocaleString('id-ID');
  };

  return (
    <div className={styles.produk}>
      <h2 className={styles.produk__title}>Daftar Produk</h2>
      <div className={styles.produk__content}>
        {products.map((product) => (
          <div key={product.id} className={styles.produk__content__item}>
            <img 
              src={product.image} 
              alt={product.name}
              className={styles.produk__content__item__image}
            />
            <h4 className={styles.produk__content__item__name}>
              {product.name}
            </h4>
            <p className={styles.produk__content__item__category}>
              {product.category}
            </p>
            <p className={styles.produk__content__item__size}>
              Size: {product.size}
            </p>
            <p className={styles.produk__content__item__price}>
              Rp {formatPrice(product.price)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TampilanProduk;