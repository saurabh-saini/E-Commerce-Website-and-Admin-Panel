import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";
import FormError from "../../components/FormError";
import Spinner from "../../components/Spinner";
import { handleApiError } from "../../utils/handleApiError";

/* ----------------------------------
   Form field types
----------------------------------- */
type ResetForm = {
  password: string;
  confirmPassword: string;
};

/* ----------------------------------
   Route state type (from Verify OTP)
----------------------------------- */
type LocationState = {
  email?: string;
};

/* ----------------------------------
   Password visibility UI state
----------------------------------- */
type PasswordVisibility = {
  password: boolean;
  confirmPassword: boolean;
};

export default function ResetPassword() {
  /* -------------------------------
     UI State: show / hide passwords
  -------------------------------- */
  const [show, setShow] = useState<PasswordVisibility>({
    password: false,
    confirmPassword: false,
  });

  /* -------------------------------
     Router helpers
  -------------------------------- */
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState };

  // Email passed from OTP screen
  const email = location.state?.email;

  /* -------------------------------
     Guard: block direct access
  -------------------------------- */
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  /* -------------------------------
     React Hook Form setup
  -------------------------------- */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>();

  /* -------------------------------
     Submit handler
  -------------------------------- */
  const onSubmit = async (data: ResetForm) => {
    try {
      // Call reset password API
      await api.post("/auth/reset-password", {
        email,
        password: data.password,
      });

      toast.success("Password reset successful");

      // Redirect to login after success
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
    <AuthLayout title="Reset Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* -------- New Password -------- */}
        <div className="relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            type={show.password ? "text" : "password"}
            placeholder="New password"
            className="w-full border px-3 py-2 pr-10 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
          />

          {/* Toggle password visibility */}
          <button
            type="button"
            onClick={() =>
              setShow((prev) => ({
                ...prev,
                password: !prev.password,
              }))
            }
            className="absolute right-3 top-1/2 -translate-y-1/2
                       text-gray-500 cursor-pointer"
          >
            {show.password ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <FormError message={errors.password?.message} />
        </div>

        {/* -------- Confirm Password -------- */}
        <div className="relative">
          <input
            {...register("confirmPassword", {
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            type={show.confirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full border px-3 py-2 pr-10 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
          />

          {/* Toggle confirm password visibility */}
          <button
            type="button"
            onClick={() =>
              setShow((prev) => ({
                ...prev,
                confirmPassword: !prev.confirmPassword,
              }))
            }
            className="absolute right-3 top-1/2 -translate-y-1/2
                       text-gray-500 cursor-pointer"
          >
            {show.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <FormError message={errors.confirmPassword?.message} />
        </div>

        {/* -------- Submit Button -------- */}
        <button
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white
            ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
        >
          {isSubmitting ? (
            <>
              <Spinner /> Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
