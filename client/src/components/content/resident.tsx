import {
  createResidentApi,
  deleteResidentApi,
  getAllResidentApi,
  getAllRooms,
  updateResidentApi,
} from "@/services/api";
import {
  App,
  Descriptions,
  Drawer,
  Pagination,
  Popconfirm,
  type DescriptionsProps,
} from "antd";
import React, { useDebugValue, useEffect, useState } from "react";

const Resident = () => {
  const [showModal, setShowModal] = useState(false);

  // Dummy data, bạn thay bằng API thực tế
  const [residents, setResidents] = useState<IResident[]>([]);
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

  // search resident
  const [searchName, setSearchName] = useState<string>("");
  const [searchRoom, setSearchRoom] = useState<string>("");
  const [searchIdCard, setSearchIdCard] = useState<string>("");

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchResidents = async () => {
    const res = await getAllResidentApi({
      searchName: searchName,
      searchRoom: searchRoom,
      searchIdCard: searchIdCard,
      page: String(page),
      limit: "20",
    });

    console.log("res data search", res);
    if (res.success && res.data) {
      setResidents(res.data.results);
      setTotal(res.data.meta.total);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, [page]);

  useEffect(() => {
    const fetchFloor = async () => {
      const res = await getAllRooms();
      console.log(res);
      if (res.success && res.data) {
        setApartments(res.data);
      }
    };
    fetchFloor();
  }, []);

  const { message, notification, modal } = App.useApp();

  const [modalDetailResident, setModalDetailResident] =
    useState<boolean>(false);

  const [detailResident, setDetailResident] = useState<IResident>();

  const openAddModal = () => {
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
    const updateResident = residents[index];
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
      setApartment(updateResident.roomNumber);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

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
      fetchResidents();
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
      message.success("Cập nhật thành viên thành công");
      fetchResidents();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const deleteResident = async (id: number) => {
    const res = await deleteResidentApi(id);
    if (res.success) {
      message.success("Xóa thành viên thành công");
      fetchResidents();
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

  const handleSearch = () => {
    console.log("search");
    console.log("search", searchName, searchRoom, searchIdCard);
    fetchResidents();
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
    <>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏢 Quản Lý Cư Dân
          </h1>
          <p className="text-gray-600">
            Hệ thống quản lý thông tin cư dân chung cư
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Section */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative">
                <input
                  type="text"
                  id="searchName"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Tìm theo tên..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="searchRoom"
                placeholder="Số phòng..."
                value={searchRoom}
                onChange={(e) => setSearchRoom(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                id="searchId"
                placeholder="Căn cước..."
                value={searchIdCard}
                onChange={(e) => setSearchIdCard(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Thêm cư dân mới
            </button>
          </div>
        </div>

        {/* Residents Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách cư dân
            </h2>
            <p className="text-gray-600 mt-1">
              Tổng số:{" "}
              <span id="totalCount" className="font-medium text-blue-600">
                {residents.length}
              </span>{" "}
              cư dân
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ và tên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày sinh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giới tính
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Căn cước
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Căn hộ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quan hệ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại cư trú
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {residents.map((r, index) => {
                  const statusColor =
                    r.status === "living"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800";

                  return (
                    <tr key={r.id}>
                      <td
                        className="px-6 py-4 text-sm font-medium text-gray-900 cursor-pointer"
                        onClick={() => {
                          setModalDetailResident(true);
                          setDetailResident(r);
                        }}
                      >
                        {r.fullName}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(r.dateOfBirth).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4">{convertGender(r.gender)}</td>
                      <td className="px-6 py-4">{r.phone}</td>
                      <td className="px-6 py-4">{r.idCardNumber}</td>
                      <td className="px-6 py-4">{r.roomNumber}</td>
                      <td className="px-6 py-4">
                        {convertRelationship(r.relationshipToOwner)}
                      </td>
                      <td className="px-6 py-4">
                        {convertResidenceStatus(r.residenceStatus)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                        >
                          <i className="fas fa-circle text-xs mr-1"></i>
                          {r.status === "living" ? "Đang ở" : "Không ở"}
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
                          title="Xóa cư dân"
                          description="Bạn có chắc chắn muốn xóa cư dân này không?"
                          onConfirm={() => deleteResident(r.id)}
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

                {residents.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">
                      Không có cư dân nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          defaultCurrent={1}
          align="center"
          total={total}
          style={{ marginTop: 20 }}
          pageSize={20}
          showSizeChanger={false}
          onChange={(page, pageSize) => {
            setPage(page);
          }}
        />
      </div>

      {/* Add/Edit Modal */}
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
        title="Chi tiết cư dân"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setModalDetailResident(false)}
        open={modalDetailResident}
        width={"50vw"}
      >
        <Descriptions
          column={2}
          bordered
          title="Thông tin cư dân"
          items={items}
        />
        ;
      </Drawer>
    </>
  );
};

export default Resident;
