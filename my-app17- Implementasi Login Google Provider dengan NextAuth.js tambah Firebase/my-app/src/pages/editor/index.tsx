import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Halaman Editor</h1>
      <p>Halaman ini hanya bisa diakses oleh role <strong>editor</strong> atau <strong>admin</strong>.</p>
      <div style={{ background: "#e8f5e9", padding: "1.5rem", borderRadius: "8px", marginTop: "1rem" }}>
        <p><strong>Nama:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>Role:</strong> {(session.user as any)?.role}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{
          marginTop: "1.5rem",
          padding: "10px 20px",
          background: "#388e3c",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
