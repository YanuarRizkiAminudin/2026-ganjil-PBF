import { useRouter } from "next/router";
import Navbar from "../Navbar";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const disableNavbar = ["/auth/login", "/auth/register", "/404"];

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = (props: AppShellProps) => {
  const { children } = props;
  const { pathname } = useRouter();
  const isAuthPage = disableNavbar.includes(pathname);
  
  return (
    <main className={roboto.className}>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && (
        <div className='footer'>
          <p>Footer</p>
        </div>
      )}
    </main>
  );
};

export default AppShell;
