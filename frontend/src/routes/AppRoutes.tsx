import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/onboarding/Login";
import Register from "../pages/onboarding/Register";
import VerifyOtp from "../pages/onboarding/VerifyOtp";
import ForgotPassword from "../pages/onboarding/ForgotPassword";
import ResetPassword from "../pages/onboarding/ResetPassword";
import Logout from "../pages/onboarding/Logout";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}
