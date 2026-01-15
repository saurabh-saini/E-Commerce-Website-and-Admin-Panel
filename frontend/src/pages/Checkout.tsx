import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import api from "../services/api";
import type { RootState } from "../store";

type AddressForm = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressForm>();

  // 🧮 Total calculation
  const total = items.reduce(
    (sum: number, item) => sum + item.price * item.quantity,
    0
  );

  // 🟡 Guard: empty cart
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

  /* ========================
      CREATE ORDER API
  ======================== */

  const onSubmit = async (data: AddressForm) => {
    try {
      const payload = {
        items: items.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),

        shippingAddress: {
          name: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          pincode: data.pincode,
        },

        totalAmount: total,
      };

      const res = await api.post("/orders", payload);

      toast.success("Order created successfully");

      // 🔥 Redirect to payment with orderId
      navigate("/payment", {
        state: { orderId: res.data.orderId },
      });
    } catch (error) {
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: ADDRESS */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Shipping Address</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            {...register("fullName", {
              required: "Full name is required",
            })}
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}

          <input
            {...register("phone", {
              required: "Phone number is required",
              minLength: {
                value: 10,
                message: "Invalid phone number",
              },
            })}
            placeholder="Phone Number"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}

          <textarea
            {...register("address", {
              required: "Address is required",
            })}
            placeholder="Full Address"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input
              {...register("city", {
                required: "City is required",
              })}
              placeholder="City"
              className="w-full border px-3 py-2 rounded"
            />

            <input
              {...register("pincode", {
                required: "Pincode is required",
                minLength: {
                  value: 6,
                  message: "Invalid pincode",
                },
              })}
              placeholder="Pincode"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className={`w-full py-3 rounded text-white
              ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting ? "Creating Order..." : "Continue to Payment"}
          </button>
        </form>
      </div>

      {/* RIGHT: ORDER SUMMARY */}
      <div className="border rounded p-4 space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-blue-600">₹{total}</span>
        </div>
      </div>
    </div>
  );
}
