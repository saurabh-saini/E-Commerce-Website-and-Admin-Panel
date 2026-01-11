import { useEffect } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/AuthLayout";
import { useLogout } from "../../hooks/useLogout";

export default function Logout() {
  const logout = useLogout();

  // 🔥 Auto logout on page load
  useEffect(() => {
    logout();
  }, []);

  return (
    <AuthLayout title="Logged Out">
      <div className="text-center space-y-4">
        <p className="text-gray-600">You have been successfully logged out.</p>

        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Login Again
        </Link>
      </div>
    </AuthLayout>
  );
}
