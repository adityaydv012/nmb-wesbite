import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  addAddress,
  getAddresses,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();

// Get all addresses
router.get(
  "/",
  authMiddleware,
  getAddresses
);

// Add new address
router.post(
  "/",
  authMiddleware,
  addAddress
);

// Update address
router.put(
  "/:addressId",
  authMiddleware,
  updateAddress
);

// Set default address
router.put(
  "/:addressId/default",
  authMiddleware,
  setDefaultAddress
);

// Delete address
router.delete(
  "/:addressId",
  authMiddleware,
  deleteAddress
);

export default router;