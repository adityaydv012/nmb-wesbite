import mongoose from "mongoose";

import User from "../models/User.js";
import Order from "../models/Order.js";


// ==========================================
// GET ALL CUSTOMERS WITH ORDER STATISTICS
// ==========================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const userIds = users.map((user) => user._id);

    const orderStats = await Order.aggregate([
      {
        $match: {
          userId: {
            $in: userIds,
          },
        },
      },

      {
        $group: {
          _id: "$userId",

          totalOrders: {
            $sum: 1,
          },

          totalSpent: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const orderStatsMap = new Map(
      orderStats.map((item) => [
        item._id.toString(),
        {
          totalOrders: item.totalOrders,
          totalSpent: item.totalSpent,
        },
      ])
    );

    const formattedUsers = users.map((user) => {
      const stats =
        orderStatsMap.get(
          user._id.toString()
        ) || {
          totalOrders: 0,
          totalSpent: 0,
        };

      return {
        ...user,

        totalOrders: stats.totalOrders,

        totalSpent: stats.totalSpent,
      };
    });

    return res.status(200).json({
      success: true,

      message: "All users fetched successfully.",

      count: formattedUsers.length,

      users: formattedUsers,
    });
  } catch (error) {
    console.error(
      "Get All Users Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message: "Unable to fetch users.",

      error: error.message,
    });
  }
};


// ==========================================
// GET ONE CUSTOMER BY ID
// ==========================================

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate MongoDB ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Get all orders belonging to this user
    const orders = await Order.find({
      userId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    // Calculate total spent
    const totalSpent = orders.reduce(
      (sum, order) =>
        sum +
        Number(order.totalAmount || 0),
      0
    );

    return res.status(200).json({
      success: true,

      message:
        "User details fetched successfully.",

      user: {
        ...user,

        totalOrders: orders.length,

        totalSpent,
      },

      orders,
    });
  } catch (error) {
    console.error(
      "Get User By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to fetch user details.",

      error: error.message,
    });
  }
};


// ==========================================
// ACTIVATE / DEACTIVATE CUSTOMER
// ==========================================

export const updateUserStatus = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const { isActive } = req.body;

    // Validate MongoDB ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    // Validate isActive
    if (
      typeof isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "isActive must be a boolean value.",
      });
    }

    const user =
      await User.findByIdAndUpdate(
        userId,

        {
          isActive,
        },

        {
          new: true,

          runValidators: true,
        }
      )
        .select("-password")
        .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: `User ${
        isActive
          ? "activated"
          : "deactivated"
      } successfully.`,

      user,
    });
  } catch (error) {
    console.error(
      "Update User Status Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to update user status.",

      error: error.message,
    });
  }
};