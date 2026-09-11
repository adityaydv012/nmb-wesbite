import mongoose from "mongoose";
import Order from "../models/Order.js";

// ============================================
// GET ALL ORDERS
// ============================================

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullName phone email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully.",
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
      error: error.message,
    });
  }
};

// ============================================
// GET ONE ORDER
// ============================================

export const getAdminOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(orderId).populate(
      "userId",
      "fullName phone email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      order,
    });
  } catch (error) {
    console.error("Get Admin Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order.",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE ORDER STATUS
// ============================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Supports both frontend formats:
    // { status: "delivered" }
    // { orderStatus: "delivered" }
    const requestedStatus = req.body.status || req.body.orderStatus;

    const allowedStatuses = [
      "placed",
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    if (!requestedStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required.",
        allowedStatuses,
      });
    }

    const orderStatus = String(requestedStatus)
      .trim()
      .toLowerCase();

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
        allowedStatuses,
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("userId", "fullName phone email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE PAYMENT STATUS
// ============================================

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Supports both frontend formats:
    // { paymentStatus: "paid" }
    // { status: "paid" }
    const requestedPaymentStatus =
      req.body.paymentStatus || req.body.status;

    const allowedPaymentStatuses = [
      "pending",
      "paid",
      "failed",
    ];

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    if (!requestedPaymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required.",
        allowedPaymentStatuses,
      });
    }

    const paymentStatus = String(requestedPaymentStatus)
      .trim()
      .toLowerCase();

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
        allowedPaymentStatuses,
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("userId", "fullName phone email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update Payment Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update payment status.",
      error: error.message,
    });
  }
};