import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8082/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   Request Interceptor
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =========================
   Response Interceptor
   AUTO LOGOUT ON EXPIRY
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // 🔐 Token expired / invalid
    if (status === 401) {
      store.dispatch(logout());

      toast.error("Session expired. Please login again.");

      // Hard redirect (safe, no loop)
      window.location.href = "/login";
    }

    // 🚫 Forbidden
    else if (status === 403) {
      toast.error("Access denied");
    }

    // ❌ Other errors
    else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
