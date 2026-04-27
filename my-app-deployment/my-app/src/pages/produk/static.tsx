import TampilanProduk from "@/views/product";
import { ProductType } from "@/types/Product.type";

const halamanProdukStatic = (props: { products: ProductType[] }) => {
  const { products } = props;
  return (
    <div>
      <h1>Halaman Produk Static (SSG)</h1>
      <TampilanProduk products={products} />
    </div>
  );
};

export default halamanProdukStatic;

export async function getStaticProps() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/produk`);
  const response: ProductType[] = await res.json();

  return {
    props: {
      products: response,
    },
    revalidate: 60,
  };
}
