import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* =========================================================
   NORMALIZE PHONE NUMBER
   ========================================================= */

function normalizePhone(phone) {
  const value = String(phone || "").trim();

  const digits = value.replace(/\D/g, "");

  // Indian 10-digit number
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  // International number
  if (
    value.startsWith("+") &&
    digits.length >= 8 &&
    digits.length <= 15
  ) {
    return `+${digits}`;
  }

  throw new Error(
    "Please enter a valid phone number."
  );
};

/* =========================================================
   MSG91 ACCESS TOKEN VERIFICATION
   ========================================================= */

async function verifyMSG91AccessToken(
  accessToken
) {
  const authKey =
    process.env.MSG91_AUTH_KEY;

  if (!authKey) {
    throw new Error(
      "MSG91_AUTH_KEY is missing from backend environment variables."
    );
  }

  if (!accessToken) {
    throw new Error(
      "MSG91 access token is required."
    );
  }

  const response = await fetch(
    "https://control.msg91.com/api/v5/widget/verifyAccessToken",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({
        authkey: authKey,

        "access-token": accessToken,
      }),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Invalid response received from MSG91."
    );
  }

  console.log(
    "MSG91 Access Token Response:",
    data
  );

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "MSG91 access token verification failed."
    );
  }

  if (
    data?.type === "error" ||
    data?.success === false ||
    data?.status === "error"
  ) {
    throw new Error(
      data?.message ||
        "MSG91 access token is invalid or expired."
    );
  }

  return data;
};

/* =========================================================
   MSG91 VERIFY + LOGIN
   ========================================================= */

router.post(
  "/msg91/verify",
  async (req, res) => {
    try {
      const {
        phone,
        accessToken,
      } = req.body;

      /* ---------------------------------------------------
         VALIDATE REQUEST
      --------------------------------------------------- */

      if (!phone) {
        return res.status(400).json({
          success: false,
          message:
            "Phone number is required.",
        });
      }

      if (!accessToken) {
        return res.status(400).json({
          success: false,
          message:
            "MSG91 access token is required.",
        });
      }

      /* ---------------------------------------------------
         NORMALIZE PHONE
      --------------------------------------------------- */

      const normalizedPhone =
        normalizePhone(phone);

      /* ---------------------------------------------------
         VERIFY WITH MSG91
      --------------------------------------------------- */

      const msg91Data =
        await verifyMSG91AccessToken(
          accessToken
        );

      console.log(
        "MSG91 user verified:",
        msg91Data
      );

      /* ---------------------------------------------------
         FIND USER
      --------------------------------------------------- */

      let user = await User.findOne({
        phone: normalizedPhone,
      });

      let isNewUser = false;

      /* ---------------------------------------------------
         CREATE USER IF NOT EXISTS
      --------------------------------------------------- */

      if (!user) {
        user = await User.create({
          phone: normalizedPhone,

          isProfileComplete: false,

          isActive: true,
        });

        isNewUser = true;
      }

      /* ---------------------------------------------------
         CHECK USER STATUS
      --------------------------------------------------- */

      if (!user.isActive) {
        return res.status(403).json({
          success: false,

          message:
            "Your account has been blocked. Please contact Narayan Misthan Bhandar.",
        });
      }

      /* ---------------------------------------------------
         JWT SECRET
      --------------------------------------------------- */

      if (!process.env.JWT_SECRET) {
        throw new Error(
          "JWT_SECRET is missing from backend environment variables."
        );
      }

      /* ---------------------------------------------------
         CREATE NMB JWT
      --------------------------------------------------- */

      const token = jwt.sign(
        {
          userId:
            user._id.toString(),

          phone: user.phone,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }
      );

      /* ---------------------------------------------------
         RESPONSE
      --------------------------------------------------- */

      return res.status(200).json({
        success: true,

        message:
          "Phone number verified successfully.",

        isNewUser,

        token,

        user: {
          id: user._id,

          phone: user.phone,

          name:
            user.fullName || "",

          email:
            user.email || "",

          isProfileComplete:
            user.isProfileComplete,
        },
      });
    } catch (error) {
      console.error(
        "MSG91 Verify Login Error:",
        error
      );

      return res.status(400).json({
        success: false,

        message:
          error.message ||
          "Unable to verify mobile number.",
      });
    }
  }
);

/* =========================================================
   OLD TWILIO AUTHENTICATION
   =========================================================

   KEEPING THIS COMMENTED FOR FUTURE USE.

   If you ever want to switch back to Twilio,
   uncomment the Twilio import, helper and routes,
   then remove/disable the MSG91 routes.

========================================================= */

/*

import twilio from "twilio";


/* =========================================================
   TWILIO VERIFY SERVICE
========================================================= *\/

function getVerifyService() {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_VERIFY_SERVICE_SID,
  } = process.env;

  if (!TWILIO_ACCOUNT_SID) {
    throw new Error(
      "TWILIO_ACCOUNT_SID is missing."
    );
  }

  if (!TWILIO_AUTH_TOKEN) {
    throw new Error(
      "TWILIO_AUTH_TOKEN is missing."
    );
  }

  if (!TWILIO_VERIFY_SERVICE_SID) {
    throw new Error(
      "TWILIO_VERIFY_SERVICE_SID is missing."
    );
  }

  const twilioClient = twilio(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
  );

  return twilioClient.verify.v2.services(
    TWILIO_VERIFY_SERVICE_SID
  );
}


/* =========================================================
   TWILIO SEND OTP
========================================================= *\/

router.post(
  "/twilio/send-otp",
  async (req, res) => {
    try {
      const phone = normalizePhone(
        req.body.phone
      );

      const verifyService =
        getVerifyService();

      const verification =
        await verifyService.verifications.create(
          {
            to: phone,
            channel: "sms",
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "OTP sent successfully.",
        status:
          verification.status,
      });
    } catch (error) {
      console.error(
        "Twilio Send OTP Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to send OTP.",
      });
    }
  }
);


/* =========================================================
   TWILIO VERIFY OTP
========================================================= *\/

router.post(
  "/twilio/verify-otp",
  async (req, res) => {
    try {
      const phone = normalizePhone(
        req.body.phone
      );

      const otp = String(
        req.body.otp || ""
      ).trim();

      if (!otp) {
        return res.status(400).json({
          success: false,
          message:
            "OTP is required.",
        });
      }

      const verifyService =
        getVerifyService();

      const verificationCheck =
        await verifyService.verificationChecks.create(
          {
            to: phone,
            code: otp,
          }
        );

      if (
        verificationCheck.status !==
        "approved"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid or expired OTP.",
        });
      }

      let user =
        await User.findOne({
          phone,
        });

      let isNewUser = false;

      if (!user) {
        user = await User.create({
          phone,
          isProfileComplete: false,
          isActive: true,
        });

        isNewUser = true;
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message:
            "Your account has been blocked.",
        });
      }

      const token = jwt.sign(
        {
          userId:
            user._id.toString(),
          phone: user.phone,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "Phone number verified successfully.",
        isNewUser,
        token,
        user: {
          id: user._id,
          phone: user.phone,
          name:
            user.fullName || "",
          email:
            user.email || "",
          isProfileComplete:
            user.isProfileComplete,
        },
      });
    } catch (error) {
      console.error(
        "Twilio Verify OTP Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to verify OTP.",
      });
    }
  }
);

*/

/* =========================================================
   EXPORT ROUTER
   ========================================================= */

export default router;