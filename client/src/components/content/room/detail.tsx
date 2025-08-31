import {
  createResidentApi,
  deleteResidentApi,
  getAllRooms,
  getFloorsApi,
  getResidentById,
  getRoomDetailApi,
  updateResidentApi,
} from "@/services/api";
import { App, Drawer, Empty, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

const RoomDetail = () => {
  const navigate = useNavigate();
  // Dummy handler, bạn nên thay bằng logic thực tế
  const goBack = () => {
    window.history.back();
  };
  const manageVehicles = () => {
    console.log(roomNumber);
    navigate(`/room/vehicle/${roomNumber}`);
  };
  const callEmergency = (phone: string) => {
    alert(`Gọi ${phone}`);
  };

  const { roomNumber } = useParams();
  const [roomDetails, setRoomDetails] = useState<IFetchRoomDetail>();

  const fetchDetails = async () => {
    const res = await getRoomDetailApi(roomNumber as string);
    if (res.data) {
      setRoomDetails(res.data);
      // Xử lý dữ liệu chi tiết căn hộ ở đây
    } else {
      console.error("Failed to fetch room details");
    }
  };

  useEffect(() => {
    if (roomNumber) {
      fetchDetails();
    }
  }, [roomNumber]);

  const convertRelationship = (relation: string) => {
    switch (relation) {
      case "owner":
        return "Chủ hộ";
      case "spouse":
        return "Vợ";
      case "child":
        return "Con";
      default:
        return "Khác";
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [placeOfBirth, setPlaceOfBirth] = useState<string>("");
  const [homeTown, setHomeTown] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [ethnicity, setEthnicity] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [idCardNumber, setIdCardNumber] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [residenceStatus, setResidenceStatus] = useState<string>("");
  const [apartment, setApartment] = useState<string>("");
  const [relationshipToOwner, setRelationshipToOwner] = useState<string>("");
  const [updateId, setUpdateId] = useState<string>("");

  const [apartments, setApartments] = useState<IRoom[]>([]);

  useEffect(() => {
    const fetchFloor = async () => {
      const res = await getAllRooms();
      console.log(res);
      if (res.success && res.data) {
        setApartments(res.data);
      }
    };
    fetchFloor();
    setApartment(roomNumber as string);
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const { message, notification, modal } = App.useApp();

  const [modalDetailResident, setModalDetailResident] =
    useState<boolean>(false);

  const handleAdd = async () => {
    const res = await createResidentApi(
      fullName,
      dateOfBirth,
      placeOfBirth,
      ethnicity,
      occupation,
      homeTown,
      idCardNumber,
      residenceStatus,
      phone,
      gender,
      relationshipToOwner,
      apartment,
      "living"
    );
    console.log("res<<<", res);
    if (res.success) {
      message.success("Thêm mới thành viên thành công");
      fetchDetails();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const handleUpdate = async () => {
    const res = await updateResidentApi(
      updateId,
      fullName,
      dateOfBirth,
      placeOfBirth,
      ethnicity,
      occupation,
      homeTown,
      idCardNumber,
      residenceStatus,
      phone,
      gender,
      relationshipToOwner,
      apartment
    );
    console.log("res<<<", res);
    if (res.success) {
      message.success("Thêm mới thành viên thành công");
      fetchDetails();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
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

  const openAddForm = () => {
    setEditIndex(null);
    setFullName("");
    setDateOfBirth("");
    setPlaceOfBirth("");
    setEthnicity("");
    setGender("");
    setHomeTown("");
    setIdCardNumber("");
    setOccupation("");
    setPhone("");
    setRelationshipToOwner("");
    setResidenceStatus("");
    setShowModal(true);
  };

  const openEditForm = (index: number) => {
    setEditIndex(index);
    const updateResident = roomDetails?.residents[index];
    if (updateResident) {
      setUpdateId(updateResident.id.toString());
      setFullName(updateResident?.fullName);
      setDateOfBirth(
        new Date(updateResident.dateOfBirth).toISOString().split("T")[0]
      );
      setPlaceOfBirth(updateResident?.placeOfBirth);
      setEthnicity(updateResident?.ethnicity);
      setGender(updateResident?.gender);
      setHomeTown(updateResident?.hometown);
      setIdCardNumber(updateResident?.idCardNumber);
      setOccupation(updateResident?.occupation);
      setPhone(updateResident?.phone);
      setRelationshipToOwner(updateResident?.relationshipToOwner);
      setResidenceStatus(updateResident?.residenceStatus);
    }
    setShowModal(true);
  };

  const deleteResident = async (id: number) => {
    const res = await deleteResidentApi(id);
    if (res.success) {
      message.success("Xóa thành viên thành công");
      fetchDetails();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const [detailResident, setDetailResident] = useState<IResident>();
  const getInfoResident = async (id: number) => {
    const res = await getResidentById(id);
    console.log(res);
    if (res.success) {
      setDetailResident(res.data);
    }
  };

  // Giới tính
  const convertGender = (gender?: string) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return "";
    }
  };

  // Loại cư trú
  const convertResidenceStatus = (status?: string) => {
    switch (status) {
      case "permanent":
        return "Thường trú";
      case "temporary":
        return "Tạm trú";
      default:
        return "";
    }
  };

  const items: DescriptionsProps["items"] = [
    { label: "Họ tên", children: detailResident?.fullName ?? "" },
    {
      label: "Ngày sinh",
      children: detailResident?.dateOfBirth
        ? new Date(detailResident.dateOfBirth).toISOString().split("T")[0]
        : "",
    },
    { label: "Nơi sinh", children: detailResident?.placeOfBirth ?? "" },
    { label: "Quê quán", children: detailResident?.hometown ?? "" },
    { label: "Nghề nghiệp", children: detailResident?.occupation ?? "" },
    { label: "Dân tộc", children: detailResident?.ethnicity ?? "" },
    { label: "Số điện thoại", children: detailResident?.phone ?? "" },
    {
      label: "Căn cước công dân",
      children: detailResident?.idCardNumber ?? "",
    },
    { label: "Giới tính", children: convertGender(detailResident?.gender) },
    {
      label: "Loại cư trú",
      children: convertResidenceStatus(detailResident?.residenceStatus),
    },
    { label: "Căn hộ", children: detailResident?.roomNumber ?? "" },
    {
      label: "Quan hệ với chủ hộ",
      children: convertRelationship(
        detailResident?.relationshipToOwner as string
      ),
    },
  ];

  return (
    <div>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <i className="fas fa-arrow-left text-xl"></i>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chi tiết căn hộ {roomDetails?.room.room_number}
                </h1>
                <p className="text-sm text-gray-500">Chung cư Sunrise Tower</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <i className="fas fa-circle text-xs mr-2"></i>
                {roomDetails?.room.status === "occupied"
                  ? "Đang sinh hoạt"
                  : "Chưa sinh hoạt"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {roomDetails?.room.status === "occupied" ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột trái - Thông tin chính */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thông tin chủ hộ */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <i className="fas fa-user-tie mr-3"></i>
                    Thông tin chủ hộ
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      NV
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {roomDetails?.owner.fullName || ""}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                          <i className="fas fa-phone w-5 text-blue-500 mr-3"></i>
                          <span>{roomDetails?.owner.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <i className="fa-solid fa-mars-stroke w-5 text-blue-500 mr-3"></i>
                          <span>
                            {roomDetails?.owner.gender === "male"
                              ? "Nam"
                              : "Nữ"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <i className="fas fa-id-card w-5 text-blue-500 mr-3"></i>
                          <span>{roomDetails?.owner.idCardNumber}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <i className="fas fa-calendar w-5 text-blue-500 mr-3"></i>
                          <span>
                            {roomDetails?.owner?.dateOfBirth
                              ? new Date(
                                  roomDetails.owner.dateOfBirth
                                ).toLocaleDateString("vi-VN")
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Thông tin căn hộ */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <i className="fas fa-home mr-3"></i>
                    Thông tin căn hộ
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Mã căn hộ:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {roomDetails?.room.room_number || "P000"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Tầng:</span>
                        <span className="text-gray-900 font-semibold">
                          {roomDetails?.room.floor}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Diện tích:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {roomDetails?.room.area} m²
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Loại căn hộ:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          2PN + 2WC
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Ngày nhận nhà:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          15/06/2022
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Trạng thái:
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {roomDetails?.room.status === "occupied"
                            ? "Đang sinh hoạt"
                            : "Chưa sinh hoạt"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Số phương tiện:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {(Number(roomDetails?.countVehicles?.car) || 0) +
                            (Number(roomDetails?.countVehicles?.motorbike) ||
                              0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Hướng ban công:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          Đông Nam
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Bảng thông tin cư dân */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden col-span-2">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <i className="fas fa-users mr-3"></i>
                    Danh sách cư dân đang sinh hoạt
                  </h2>
                  <button
                    className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-50 transition"
                    onClick={openAddForm}
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Thêm thành viên
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Họ và tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày sinh
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CCCD/CMND
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {roomDetails?.residents.map((resident, index) => {
                        const initials = resident.fullName
                          .split(" ")
                          .map((word) => word[0]?.toUpperCase())
                          .join("")
                          .slice(0, 2);

                        const avatarColor =
                          resident.gender === "male"
                            ? "from-blue-500 to-blue-600"
                            : "from-pink-500 to-pink-600";

                        const statusColor =
                          resident.status === "living"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800";

                        return (
                          <tr
                            key={resident.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  className={`w-10 h-10 bg-gradient-to-br ${avatarColor} rounded-full flex items-center justify-center text-white text-sm font-bold mr-3`}
                                >
                                  {initials}
                                </div>
                                <div>
                                  <div
                                    className="text-sm font-medium text-gray-900 cursor-pointer"
                                    onClick={() => {
                                      setModalDetailResident(true);
                                      getInfoResident(resident.id);
                                    }}
                                  >
                                    {resident.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {convertRelationship(
                                      resident.relationshipToOwner
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(
                                resident.dateOfBirth
                              ).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {resident.idCardNumber || "Chưa có"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                              >
                                <i className="fas fa-circle text-xs mr-1"></i>
                                {resident.status === "living"
                                  ? "Đang ở"
                                  : "Không ở"}
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
                                title="Xóa thành viên"
                                description="Bạn có chắc chắn muốn xóa thành viên này không?"
                                onConfirm={() => deleteResident(resident.id)}
                                okText="Có"
                                cancelText="Không"
                              >
                                <button className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition">
                                  <i className="fas fa-trash"></i>
                                </button>
                              </Popconfirm>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Cột phải - Thông tin bổ sung */}
            <div className="space-y-6">
              {/* Nút quản lý phương tiện */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-car text-orange-500 mr-3"></i>
                    Quản lý phương tiện
                  </h3>
                  <button
                    onClick={manageVehicles}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-cogs mr-2"></i>
                    Quản lý phương tiện
                  </button>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                        <span>Xe máy đăng ký:</span>
                        <span className="font-semibold text-gray-900">
                          {roomDetails?.countVehicles.motorbike}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ô tô đăng ký:</span>
                        <span className="font-semibold text-gray-900">
                          {roomDetails?.countVehicles.car}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Xe đạp đăng ký:</span>
                        <span className="font-semibold text-gray-900">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ khẩn cấp */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <i className="fas fa-phone-alt mr-3"></i>
                    Liên hệ khẩn cấp
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Ban quản lý
                      </div>
                      <div className="text-sm text-gray-600">024.3456.7890</div>
                    </div>
                    <button
                      onClick={() => callEmergency("024.3456.7890")}
                      className="text-red-600 hover:text-red-700"
                    >
                      <i className="fas fa-phone text-lg"></i>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Bảo vệ
                      </div>
                      <div className="text-sm text-gray-600">024.3456.7891</div>
                    </div>
                    <button
                      onClick={() => callEmergency("024.3456.7891")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <i className="fas fa-phone text-lg"></i>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Kỹ thuật
                      </div>
                      <div className="text-sm text-gray-600">024.3456.7892</div>
                    </div>
                    <button
                      onClick={() => callEmergency("024.3456.7892")}
                      className="text-green-600 hover:text-green-700"
                    >
                      <i className="fas fa-phone text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 100 }}>
          <Empty description={"Căn hộ này đang trống"} />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editIndex !== null ? "Sửa thông tin cư dân" : "Thêm cư dân"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="grid grid-cols-2 gap-4">
              {/* Họ và tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Nơi sinh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nơi sinh
                </label>
                <input
                  type="text"
                  value={placeOfBirth}
                  onChange={(e) => setPlaceOfBirth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Quê quán */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quê quán
                </label>
                <input
                  type="text"
                  value={homeTown}
                  onChange={(e) => setHomeTown(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Nghề nghiệp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nghề nghiệp
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Dân tộc */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dân tộc
                </label>
                <input
                  type="text"
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Căn cước */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Căn cước
                </label>
                <input
                  type="text"
                  value={idCardNumber}
                  onChange={(e) => setIdCardNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              {/* Loại cư trú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại cư trú
                </label>
                <select
                  value={residenceStatus}
                  onChange={(e) => setResidenceStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn loại cư trú</option>
                  <option value="permanent">Thường trú</option>
                  <option value="temporary">Tạm trú</option>
                </select>
              </div>

              {/* Căn hộ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Căn hộ
                </label>
                <select
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn căn hộ</option>
                  {apartments.map((a, index) => (
                    <option key={index} value={a.room_number}>
                      {a.room_number}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quan hệ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quan hệ
                </label>
                <select
                  value={relationshipToOwner}
                  onChange={(e) => setRelationshipToOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn quan hệ</option>
                  <option value="owner">Chủ hộ</option>
                  <option value="spouse">Vợ / Chồng</option>
                  <option value="child">Con</option>
                  <option value="parent">Bố mẹ của chủ hộ</option>
                  <option value="other">Khác</option>
                </select>
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
                form="resident-form"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {editIndex !== null ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Drawer
        title="Chi tiết thành viên"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setModalDetailResident(false)}
        open={modalDetailResident}
        width={"50vw"}
      >
        <Descriptions
          column={2}
          bordered
          title="Thông tin thành viên"
          items={items}
        />
        ;
      </Drawer>
    </div>
  );
};

export default RoomDetail;
