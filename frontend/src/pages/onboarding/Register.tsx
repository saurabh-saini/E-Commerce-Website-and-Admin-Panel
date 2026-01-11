import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";
import FormError from "../../components/FormError";
import Spinner from "../../components/Spinner";
import { handleApiError } from "../../utils/handleApiError";

/* ----------------------------------
   Form fields type (React Hook Form)
----------------------------------- */
type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  /* -------------------------------
     UI State: show / hide password
     (explicit boolean for clarity)
  -------------------------------- */
  const [showPassword, setShowPassword] = useState<boolean>(false);

  /* -------------------------------
     Router helper
  -------------------------------- */
  const navigate = useNavigate();

  /* -------------------------------
     React Hook Form setup
  -------------------------------- */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  /* -------------------------------
     Submit handler
  -------------------------------- */
  const onSubmit = async (data: RegisterForm) => {
    try {
      // Call register API
      const res = await api.post("/auth/register", data);

      toast.success(res.data.message || "Registered successfully");

      // Redirect to login after successful registration
      navigate("/login");
    } catch (error) {
      // Errors are handled globally via axios interceptor
      handleApiError(error);
    }
  };

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* -------- Name -------- */}
        <div>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
          />
          <FormError message={errors.name?.message} />
        </div>

        {/* -------- Email -------- */}
        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
          />
          <FormError message={errors.email?.message} />
        </div>

        {/* -------- Password (with toggle eye) -------- */}
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
            className="w-full border px-3 py-2 rounded pr-10
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
          />

          {/* Toggle password visibility */}
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       text-gray-500 hover:text-gray-700
                       cursor-pointer focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <FormError message={errors.password?.message} />
        </div>

        {/* -------- Submit Button -------- */}
        <button
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white
            flex items-center justify-center gap-2 transition
            ${
              isSubmitting
                ? "bg-blue-400 opacity-70 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
        >
          {isSubmitting ? (
            <>
              <Spinner /> Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* -------- Footer Link -------- */}
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
