import { Popconfirm } from "antd";
import { useEffect, useState } from "react";

interface IHouseholdPayment {
  id: string;
  householdName: string;
  totalDue: number;
  totalPaid: number;
  payDate?: string;
  note?: string;
  status: "paid" | "unpaid" | "partial";
}

const DetailCollectionPeriod = () => {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<IHouseholdPayment | null>(null);

  const [payments, setPayments] = useState<IHouseholdPayment[]>([]);

  // state form
  const [householdName, setHouseholdName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");

  const fakeData: IHouseholdPayment[] = [
    {
      id: "1",
      householdName: "Phòng 1001",
      totalDue: 2000000,
      totalPaid: 2000000,
      payDate: "2025-08-01",
      note: "Thanh toán phí quý 3/2025",
      status: "paid",
    },
    {
      id: "2",
      householdName: "Phòng 1002",
      totalDue: 2000000,
      totalPaid: 1000000,
      payDate: "2025-08-10",
      note: "Đóng một phần",
      status: "partial",
    },
    {
      id: "3",
      householdName: "Phòng 1003",
      totalDue: 2000000,
      totalPaid: 0,
      payDate: undefined,
      note: "Chưa thanh toán",
      status: "unpaid",
    },
  ];

  useEffect(() => {
    setPayments(fakeData);
  }, []);

  const resetForm = () => {
    setHouseholdName("");
    setAmount("");
    setNote("");
    setEditData(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: IHouseholdPayment) => {
    setEditData(item);
    setHouseholdName(item.householdName);
    setAmount(item.totalPaid);
    setNote(item.note || "");
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editData) {
      // update
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editData.id
            ? { ...p, householdName, totalPaid: Number(amount), note }
            : p
        )
      );
    } else {
      // add new
      const newItem: IHouseholdPayment = {
        id: Date.now().toString(),
        householdName,
        totalDue: 2000000,
        totalPaid: Number(amount),
        payDate: new Date().toISOString().split("T")[0],
        note,
        status:
          Number(amount) >= 2000000
            ? "paid"
            : Number(amount) > 0
            ? "partial"
            : "unpaid",
      };
      setPayments((prev) => [...prev, newItem]);
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="text-green-600 font-medium">Đã đóng</span>;
      case "partial":
        return (
          <span className="text-yellow-600 font-medium">Đóng một phần</span>
        );
      case "unpaid":
        return <span className="text-red-600 font-medium">Chưa đóng</span>;
      default:
        return <span>-</span>;
    }
  };

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8 bg-white rounded-xl shadow-lg p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Các hộ đã đóng Quý 3/2025
            </h1>
            <p className="text-gray-600">
              Thống kê các hộ đã đóng đợt thu này của chung cư
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <i className="fas fa-plus"></i>
            <span>Thu phí</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách các hộ
            </h2>
            <p className="text-gray-600 mt-1">
              Tổng số:{" "}
              <span id="totalCount" className="font-medium text-blue-600">
                {payments.length}
              </span>{" "}
              hộ
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên hộ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã đóng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đóng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {item.householdName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                      {item.payDate || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.note}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {renderStatus(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 transition"
                        onClick={() => openEditModal(item)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <Popconfirm
                        title="Xóa khoản thu"
                        description="Bạn có chắc chắn muốn xóa khoản thu này không?"
                        onConfirm={() => handleDelete(item.id)}
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
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editData ? "Sửa Khoản Thu" : "Thêm Khoản Thu"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="grid grid-cols-1 gap-4">
              {/* Hộ gia đình */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hộ gia đình
                </label>
                <input
                  type="text"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder="Ví dụ: Phòng 1005"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Số tiền */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền đã đóng
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
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
                {editData ? "Cập nhật" : "Ghi nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailCollectionPeriod;
