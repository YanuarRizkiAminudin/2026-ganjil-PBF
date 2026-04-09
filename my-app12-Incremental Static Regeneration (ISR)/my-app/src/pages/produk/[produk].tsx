import DetailProduk from '../../views/DetailProduct';
import { ProductType } from '../../types/Product.type';

export default function DetailPageSSG({ product }: { product: ProductType }) {
  return <DetailProduk product={product} />;
}

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3000/api/produk');
  const products: ProductType[] = await res.json();
  const paths = products.map((product) => ({ params: { produk: product.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { produk: string } }) {
  const res = await fetch(`http://localhost:3000/api/produk/${params.produk}`);
  const product = await res.json();
  return { props: { product } };
}