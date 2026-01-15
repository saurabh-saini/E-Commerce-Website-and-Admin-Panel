import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { handleApiError } from "../../utils/handleApiError";

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
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  paidAt?: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
};

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleCancelOrder = async () => {
    if (!order) return;

    const confirm = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirm) return;

    try {
      await api.put(`/orders/${order._id}/cancel`);

      alert("Order cancelled successfully");

      // Refresh order
      window.location.reload();
    } catch (error) {
      handleApiError(error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading invoice...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Invoice</h1>

        <button
          onClick={() => navigate("/orders")}
          className="text-blue-600 hover:underline"
        >
          Back to Orders
        </button>
      </div>

      {/* STATUS */}
      <div className="flex justify-between border p-4 rounded">
        <div>
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-medium">{order._id}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Payment Status</p>
          <p
            className={`font-medium ${
              order.paymentStatus === "paid" ? "text-green-600" : "text-red-500"
            }`}
          >
            {order.paymentStatus}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Order Status</p>
          <p className="font-medium text-blue-600">{order.orderStatus}</p>
        </div>

        <div className="flex gap-3">
          {/* PAY NOW BUTTON */}
          {order.paymentStatus === "pending" && (
            <button
              onClick={() => navigate(`/payment?orderId=${order._id}`)}
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            >
              Pay Now
            </button>
          )}

          {/* CANCEL BUTTON */}
          {order.orderStatus === "placed" && (
            <button
              onClick={handleCancelOrder}
              className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* SHIPPING */}
      <div className="border p-4 rounded space-y-1">
        <h2 className="font-semibold mb-2">Shipping Address</h2>

        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.phone}</p>
        <p>
          {order.shippingAddress.address}, {order.shippingAddress.city}
        </p>
        <p>{order.shippingAddress.pincode}</p>
      </div>

      {/* ITEMS */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-3">Ordered Items</h2>

        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-3">
          <span>Total</span>
          <span className="text-blue-600">₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}
