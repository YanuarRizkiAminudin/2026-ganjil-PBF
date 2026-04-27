import Script from "next/script";
import Image from "next/image";
import styles from './Navbar.module.css';
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data }: any = useSession();

  return (
    <div className={styles.navbar}>
      {/* Standard React/JSX - langsung render */}
      {/* <div className={styles.navbar__brand}>MyApp</div> */}

      {/* Next.js Script - lazyOnload, inject via DOM */}
      <div className={styles.navbar__brand} id="title"></div>
      <Script id="title-script" strategy="lazyOnload">
        {`document.getElementById('title').innerHTML = 'MyApp';`}
      </Script>

      <div className={styles.navbar__right}>
        {data ? (
          <>
            <div className={styles.navbar__user}>
              Welcome, {data.user?.fullname}
              {data?.user?.image && (
                // <img src={data.user.image} />
                <Image
                  width={50}
                  height={50}
                  src={data.user.image}
                  alt={data.user.fullname}
                  className={styles.navbar__user__image}
                />
              )}
            </div>
          </>
        ) : (
          <button onClick={() => signIn()}>Login</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
