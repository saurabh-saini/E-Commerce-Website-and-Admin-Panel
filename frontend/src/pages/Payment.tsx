import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Payment() {
  const [method, setMethod] = useState("razorpay");

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>

        {/* Razorpay */}
        <label className="flex items-center gap-3 border p-3 rounded mb-3 cursor-pointer">
          <input
            type="radio"
            checked={method === "razorpay"}
            onChange={() => setMethod("razorpay")}
          />
          <span>Razorpay (UPI / Card / NetBanking)</span>
        </label>

        {/* Stripe */}
        <label className="flex items-center gap-3 border p-3 rounded mb-6 cursor-pointer">
          <input
            type="radio"
            checked={method === "stripe"}
            onChange={() => setMethod("stripe")}
          />
          <span>Stripe (Card / International)</span>
        </label>

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Pay ₹2999
        </button>
      </div>
    </>
  );
}
