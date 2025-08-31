import {
  createVehicleApi,
  deleteVehicleApi,
  getVehiclesApi,
  updateVehicleApi,
} from "@/services/api";
import { App, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const Vehicle = () => {
  const { roomNumber } = useParams();
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // tách state riêng lẻ
  const [type, setType] = useState<string>("");
  const [plateNumber, setPlateNumber] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [registrationDate, setRegistrationDate] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const { message, notification, modal } = App.useApp();

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await getVehiclesApi(roomNumber as string);
      if (res.success) {
        setVehicles(res?.data ?? []);
      }
    };
    fetchVehicles();
  }, [roomNumber]);

  // reset khi thêm mới
  const openAddForm = () => {
    setEditIndex(null);
    setType("");
    setPlateNumber("");
    setBrand("");
    setColor("");
    setRegistrationDate("");
    setNote("");
    setIsActive(true);
    setShowModal(true);
  };

  // nạp dữ liệu khi sửa
  const openEditForm = (index: number) => {
    const v = vehicles[index];
    setEditIndex(index);
    setType(v.type);
    setPlateNumber(v.plateNumber);
    setBrand(v.brand);
    setColor(v.color);
    setRegistrationDate(
      new Date(v.registrationDate).toISOString().split("T")[0]
    ); // convert về yyyy-MM-dd
    setNote(v.note);
    setIsActive(v.isActive);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAdd = async () => {
    const res = await createVehicleApi(
      roomNumber as string,
      plateNumber,
      type,
      brand,
      color,
      registrationDate,
      isActive,
      note
    );
    if (res.success && res.data) {
      console.log(res);
      message.success("Thêm mới phương tiện thành công");
      setVehicles((prev) => [...prev, res.data as IVehicle]);
    } else {
      notification.error({
        description: res.message,
        message: "Có lỗi xảy ra",
      });
    }
  };

  const handleUpdate = async () => {
    const date = new Date(registrationDate);
    const res = await updateVehicleApi(
      plateNumber,
      type,
      brand,
      color,
      date,
      isActive,
      note,
      roomNumber as string
    );
    if (res.success && res.data) {
      message.success("Update phương tiện thành công");

      const updatedVehicles = vehicles.map((item) =>
        item.plateNumber === plateNumber ? (res.data as IVehicle) : item
      );

      setVehicles(updatedVehicles);
    } else {
      notification.error({
        description: res.message,
        message: "Có lỗi xảy ra",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Edit
      await handleUpdate();
    } else {
      // Add
      await handleAdd();
    }
    setShowModal(false);
  };

  const deleteVehicle = async (plateNumber: string) => {
    const res = await deleteVehicleApi(plateNumber);
    if (res.success) {
      message.success("Xóa phương tiện thành công");
      const newVehicles = vehicles.filter(
        (item) => item.plateNumber !== plateNumber
      );
      setVehicles(newVehicles);
    } else {
      notification.error({
        description: res.message,
        message: "Có lỗi xảy ra",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <i className="fas fa-car text-blue-600 mr-3"></i>
          Quản lý phương tiện phòng {roomNumber}
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin các phương tiện đã đăng ký
        </p>
      </div>

      {/* Add Vehicle Button */}
      <div className="mb-6">
        <button
          onClick={openAddForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <i className="fas fa-plus mr-2"></i>
          Thêm phương tiện mới
        </button>
      </div>

      {/* Vehicle Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại xe
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biển số
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hãng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Màu
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((v, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{v.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {v.plateNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{v.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{v.color}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(v.registrationDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{v.note}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        v.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {v.isActive ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditForm(idx)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <Popconfirm
                      title="Xóa phương tiện"
                      description="Bạn có chắc chắn muốn xóa phương tiện này không?"
                      onConfirm={() => deleteVehicle(v.plateNumber)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button className="text-red-600 hover:text-red-900">
                        <i className="fas fa-trash"></i>
                      </button>
                    </Popconfirm>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Không có phương tiện nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editIndex !== null
                  ? "Sửa phương tiện"
                  : "Thêm phương tiện mới"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại xe
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn loại xe</option>
                  <option value="car">Ô tô</option>
                  <option value="motorbike">Xe máy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biển số
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hãng
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Màu
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày đăng ký
                </label>
                <input
                  type="date"
                  value={registrationDate}
                  onChange={(e) => setRegistrationDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Tạm ngưng</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicle;
