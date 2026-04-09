import { useRouter } from 'next/router';

const BlogDetailPage = () => {
  const { query } = useRouter();

  return (
    <div>
      <h1>Halaman Blog</h1>
      <p>Slug: {query.slug}</p>
    </div>
  );
};

export default BlogDetailPage;
