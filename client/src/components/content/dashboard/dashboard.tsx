import { useEffect, useState } from "react";
import DashboardCharts from "./chart";
import { getDashboardStatCardApi } from "@/services/api";

const Dashboard = () => {
  const [statCard, setStatCard] = useState<IDashboardStatCard>();
  useEffect(() => {
    const fetchStatCard = async () => {
      const res = await getDashboardStatCardApi();
      if (res.data) {
        setStatCard(res.data);
      }
    };
    fetchStatCard();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tổng số căn hộ */}
        <div className="bg-white rounded-xl shadow-md p-6 card-hover">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng căn hộ</p>
              <p className="text-2xl font-bold text-gray-900">
                {statCard?.countRooms}
              </p>
              <p className="text-xs text-green-600">100% căn mới</p>
            </div>
          </div>
        </div>

        {/* Căn hộ đã thuê */}
        <div className="bg-white rounded-xl shadow-md p-6 card-hover">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã thuê</p>
              <p className="text-2xl font-bold text-gray-900">
                {statCard?.countRoomsActive}
              </p>
              <p className="text-xs text-green-600">
                {(
                  ((statCard?.countRoomsActive ?? 0) /
                    (statCard?.countRooms ?? 1)) *
                  100
                ).toFixed(1)}
                % tỷ lệ thuê
              </p>
            </div>
          </div>
        </div>

        {/* Doanh thu tháng */}
        <div className="bg-white rounded-xl shadow-md p-6 card-hover">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {(Number(statCard?.countFees) || 0).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <p className="text-xs text-green-600">+12% so với tháng trước</p>
            </div>
          </div>
        </div>

        {/* Yêu cầu bảo trì */}
        <div className="bg-white rounded-xl shadow-md p-6 card-hover">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span> {/* 🔹 icon người */}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Số cư dân</p>
              <p className="text-2xl font-bold text-gray-900">
                {statCard?.countResident}
              </p>{" "}
              {/* 🔹 số cư dân */}
              <p className="text-xs text-blue-600">+10 mới tháng này</p>{" "}
              {/* 🔹 ghi chú */}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <DashboardCharts
        active={statCard?.countRoomsActive ?? 0}
        all={statCard?.countRooms ?? 0}
      />

      {/* Recent Activities & Maintenance Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hoạt động gần đây */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Hoạt Động Gần Đây
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Căn hộ A-1205 đã thanh toán tiền thuê
                </p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Hợp đồng thuê mới - Căn B-0803
                </p>
                <p className="text-xs text-gray-500">5 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Bảo trì thang máy tầng 15 hoàn thành
                </p>
                <p className="text-xs text-gray-500">1 ngày trước</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Cư dân mới đăng ký thẻ ra vào
                </p>
                <p className="text-xs text-gray-500">2 ngày trước</p>
              </div>
            </div>
          </div>
        </div>

        {/* Yêu cầu bảo trì */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔧 Yêu Cầu Bảo Trì
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Rò rỉ nước - Căn A-1508
                  </p>
                  <p className="text-xs text-gray-500">
                    Báo cáo: 30 phút trước
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  Khẩn cấp
                </span>
              </div>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Điều hòa không hoạt động - B-0912
                  </p>
                  <p className="text-xs text-gray-500">Báo cáo: 2 giờ trước</p>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  Trung bình
                </span>
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Thay bóng đèn hành lang tầng 8
                  </p>
                  <p className="text-xs text-gray-500">Báo cáo: 1 ngày trước</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Thấp
                </span>
              </div>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Kiểm tra hệ thống PCCC định kỳ
                  </p>
                  <p className="text-xs text-gray-500">Lên lịch: 3 ngày nữa</p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Định kỳ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
