import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ProtectedLayout from "../layouts/ProtectedLayout";

/* =====================
   Lazy Loaded Pages
===================== */

// Onboarding (Public)
const Login = lazy(() => import("../pages/onboarding/Login"));
const Register = lazy(() => import("../pages/onboarding/Register"));
const VerifyOtp = lazy(() => import("../pages/onboarding/VerifyOtp"));
const ForgotPassword = lazy(() => import("../pages/onboarding/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/onboarding/ResetPassword"));
const Logout = lazy(() => import("../pages/onboarding/Logout"));

// Protected Pages
const Home = lazy(() => import("../pages/product/Home"));
const ProductDetail = lazy(() => import("../pages/product/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Payment = lazy(() => import("../pages/Payment"));

/* =====================
   Routes
===================== */

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 🌐 Public Routes (ONLY when NOT logged-in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* 🔐 Protected Routes (ONLY when logged-in) */}
      <Route element={<ProtectedRoute />}>
        {/* 🧱 Protected Layout (Navbar / Sidebar etc.) */}
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
