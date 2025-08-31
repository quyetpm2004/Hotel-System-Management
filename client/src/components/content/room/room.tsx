import { getFloorsApi, getRoomsApi, getStatusApi } from "@/services/api";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router";

interface IRoom {
  room_number: string;
  floor: number;
  status: string;
  area: number;
}

const Room = () => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [floors, setFloors] = useState<number[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleFilterChange = (field: string, value: string) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "floor":
        setFloorFilter(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      default:
        break;
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await getRoomsApi({
        name: name,
        floor: floorFilter,
        status: statusFilter,
        page: String(page),
        limit: "24",
      });
      if (response.data) {
        setRooms(response.data.results);
        setTotal(response.data.meta.total);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Infinite scroll
  useEffect(() => {
    fetchRooms();
  }, [name, floorFilter, statusFilter, page]);

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const res = await getFloorsApi();
        if (res.data) {
          setFloors(res.data.floor);
        }
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };
    const fetchStatus = async () => {
      try {
        const res = await getStatusApi();
        if (res.data) {
          setStatus(res.data.statusRooms);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchFloors();
    fetchStatus();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { text: string; className: string; icon: string }
    > = {
      occupied: {
        text: "Đã có người ở",
        className: "bg-green-100 text-green-800",
        icon: "👥",
      },
      available: {
        text: "Trống",
        className: "bg-yellow-100 text-yellow-800",
        icon: "🏠",
      },
      vacant: {
        text: "Trống",
        className: "bg-yellow-100 text-yellow-800",
        icon: "🏠",
      },
      maintenance: {
        text: "Bảo trì",
        className: "bg-red-100 text-red-800",
        icon: "🛠️",
      },
    };
    const config = statusConfig[status] || statusConfig["available"];
    return (
      <>
        {config.icon} {config.text}
      </>
    );
  };

  const resetSearch = () => {
    setName("");
    setFloorFilter("");
    setStatusFilter("");
    setPage(1);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Search box */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Tìm Kiếm Căn Hộ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên căn hộ</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              placeholder="Nhập tên căn hộ..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Số tầng</label>
            <select
              value={floorFilter}
              onChange={(e) => handleFilterChange("floor", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Tất cả tầng</option>
              {floors.map((floor, index) => (
                <option key={index} value={floor}>
                  Tầng {floor}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Tất cả trạng thái</option>
              {status.map((stat, index) => (
                <option key={index} value={stat}>
                  {getStatusBadge(stat)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={resetSearch}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            🔄 Đặt lại
          </button>
        </div>
      </div>

      {/* Room list */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh Sách Căn Hộ
          </h2>
          <span className="text-sm text-gray-600">Tổng: {total} căn hộ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  P{room.room_number}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Tầng {room.floor}
                </span>
              </div>
              <div className="mb-4">{getStatusBadge(room.status)}</div>
              <p className="text-sm text-gray-600">
                📐 Diện tích:{" "}
                <span className="font-medium">
                  {room.area} m<sup>2</sup>
                </span>
              </p>
              <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                <Link to={`/room/${room.room_number}`}>📋 Xem chi tiết </Link>
              </button>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        defaultCurrent={1}
        align="center"
        total={total}
        style={{ marginTop: 20 }}
        pageSize={24}
        showSizeChanger={false}
        onChange={(page, pageSize) => {
          setPage(page);
        }}
      />
    </div>
  );
};

export default Room;
