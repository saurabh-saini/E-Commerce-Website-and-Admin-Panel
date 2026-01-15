import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { handleApiError } from "../../utils/handleApiError";

type Order = {
  _id: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get<Order[]>("/orders/my");
        setOrders(res.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            {/* LEFT */}
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

            {/* RIGHT */}
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
        ))}
      </div>
    </div>
  );
}
