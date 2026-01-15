import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

// type LocationState = {
//   orderId: string;
// };

export default function Payment() {
  const navigate = useNavigate();
  // const location = useLocation() as { state: LocationState };
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  // const orderId = location.state?.orderId;

  const [loading, setLoading] = useState(false);

  if (!orderId) {
    navigate("/home");
  }

  const handlePayment = async () => {
    try {
      setLoading(true);

      await api.post(`/orders/${orderId}/pay`);

      toast.success("Payment successful");

      navigate("/order-success/" + orderId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">Complete Payment</h2>

        <p className="text-center text-gray-600">
          Order ID: {orderId.slice(-6)}
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded text-white font-medium
            ${loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? (
            <>
              <Spinner /> Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </div>
  );
}
