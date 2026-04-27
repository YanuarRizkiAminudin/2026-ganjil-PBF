import { ProductType } from '../../types/Product.type';
import styles from './detailProduct.module.scss';

const DetailProduk = ({ product }: { product: ProductType }) => {
  const formatPrice = (price: string) => {
    const cleanPrice = price.replace(/\./g, '');
    const numPrice = parseInt(cleanPrice);
    return numPrice.toLocaleString('id-ID');
  };

  return (
    <>
      <h1 className={styles.title}>Detail Produk</h1>
      <div className={styles.produkdetail}>
        <div className={styles.produkdetail__image}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className={styles.produkdetail__info}>
          <h1 className={styles.produkdetail__name}>{product.name}</h1>
          <p className={styles.produkdetail__category}>{product.category}</p>
          <p className={styles.produkdetail__price}>
            Rp {formatPrice(product.price)}
          </p>
          <p>Ukuran: {product.size}</p>
          <div className={styles.produkdetail__button}>Beli Sekarang</div>
        </div>
      </div>
    </>
  );
};

export default DetailProduk;