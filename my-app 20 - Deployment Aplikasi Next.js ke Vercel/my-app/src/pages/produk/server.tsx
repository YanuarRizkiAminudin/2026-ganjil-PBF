import TampilanProduk from "@/views/product";
import { ProductType } from "@/types/Product.type";

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

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk`);
  const response: ProductType[] = await res.json();

  return {
    props: {
      products: response,
    },
  };
}