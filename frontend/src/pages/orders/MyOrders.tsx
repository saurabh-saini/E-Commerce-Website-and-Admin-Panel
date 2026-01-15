import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [loading, setLoading] = useState<boolean>(true);

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
    return <div className="p-6">No orders found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 rounded shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-medium">Order ID: {order._id.slice(-6)}</p>

            <p className="text-sm text-gray-600">
              Status:{" "}
              <span className="capitalize font-semibold">
                {order.orderStatus}
              </span>
            </p>

            <p className="text-sm text-gray-600">
              Payment:{" "}
              <span
                className={`font-semibold ${
                  order.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-blue-600">₹{order.totalAmount}</p>

            <Link
              to={`/orders/${order._id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              View Details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
