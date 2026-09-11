import express from "express";
import twilio from "twilio";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();

// ============================================
// GET TWILIO VERIFY SERVICE
// ============================================

function getVerifyService() {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_VERIFY_SERVICE_SID,
  } = process.env;

  if (!TWILIO_ACCOUNT_SID) {
    throw new Error("TWILIO_ACCOUNT_SID is missing.");
  }

  if (!TWILIO_AUTH_TOKEN) {
    throw new Error("TWILIO_AUTH_TOKEN is missing.");
  }

  if (!TWILIO_VERIFY_SERVICE_SID) {
    throw new Error("TWILIO_VERIFY_SERVICE_SID is missing.");
  }

  const twilioClient = twilio(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
  );

  return twilioClient.verify.v2.services(
    TWILIO_VERIFY_SERVICE_SID
  );
}

// ============================================
// NORMALIZE PHONE NUMBER
// ============================================

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

  throw new Error("Please enter a valid phone number.");
}

// ============================================
// SEND OTP
// ============================================

router.post("/send-otp", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);

    const verifyService = getVerifyService();

    const verification =
      await verifyService.verifications.create({
        to: phone,
        channel: "sms",
      });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      status: verification.status,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to send OTP.",
    });
  }
});

// ============================================
// VERIFY OTP
// ============================================

router.post("/verify-otp", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const otp = String(req.body.otp || "").trim();

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required.",
      });
    }

    // Verify OTP with Twilio
    const verifyService = getVerifyService();

    const verificationCheck =
      await verifyService.verificationChecks.create({
        to: phone,
        code: otp,
      });

    // OTP is incorrect or expired
    if (verificationCheck.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // ========================================
    // FIND OR CREATE USER
    // ========================================

    let user = await User.findOne({ phone });

    let isNewUser = false;

    if (!user) {
      user = await User.create({
        phone,
        isProfileComplete: false,
        isActive: true,
      });

      isNewUser = true;
    }

    // ========================================
    // CREATE LOGIN TOKEN
    // ========================================

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Phone number verified successfully.",
      isNewUser,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.fullName || "",
        email: user.email || "",
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(400).json({
      success: false,
      message:
        error.message || "Failed to verify OTP.",
    });
  }
});

export default router;