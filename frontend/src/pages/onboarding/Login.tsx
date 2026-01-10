import AuthLayout from "../../components/AuthLayout";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <AuthLayout title="Login">
      <form className="space-y-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Links */}
        <div className="text-sm text-center text-gray-600 space-y-1">
          <p>
            Forgot password?{" "}
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Click here
            </Link>
          </p>

          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
