import mongoose from "mongoose";
import User from "../models/User.js";

// ============================================
// ADD ADDRESS
// ============================================

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

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

    // Required fields
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

    // Validate pincode
    if (!/^\d{6}$/.test(String(pincode))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit pincode.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // If this is the first address, automatically make it default
    const shouldBeDefault =
      user.addresses.length === 0 || isDefault === true;

    // If this address should be default,
    // remove default from existing addresses
    if (shouldBeDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    user.addresses.push({
      fullName: fullName.trim(),
      phone: String(phone).trim(),
      houseNo: houseNo.trim(),
      area: area.trim(),
      landmark: landmark?.trim() || "",
      city: city.trim(),
      state: state.trim(),
      pincode: String(pincode).trim(),
      addressType: addressType || "Home",
      isDefault: shouldBeDefault,
    });

    await user.save();

    const newAddress =
      user.addresses[user.addresses.length - 1];

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      address: newAddress,
    });
  } catch (error) {
    console.error("Add Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add address.",
    });
  }
};

// ============================================
// GET ADDRESSES
// ============================================

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select(
      "addresses"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Get Addresses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get addresses.",
    });
  }
};

// ============================================
// UPDATE ADDRESS
// ============================================

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

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

    if (pincode && !/^\d{6}$/.test(String(pincode))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit pincode.",
      });
    }

    if (fullName !== undefined) {
      address.fullName = fullName.trim();
    }

    if (phone !== undefined) {
      address.phone = String(phone).trim();
    }

    if (houseNo !== undefined) {
      address.houseNo = houseNo.trim();
    }

    if (area !== undefined) {
      address.area = area.trim();
    }

    if (landmark !== undefined) {
      address.landmark = landmark.trim();
    }

    if (city !== undefined) {
      address.city = city.trim();
    }

    if (state !== undefined) {
      address.state = state.trim();
    }

    if (pincode !== undefined) {
      address.pincode = String(pincode).trim();
    }

    if (addressType !== undefined) {
      address.addressType = addressType;
    }

    // Set this address as default
    if (isDefault === true) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });

      address.isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      address,
    });
  } catch (error) {
    console.error("Update Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update address.",
    });
  }
};

// ============================================
// SET DEFAULT ADDRESS
// ============================================

export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const selectedAddress = user.addresses.id(addressId);

    if (!selectedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    user.addresses.forEach((address) => {
      address.isDefault = false;
    });

    selectedAddress.isDefault = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully.",
      address: selectedAddress,
    });
  } catch (error) {
    console.error(
      "Set Default Address Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to set default address.",
    });
  }
};

// ============================================
// DELETE ADDRESS
// ============================================

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const wasDefault = address.isDefault;

    address.deleteOne();

    // If we deleted the default address,
    // make the first remaining address default.
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Delete Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete address.",
    });
  }
};