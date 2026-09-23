import { useState } from "react";

import {
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { msg91SendOtp } from "../../services/msg91";

import VerifyOtp from "./VerifyOtp";

export default function Login({
  onClose,
  onLoginSuccess,
}) {
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);

  /* =======================================================
     PHONE NUMBER CHANGE
     ======================================================= */

  const handlePhoneChange = (event) => {
    const value = event.target.value;

    // Only allow numbers
    const numbersOnly = value.replace(/\D/g, "");

    // Indian mobile number = 10 digits
    if (numbersOnly.length <= 10) {
      setPhone(numbersOnly);
      setError("");
    }
  };

  /* =======================================================
     SEND OTP
     ======================================================= */

  const handleSendOtp = async (event) => {
    event.preventDefault();

    setError("");

    if (phone.length !== 10) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * MSG91 sends the OTP.
       *
       * We do NOT call our backend here.
       */
      await msg91SendOtp(phone);

      /*
       * OTP was successfully requested.
       * Show OTP screen.
       */
      setShowOtp(true);
    } catch (error) {
      console.error(
        "Send OTP Error:",
        error
      );

      setError(
        error?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     OTP SCREEN
     ======================================================= */

  if (showOtp) {
    return (
      <VerifyOtp
        phone={phone}

        onClose={onClose}

        onBack={() => {
          setShowOtp(false);
          setError("");
        }}

        onLoginSuccess={onLoginSuccess}
      />
    );
  }

  /* =======================================================
     LOGIN UI
     ======================================================= */

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
        if (
          event.target === event.currentTarget
        ) {
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
          aria-label="Close login"
        >
          <X size={18} />
        </button>

        {/* HEADER */}

        <div
          className="
            px-8
            pb-6
            pt-10
            text-center
            sm:px-10
          "
        >
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
            Narayan Misthan Bhandar
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
            Welcome Back
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-[330px]
              text-[14px]
              leading-6
              text-[#6E6670]
            "
          >
            Enter your mobile number to continue
            with your NMB account.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSendOtp}
          className="
            px-8
            pb-10
            sm:px-10
          "
        >
          <label
            htmlFor="login-phone"
            className="
              mb-2
              block
              text-[13px]
              font-semibold
              text-[#2B2430]
            "
          >
            Mobile Number
          </label>

          <div
            className="
              flex
              h-[54px]
              overflow-hidden
              rounded-xl
              border
              border-[#DED4E2]
              bg-white
              transition
              focus-within:border-[#340C48]
              focus-within:ring-2
              focus-within:ring-[#340C48]/10
            "
          >
            <div
              className="
                flex
                items-center
                border-r
                border-[#DED4E2]
                px-4
                text-[14px]
                font-medium
                text-[#340C48]
              "
            >
              +91
            </div>

            <input
              id="login-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              placeholder="Enter mobile number"
              value={phone}
              onChange={handlePhoneChange}
              className="
                min-w-0
                flex-1
                bg-transparent
                px-4
                text-[15px]
                text-[#2B2430]
                outline-none
                placeholder:text-[#A49BA6]
              "
            />
          </div>

          {/* ERROR */}

          {error && (
            <p
              className="
                mt-3
                text-[13px]
                leading-5
                text-red-600
              "
            >
              {error}
            </p>
          )}

          {/* SEND OTP BUTTON */}

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

                Sending OTP...
              </>
            ) : (
              <>
                Send OTP

                <ArrowRight size={17} />
              </>
            )}
          </button>

          {/* TERMS */}

          <p
            className="
              mt-5
              text-center
              text-[11px]
              leading-5
              text-[#8A828C]
            "
          >
            By continuing, you agree to our
            terms and privacy policy.
          </p>
        </form>
      </div>
    </div>
  );
}