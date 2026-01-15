import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle } from "lucide-react";
import { clearCart } from "../../store/slices/cartSlice";

export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ==========================
      Clear Cart After Order
  ========================== */

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center space-y-5">
        {/* SUCCESS ICON */}
        <CheckCircle size={70} className="mx-auto text-green-500" />

        {/* TITLE */}
        <h1 className="text-2xl font-bold">Order Placed Successfully 🎉</h1>

        {/* ORDER ID */}
        <p className="text-gray-600 text-sm">
          Order ID:
          <span className="font-medium ml-1">{id}</span>
        </p>

        {/* MESSAGE */}
        <p className="text-gray-500 text-sm">
          Thank you for shopping with us. Your order is being processed.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/home", { replace: true })}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate(`/orders/${id}`)}
            className="border py-2 rounded hover:bg-gray-100"
          >
            View Order Details
          </button>
        </div>
      </div>
    </div>
  );
}
