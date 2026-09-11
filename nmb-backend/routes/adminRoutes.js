import express from "express";

import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getDashboardStats,
} from "../controllers/adminDashboardController.js";

import {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/adminOrderController.js";

import {
  getAllUsers,
  getUserById,
  updateUserStatus,
} from "../controllers/adminUserController.js";

import adminProductRoutes from "./adminProductRoutes.js";

const router = express.Router();


// ==========================================
// DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  adminMiddleware,
  getDashboardStats
);


// ==========================================
// PRODUCT MANAGEMENT
// ==========================================

router.use(
  "/products",
  adminProductRoutes
);


// ==========================================
// ORDER MANAGEMENT
// ==========================================

router.get(
  "/orders",
  adminMiddleware,
  getAllOrders
);

router.get(
  "/orders/:orderId",
  adminMiddleware,
  getAdminOrderById
);

router.patch(
  "/orders/:orderId/status",
  adminMiddleware,
  updateOrderStatus
);

router.patch(
  "/orders/:orderId/payment-status",
  adminMiddleware,
  updatePaymentStatus
);


// ==========================================
// USER MANAGEMENT
// ==========================================

// Get all users
router.get(
  "/users",
  adminMiddleware,
  getAllUsers
);


// Get single user
router.get(
  "/users/:userId",
  adminMiddleware,
  getUserById
);


// Activate / Block user
router.patch(
  "/users/:userId/status",
  adminMiddleware,
  updateUserStatus
);


export default router;