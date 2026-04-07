import Link from "next/link";
import { useRouter } from "next/router";

const HalamanLogin = () => {
  const { push } = useRouter();

  const handlerLogin = () => {
    push('/produk');
  };

  return (
    <div style={{
      backgroundColor: "#4CAF50",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white"
    }}>
      <h1>Halaman Login</h1>
      <button onClick={() => handlerLogin()}>Login</button>
      <br />
      <p style={{ color: "orange", fontWeight: "bold" }}>belum punya akun</p>
      <Link href="/auth/register">Ke Halaman Register</Link>
    </div>
  );
};

export default HalamanLogin;