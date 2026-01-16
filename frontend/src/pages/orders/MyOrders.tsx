import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { handleApiError } from "../../utils/handleApiError";

/* ======================
      TYPES
====================== */

type Order = {
  _id: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

type OrderResponse = {
  orders: Order[];
  totalPages: number;
  currentPage: number;
};

/* ======================
      COMPONENT
====================== */

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  /* ======================
      FETCH ORDERS
  ====================== */

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await api.get<OrderResponse>(
          `/orders/my?page=${page}&limit=3`
        );

        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  /* ======================
      UI STATES
  ====================== */

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-xl font-semibold">No orders found</h2>

        <button
          onClick={() => navigate("/home")}
          className="text-blue-600 hover:underline mt-2"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  /* ======================
      MAIN UI
  ====================== */

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* ORDER LIST */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4 items-center"
          >
            {/* LEFT INFO */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Order ID: {order._id}</p>

              <p className="font-semibold">₹{order.totalAmount}</p>

              <p className="text-sm">
                Payment:
                <span
                  className={`ml-1 font-medium ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>

              <p className="text-sm">
                Status:
                <span className="ml-1 font-medium text-blue-600">
                  {order.orderStatus}
                </span>
              </p>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex gap-4">
              {order.paymentStatus === "pending" && (
                <button
                  onClick={() => navigate(`/payment?orderId=${order._id}`)}
                  className="text-green-600 font-medium"
                >
                  Pay Now
                </button>
              )}

              <button
                onClick={() => navigate(`/orders/${order._id}`)}
                className="text-blue-600 hover:underline"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-5 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
