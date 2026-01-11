import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";
import FormError from "../../components/FormError";
import { handleApiError } from "../../utils/handleApiError";

/* ----------------------------------
   Form field types (React Hook Form)
----------------------------------- */
type ForgotForm = {
  email: string;
};

export default function ForgotPassword() {
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
  } = useForm<ForgotForm>();

  /* -------------------------------
     Submit handler
  -------------------------------- */
  const onSubmit = async (data: ForgotForm) => {
    try {
      // Call forgot password API
      const res = await api.post("/auth/forgot-password", data);

      toast.success(res.data.message || "OTP sent to your email");

      // Redirect to OTP verification screen
      // Email is passed via route state
      navigate("/verify-otp", { state: { email: data.email } });
    } catch (error) {
      // Errors are handled globally via axios interceptor
      handleApiError(error);
    }
  };

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* -------- Email -------- */}
        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email",
              },
            })}
            placeholder="Enter your email"
            className="w-full border px-3 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
          />
          <FormError message={errors.email?.message} />
        </div>

        {/* -------- Submit Button -------- */}
        <button
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white transition
            ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
        >
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </AuthLayout>
  );
}
