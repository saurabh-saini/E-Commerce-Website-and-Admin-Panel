import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState, AppDispatch } from "../store";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../store/slices/cartSlice";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items } = useSelector((state: RootState) => state.cart);

  // 🧮 Total cart value
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* =====================
     EMPTY CART UI
  ===================== */

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>

        <button
          onClick={() => navigate("/home")}
          className="text-blue-600 hover:underline"
        >
          Go shopping
        </button>
      </div>
    );
  }

  /* =====================
        MAIN UI
  ===================== */

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row justify-between gap-4 items-center border rounded p-4"
          >
            {/* PRODUCT INFO */}
            <div>
              <h3 className="font-medium">{item.name}</h3>

              <p className="text-sm text-gray-500">Price: ₹{item.price}</p>

              <p className="font-semibold text-blue-600">
                Subtotal: ₹{item.price * item.quantity}
              </p>
            </div>

            {/* QUANTITY CONTROL */}
            <div className="flex items-center gap-3">
              <button
                disabled={item.quantity === 1}
                onClick={() => dispatch(decreaseQty(item._id))}
                className={`px-3 py-1 border rounded
                  ${
                    item.quantity === 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
              >
                −
              </button>

              <span className="font-medium">{item.quantity}</span>

              <button
                onClick={() => dispatch(increaseQty(item._id))}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* REMOVE BUTTON */}
            <button
              onClick={() => dispatch(removeFromCart(item._id))}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* SUMMARY BAR */}
      <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold">
          Total:
          <span className="text-blue-600 ml-1">₹{total}</span>
        </h2>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
