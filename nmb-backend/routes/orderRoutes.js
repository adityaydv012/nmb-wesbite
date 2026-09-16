import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  verifyRazorpayPayment,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================
   CREATE ORDER
   ============================================ */

router.post(
  "/",
  authMiddleware,
  createOrder
);

/* ============================================
   VERIFY RAZORPAY PAYMENT
   ============================================ */

router.post(
  "/verify-payment",
  authMiddleware,
  verifyRazorpayPayment
);

/* ============================================
   GET LOGGED-IN USER ORDERS
   ============================================ */

router.get(
  "/",
  authMiddleware,
  getMyOrders
);

/* ============================================
   GET ONE ORDER
   ============================================ */

router.get(
  "/:orderId",
  authMiddleware,
  getOrderById
);

export default router;