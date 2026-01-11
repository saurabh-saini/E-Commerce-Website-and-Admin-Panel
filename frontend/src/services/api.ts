import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:8082/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* 🔐 Request Interceptor */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Token expected but missing
    if (!token && config.url?.includes("/auth") === false) {
      toast.error("Session expired. Please login again.");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    toast.error("Request error");
    return Promise.reject(error);
  }
);

/* ❌ Global Response Error Handler */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // Auth errors
    if (error.response?.status === 401) {
      toast.error("Unauthorized. Please login again.");
      localStorage.removeItem("token");
    } else if (error.response?.status === 403) {
      toast.error("Access denied");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
