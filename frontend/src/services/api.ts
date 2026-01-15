import axios, { AxiosError } from "axios";
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
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    const requestUrl = error.config?.url || "";

    /* ========= Ignore Auth Routes ========= */

    const isAuthRoute =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/forgot-password") ||
      requestUrl.includes("/auth/reset-password") ||
      requestUrl.includes("/auth/verify-otp");

    /* ========= Auto Logout ========= */

    if (status === 401 && !isAuthRoute) {
      if (!isLoggingOut) {
        isLoggingOut = true;

        toast.error("Session expired. Please login again");

        store.dispatch(logout());

        setTimeout(() => {
          isLoggingOut = false;
        }, 1500);
      }

      return Promise.reject(error);
    }

    /* ========= Forbidden ========= */

    if (status === 403) {
      toast.error("Access denied");
      return Promise.reject(error);
    }

    /* ========= Normal API Errors ========= */

    if (!isAuthRoute) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
