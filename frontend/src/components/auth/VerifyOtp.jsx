import React, { useEffect, useState } from "react";

import {
  msg91VerifyOtp,
  msg91RetryOtp,
} from "../../services/msg91";

const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

/*
 * Your application normally uses:
 *
 * VITE_API_BASE_URL=https://api.nmbsweets.com/api
 *
 * To avoid /api/api/... in case an environment variable
 * is changed later, this builds the endpoint safely.
 */
const MSG91_VERIFY_URL = API_BASE_URL.endsWith("/api")
  ? `${API_BASE_URL}/auth/msg91/verify`
  : `${API_BASE_URL}/api/auth/msg91/verify`;

const RESEND_TIME = 30;

const VerifyOtp = ({
  phone,
  onClose,
  onBack,
  onLoginSuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(
    RESEND_TIME
  );

  // -----------------------------------------
  // RESEND TIMER
  // -----------------------------------------
  useEffect(() => {
    if (resendTimer <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setResendTimer((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // -----------------------------------------
  // OTP INPUT
  // -----------------------------------------
  const handleOtpChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);

    if (error) {
      setError("");
    }
  };

  // -----------------------------------------
  // NORMALIZE PHONE
  // -----------------------------------------
  const normalizedPhone = String(phone || "")
    .replace(/\D/g, "")
    .slice(-10);

  // -----------------------------------------
  // VERIFY OTP
  // -----------------------------------------
  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (normalizedPhone.length !== 10) {
      setError(
        "Invalid mobile number. Please go back and try again."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // -----------------------------------------
      // STEP 1: VERIFY OTP WITH MSG91
      // -----------------------------------------
      const msg91Response = await msg91VerifyOtp(otp);

      /*
       * MSG91 Custom Web SDK commonly returns the
       * access token in the "message" property.
       */
      const accessToken =
        msg91Response?.message ||
        msg91Response?.token ||
        msg91Response?.access_token ||
        msg91Response?.accessToken ||
        msg91Response?.data?.token ||
        msg91Response?.data?.access_token ||
        msg91Response?.data?.accessToken;

      if (!accessToken) {
        throw new Error(
          "OTP verified, but MSG91 did not return an access token."
        );
      }

      // -----------------------------------------
      // STEP 2: SEND MSG91 TOKEN TO BACKEND
      // -----------------------------------------
      const response = await fetch(
        MSG91_VERIFY_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            phone: normalizedPhone,
            accessToken,
          }),
        }
      );

      // -----------------------------------------
      // STEP 3: READ BACKEND RESPONSE
      // -----------------------------------------
      const contentType =
        response.headers.get("content-type") || "";

      let data = null;
      let responseText = "";

      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      } else {
        try {
          responseText = await response.text();
        } catch {
          responseText = "";
        }
      }

      // -----------------------------------------
      // STEP 4: HANDLE HTTP ERROR
      // -----------------------------------------
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Authentication service was not found. Please try again later."
          );
        }

        throw new Error(
          data?.message ||
            responseText ||
            `Unable to complete login. Server returned ${response.status}.`
        );
      }

      // -----------------------------------------
      // STEP 5: VALIDATE RESPONSE
      // -----------------------------------------
      if (!data) {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (data.success === false) {
        throw new Error(
          data.message ||
            "Unable to complete login."
        );
      }

      // -----------------------------------------
      // STEP 6: CHECK NMB JWT
      // -----------------------------------------
      if (!data.token) {
        throw new Error(
          "Login completed, but application token was not received."
        );
      }

      // -----------------------------------------
      // STEP 7: SAVE LOGIN DATA
      // -----------------------------------------
      localStorage.setItem(
        "nmb_token",
        data.token
      );

      if (data.user) {
        localStorage.setItem(
          "nmb_user",
          JSON.stringify(data.user)
        );
      }

      // -----------------------------------------
      // STEP 8: LOGIN CALLBACK
      // -----------------------------------------
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }

      // -----------------------------------------
      // STEP 9: CLOSE MODAL
      // -----------------------------------------
      if (onClose) {
        onClose();
      }
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // RESEND OTP
  // -----------------------------------------
  const handleResendOtp = async () => {
    if (
      resendTimer > 0 ||
      resendLoading ||
      loading
    ) {
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      /*
       * "11" = SMS channel for MSG91.
       */
      await msg91RetryOtp("11");

      setOtp("");
      setResendTimer(RESEND_TIME);
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  // -----------------------------------------
  // MASK PHONE NUMBER
  // -----------------------------------------
  const maskedPhone = normalizedPhone
    ? `+91 ${normalizedPhone.slice(
        0,
        2
      )}******${normalizedPhone.slice(-2)}`
    : "";

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[430px] rounded-2xl bg-[#FFF9F2] p-7 shadow-2xl">

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-xl text-[#340C48] transition hover:bg-[#340C48]/10 disabled:opacity-50"
        >
          ×
        </button>

        {/* HEADER */}
        <div className="mb-7 text-center">

          {/* ICON */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#340C48] text-2xl text-[#C9A45C]">
              🔐
            </div>
          </div>

          {/* TITLE */}
          <h2
            className="text-2xl font-semibold text-[#340C48]"
            style={{
              fontFamily:
                "'Playfair Display', serif",
            }}
          >
            Verify OTP
          </h2>

          {/* DESCRIPTION */}
          <p className="mt-2 text-sm text-[#4C444E]">
            Enter the 6-digit OTP sent to
          </p>

          {/* PHONE */}
          <p className="mt-1 font-medium text-[#340C48]">
            {maskedPhone}
          </p>
        </div>

        {/* OTP FORM */}
        <form onSubmit={handleVerifyOtp}>

          {/* OTP INPUT */}
          <div className="mb-5">
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-[#340C48]"
            >
              Enter OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              disabled={loading}
              autoFocus
              placeholder="••••••"
              aria-label="6-digit OTP"
              className="w-full rounded-xl border border-[#340C48]/20 bg-white px-4 py-4 text-center text-2xl font-semibold tracking-[0.6em] text-[#340C48] outline-none transition focus:border-[#C9A45C] focus:ring-2 focus:ring-[#C9A45C]/20 disabled:opacity-60"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* VERIFY BUTTON */}
          <button
            type="submit"
            disabled={
              loading ||
              otp.length !== 6
            }
            className="flex w-full items-center justify-center rounded-xl bg-[#340C48] px-5 py-3.5 font-semibold text-white transition hover:bg-[#340C48]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        {/* RESEND OTP */}
        <div className="mt-5 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-[#4C444E]">
              Resend OTP{" "}
              <span className="font-semibold text-[#340C48]">
                in {resendTimer}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={
                resendLoading ||
                loading
              }
              className="font-semibold text-[#340C48] underline underline-offset-4 transition hover:text-[#C9A45C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resendLoading
                ? "Resending..."
                : "Resend OTP"}
            </button>
          )}
        </div>

        {/* CHANGE NUMBER */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="text-sm text-[#4C444E] transition hover:text-[#340C48] disabled:opacity-50"
          >
            ← Change mobile number
          </button>
        </div>

        {/* SECURITY MESSAGE */}
        <p className="mt-6 text-center text-xs leading-5 text-[#4C444E]/70">
          Never share your OTP with anyone.
        </p>

      </div>
    </div>
  );
};

export default VerifyOtp;