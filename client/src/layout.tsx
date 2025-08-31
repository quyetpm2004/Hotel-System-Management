import { Outlet } from "react-router";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const Layout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div
        style={{ marginTop: 64 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
