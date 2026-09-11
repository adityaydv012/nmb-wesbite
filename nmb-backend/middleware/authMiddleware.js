// middleware/authMiddleware.js

import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    const token = authorization.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in backend .env file.");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration is missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
     * Keep the complete decoded token available.
     * Different controllers can use req.user.id,
     * req.user.userId, or req.user._id.
     */
    req.user = decoded;

    /*
     * Normalize the user ID so order controllers
     * can consistently use req.userId.
     */
    req.userId =
      decoded.userId ||
      decoded.id ||
      decoded._id ||
      decoded.user?._id ||
      decoded.user?.id ||
      null;

    if (!req.userId) {
      console.error("JWT does not contain a user ID:", decoded);

      return res.status(401).json({
        success: false,
        message: "Invalid token user information.",
      });
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your login session has expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;