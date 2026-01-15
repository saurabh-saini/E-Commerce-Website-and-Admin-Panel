import api from "./api";

export const startPayment = async (orderId: string) => {
  const confirmPayment = window.confirm(
    "Mock Payment Mode\n\nClick OK → Payment Success\nClick Cancel → Payment Failed"
  );

  // ❌ User cancelled
  if (!confirmPayment) {
    await api.post("/payment/payment-failed", {
      orderId,
    });

    alert("Payment cancelled");

    return;
  }

  // ✅ Simulate success
  await api.post("/payment/verify-payment", {
    razorpay_order_id: "mock_order_" + Date.now(),
    razorpay_payment_id: "mock_payment_" + Date.now(),
    razorpay_signature: "mock_signature",
    orderId,
    method: "mock",
  });

  // Redirect to success page
  window.location.href = `/order-success/${orderId}`;
};
