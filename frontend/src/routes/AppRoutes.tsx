import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ProtectedLayout from "../layouts/ProtectedLayout";
import MyOrders from "../pages/orders/MyOrders";
import OrderDetail from "../pages/orders/OrderDetail";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import OrderSuccess from "../pages/orders/OrderSuccess";

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
const Payment = lazy(() => import("../pages/payment/Payment"));

// Admin
const AdminLogin = lazy(() => import("../admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../admin/AdminProducts"));
const AdminOrders = lazy(() => import("../admin/AdminOrders"));

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
          <Route path="/logout" element={<Logout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
        </Route>
      </Route>

      {/* admin  */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/orders" element={<AdminOrders />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
