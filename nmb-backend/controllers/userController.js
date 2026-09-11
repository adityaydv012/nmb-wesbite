import User from "../models/User.js";

// ============================================
// UPDATE CUSTOMER PROFILE
// ============================================

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { fullName, email } = req.body;

    // Validate full name
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    // Validate email if provided
    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // Update profile
    user.fullName = fullName.trim();

    if (email) {
      user.email = email.trim().toLowerCase();
    }

    user.isProfileComplete = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        email: user.email || "",
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

// ============================================
// GET CUSTOMER PROFILE
// ============================================

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select(
      "-__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile.",
    });
  }
};