import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/admin/products")}
          className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
        >
          <h3 className="font-semibold text-lg">Manage Products</h3>
          <p className="text-gray-500 text-sm">
            Add / Update / Delete Products
          </p>
        </div>

        <div
          onClick={() => navigate("/admin/orders")}
          className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
        >
          <h3 className="font-semibold text-lg">Manage Orders</h3>
          <p className="text-gray-500 text-sm">View & Update Orders</p>
        </div>
      </div>
    </div>
  );
}
