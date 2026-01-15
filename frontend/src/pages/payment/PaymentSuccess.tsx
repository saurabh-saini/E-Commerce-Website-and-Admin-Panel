import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md text-center space-y-4">
        <CheckCircle className="mx-auto text-green-500" size={60} />

        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful!
        </h1>

        <p className="text-gray-600">
          Your order has been placed successfully.
        </p>

        <div className="flex gap-4 justify-center mt-4">
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            View Orders
          </Link>

          <Link
            to="/home"
            className="border px-5 py-2 rounded hover:bg-gray-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
