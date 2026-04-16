import styles from './Navbar.module.css';
import { signIn, signOut, useSession } from "next-auth/react"

const Navbar = () => {
  const {data}:any = useSession()

  return (
    <div className={styles.navbar}>
      <div className="big">
        MyApp
      </div>
      <div>
        {data ? (
          <>
            <span>Welcome, {data.user?.fullname}</span>
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;