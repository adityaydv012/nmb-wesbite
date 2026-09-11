import Order from "../models/Order.js";

// ============================================
// CREATE ORDER
// ============================================

export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to place an order.",
      });
    }

    const {
      customerName,
      customerPhone,
      deliveryAddress,
      items,
      subtotal,
      gst,
      deliveryCharge,
      totalAmount,
      paymentMethod,
    } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Customer name and phone are required.",
      });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.houseNo ||
      !deliveryAddress.area ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.pinCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery address is required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required.",
      });
    }

   const order = await Order.create({
  userId,
  customerName,
  customerPhone,
  deliveryAddress,
  items,
  subtotal: Number(subtotal || 0),
  gst: Number(gst || 0),
  deliveryCharge: Number(deliveryCharge || 0),
  totalAmount: Number(totalAmount || 0),
  paymentMethod: paymentMethod || "cod",
  paymentStatus: "pending",
  orderStatus: "placed",
});

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to place order.",
      error: error.message,
    });
  }
};

// ============================================
// GET LOGGED-IN USER ORDERS
// ============================================

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to view orders.",
      });
    }

    const orders = await Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
      error: error.message,
    });
  }
};

// ============================================
// GET ONE ORDER
// ============================================

export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to view this order.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order.",
      error: error.message,
    });
  }
};