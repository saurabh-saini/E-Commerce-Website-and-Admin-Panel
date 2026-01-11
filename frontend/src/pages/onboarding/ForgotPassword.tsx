import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";
import FormError from "../../components/FormError";

type ForgotForm = {
  email: string;
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>();

  const onSubmit = async (data: ForgotForm) => {
    try {
      const res = await api.post("/auth/forgot-password", data);
      toast.success(res.data.message || "OTP sent to your email");
      navigate("/verify-otp", { state: { email: data.email } });
    } catch {
      // handled globally
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
