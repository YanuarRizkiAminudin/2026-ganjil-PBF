import styles from "../../pages/produk/product.module.scss";

type ProductType = {
  id: string;
  name: string;
  price: number;
  size: string;
  category: string;
  image: string;
};

const TampilanProduk = ({ products }: { products: ProductType[] }) => {
  return (
    <div className={styles.produk}>
      <h1 className={styles.produk__title}>Daftar Produk</h1>
      <div className={styles.produk__content}>
        {products.length === 0 ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className={styles.produk__content__skeleton}>
              <div className={styles.produk__content__skeleton__image}></div>
              <div className={styles.produk__content__skeleton__name}></div>
              <div className={styles.produk__content__skeleton__category}></div>
              <div className={styles.produk__content__skeleton__price}></div>
            </div>
          ))
        ) : (
          products.map((product) => (
            <div key={product.id} className={styles.produk__content__item}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.produk__content__item__image}
              />
              <h4 className={styles.produk__content__item__name}>{product.name}</h4>
              <p className={styles.produk__content__item__category}>{product.category}</p>
              <p className={styles.produk__content__item__price}>
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TampilanProduk;