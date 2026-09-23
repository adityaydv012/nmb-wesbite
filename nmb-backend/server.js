// ============================================================
// NMB BACKEND - server.js
// ============================================================

import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

// ============================================================
// ROUTES
// ============================================================

import authRoutes from "./routes/authRoutes.js";

import userRoutes from "./routes/userRoutes.js";

import addressRoutes from "./routes/addressRoutes.js";

import orderRoutes from "./routes/orderRoutes.js";

import adminAuthRoutes from "./routes/adminAuthRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";

import productRoutes from "./routes/productRoutes.js";

import showcaseSweetRoutes from "./routes/showcaseSweetRoutes.js";

import settingsRoutes from "./routes/settings.routes.js";

import settingsPublicRoutes from "./routes/settings.public.routes.js";

// ============================================================
// DATABASE
// ============================================================

import connectDB from "./config/db.js";

// ============================================================
// APP
// ============================================================

const app = express();

// ============================================================
// PORT
// ============================================================

const PORT = process.env.PORT || 5001;

// ============================================================
// ALLOWED FRONTEND ORIGINS
// ============================================================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",

  // Production website
  "https://nmbsweets.com",

  // Admin panel
  "https://nmb-panel.netlify.app",
];

// ============================================================
// ADD FRONTEND_URL FROM ENV IF PROVIDED
// ============================================================

if (
  process.env.FRONTEND_URL &&
  !allowedOrigins.includes(
    process.env.FRONTEND_URL
  )
) {
  allowedOrigins.push(
    process.env.FRONTEND_URL
  );
}

// ============================================================
// CORS
// ============================================================

app.use(
  cors({
    origin: function (origin, callback) {
      /*
       * Allow requests that don't contain an Origin header.
       *
       * This is useful for:
       * - Postman
       * - server-to-server requests
       * - some development tools
       */

      if (!origin) {
        return callback(null, true);
      }

      /*
       * Allow registered frontend origins.
       */

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      /*
       * Block unknown origins.
       */

      return callback(
        new Error(
          `CORS policy blocked this origin: ${origin}`
        )
      );
    },

    credentials: true,
  })
);

// ============================================================
// BODY PARSER
// ============================================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ============================================================
// ROOT
// ============================================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "NMB Backend is running",
  });
});

// ============================================================
// AUTH
// ============================================================
//
// IMPORTANT:
//
// authRoutes.js is mounted here:
//
// /api/auth
//
// Therefore:
//
// router.post("/msg91/verify")
//
// becomes:
//
// POST /api/auth/msg91/verify
//
// ============================================================

app.use(
  "/api/auth",
  authRoutes
);

// ============================================================
// USER
// ============================================================

app.use(
  "/api/user",
  userRoutes
);

// ============================================================
// ADDRESSES
// ============================================================

app.use(
  "/api/user/addresses",
  addressRoutes
);

// ============================================================
// ORDERS
// ============================================================

app.use(
  "/api/orders",
  orderRoutes
);

// ============================================================
// PUBLIC PRODUCTS
// ============================================================

app.use(
  "/api/products",
  productRoutes
);

// ============================================================
// SHOWCASE SWEETS
// ============================================================

app.use(
  "/api/showcase-sweets",
  showcaseSweetRoutes
);

// ============================================================
// ADMIN AUTH
// ============================================================

app.use(
  "/api/admin/auth",
  adminAuthRoutes
);

// ============================================================
// ADMIN
// ============================================================

app.use(
  "/api/admin",
  adminRoutes
);

// ============================================================
// ADMIN SETTINGS
// ============================================================

app.use(
  "/api/admin/settings",
  settingsRoutes
);

// ============================================================
// PUBLIC SETTINGS
// ============================================================

app.use(
  "/api/settings",
  settingsPublicRoutes
);

// ============================================================
// DATABASE
// ============================================================

connectDB();

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log("");

  console.log(
    "============================================"
  );

  console.log(
    "        NMB BACKEND SERVER"
  );

  console.log(
    "============================================"
  );

  console.log(
    `Backend: http://localhost:${PORT}`
  );

  console.log(
    `API:     http://localhost:${PORT}/api`
  );

  console.log("");

  console.log(
    "Allowed frontend origins:"
  );

  allowedOrigins.forEach((origin) => {
    console.log(`- ${origin}`);
  });

  console.log("");

  console.log(
    "Authentication:"
  );

  console.log(
    `- MSG91 Verify: http://localhost:${PORT}/api/auth/msg91/verify`
  );

  console.log(
    "- Twilio: commented out / available for future use"
  );

  console.log("");

  console.log(
    "============================================"
  );

  console.log("");
});