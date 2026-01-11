import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import FormError from "../../components/FormError";
import AuthLayout from "../../components/AuthLayout";

import api from "../../services/api";
import type { AppDispatch } from "../../store";
import { loginSuccess } from "../../store/slices/authSlice";
import Spinner from "../../components/Spinner";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data);

      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
        })
      );

      toast.success("Login successful");
      navigate("/");
    } catch {
      // error handled globally by axios
    }
  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            // type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded
           focus:outline-none focus:ring-2 focus:ring-blue-500
           focus:border-blue-500"
          />
          <FormError message={errors.email?.message} />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border px-3 py-2 rounded
           focus:outline-none focus:ring-2 focus:ring-blue-500
           focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <FormError message={errors.password?.message} />
        </div>

        <button
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white flex items-center justify-center gap-2 transition
          ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {isSubmitting ? (
            <>
              <Spinner /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-sm text-center space-y-1">
          <p>
            Forgot password?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Click here
            </Link>
          </p>

          <p>
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
