import { useRouter } from "next/router";

const halamanToko = () => {
  const { query } = useRouter();
  const slug = query.slug as string[] | undefined;

  return (
    <div>
      <h1>Halaman Toko</h1>
      <p>
        Toko: {Array.isArray(slug) ? slug.join("-") : ""}
      </p>
      <p>
        Kategori: {slug ? slug[0] : "Semua Kategori"}
      </p>
    </div>
  );
};

export default halamanToko;