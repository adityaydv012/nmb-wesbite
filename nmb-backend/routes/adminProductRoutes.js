import express from "express";

import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../controllers/adminProductController.js";

const router = express.Router();

router.get("/", adminMiddleware, getAllProducts);

router.get("/:productId", adminMiddleware, getProductById);

router.post("/", adminMiddleware, createProduct);

router.patch("/:productId", adminMiddleware, updateProduct);

router.patch(
  "/:productId/status",
  adminMiddleware,
  updateProductStatus
);

router.delete("/:productId", adminMiddleware, deleteProduct);

export default router;