import express from "express";

import {
  getPublicGstSettings,
} from "../controllers/settings.controller.js";

const router = express.Router();

/* ============================================
   PUBLIC GST SETTINGS
   ============================================ */

router.get(
  "/gst",
  getPublicGstSettings
);

export default router;