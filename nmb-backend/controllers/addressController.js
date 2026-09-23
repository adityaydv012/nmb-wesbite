import mongoose from "mongoose";

import User from "../models/User.js";

/* ============================================
   HELPER
============================================ */

const normalizePhone = (phone = "") => {
  return String(phone)
    .trim()
    .replace(/\s+/g, "");
};

/* ============================================
   ADD ADDRESS
============================================ */

export const addAddress = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId;

    const {
      fullName,
      phone,
      houseNo,
      area,
      landmark,
      city,
      state,
      pincode,
      addressType,
      isDefault,
    } = req.body;

    /* ==========================================
       REQUIRED FIELDS
    ========================================== */

    if (
      !fullName ||
      !phone ||
      !houseNo ||
      !area ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Full name, phone, house number, area, city, state and pincode are required.",
      });
    }

    /* ==========================================
       CLEAN VALUES
    ========================================== */

    const cleanedFullName =
      String(fullName).trim();

    const cleanedPhone =
      normalizePhone(phone);

    const cleanedHouseNo =
      String(houseNo).trim();

    const cleanedArea =
      String(area).trim();

    const cleanedLandmark =
      String(landmark || "").trim();

    const cleanedCity =
      String(city).trim();

    const cleanedState =
      String(state).trim();

    const cleanedPincode =
      String(pincode).trim();

    /* ==========================================
       NAME VALIDATION
    ========================================== */

    if (cleanedFullName.length < 2) {
      return res.status(400).json({
        success: false,

        message:
          "Please enter a valid full name.",
      });
    }

    /* ==========================================
       PHONE VALIDATION
       
       Supports:
       9876543210
       +919876543210
       919876543210
    ========================================== */

    const phoneDigits =
      cleanedPhone.replace(/\D/g, "");

    let normalizedPhone = "";

    if (
      phoneDigits.length === 10
    ) {
      normalizedPhone =
        `+91${phoneDigits}`;
    } else if (
      phoneDigits.length === 12 &&
      phoneDigits.startsWith("91")
    ) {
      normalizedPhone =
        `+${phoneDigits}`;
    } else {
      return res.status(400).json({
        success: false,

        message:
          "Please enter a valid 10-digit mobile number.",
      });
    }

    /* ==========================================
       PINCODE VALIDATION
    ========================================== */

    if (
      !/^\d{6}$/.test(
        cleanedPincode
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Please enter a valid 6-digit pincode.",
      });
    }

    /* ==========================================
       FIND USER
    ========================================== */

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,

        message:
          "Customer not found.",
      });
    }

    /* ==========================================
       FIRST ADDRESS = DEFAULT
    ========================================== */

    const shouldBeDefault =
      user.addresses.length === 0 ||
      isDefault === true;

    /* ==========================================
       REMOVE OLD DEFAULT
    ========================================== */

    if (shouldBeDefault) {
      user.addresses.forEach(
        (address) => {
          address.isDefault = false;
        }
      );
    }

    /* ==========================================
       ADD ADDRESS
    ========================================== */

    user.addresses.push({
      fullName:
        cleanedFullName,

      phone:
        normalizedPhone,

      houseNo:
        cleanedHouseNo,

      area:
        cleanedArea,

      landmark:
        cleanedLandmark,

      city:
        cleanedCity,

      state:
        cleanedState,

      pincode:
        cleanedPincode,

      addressType:
        addressType || "Home",

      isDefault:
        shouldBeDefault,
    });

    await user.save();

    /* ==========================================
       GET NEW ADDRESS
    ========================================== */

    const newAddress =
      user.addresses[
        user.addresses.length - 1
      ];

    return res.status(201).json({
      success: true,

      message:
        "Address added successfully.",

      address:
        newAddress,
    });
  } catch (error) {
    console.error(
      "Add Address Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to add address.",

      error:
        error.message,
    });
  }
};

/* ============================================
   GET ADDRESSES
============================================ */

export const getAddresses = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId;

    const user =
      await User.findById(
        userId
      ).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,

        message:
          "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,

      addresses:
        user.addresses,
    });
  } catch (error) {
    console.error(
      "Get Addresses Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get addresses.",

      error:
        error.message,
    });
  }
};

/* ============================================
   UPDATE ADDRESS
============================================ */

export const updateAddress =
  async (req, res) => {
    try {
      const userId =
        req.user.userId;

      const {
        addressId,
      } = req.params;

      /* ========================================
         VALIDATE ADDRESS ID
      ======================================== */

      if (
        !mongoose.Types.ObjectId.isValid(
          addressId
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid address ID.",
        });
      }

      /* ========================================
         FIND USER
      ======================================== */

      const user =
        await User.findById(
          userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "Customer not found.",
        });
      }

      /* ========================================
         FIND ADDRESS
      ======================================== */

      const address =
        user.addresses.id(
          addressId
        );

      if (!address) {
        return res.status(404).json({
          success: false,

          message:
            "Address not found.",
        });
      }

      /* ========================================
         REQUEST DATA
      ======================================== */

      const {
        fullName,
        phone,
        houseNo,
        area,
        landmark,
        city,
        state,
        pincode,
        addressType,
        isDefault,
      } = req.body;

      /* ========================================
         UPDATE NAME
      ======================================== */

      if (
        fullName !== undefined
      ) {
        const cleanedName =
          String(
            fullName
          ).trim();

        if (
          cleanedName.length < 2
        ) {
          return res.status(400).json({
            success: false,

            message:
              "Please enter a valid full name.",
          });
        }

        address.fullName =
          cleanedName;
      }

      /* ========================================
         UPDATE PHONE
      ======================================== */

      if (
        phone !== undefined
      ) {
        const digits =
          String(phone)
            .replace(/\D/g, "");

        if (
          digits.length !== 10 &&
          !(
            digits.length === 12 &&
            digits.startsWith("91")
          )
        ) {
          return res.status(400).json({
            success: false,

            message:
              "Please enter a valid 10-digit mobile number.",
          });
        }

        address.phone =
          digits.length === 10
            ? `+91${digits}`
            : `+${digits}`;
      }

      /* ========================================
         UPDATE HOUSE
      ======================================== */

      if (
        houseNo !== undefined
      ) {
        address.houseNo =
          String(
            houseNo
          ).trim();
      }

      /* ========================================
         UPDATE AREA
      ======================================== */

      if (
        area !== undefined
      ) {
        address.area =
          String(
            area
          ).trim();
      }

      /* ========================================
         UPDATE LANDMARK
      ======================================== */

      if (
        landmark !== undefined
      ) {
        address.landmark =
          String(
            landmark
          ).trim();
      }

      /* ========================================
         UPDATE CITY
      ======================================== */

      if (
        city !== undefined
      ) {
        address.city =
          String(
            city
          ).trim();
      }

      /* ========================================
         UPDATE STATE
      ======================================== */

      if (
        state !== undefined
      ) {
        address.state =
          String(
            state
          ).trim();
      }

      /* ========================================
         UPDATE PINCODE
      ======================================== */

      if (
        pincode !== undefined
      ) {
        const cleanedPincode =
          String(
            pincode
          ).trim();

        if (
          !/^\d{6}$/.test(
            cleanedPincode
          )
        ) {
          return res.status(400).json({
            success: false,

            message:
              "Please enter a valid 6-digit pincode.",
          });
        }

        address.pincode =
          cleanedPincode;
      }

      /* ========================================
         ADDRESS TYPE
      ======================================== */

      if (
        addressType !== undefined
      ) {
        address.addressType =
          addressType;
      }

      /* ========================================
         DEFAULT ADDRESS
      ======================================== */

      if (
        isDefault === true
      ) {
        user.addresses.forEach(
          (item) => {
            item.isDefault = false;
          }
        );

        address.isDefault =
          true;
      }

      await user.save();

      return res.status(200).json({
        success: true,

        message:
          "Address updated successfully.",

        address,
      });
    } catch (error) {
      console.error(
        "Update Address Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to update address.",

        error:
          error.message,
      });
    }
  };

/* ============================================
   SET DEFAULT ADDRESS
============================================ */

export const setDefaultAddress =
  async (req, res) => {
    try {
      const userId =
        req.user.userId;

      const {
        addressId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          addressId
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid address ID.",
        });
      }

      const user =
        await User.findById(
          userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "Customer not found.",
        });
      }

      const selectedAddress =
        user.addresses.id(
          addressId
        );

      if (!selectedAddress) {
        return res.status(404).json({
          success: false,

          message:
            "Address not found.",
        });
      }

      user.addresses.forEach(
        (address) => {
          address.isDefault = false;
        }
      );

      selectedAddress.isDefault =
        true;

      await user.save();

      return res.status(200).json({
        success: true,

        message:
          "Default address updated successfully.",

        address:
          selectedAddress,
      });
    } catch (error) {
      console.error(
        "Set Default Address Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to set default address.",

        error:
          error.message,
      });
    }
  };

/* ============================================
   DELETE ADDRESS
============================================ */

export const deleteAddress =
  async (req, res) => {
    try {
      const userId =
        req.user.userId;

      const {
        addressId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          addressId
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid address ID.",
        });
      }

      const user =
        await User.findById(
          userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "Customer not found.",
        });
      }

      const address =
        user.addresses.id(
          addressId
        );

      if (!address) {
        return res.status(404).json({
          success: false,

          message:
            "Address not found.",
        });
      }

      const wasDefault =
        address.isDefault;

      address.deleteOne();

      /* ========================================
         MAKE FIRST REMAINING ADDRESS DEFAULT
      ======================================== */

      if (
        wasDefault &&
        user.addresses.length > 0
      ) {
        user.addresses[0].isDefault =
          true;
      }

      await user.save();

      return res.status(200).json({
        success: true,

        message:
          "Address deleted successfully.",

        addresses:
          user.addresses,
      });
    } catch (error) {
      console.error(
        "Delete Address Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to delete address.",

        error:
          error.message,
      });
    }
  };