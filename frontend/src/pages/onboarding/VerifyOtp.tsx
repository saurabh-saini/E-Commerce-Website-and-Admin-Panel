import { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import { MailCheck } from "lucide-react";

import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";
import { handleApiError } from "../../utils/handleApiError";

/* ----------------------------------
   Route state type
   (email passed from Forgot Password)
----------------------------------- */
type LocationState = {
  email?: string;
};

/* ----------------------------------
   OTP screen UI state
----------------------------------- */
type OtpState = {
  value: string; // entered OTP
  loading: boolean; // API loading state
  timer: number; // resend countdown timer
};

export default function VerifyOtp() {
  /* -------------------------------
     Single typed state for OTP flow
  -------------------------------- */
  const [otpState, setOtpState] = useState<OtpState>({
    value: "",
    loading: false,
    timer: 30,
  });

  /* -------------------------------
     Router helpers
  -------------------------------- */
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState };

  // Email received from previous screen
  const email = location.state?.email;

  /* -------------------------------
     Guard: block direct access
  -------------------------------- */
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  /* -------------------------------
     Submit OTP handler
  -------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (otpState.value.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    try {
      // Start loading
      setOtpState((prev) => ({ ...prev, loading: true }));

      // Verify OTP API call
      await api.post("/auth/verify-otp", {
        email,
        otp: otpState.value,
      });

      toast.success("OTP verified successfully");

      // Navigate to reset password screen
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      // Errors are handled globally via axios interceptor
      handleApiError(error);
    } finally {
      // Stop loading
      setOtpState((prev) => ({ ...prev, loading: false }));
    }
  };

  /* -------------------------------
     Resend OTP handler
  -------------------------------- */
  const handleResend = async () => {
    try {
      await api.post("/auth/forgot-password", { email });

      toast.success("OTP resent to your email");

      // Reset timer and OTP input
      setOtpState((prev) => ({
        ...prev,
        timer: 30,
        value: "",
      }));
    } catch {
      // Error handled globally
    }
  };

  /* -------------------------------
     Countdown timer effect
  -------------------------------- */
  useEffect(() => {
    // Stop when timer reaches 0
    if (otpState.timer === 0) return;

    // Decrease timer every second
    const interval = setInterval(() => {
      setOtpState((prev) => ({
        ...prev,
        timer: prev.timer - 1,
      }));
    }, 1000);

    // Cleanup interval
    return () => clearInterval(interval);
  }, [otpState.timer]);

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <AuthLayout title="">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* ICON */}
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <MailCheck className="text-blue-600" size={32} />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold">OTP Verification</h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600">
          One Time Password (OTP) has been sent to
          <br />
          <span className="font-medium text-gray-800">{email}</span>
        </p>

        {/* OTP FORM */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-2">
          {/* OTP INPUT */}
          <div className="flex justify-center">
            <OtpInput
              value={otpState.value}
              onChange={(val) =>
                setOtpState((prev) => ({ ...prev, value: val }))
              }
              numInputs={6}
              shouldAutoFocus
              inputType="text"
              renderInput={(props) => (
                <input
                  {...props}
                  inputMode="numeric"
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  className="
                    w-11 h-11 mx-2
                    text-center text-lg font-bold
                    text-black bg-white
                    border border-gray-400 rounded-md
                    placeholder-gray-300
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500
                  "
                />
              )}
            />
          </div>

          {/* RESEND TIMER */}
          <p className="text-sm text-gray-500">
            {otpState.timer > 0 ? (
              <>
                Resend OTP in{" "}
                <span className="font-medium">
                  00:{otpState.timer.toString().padStart(2, "0")}
                </span>
              </>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </p>

          {/* VERIFY BUTTON */}
          <button
            type="submit"
            disabled={otpState.loading || otpState.value.length !== 6}
            className={`w-full py-3 rounded-full text-white font-medium transition
              ${
                otpState.loading || otpState.value.length !== 6
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
          >
            {otpState.loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* BACK TO LOGIN */}
          <p className="text-sm">
            <Link
              to="/login"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
