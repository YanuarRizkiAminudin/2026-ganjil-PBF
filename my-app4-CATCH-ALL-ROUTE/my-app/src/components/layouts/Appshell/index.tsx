import Navbar from '../Navbar';

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = (props: AppShellProps) => {
  const { children } = props;
  return (
    <main>
      <Navbar />
      {children}
      <div className='footer'>
        <p>Footer</p>
      </div>
    </main>
  );
};

export default AppShell;
