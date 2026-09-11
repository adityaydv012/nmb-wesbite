import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  updateProfile,
  getProfile,
} from "../controllers/userController.js";

const router = express.Router();

// Get logged-in customer's profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

// Update logged-in customer's profile
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

export default router;