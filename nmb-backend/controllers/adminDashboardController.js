import User from "../models/User.js";
import Order from "../models/Order.js";

// ============================================
// GET ADMIN DASHBOARD STATISTICS
// ============================================

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments(),

      Order.countDocuments(),

      Order.countDocuments({
        orderStatus: "pending",
      }),

      Order.countDocuments({
        orderStatus: "confirmed",
      }),

      Order.countDocuments({
        orderStatus: "processing",
      }),

      Order.countDocuments({
        orderStatus: "shipped",
      }),

      Order.countDocuments({
        orderStatus: "delivered",
      }),

      Order.countDocuments({
        orderStatus: "cancelled",
      }),

      Order.aggregate([
        {
          $match: {
            orderStatus: {
              $nin: ["cancelled"],
            },
            paymentStatus: {
              $in: ["pending", "paid"],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully.",

      stats: {
        totalUsers,
        totalOrders,
        totalRevenue,

        orders: {
          pending: pendingOrders,
          confirmed: confirmedOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics.",
      error: error.message,
    });
  }
};