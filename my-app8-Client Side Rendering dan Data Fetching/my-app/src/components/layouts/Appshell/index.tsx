import { useRouter } from "next/router";
import Navbar from "../Navbar";

const disableNavbar = ["/auth/login", "/auth/register", "/404"];

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = (props: AppShellProps) => {
  const { children } = props;
  const { pathname } = useRouter();
  const isAuthPage = disableNavbar.includes(pathname);
  
  return (
    <main>
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