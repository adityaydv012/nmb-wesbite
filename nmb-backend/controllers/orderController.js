import crypto from "crypto";
import Order from "../models/Order.js";
import { razorpay } from "../config/razorpay.js";

/* ============================================
   DELIVERY FEE CONFIGURATION
   ============================================ */

const UP_STATE_NAME = "uttar pradesh";

const DELIVERY_RATE_UP_TO_3_KG = 100;
const DELIVERY_RATE_ABOVE_3_KG = 50;
const DELIVERY_WEIGHT_THRESHOLD = 3;

/* ============================================
   STATE NORMALIZATION
   ============================================ */

const normalizeState = (state = "") => {
  return String(state)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const isUttarPradesh = (state = "") => {
  const normalized = normalizeState(state);

  return (
    normalized === UP_STATE_NAME ||
    normalized === "up" ||
    normalized === "uttar pradesh, india" ||
    normalized === "uttar pradesh india"
  );
};

/* ============================================
   PARSE PRODUCT WEIGHT
   ============================================ */

const parseWeightInKg = (weight) => {
  if (weight === null || weight === undefined) {
    return 0;
  }

  const value = String(weight)
    .trim()
    .toLowerCase()
    .replace(/,/g, "");

  if (!value) {
    return 0;
  }

  const match = value.match(
    /(\d+(?:\.\d+)?)\s*(kg|kgs|kilogram|kilograms|g|gm|gms|gram|grams)?/
  );

  if (!match) {
    return 0;
  }

  const numericValue = Number(match[1]);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  const unit = match[2] || "kg";

  if (
    unit === "g" ||
    unit === "gm" ||
    unit === "gms" ||
    unit === "gram" ||
    unit === "grams"
  ) {
    return numericValue / 1000;
  }

  return numericValue;
};

/* ============================================
   CALCULATE TOTAL ORDER WEIGHT
   ============================================ */

const calculateOrderWeight = (items = []) => {
  return items.reduce((total, item) => {
    const weightInKg = parseWeightInKg(item?.weight);

    const quantity = Number(item?.quantity || 0);

    if (
      !Number.isFinite(weightInKg) ||
      !Number.isFinite(quantity)
    ) {
      return total;
    }

    return total + weightInKg * quantity;
  }, 0);
};

/* ============================================
   CALCULATE DELIVERY CHARGE
   ============================================ */

const calculateDeliveryCharge = (
  state,
  totalWeightKg
) => {
  const weight = Number(totalWeightKg || 0);

  if (weight <= 0) {
    return 0;
  }

  /* ============================================
     UTTAR PRADESH = FREE DELIVERY
     ============================================ */

  if (isUttarPradesh(state)) {
    return 0;
  }

  /* ============================================
     OUTSIDE UP - UP TO 3KG
     ₹100 / KG
     ============================================ */

  if (weight <= DELIVERY_WEIGHT_THRESHOLD) {
    return Math.round(
      weight * DELIVERY_RATE_UP_TO_3_KG
    );
  }

  /* ============================================
     OUTSIDE UP - ABOVE 3KG
     ₹50 / KG
     ============================================ */

  return Math.round(
    weight * DELIVERY_RATE_ABOVE_3_KG
  );
};

/* ============================================
   CREATE ORDER
   ============================================ */

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
      paymentMethod,
    } = req.body;

    /* ==========================================
       BASIC VALIDATION
       ========================================== */

    if (!customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name and phone are required.",
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
        message:
          "Complete delivery address is required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required.",
      });
    }

    /* ==========================================
       PAYMENT METHOD
       ========================================== */

    const normalizedPaymentMethod =
      paymentMethod === "online"
        ? "online"
        : "cod";

    /* ==========================================
       CALCULATE TOTAL WEIGHT
       ========================================== */

    const totalWeightKg =
      calculateOrderWeight(items);

    /* ==========================================
       CALCULATE DELIVERY CHARGE
       SERVER-SIDE
       ========================================== */

    const calculatedDeliveryCharge =
      calculateDeliveryCharge(
        deliveryAddress.state,
        totalWeightKg
      );

    /* ==========================================
       NORMALIZE SUBTOTAL + GST
       ========================================== */

    const normalizedSubtotal =
      Number(subtotal || 0);

    const normalizedGst =
      Number(gst || 0);

    if (
      !Number.isFinite(normalizedSubtotal) ||
      normalizedSubtotal < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid subtotal.",
      });
    }

    if (
      !Number.isFinite(normalizedGst) ||
      normalizedGst < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid GST amount.",
      });
    }

    /* ==========================================
       CALCULATE FINAL TOTAL
       SERVER-SIDE
       ========================================== */

    const calculatedTotalAmount =
      normalizedSubtotal +
      normalizedGst +
      calculatedDeliveryCharge;

    if (
      !Number.isFinite(calculatedTotalAmount) ||
      calculatedTotalAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order total.",
      });
    }

    /* ==========================================
       CREATE NMB ORDER
       ========================================== */

    const order = await Order.create({
      userId,

      customerName,

      customerPhone,

      deliveryAddress,

      items,

      subtotal:
        normalizedSubtotal,

      gst:
        normalizedGst,

      deliveryCharge:
        calculatedDeliveryCharge,

      totalAmount:
        calculatedTotalAmount,

      paymentMethod:
        normalizedPaymentMethod,

      paymentStatus:
        "pending",

      orderStatus:
        "placed",
    });

    /* ==========================================
       COD ORDER
       ========================================== */

    if (normalizedPaymentMethod === "cod") {
      return res.status(201).json({
        success: true,

        message:
          "Order placed successfully.",

        order,

        payment: {
          method: "cod",
          status: "pending",
        },

        deliveryCalculation: {
          totalWeightKg:
            Number(
              totalWeightKg.toFixed(3)
            ),

          state:
            deliveryAddress.state,

          isUttarPradesh:
            isUttarPradesh(
              deliveryAddress.state
            ),

          deliveryCharge:
            calculatedDeliveryCharge,
        },
      });
    }

    /* ==========================================
       ONLINE PAYMENT
       CREATE RAZORPAY ORDER
       ========================================== */

    const razorpayAmount = Math.round(
      calculatedTotalAmount * 100
    );

    if (
      !Number.isInteger(razorpayAmount) ||
      razorpayAmount <= 0
    ) {
      await Order.findByIdAndDelete(order._id);

      return res.status(400).json({
        success: false,
        message:
          "Invalid payment amount.",
      });
    }

    const razorpayOrder =
      await razorpay.orders.create({
        amount: razorpayAmount,

        currency: "INR",

        receipt:
          `NMB-${String(order._id)}`,

        notes: {
          nmbOrderId:
            String(order._id),

          customerPhone:
            String(customerPhone),

          paymentMethod:
            "online",
        },
      });

    /* ==========================================
       SAVE RAZORPAY ORDER ID
       ========================================== */

    order.razorpayOrderId =
      razorpayOrder.id;

    await order.save();

    /* ==========================================
       RETURN ONLINE PAYMENT DATA
       ========================================== */

    return res.status(201).json({
      success: true,

      message:
        "Order created. Proceed to payment.",

      order,

      payment: {
        method: "online",

        status: "pending",

        razorpayOrderId:
          razorpayOrder.id,

        razorpayKeyId:
          process.env.RAZORPAY_KEY_ID,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,
      },

      deliveryCalculation: {
        totalWeightKg:
          Number(
            totalWeightKg.toFixed(3)
          ),

        state:
          deliveryAddress.state,

        isUttarPradesh:
          isUttarPradesh(
            deliveryAddress.state
          ),

        deliveryCharge:
          calculatedDeliveryCharge,
      },
    });
  } catch (error) {
    console.error(
      "Create Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to place order.",
      error: error.message,
    });
  }
};

/* ============================================
   GET LOGGED-IN USER ORDERS
   ============================================ */

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Please login to view orders.",
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
    console.error(
      "Get Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch orders.",
      error: error.message,
    });
  }
};

/* ============================================
   GET ONE ORDER
   ============================================ */

export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;

    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Please login to view this order.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get Order By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch order.",
      error: error.message,
    });
  }
};

/* ============================================
   VERIFY RAZORPAY PAYMENT
   ============================================ */

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to verify payment.",
      });
    }

    const {
      orderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    /* ==========================================
       BASIC VALIDATION
       ========================================== */

    if (
      !orderId ||
      !razorpayPaymentId ||
      !razorpayOrderId ||
      !razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Incomplete Razorpay payment details.",
      });
    }

    /* ==========================================
       FIND NMB ORDER
       ========================================== */

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

    /* ==========================================
       VERIFY PAYMENT METHOD
       ========================================== */

    if (order.paymentMethod !== "online") {
      return res.status(400).json({
        success: false,
        message:
          "This order is not an online payment order.",
      });
    }

    /* ==========================================
       ALREADY PAID
       ========================================== */

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified.",
        order,
      });
    }

    /* ==========================================
       VERIFY RAZORPAY ORDER ID
       ========================================== */

    if (
      !order.razorpayOrderId ||
      order.razorpayOrderId !== razorpayOrderId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay order verification failed.",
      });
    }

    /* ==========================================
       CREATE SERVER-SIDE SIGNATURE
       ========================================== */

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${order.razorpayOrderId}|${razorpayPaymentId}`
        )
        .digest("hex");

    /* ==========================================
       COMPARE SIGNATURE
       ========================================== */

    if (
      generatedSignature !==
      razorpaySignature
    ) {
      order.paymentStatus = "failed";

      await order.save();

      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed.",
      });
    }

    /* ==========================================
       PAYMENT VERIFIED
       ========================================== */

    order.razorpayPaymentId =
      razorpayPaymentId;

    order.razorpaySignature =
      razorpaySignature;

    order.paymentStatus = "paid";

    await order.save();

    /* ==========================================
       SUCCESS RESPONSE
       ========================================== */

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Razorpay Payment Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify payment.",
      error: error.message,
    });
  }
};