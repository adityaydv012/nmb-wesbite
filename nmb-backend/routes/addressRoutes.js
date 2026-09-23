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

/* ============================================
   GET ALL ADDRESSES
============================================ */

router.get(
  "/",
  authMiddleware,
  getAddresses
);

/* ============================================
   ADD ADDRESS
============================================ */

router.post(
  "/",
  authMiddleware,
  addAddress
);

/* ============================================
   UPDATE ADDRESS
============================================ */

router.put(
  "/:addressId",
  authMiddleware,
  updateAddress
);

/* ============================================
   SET DEFAULT ADDRESS
============================================ */

router.put(
  "/:addressId/default",
  authMiddleware,
  setDefaultAddress
);

/* ============================================
   DELETE ADDRESS
============================================ */

router.delete(
  "/:addressId",
  authMiddleware,
  deleteAddress
);

export default router;