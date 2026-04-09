import TampilanProduk from "../../views/product";
import { ProductType } from "../types/Product.type";

const halamanProdukServer = (props: { products: ProductType[] }) => {
  const { products } = props;
  return (
    <div>
      <h1>Halaman Produk Server</h1>
      <TampilanProduk products={products} />
    </div>
  );
};

export default halamanProdukServer;

// Fungsi getServerSideProps akan dipanggil setiap kali halaman ini diakses
export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/produk");
  const respone = await res.json();
  // console.log("Data produk yang diambil dari API:", respone);
  return {
    props: {
      products: respone.data,
    },
  };
}