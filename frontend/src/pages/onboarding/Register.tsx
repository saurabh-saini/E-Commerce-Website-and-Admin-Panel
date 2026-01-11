import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";
import FormError from "../../components/FormError";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await api.post("/auth/register", data);
      toast.success(res.data.message || "Registered successfully");
      navigate("/login");
    } catch {
      // global axios interceptor handles error toast
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded"
          />
          <FormError message={errors.name?.message} />
        </div>

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
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />
          <FormError message={errors.email?.message} />
        </div>

        {/* Password */}
        <div>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
          />
          <FormError message={errors.password?.message} />
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
