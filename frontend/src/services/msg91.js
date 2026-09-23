const MSG91_WIDGET_ID =
  "366976714133323939303439";

const MSG91_TOKEN =
  import.meta.env.VITE_MSG91_WIDGET_TOKEN;

const MSG91_SCRIPT =
  "https://verify.msg91.com/otp-provider.js";

const MSG91_SMS_CHANNEL = "11";

let initialized = false;
let initializationPromise = null;

/**
 * Wait until MSG91 exposes its custom UI methods.
 */
function waitForMSG91Methods(timeout = 15000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      if (
        typeof window.sendOtp === "function" &&
        typeof window.verifyOtp === "function" &&
        typeof window.retryOtp === "function"
      ) {
        resolve();
        return;
      }

      if (Date.now() - startTime >= timeout) {
        reject(
          new Error(
            "MSG91 OTP methods were not available after initialization."
          )
        );
        return;
      }

      setTimeout(check, 100);
    };

    check();
  });
}

/**
 * Load and initialize MSG91 OTP Widget.
 */
export function loadMSG91() {
  if (
    initialized &&
    typeof window.sendOtp === "function" &&
    typeof window.verifyOtp === "function" &&
    typeof window.retryOtp === "function"
  ) {
    return Promise.resolve();
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = new Promise(
    (resolve, reject) => {
      const initialize = async () => {
        try {
          if (!window.initSendOTP) {
            throw new Error(
              "MSG91 initSendOTP function is unavailable."
            );
          }

          if (!MSG91_TOKEN) {
            throw new Error(
              "MSG91 Widget Token is missing. Check your .env file."
            );
          }

          window.initSendOTP({
            widgetId: MSG91_WIDGET_ID,
            tokenAuth: MSG91_TOKEN,
            exposeMethods: true,

            success: () => {},

            failure: () => {},
          });

          await waitForMSG91Methods();

          initialized = true;

          resolve();
        } catch (error) {
          initialized = false;
          initializationPromise = null;

          reject(error);
        }
      };

      const existingScript =
        document.querySelector(
          `script[src="${MSG91_SCRIPT}"]`
        );

      if (existingScript) {
        /*
         * If the SDK already exists, initialize it.
         */
        initialize();
        return;
      }

      const script =
        document.createElement("script");

      script.type = "text/javascript";
      script.src = MSG91_SCRIPT;

      script.onload = () => {
        initialize();
      };

      script.onerror = () => {
        initializationPromise = null;

        reject(
          new Error(
            "Unable to load MSG91 OTP SDK."
          )
        );
      };

      document.body.appendChild(script);
    }
  );

  return initializationPromise;
}

/**
 * SEND OTP
 */
export async function msg91SendOtp(phone) {
  await loadMSG91();

  const normalizedPhone = String(phone || "")
    .replace(/\D/g, "")
    .slice(-10);

  if (normalizedPhone.length !== 10) {
    throw new Error(
      "Please enter a valid 10-digit mobile number."
    );
  }

  const identifier = `91${normalizedPhone}`;

  return new Promise((resolve, reject) => {
    if (
      typeof window.sendOtp !== "function"
    ) {
      reject(
        new Error(
          "MSG91 sendOtp method is unavailable."
        )
      );
      return;
    }

    window.sendOtp(
      identifier,
      (data) => {
        resolve(data);
      },
      (error) => {
        reject(
          new Error(
            error?.message ||
              "Unable to send OTP. Please try again."
          )
        );
      }
    );
  });
}

/**
 * VERIFY OTP
 */
export async function msg91VerifyOtp(otp) {
  await loadMSG91();

  const normalizedOtp = String(otp || "")
    .replace(/\D/g, "")
    .slice(0, 6);

  if (normalizedOtp.length !== 6) {
    throw new Error(
      "Please enter a valid 6-digit OTP."
    );
  }

  return new Promise((resolve, reject) => {
    if (
      typeof window.verifyOtp !== "function"
    ) {
      reject(
        new Error(
          "MSG91 verifyOtp method is unavailable."
        )
      );
      return;
    }

    window.verifyOtp(
      Number(normalizedOtp),
      (data) => {
        resolve(data);
      },
      (error) => {
        reject(
          new Error(
            error?.message ||
              "Invalid or expired OTP."
          )
        );
      }
    );
  });
}

/**
 * RESEND OTP
 *
 * MSG91 channels:
 * SMS      = "11"
 * Voice    = "4"
 * Email    = "3"
 * WhatsApp = "12"
 */
export async function msg91RetryOtp(
  channel = MSG91_SMS_CHANNEL
) {
  await loadMSG91();

  if (!channel) {
    throw new Error(
      "MSG91 resend channel is required."
    );
  }

  return new Promise((resolve, reject) => {
    if (
      typeof window.retryOtp !== "function"
    ) {
      reject(
        new Error(
          "MSG91 retryOtp method is unavailable."
        )
      );
      return;
    }

    window.retryOtp(
      channel,
      (data) => {
        resolve(data);
      },
      (error) => {
        reject(
          new Error(
            error?.message ||
              "Unable to resend OTP. Please try again."
          )
        );
      }
    );
  });
}