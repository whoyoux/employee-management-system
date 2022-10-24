import { Header } from "../components";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
