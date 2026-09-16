import express from "express";
import {
  getGstSettings,
  updateGstSettings,
} from "../controllers/settings.controller.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/gst", adminMiddleware, getGstSettings);
router.patch("/gst", adminMiddleware, updateGstSettings);

export default router;