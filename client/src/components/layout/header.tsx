import { UserOutlined } from "@ant-design/icons";
import { useCurrentApp } from "../context/app.context";
import { App, Dropdown, type MenuProps } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateUserInfo, updateUserPassword } from "@/services/api";

const Header = () => {
  const { user, setUser, setIsAuthenticated, isAuthenticated } =
    useCurrentApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "password">("basic");

  // state cho modal
  const [avatar, setAvatar] = useState<File>();
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");

  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/room", label: "Căn hộ" },
    { path: "/resident", label: "Cư dân" },
    { path: "/revenue", label: "Khoản thu" },
    { path: "/statistic", label: "Thống kê" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const items: MenuProps["items"] = [
    {
      label: <p onClick={() => setShowModal(true)}>Chỉnh sửa thông tin</p>,
      key: "1",
    },
    {
      label: <p onClick={handleLogout}>Đăng xuất</p>,
      key: "2",
    },
  ];

  const { message, notification, modal } = App.useApp();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // handle upload avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateInfo = async () => {
    console.log(avatar, "avatar in header");
    const res = await updateUserInfo(email, username, avatar as any);
    if (res.success) {
      message.success("Chỉnh sửa thông tin thành công!");
      setUser(res.data as any);
      setShowModal(false);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const handleUpdatePassword = async () => {
    const res = await updateUserPassword(
      email,
      oldPassword,
      confirmPassword,
      newPassword
    );
    if (res.success) {
      message.success("Chỉnh sửa password thành công!");
      setShowModal(false);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.error,
      });
    }
  };

  let avatarSrc = "https://via.placeholder.com/80x80.png?text=Avatar";

  if (avatarPreview) {
    avatarSrc = avatarPreview;
  } else if (user?.avatar) {
    avatarSrc = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
      user.avatar
    }`;
  }

  return (
    <>
      {isAuthenticated ? (
        <header className="fixed top-0 left-0 right-0 bg-blue-800 text-white shadow-lg z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">
                  Hệ thống quản lý chung cư
                </h2>
              </div>

              <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="font-semibold">
                    Xin chào {user?.username}
                  </span>
                </div>
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  arrow={{ pointAtCenter: true }}
                  placement="bottomRight"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-700 text-white cursor-pointer">
                    <a onClick={(e) => e.preventDefault()}>
                      <UserOutlined style={{ fontSize: 15 }} />
                    </a>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </header>
      ) : null}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 p-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Chỉnh Sửa Thông Tin
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b mt-3">
              <button
                onClick={() => setActiveTab("basic")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "basic"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Thông Tin Cơ Bản
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "password"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Đổi Mật Khẩu
              </button>
            </div>

            {/* Content */}
            <div className="mt-4">
              {activeTab === "basic" ? (
                <div className="space-y-4">
                  {/* Avatar */}
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <img
                        src={avatarSrc}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <label
                        htmlFor="avatarInput"
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg"
                      >
                        +
                      </label>
                      <input
                        type="file"
                        id="avatarInput"
                        name="avatar"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Nhấn vào dấu + để thay đổi avatar
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên người dùng
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleUpdateInfo}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium"
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Old Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu cũ
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  {/* Confirm Old Password */}

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleUpdatePassword}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium"
                  >
                    Đổi Mật Khẩu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
