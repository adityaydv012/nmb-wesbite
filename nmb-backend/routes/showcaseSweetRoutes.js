import express from "express";

import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getAllShowcaseSweets,
  getAllAdminShowcaseSweets,
  getShowcaseSweetById,
  createShowcaseSweet,
  updateShowcaseSweet,
  updateShowcaseSweetStatus,
  deleteShowcaseSweet,
} from "../controllers/showcaseSweetController.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

// GET /api/showcase-sweets
router.get(
  "/",
  getAllShowcaseSweets
);

/* =========================================================
   ADMIN
========================================================= */

// GET /api/showcase-sweets/admin
router.get(
  "/admin",
  adminMiddleware,
  getAllAdminShowcaseSweets
);

// GET /api/showcase-sweets/admin/:sweetId
router.get(
  "/admin/:sweetId",
  adminMiddleware,
  getShowcaseSweetById
);

// POST /api/showcase-sweets
router.post(
  "/",
  adminMiddleware,
  createShowcaseSweet
);

// PATCH /api/showcase-sweets/:sweetId
router.patch(
  "/:sweetId",
  adminMiddleware,
  updateShowcaseSweet
);

// PATCH /api/showcase-sweets/:sweetId/status
router.patch(
  "/:sweetId/status",
  adminMiddleware,
  updateShowcaseSweetStatus
);

// DELETE /api/showcase-sweets/:sweetId
router.delete(
  "/:sweetId",
  adminMiddleware,
  deleteShowcaseSweet
);

export default router;