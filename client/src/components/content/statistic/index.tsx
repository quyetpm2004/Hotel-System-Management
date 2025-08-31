import {
  createCollectionItem,
  createCollectionPeriod,
  deleteCollectionPeriod,
  getAllRevenueItemApi,
  getAllRooms,
  getCollectionPeriod,
  getRoomDetailApi,
  updateCollectionPeriod,
} from "@/services/api";
import { App, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface IFee {
  id: string;
  name: string;
}

const Statistic = () => {
  const { message, notification, modal } = App.useApp();

  const [showModal, setShowModal] = useState(false);
  const [openSettingCollection, setOpenSettingCollection] = useState(false);
  const [editData, setEditData] = useState<ICollectionPeriod | null>(null);

  const [colletionPeriods, setCollectionPeriods] = useState<
    ICollectionPeriod[]
  >([]);

  // state cho form
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");
  const [totalDue, setTotalDue] = useState<number | "">("");
  const [totalPaid, setTotalPaid] = useState<number | "">("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [revenue, setRevenue] = useState<IRevenueItem[]>([]);
  const [roomChoose, setRoomChoose] = useState<string>("");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const getRoom = async () => {
    const res = await getAllRooms();
    if (res.success && res.data) {
      const roomNumbers = res.data.map((room) => room.room_number);
      setRooms(roomNumbers);
    }
  };

  const getRevenue = async () => {
    const res = await getAllRevenueItemApi();
    if (res.success && res.data) {
      setRevenue(res.data);
    }
  };

  useEffect(() => {
    getRoom();
    getRevenue();
  }, []);

  const resetForm = () => {
    setName("");
    setCode("");
    setStartDate("");
    setEndDate("");
    setType("");
    setTotalDue("");
    setTotalPaid("");
    setEditData(null);
  };

  const fetchCollectionPeriods = async () => {
    const res = await getCollectionPeriod();
    if (res.success && res.data) {
      setCollectionPeriods(res.data);
    }
  };

  useEffect(() => {
    fetchCollectionPeriods();
  }, []);

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: ICollectionPeriod) => {
    setEditData(item);
    setName(item.name);
    setCode(item.code);
    setStartDate(item.startDate.split("T")[0]);
    setEndDate(item.endDate.split("T")[0]);
    setType(item.type);
    setTotalDue(item.totalDue);
    setTotalPaid(item.totalPaid);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      code,
      startDate,
      endDate,
      type,
    };

    if (editData) {
      // gọi API update
      const res = await updateCollectionPeriod(
        editData.id + "",
        name,
        startDate,
        endDate,
        type
      );
      if (res.success) {
        message.success("Cập nhật đợt thu thành công");
        fetchCollectionPeriods();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message || "Đã có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } else {
      const res = await createCollectionPeriod(
        name,
        startDate,
        endDate,
        type,
        code
      );
      if (res.success) {
        message.success("Tạo đợt thu thành công");
        fetchCollectionPeriods();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message || "Đã có lỗi xảy ra, vui lòng thử lại",
        });
      }
    }

    setShowModal(false);
    resetForm();
    fetchCollectionPeriods();
  };

  const [applyAll, setApplyAll] = useState(false);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);

  const toggleFee = (feeId: string) => {
    setSelectedFees((prev) => {
      if (prev.includes(feeId)) {
        // Nếu đã có trong mảng thì bỏ đi (bỏ tick)
        return prev.filter((id) => id !== feeId);
      } else {
        // Nếu chưa có thì thêm vào (tick)
        return [...prev, feeId];
      }
    });
  };

  const handleSave = async () => {
    if (!settingData) return;

    // Tạo mảng items
    const items = selectedFees.map((id) => {
      const fee = revenue.find((item) => item.id === +id);
      const quantity = quantities[id] ?? 0;
      return {
        revenueItemId: fee?.id || 0,
        quantity,
        quantityUnit: fee?.quantityUnit || "unit",
        unitPrice: Number(fee?.unitPrice) || 0,
        note: fee?.name || "",
      };
    });

    // Gọi API ở đây nếu muốn
    const res = await createCollectionItem(
      settingData.id,
      applyAll ? "All" : roomChoose,
      items
    );
    if (res.success) {
      message.success("Lưu thiết lập khoản thu thành công");
      fetchCollectionPeriods();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message || "Đã có lỗi xảy ra, vui lòng thử lại",
      });
    }

    setOpenSettingCollection(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteCollectionPeriod(id);
    if (res.success) {
      message.success("Xóa đợt thu thành công");
      fetchCollectionPeriods();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message || "Đã có lỗi xảy ra, vui lòng thử lại",
      });
    }
  };

  const convertUnit = (unit?: string): string => {
    switch (unit) {
      case "m2":
        return "m²"; // mét vuông
      case "m3":
        return "khối"; // mét khối
      case "h":
        return "giờ";
      case "kg":
        return "kilogram";
      case "g":
        return "gram";
      case "l":
        return "lít";
      case "unit":
        return "đơn vị";
      case "motorbike":
        return "xe máy";
      case "car":
        return "ô tô";
      default:
        return unit || "";
    }
  };

  useEffect(() => {
    const fetchQuantities = async () => {
      if (!roomChoose) return;

      const res = await getRoomDetailApi(roomChoose);
      const room = res.data?.room;
      const motorbikeCount = res.data?.countVehicles.motorbike || 0;
      const carCount = res.data?.countVehicles.car || 0;

      const newQuantities: { [key: string]: number } = {};
      selectedFees.forEach((feeId) => {
        const fee = revenue.find((f) => f.id === +feeId);
        if (!fee) return;

        if (fee.quantityUnit === "m2") {
          newQuantities[feeId] = room?.area ?? 1;
        } else if (fee.quantityUnit === "motorbike") {
          newQuantities[feeId] = motorbikeCount;
        } else if (fee.quantityUnit === "car") {
          newQuantities[feeId] = carCount;
        } else {
          newQuantities[feeId] = 1;
        }
      });

      setQuantities(newQuantities);
    };

    fetchQuantities();
  }, [selectedFees, roomChoose]);

  const openCollection = (item: ICollectionPeriod) => {
    setOpenSettingCollection(true);
    setSettingData(item);
    console.log("Chọn đợt thu:", item);
  };

  const [settingData, setSettingData] = useState<ICollectionPeriod | null>(
    null
  );

  const navigate = useNavigate();

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8 bg-white rounded-xl shadow-lg p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Thống kê theo đợt thu
            </h1>
            <p className="text-gray-600">Thông kê các thu phí của chung cư</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <i className="fas fa-plus"></i>
            <span>Thêm đợt thu</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách đợt thu
            </h2>
            <p className="text-gray-600 mt-1">
              Tổng số:{" "}
              <span id="totalCount" className="font-medium text-blue-600">
                {colletionPeriods.length}
              </span>{" "}
              đợt thu
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đợt thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đợt thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền đã thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày kết thúc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chu kỳ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiến độ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {colletionPeriods.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => navigate(`/statistic/${item.code}`)}
                    >
                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalDue.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalPaid.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.startDate).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.endDate).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type === "monthly"
                        ? "Theo tháng"
                        : item.type === "quarterly"
                        ? "Theo quý"
                        : item.type === "yearly"
                        ? "Theo năm"
                        : "Khác"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.paidRooms}/{item.totalRooms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => openCollection(item)}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200 transition"
                      >
                        <i className="fa-solid fa-gears"></i>
                      </button>
                      <button
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 transition"
                        onClick={() => openEditModal(item)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <Popconfirm
                        title="Xóa đợt thu"
                        description="Bạn có chắc chắn muốn xóa đợt thu này không?"
                        onConfirm={() => handleDelete(item.id + "")}
                        okText="Có"
                        cancelText="Không"
                      >
                        <button className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition">
                          <i className="fas fa-trash"></i>
                        </button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editData ? "Sửa Đợt Thu" : "Thêm Đợt Thu"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đợt thu
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã đợt thu
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={!!editData}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chu kỳ
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn chu kỳ</option>
                  <option value="monthly">Theo tháng</option>
                  <option value="quarterly">Theo quý</option>
                  <option value="yearly">Theo năm</option>
                </select>
              </div>
            </form>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {editData ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openSettingCollection && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl mx-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Thiết lập khoản thu cho đợt thu
              </h2>
              <button
                onClick={() => setOpenSettingCollection(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Nội dung */}
            <div className="grid grid-cols-6 gap-6">
              {/* Cột trái */}
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="block font-semibold mb-1">
                    Tên đợt thu
                  </label>
                  <p className="px-3 py-2 border rounded-md bg-gray-50">
                    {settingData?.name}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Căn hộ</label>
                  <select
                    disabled={applyAll}
                    className="w-full px-3 py-2 border rounded-md"
                    onChange={(e) => setRoomChoose(e.target.value)}
                  >
                    <option>Chọn căn hộ</option>
                    {rooms.map((room) => (
                      <option key={room} value={room}>
                        Phòng {room}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={applyAll}
                      onChange={(e) => setApplyAll(e.target.checked)}
                    />
                    <span>Áp dụng tất cả căn hộ</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Khoản thu</label>
                  <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
                    {revenue.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFees.includes(item.id + "")}
                          onChange={() => toggleFee(item.id + "")}
                        />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cột phải */}
              <div className="col-span-4">
                <label className="block font-semibold mb-2">Thiết lập</label>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left">Khoản thu</th>
                        <th className="px-3 py-2 text-left">Đơn giá</th>
                        <th className="px-3 py-2 text-left">Số lượng</th>
                        <th className="px-3 py-2 text-left">Thu theo</th>
                        <th className="px-3 py-2 text-left">Loại</th>
                        <th className="px-3 py-2 text-left">Căn hộ</th>
                        <th className="px-3 py-2 text-left">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFees.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center text-gray-500 py-4"
                          >
                            No content in table
                          </td>
                        </tr>
                      ) : (
                        selectedFees.map((id) => {
                          const fee = revenue.find((item) => item.id === +id);
                          return (
                            <tr key={id} className="border-t">
                              <td className="px-3 py-2">{fee?.name}</td>
                              <td className="px-3 py-2">
                                {fee && !isNaN(Number(fee.unitPrice))
                                  ? Number(fee.unitPrice).toLocaleString(
                                      "vi-VN",
                                      {
                                        style: "currency",
                                        currency: "VND",
                                      }
                                    )
                                  : "0 ₫"}
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  className="w-20 border rounded px-2 py-1"
                                  min={0}
                                  value={quantities[id] ?? "0"}
                                  onChange={(e) =>
                                    setQuantities((prev) => ({
                                      ...prev,
                                      [id]: Number(e.target.value),
                                    }))
                                  }
                                />
                              </td>
                              <td className="px-3 py-2">
                                {convertUnit(fee?.quantityUnit) || "lần"}
                              </td>
                              <td className="px-3 py-2">
                                {fee?.category !== "mandatory"
                                  ? "Tự nguyện"
                                  : "Bắt buộc"}
                              </td>
                              <td className="px-3 py-2">
                                {applyAll ? "Tất cả" : `Phòng ${roomChoose}`}
                              </td>
                              <td className="px-3 py-2">
                                {fee && fee.unitPrice
                                  ? (
                                      Number(fee.unitPrice) *
                                      (quantities[id] ?? 0)
                                    ).toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    })
                                  : "0 ₫"}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenSettingCollection(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Statistic;
