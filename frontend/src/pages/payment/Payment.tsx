// import { useSelector } from "react-redux";
// import type { RootState } from "../../store";

// declare global {
//   interface Window {
//     Razorpay?: any;
//   }
// }

// export default function Payment() {
//   const { items } = useSelector((state: RootState) => state.cart);

//   const total = items.reduce(
//     (sum: number, item) => sum + item.price * item.quantity,
//     0
//   );

//   /* 🔥 Lazy load Razorpay SDK */
//   const loadRazorpay = () => {
//     return new Promise<boolean>((resolve) => {
//       if (window.Razorpay) return resolve(true);

//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     const loaded = await loadRazorpay();

//     if (!loaded) {
//       alert("Payment SDK failed to load");
//       return;
//     }

//     // 🔴 Fake options (backend later)
//     const options = {
//       key: "rzp_test_xxxxxxxx",
//       amount: total * 100,
//       currency: "INR",
//       name: "MyShop",
//       description: "Test Payment",
//       handler: function () {
//         alert("Payment Success (dummy)");
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold">Payment</h1>

//       {/* Order Summary */}
//       <div className="border rounded p-4 space-y-3">
//         {items.map((item) => (
//           <div key={item._id} className="flex justify-between text-sm">
//             <span>
//               {item.name} × {item.quantity}
//             </span>
//             <span>₹{item.price * item.quantity}</span>
//           </div>
//         ))}

//         <div className="border-t pt-3 flex justify-between font-semibold">
//           <span>Total</span>
//           <span className="text-blue-600">₹{total}</span>
//         </div>
//       </div>

//       {/* Pay Button */}
//       <button
//         onClick={handlePayment}
//         className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
//       >
//         Pay ₹{total}
//       </button>
//     </div>
//   );
// }

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

type LocationState = {
  orderId: string;
};

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState };

  const orderId = location.state?.orderId;

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
