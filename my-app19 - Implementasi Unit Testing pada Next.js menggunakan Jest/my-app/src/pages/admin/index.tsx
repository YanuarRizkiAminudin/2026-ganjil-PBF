import { useSession } from "next-auth/react";

export default function AdminPage() {
  const { data: session } = useSession();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Halaman Admin</h1>
      <p>Selamat datang, <strong>{session?.user?.name}</strong></p>
      <p>Role: <strong>{(session?.user as any)?.role}</strong></p>
    </div>
  );
}
