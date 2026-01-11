import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import { MailCheck } from "lucide-react";

import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();
  const email: string | undefined = location.state?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified successfully");
      navigate("/reset-password", { state: { email } });
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP resent to your email");
      setTimer(30);
      setOtp("");
    } catch {}
  };

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

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

        {/* OTP INPUT */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-2">
          <div className="flex justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
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
                        w-11 h-11
                        mx-2
                        text-center text-lg font-bold
                        text-black                /* 🔥 FIX 1 */
                        bg-white                  /* 🔥 FIX 2 */
                        border border-gray-400
                        rounded-md
                        placeholder-gray-300
                        focus:outline-none
                        focus:ring-2 focus:ring-blue-500
                        focus:border-blue-500
                      "
                />
              )}
            />
          </div>

          {/* TIMER */}
          <p className="text-sm text-gray-500">
            {timer > 0 ? (
              <>
                Resend OTP in{" "}
                <span className="font-medium">
                  00:{timer.toString().padStart(2, "0")}
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
            disabled={loading || otp.length !== 6}
            className={`w-full py-3 rounded-full text-white font-medium transition
              ${
                loading || otp.length !== 6
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* BACK */}
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
