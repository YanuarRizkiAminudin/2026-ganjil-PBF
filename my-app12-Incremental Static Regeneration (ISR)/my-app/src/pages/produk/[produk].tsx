import { useRouter } from 'next/router';
import useSWR from 'swr';
import DetailProduk from '../../views/DetailProduct';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DetailPage() {
  const router = useRouter();
  const { produk } = router.query;
  const { data, isLoading } = useSWR(
    produk ? `/api/produk/${produk}` : null,
    fetcher
  );

  if (isLoading) return <div>Loading detail...</div>;
  if (!data) return <div>Produk tidak ditemukan</div>;

  return <DetailProduk product={data} />;
}