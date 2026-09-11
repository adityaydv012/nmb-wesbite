import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Admin authorization token is required.",
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
        message: "Admin authorization token is missing.",
      });
    }

    if (!process.env.ADMIN_JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Admin authentication configuration is missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET
    );

    if (!decoded.adminId) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token.",
      });
    }

    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Admin account is inactive or not found.",
      });
    }

    req.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Admin session has expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

export default adminMiddleware;