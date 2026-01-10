import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Checkout() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-6">
        {/* LEFT — ADDRESS */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

          <div className="space-y-3">
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Full Name"
            />
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Address"
            />
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="City"
            />
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Postal Code"
            />
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Phone Number"
            />
          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Wireless Headphones</span>
            <span>₹2999</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹2999</span>
          </div>

          <Link
            to="/payment"
            className="block text-center mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Proceed to Payment
          </Link>
        </div>
      </div>
    </>
  );
}
