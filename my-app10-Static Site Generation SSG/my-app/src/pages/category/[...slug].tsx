import { useRouter } from "next/router";

const HalamanCategory = () => {
  const { query } = useRouter();
  const slug = query.slug as string[] | undefined;

  return (
    <div>
      <h1>Halaman Category</h1>
      <p>Parameter URL:</p>
      <ul>
        {slug ? (
          slug.map((item, index) => (
            <li key={index}>{item}</li>
          ))
        ) : (
          <li>Tidak ada parameter</li>
        )}
      </ul>
    </div>
  );
};

export default HalamanCategory;