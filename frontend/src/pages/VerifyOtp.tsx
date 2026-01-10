import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { Link } from "react-router-dom";
import OtpInput from "react-otp-input";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP:", otp); // API later
  };

  return (
    <AuthLayout title="Verify OTP">
      <p className="text-sm text-gray-600 text-center mb-4">
        Enter the 6-digit code sent to your email
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* OTP INPUT */}
        <div className="flex justify-center">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus
            inputType="number"
            renderInput={(props) => (
              <input
                {...props}
                className="w-10 h-12 mx-1 text-center text-lg border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Verify
        </button>

        {/* Resend OTP */}
        <p className="text-sm text-center text-gray-600">
          Didn’t receive the code?{" "}
          <button type="button" className="text-blue-600 hover:underline">
            Resend OTP
          </button>
        </p>

        {/* Back to Login */}
        <p className="text-sm text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
