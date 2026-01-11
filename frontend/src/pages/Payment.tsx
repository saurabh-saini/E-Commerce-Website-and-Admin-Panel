import { useSelector } from "react-redux";
import type { RootState } from "../store";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function Payment() {
  const { items } = useSelector((state: RootState) => state.cart);

  const total = items.reduce(
    (sum: number, item) => sum + item.price * item.quantity,
    0
  );

  /* 🔥 Lazy load Razorpay SDK */
  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Payment SDK failed to load");
      return;
    }

    // 🔴 Fake options (backend later)
    const options = {
      key: "rzp_test_xxxxxxxx",
      amount: total * 100,
      currency: "INR",
      name: "MyShop",
      description: "Test Payment",
      handler: function () {
        alert("Payment Success (dummy)");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Payment</h1>

      {/* Order Summary */}
      <div className="border rounded p-4 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-blue-600">₹{total}</span>
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
      >
        Pay ₹{total}
      </button>
    </div>
  );
}
