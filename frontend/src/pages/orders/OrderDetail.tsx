import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { handleApiError } from "../../utils/handleApiError";
import { toast } from "react-toastify";

/* ---------------- TYPES ---------------- */

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type ShippingAddress = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

/* ---------------- COMPONENT ---------------- */

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  /* ---------------- FETCH ORDER ---------------- */

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await api.get<Order>(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /* ---------------- CANCEL ORDER ---------------- */

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCancelLoading(true);

      await api.put(`/orders/${order._id}/cancel`);

      toast.success("Order cancelled successfully");

      // Refresh page data
      const res = await api.get<Order>(`/orders/${order._id}`);
      setOrder(res.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setCancelLoading(false);
    }
  };

  /* ---------------- UI STATES ---------------- */

  if (loading) {
    return <div className="p-6">Loading order...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-6)}</h1>

        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* STATUS */}
      <div className="border p-4 rounded flex justify-between">
        <div>
          <p>
            <span className="font-semibold">Order Status:</span>{" "}
            <span className="capitalize">{order.orderStatus}</span>
          </p>

          <p>
            <span className="font-semibold">Payment:</span>{" "}
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

        {/* CANCEL BUTTON */}
        {order.orderStatus === "placed" && (
          <button
            disabled={cancelLoading}
            onClick={handleCancelOrder}
            className={`px-4 py-2 rounded text-white
              ${cancelLoading ? "bg-red-300" : "bg-red-500 hover:bg-red-600"}`}
          >
            {cancelLoading ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      {/* SHIPPING */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Shipping Address</h2>

        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.phone}</p>
        <p>
          {order.shippingAddress.address}, {order.shippingAddress.city}
        </p>
        <p>{order.shippingAddress.pincode}</p>
      </div>

      {/* ITEMS */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Items</h2>

        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between py-2 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>

            <p className="font-semibold">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="text-right text-xl font-bold">
        Total: ₹{order.totalAmount}
      </div>
    </div>
  );
}
