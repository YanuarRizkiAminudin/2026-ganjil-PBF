<<<<<<< HEAD
import TampilanLogin from "../../views/auth/login";

const halamanLogin = () => {
  return (
    <>
      <TampilanLogin />
    </>
  );
};

export default halamanLogin;
=======
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
>>>>>>> e8a726567a2e12f20d2f2837ac501da8a9fd590e
