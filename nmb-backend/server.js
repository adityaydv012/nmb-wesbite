// nmb-backend/server.js

import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

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

import connectDB from "./config/db.js";

// ============================================
// APP
// ============================================

const app = express();

// ============================================
// PORT
// ============================================

const PORT = process.env.PORT || 5001;

// ============================================
// ALLOWED FRONTEND ORIGINS
// ============================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

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

// ============================================
// CORS
// ============================================

app.use(
  cors({
    origin: function (
      origin,
      callback
    ) {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `CORS policy blocked this origin: ${origin}`
        )
      );
    },

    credentials: true,
  })
);

// ============================================
// BODY PARSER
// ============================================

app.use(express.json());

// ============================================
// ROOT
// ============================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "NMB Backend is running",
  });
});

// ============================================
// AUTH
// ============================================

app.use(
  "/api/auth",
  authRoutes
);

// ============================================
// USER
// ============================================

app.use(
  "/api/user",
  userRoutes
);

// ============================================
// ADDRESSES
// ============================================

app.use(
  "/api/user/addresses",
  addressRoutes
);

// ============================================
// ORDERS
// ============================================

app.use(
  "/api/orders",
  orderRoutes
);

// ============================================
// PUBLIC PRODUCTS
// ============================================

app.use(
  "/api/products",
  productRoutes
);

// ============================================
// SHOWCASE SWEETS
// ============================================

app.use(
  "/api/showcase-sweets",
  showcaseSweetRoutes
);

// ============================================
// ADMIN AUTH
// ============================================

app.use(
  "/api/admin/auth",
  adminAuthRoutes
);

// ============================================
// ADMIN
// ============================================

app.use(
  "/api/admin",
  adminRoutes
);


app.use("/api/admin/settings", settingsRoutes);

app.use(
  "/api/settings",
  settingsPublicRoutes
);

app.use(
  "/api/admin/settings",
  settingsRoutes
);
// ============================================
// DATABASE
// ============================================

connectDB();

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log("");
  console.log(
    "============================================"
  );
  console.log(
    "NMB BACKEND SERVER"
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

  allowedOrigins.forEach(
    (origin) => {
      console.log(`- ${origin}`);
    }
  );

  console.log(
    "============================================"
  );
  console.log("");
});