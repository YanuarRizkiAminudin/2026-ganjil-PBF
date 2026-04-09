import { useRouter } from 'next/router';
import useSWR from 'swr';
import DetailProduk from '../../views/DetailProduct';
import { ProductType } from '../../types/Product.type';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DetailPageCSR() {
  const router = useRouter();
  const { produk } = router.query;
  const { data, error, isLoading } = useSWR<ProductType>(
    produk ? `/api/produk/${produk}` : null,
    fetcher
  );

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading detail produk...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: 50 }}>Gagal memuat data</div>;
  if (!data) return null;

  return <DetailProduk product={data} />;
}