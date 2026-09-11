import express from "express";

import {
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// Public product APIs
router.get("/", getAllProducts);

router.get("/:productId", getProductById);

export default router;