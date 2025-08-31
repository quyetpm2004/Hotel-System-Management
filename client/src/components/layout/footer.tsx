import { useCurrentApp } from "../context/app.context";

const Footer = () => {
  const { isAuthenticated } = useCurrentApp();
  return (
    <>
      {isAuthenticated ? (
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-sm">
                © 2025 Hệ thống quản lý chung cư. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Phát triển bởi QuyetPham204
              </p>
            </div>
          </div>
        </footer>
      ) : (
        <></>
      )}
    </>
  );
};

export default Footer;
