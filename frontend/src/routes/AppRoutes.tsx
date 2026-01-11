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

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ProtectedLayout from "../layouts/ProtectedLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 🌐 Public Routes - (ONLY when NOT logged-in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* 🔐 Protected Routes - (ONLY when logged-in) */}
      {/* Protected Layout - (Navbar automatically sab protected pages pe dikhega) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
