import {
  createRevenueItemApi,
  deleteRevenueItemApi,
  getAllRevenueItemApi,
  updateRevenueItemApi,
} from "@/services/api";
import { App, message, Popconfirm } from "antd";
import { useEffect, useState } from "react";

const Revenue = () => {
  const editFee = (feeCode: string) => {
    // TODO: Code chỉnh sửa khoản thu
    console.log("Edit fee:", feeCode);
  };

  const deleteFee = (feeCode: string) => {
    // TODO: Code xóa khoản thu
    console.log("Delete fee:", feeCode);
  };

  const { message, notification, modal } = App.useApp();

  const [revenueItems, setRevenueItems] = useState<IRevenueItem[]>([]);

  const fetchRevenueItems = async () => {
    const res = await getAllRevenueItemApi();
    if (res.success && res.data) {
      setRevenueItems(res.data);
    }
  };

  useEffect(() => {
    fetchRevenueItems();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [updateIdRevenueItem, setUpdateIdRevenueItem] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<number | string>("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [quantityUnit, setQuantityUnit] = useState<string>("");

  const closeModal = () => setShowModal(false);
  const openAddModal = () => {
    setEditIndex(null);
    setName("");
    setUnitPrice("");
    setCategory("");
    setCode("");
    setStatus("active");
    setDescription("");
    setQuantityUnit("");
    setShowModal(true);
  };

  const openEditForm = (index: number) => {
    setEditIndex(index);
    const updateRevenueItem = revenueItems[index];
    if (updateRevenueItem) {
      setUpdateIdRevenueItem(updateRevenueItem.id);
      setName(updateRevenueItem.name);
      setUnitPrice(updateRevenueItem.unitPrice);
      setCategory(updateRevenueItem.category);
      setCode(updateRevenueItem.code);
      setStatus(updateRevenueItem.status);
      setDescription(updateRevenueItem.description);
      setQuantityUnit(updateRevenueItem.quantityUnit);
    }
    setShowModal(true);
  };
  const handleSubmit = () => {
    if (editIndex !== null) {
      handleUpdate();
      setShowModal(false);
    } else {
      handleAdd();
      setShowModal(false);
    }
  };

  // convert unit
  const convertUnit = (unit?: string): string => {
    switch (unit) {
      case "m2":
        return "m²"; // mét vuông
      case "m3":
        return "m³"; // mét khối
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
      default:
        return unit || "";
    }
  };

  const handleAdd = async () => {
    const res = await createRevenueItemApi(
      name,
      unitPrice,
      category,
      status,
      code,
      description,
      quantityUnit
    );
    if (res.success) {
      message.success("Thêm mới khoản thu thành công");
      fetchRevenueItems();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const handleUpdate = async () => {
    const res = await updateRevenueItemApi(
      updateIdRevenueItem,
      name,
      unitPrice,
      category,
      status,
      description,
      quantityUnit
    );
    if (res.success) {
      message.success("Cập nhật khoản thu thành công");
      fetchRevenueItems();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const deleteRevenueItem = async (id: number) => {
    const res = await deleteRevenueItemApi(id);
    if (res.success) {
      message.success("Xóa khoản thu thành công");
      fetchRevenueItems();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8 bg-white rounded-xl shadow-lg p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Quản Lý Khoản Thu
            </h1>
            <p className="text-gray-600">
              Quản lý các khoản thu phí của chung cư
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <i className="fas fa-plus"></i>
            <span>Tạo Khoản Thu</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách khoản thủ
            </h2>
            <p className="text-gray-600 mt-1">
              Tổng số:{" "}
              <span id="totalCount" className="font-medium text-blue-600">
                {revenueItems.length}
              </span>{" "}
              khoản thu
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Khoản Thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã Khoản Thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thu Theo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô Tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              {revenueItems.map((revenueItem, index) => {
                const statusColor =
                  revenueItem.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800";

                const categoryColor =
                  revenueItem.category === "mandatory"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800";

                return (
                  <tbody
                    className="bg-white divide-y divide-gray-200"
                    id="feeTableBody"
                  >
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {revenueItem.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {revenueItem.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {revenueItem.unitPrice.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {convertUnit(revenueItem.quantityUnit)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {revenueItem.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium ${categoryColor}  rounded-full`}
                        >
                          {revenueItem.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium ${statusColor}  rounded-full`}
                        >
                          {revenueItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 transition"
                          onClick={() => openEditForm(index)}
                          title="Sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <Popconfirm
                          title="Xóa khoản thu"
                          description="Bạn có chắc chắn muốn xóa khoản thu này không?"
                          onConfirm={() => deleteRevenueItem(revenueItem.id)}
                          okText="Có"
                          cancelText="Không"
                        >
                          <button className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition">
                            <i className="fas fa-trash"></i>
                          </button>
                        </Popconfirm>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editIndex !== null ? "Sửa Khoản Thu" : "Thêm Khoản Thu"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="grid grid-cols-2 gap-4">
              {/* Tên khoản thu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khoản thu
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Mã khoản thu */}
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 `}
                >
                  Mã khoản thu
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={editIndex !== null} // ✅ đúng cách
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              {/* Đơn giá */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn giá
                </label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) =>
                    setUnitPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Đơn vị tính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tính
                </label>
                <input
                  type="text"
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Loại khoản thu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại khoản thu
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn loại</option>
                  <option value="mandatory">Bắt buộc</option>
                  <option value="voluntary">Tự nguyện</option>
                </select>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>

              {/* Mô tả */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </form>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {editIndex !== null ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Revenue;
