import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

import { sendOtp, verifyOtp } from "../../services/api";

export default function VerifyOtp({
  phone,
  onClose,
  onBack,
  onLoginSuccess,
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const otpInputRef = useRef(null);

  /* =======================================================
     AUTO FOCUS OTP INPUT
  ======================================================= */

  useEffect(() => {
    otpInputRef.current?.focus();
  }, []);

  /* =======================================================
     RESEND TIMER
  ======================================================= */

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  /* =======================================================
     MASK PHONE NUMBER
  ======================================================= */

  const maskedPhone = phone
    ? `+91 ${phone.slice(0, 2)}••••••${phone.slice(-2)}`
    : "";

  /* =======================================================
     OTP INPUT
  ======================================================= */

  const handleOtpChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);
    setError("");
  };

  /* =======================================================
     VERIFY OTP
  ======================================================= */

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOtp(phone, otp);

      if (!response?.token) {
        throw new Error(
          "Login successful, but no authentication token was received."
        );
      }

      /* Save JWT token */

      localStorage.setItem(
        "nmb_token",
        response.token
      );

      /* Save customer information */

      if (response.user) {
        localStorage.setItem(
          "nmb_user",
          JSON.stringify(response.user)
        );
      }

      /* Tell Navbar that login was successful */

      onLoginSuccess?.(response);

      /* Close popup */

      onClose?.();
    } catch (error) {
      console.error("Verify OTP Error:", error);

      setError(
        error.message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     RESEND OTP
  ======================================================= */

  const handleResendOtp = async () => {
    if (resendTimer > 0 || resending) {
      return;
    }

    try {
      setError("");
      setResending(true);

      await sendOtp(phone);

      setOtp("");
      setResendTimer(30);
      otpInputRef.current?.focus();
    } catch (error) {
      console.error("Resend OTP Error:", error);

      setError(
        error.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/50
        px-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="
          relative
          w-full max-w-[460px]
          overflow-hidden
          rounded-[24px]
          bg-[#FFF9F2]
          shadow-2xl
        "
      >
        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-5 top-5 z-10
            flex h-9 w-9
            items-center justify-center
            rounded-full
            bg-[#340C48]/10
            text-[#340C48]
            transition
            hover:bg-[#340C48]
            hover:text-white
          "
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={onBack}
          className="
            absolute left-5 top-5 z-10
            flex h-9 w-9
            items-center justify-center
            rounded-full
            bg-[#340C48]/10
            text-[#340C48]
            transition
            hover:bg-[#340C48]
            hover:text-white
          "
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        {/* HEADER */}

        <div className="px-8 pb-6 pt-10 text-center sm:px-10">
          <div
            className="
              mx-auto
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#340C48]/10
              text-[#340C48]
            "
          >
            <CheckCircle2 size={28} />
          </div>

          <p
            className="
              mb-3
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#C9A45C]
            "
          >
            Verify Mobile
          </p>

          <h2
            className="
              font-[var(--font-display)]
              text-[32px]
              leading-tight
              text-[#340C48]
              sm:text-[36px]
            "
          >
            Enter OTP
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-[340px]
              text-[14px]
              leading-6
              text-[#6E6670]
            "
          >
            We've sent a verification code to
          </p>

          <p
            className="
              mt-1
              text-[14px]
              font-semibold
              text-[#340C48]
            "
          >
            {maskedPhone}
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleVerifyOtp}
          className="px-8 pb-10 sm:px-10"
        >
          <label
            htmlFor="otp"
            className="
              mb-2
              block
              text-center
              text-[13px]
              font-semibold
              text-[#2B2430]
            "
          >
            6-Digit OTP
          </label>

          <input
            ref={otpInputRef}
            id="otp"
            type="tel"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            placeholder="••••••"
            className="
              h-[64px]
              w-full
              rounded-xl
              border
              border-[#DED4E2]
              bg-white
              text-center
              text-[25px]
              font-semibold
              tracking-[0.5em]
              text-[#340C48]
              outline-none
              transition
              placeholder:text-[#C8C0CA]
              focus:border-[#340C48]
              focus:ring-2
              focus:ring-[#340C48]/10
            "
          />

          {/* ERROR */}

          {error && (
            <p
              className="
                mt-3
                text-center
                text-[13px]
                leading-5
                text-red-600
              "
            >
              {error}
            </p>
          )}

          {/* VERIFY BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              mt-6
              flex
              h-[54px]
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#340C48]
              px-5
              text-[14px]
              font-semibold
              text-white
              transition
              hover:bg-[#4B1D63]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </button>

          {/* RESEND OTP */}

          <div className="mt-5 text-center">
            <p className="text-[12px] text-[#8A828C]">
              Didn't receive the OTP?
            </p>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={
                resendTimer > 0 || resending
              }
              className="
                mt-1
                text-[13px]
                font-semibold
                text-[#340C48]
                disabled:cursor-not-allowed
                disabled:text-[#A49BA6]
              "
            >
              {resending
                ? "Sending..."
                : resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}