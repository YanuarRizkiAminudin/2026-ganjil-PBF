import styles from "../../pages/produk/product.module.scss";
import { ProductType } from "../../pages/types/Product.type";

const TampilanProduk = ({ products }: { products: ProductType[] }) => {
  return (
    <div className={styles.produk}>
      <h1 className={styles.produk__title}>Daftar Produk</h1>
      <div className={styles.produk__content}>
        {products.length > 0 ? (
          products.map((product: ProductType) => (
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
        ) : (
          <>
            <div className={styles.produk__content__skeleton}>
              <div className={styles.produk__content__skeleton__image}></div>
              <div className={styles.produk__content__skeleton__name}></div>
              <div className={styles.produk__content__skeleton__category}></div>
              <div className={styles.produk__content__skeleton__price}></div>
            </div>
            <div className={styles.produk__content__skeleton}>
              <div className={styles.produk__content__skeleton__image}></div>
              <div className={styles.produk__content__skeleton__name}></div>
              <div className={styles.produk__content__skeleton__category}></div>
              <div className={styles.produk__content__skeleton__price}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TampilanProduk;