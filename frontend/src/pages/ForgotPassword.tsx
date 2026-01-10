import AuthLayout from "../components/AuthLayout";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <AuthLayout title="Forgot Password">
      <p className="text-sm text-gray-600 text-center mb-4">
        Enter your registered email address.  
        We’ll send you a link to reset your password.
      </p>

      <form className="space-y-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Send Reset Link
        </button>

        {/* Back to Login */}
        <p className="text-sm text-center text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
