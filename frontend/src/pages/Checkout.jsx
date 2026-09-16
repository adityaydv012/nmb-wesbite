import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Login from "../components/auth/Login";
import { useCart } from "../context/CartContext";
import {
  addAddress,
  getAddresses,
  getProfile,
  createOrder,
  verifyRazorpayPayment,
  getPublicGstSettings,
} from "../services/api";

const EMPTY_ADDRESS = {
  houseNo: "",
  area: "",
  city: "",
  state: "",
  pinCode: "",
};

/* ============================================
   RAZORPAY CHECKOUT
   ============================================ */

const RAZORPAY_CHECKOUT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_CHECKOUT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () =>
        resolve(true)
      );
      existingScript.addEventListener("error", () =>
        resolve(false)
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

/* ============================================
   DELIVERY FEE CONFIGURATION
   ============================================ */

const UP_STATE_NAME = "uttar pradesh";

const DELIVERY_RATE_UP_TO_3_KG = 100;
const DELIVERY_RATE_ABOVE_3_KG = 50;
const DELIVERY_WEIGHT_THRESHOLD = 3;

/* ============================================
   DEFAULT GST CONFIGURATION
   ============================================ */

const DEFAULT_GST_ENABLED = true;
const DEFAULT_GST_RATE = 5;

/* ============================================
   HELPERS
   ============================================ */

/**
 * Get a consistent ID from an address.
 *
 * IMPORTANT:
 * This is outside the component so it is initialized
 * before any useMemo/useEffect/component logic uses it.
 */
const getAddressId = (address) => {
  return String(address?._id || address?.id || "");
};

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

/**
 * Converts product weight strings into kilograms.
 *
 * Supported examples:
 *
 * "500g"       -> 0.5
 * "500 g"      -> 0.5
 * "1kg"        -> 1
 * "1 kg"       -> 1
 * "2.5kg"      -> 2.5
 * "2.5 kg"     -> 2.5
 * "1000gm"     -> 1
 * "1 kilogram" -> 1
 */
const parseWeightInKg = (weight) => {
  if (
    weight === null ||
    weight === undefined
  ) {
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

const calculateCartWeight = (
  items = []
) => {
  return items.reduce(
    (total, item) => {
      const weightInKg =
        parseWeightInKg(
          item?.weight
        );

      const quantity = Number(
        item?.quantity || 0
      );

      if (
        !Number.isFinite(
          weightInKg
        ) ||
        !Number.isFinite(
          quantity
        )
      ) {
        return total;
      }

      return (
        total +
        weightInKg * quantity
      );
    },
    0
  );
};

/**
 * Delivery rules:
 *
 * Uttar Pradesh:
 *     FREE
 *
 * Outside Uttar Pradesh:
 *     Up to and including 3kg -> ₹100/kg
 *     Above 3kg              -> ₹50/kg
 *
 * Examples:
 *
 * Delhi + 1kg  = ₹100
 * Delhi + 2kg  = ₹200
 * Delhi + 3kg  = ₹300
 * Delhi + 4kg  = ₹200
 * Delhi + 5kg  = ₹250
 * Delhi + 10kg = ₹500
 */
const calculateDeliveryCharge = (
  state,
  totalWeightKg
) => {
  const weight = Number(
    totalWeightKg || 0
  );

  if (weight <= 0) {
    return 0;
  }

  /* ============================================
     UTTAR PRADESH = FREE
     ============================================ */

  if (isUttarPradesh(state)) {
    return 0;
  }

  /* ============================================
     OUTSIDE UP - UP TO 3KG
     ============================================ */

  if (
    weight <=
    DELIVERY_WEIGHT_THRESHOLD
  ) {
    return Math.round(
      weight *
        DELIVERY_RATE_UP_TO_3_KG
    );
  }

  /* ============================================
     OUTSIDE UP - ABOVE 3KG
     ============================================ */

  return Math.round(
    weight *
      DELIVERY_RATE_ABOVE_3_KG
  );
};

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [profile, setProfile] =
    useState(null);

  const [addresses, setAddresses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [showLogin, setShowLogin] =
    useState(false);

  const [
    showOrderSuccess,
    setShowOrderSuccess,
  ] = useState(false);

  const [placedOrder, setPlacedOrder] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState("");

  const [addressForm, setAddressForm] =
    useState(EMPTY_ADDRESS);

  const [
    showNewAddress,
    setShowNewAddress,
  ] = useState(false);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("cod");

  /* ============================================
     GST SETTINGS
     ============================================ */

  const [gstSettings, setGstSettings] =
    useState({
      gstEnabled:
        DEFAULT_GST_ENABLED,

      gstRate:
        DEFAULT_GST_RATE,
    });

  const [
    gstSettingsLoading,
    setGstSettingsLoading,
  ] = useState(true);

  /* ============================================
     SUBTOTAL
     ============================================ */

  const subtotal = Number(
    cartTotal || 0
  );

  /* ============================================
     GST
     ============================================ */

  const gst = useMemo(() => {
    if (
      !gstSettings.gstEnabled
    ) {
      return 0;
    }

    const rate = Number(
      gstSettings.gstRate || 0
    );

    if (
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      return 0;
    }

    return Math.round(
      subtotal * (rate / 100)
    );
  }, [
    subtotal,
    gstSettings.gstEnabled,
    gstSettings.gstRate,
  ]);

  /* ============================================
     TOTAL CART WEIGHT
     ============================================ */

  const totalWeightKg = useMemo(() => {
    return calculateCartWeight(
      cartItems
    );
  }, [cartItems]);

  /* ============================================
     SELECTED ADDRESS
     ============================================ */

  const selectedAddress = useMemo(() => {
    if (
      !selectedAddressId ||
      !addresses.length
    ) {
      return null;
    }

    return (
      addresses.find(
        (address) =>
          getAddressId(address) ===
          String(
            selectedAddressId
          )
      ) || null
    );
  }, [
    addresses,
    selectedAddressId,
  ]);

  /* ============================================
     DELIVERY CHARGE
     ============================================ */

  const deliveryCharge = useMemo(() => {
    return calculateDeliveryCharge(
      selectedAddress?.state || "",
      totalWeightKg
    );
  }, [
    selectedAddress,
    totalWeightKg,
  ]);

  /* ============================================
     GRAND TOTAL
     ============================================ */

  const grandTotal =
    subtotal +
    gst +
    deliveryCharge;

  /* ============================================
     EFFECTS
     ============================================ */

  useEffect(() => {
    const token =
      localStorage.getItem(
        "nmb_token"
      );

    if (!token) {
      setLoading(false);
      setShowLogin(true);
      return;
    }

    loadCheckoutData();
  }, []);

  /* ============================================
     FORMAT ADDRESS
     ============================================ */

  const formatAddress = (
    address
  ) => {
    if (!address) {
      return "";
    }

    return [
      address.houseNo,
      address.area,
      address.city,
      address.state,
      address.pinCode ||
        address.pincode ||
        address.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  /* ============================================
     LOAD CHECKOUT DATA
     ============================================ */

  const loadCheckoutData =
    async () => {
      try {
        setLoading(true);
        setError("");

        const [
          profileResponse,
          addressResponse,
          gstResponse,
        ] = await Promise.all([
          getProfile(),
          getAddresses(),
          getPublicGstSettings(),
        ]);

        /* ============================================
           PROFILE
           ============================================ */

        const user =
          profileResponse?.user ||
          profileResponse?.profile ||
          profileResponse ||
          null;

        /* ============================================
           ADDRESSES
           ============================================ */

        const savedAddresses =
          addressResponse?.addresses ||
          addressResponse?.data ||
          [];

        const validAddresses =
          Array.isArray(
            savedAddresses
          )
            ? savedAddresses
            : [];

        /* ============================================
           GST SETTINGS
           ============================================ */

        const settings =
          gstResponse?.settings ||
          gstResponse?.data ||
          {};

        const configuredGstRate =
          Number(
            settings.gstRate ??
              DEFAULT_GST_RATE
          );

        setGstSettings({
          gstEnabled:
            settings.gstEnabled !==
            false,

          gstRate:
            Number.isFinite(
              configuredGstRate
            )
              ? configuredGstRate
              : DEFAULT_GST_RATE,
        });

        setGstSettingsLoading(
          false
        );

        /* ============================================
           SAVE DATA
           ============================================ */

        setProfile(user);
        setAddresses(
          validAddresses
        );

        /* ============================================
           DEFAULT ADDRESS
           ============================================ */

        const defaultAddress =
          validAddresses.find(
            (address) =>
              address?.isDefault ===
                true ||
              address?.default ===
                true
          ) ||
          validAddresses[0];

        if (defaultAddress) {
          setSelectedAddressId(
            getAddressId(
              defaultAddress
            )
          );
        }
      } catch (requestError) {
        console.error(
          "Failed to load checkout data:",
          requestError
        );

        /*
         * Keep default GST configuration
         * if the settings request fails.
         */
        setGstSettings({
          gstEnabled:
            DEFAULT_GST_ENABLED,

          gstRate:
            DEFAULT_GST_RATE,
        });

        setGstSettingsLoading(
          false
        );

        setError(
          requestError.message ||
            "Unable to load checkout details."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ============================================
     LOGIN
     ============================================ */

  const handleLoginSuccess =
    async () => {
      setShowLogin(false);

      await loadCheckoutData();
    };

  /* ============================================
     ADDRESS INPUT
     ============================================ */

  const handleAddressInput = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setAddressForm(
      (currentForm) => ({
        ...currentForm,

        [name]:
          name === "pinCode"
            ? value
                .replace(
                  /\D/g,
                  ""
                )
                .slice(0, 6)
            : value,
      })
    );
  };

  /* ============================================
     SAVE ADDRESS
     ============================================ */

  const handleSaveAddress =
    async () => {
      const cleanedAddress = {
        houseNo:
          addressForm.houseNo.trim(),

        area:
          addressForm.area.trim(),

        city:
          addressForm.city.trim(),

        state:
          addressForm.state.trim(),

        pinCode:
          addressForm.pinCode.trim(),
      };

      if (
        !cleanedAddress.houseNo ||
        !cleanedAddress.area ||
        !cleanedAddress.city ||
        !cleanedAddress.state ||
        !cleanedAddress.pinCode
      ) {
        setError(
          "Please fill in all address fields."
        );

        return;
      }

      if (
        !/^\d{6}$/.test(
          cleanedAddress.pinCode
        )
      ) {
        setError(
          "Please enter a valid 6-digit PIN code."
        );

        return;
      }

      const customerName =
        profile?.fullName ||
        profile?.name ||
        "";

      const customerPhone =
        profile?.phone ||
        profile?.mobileNumber ||
        profile?.number ||
        "";

      try {
        setError("");
        setSuccess("");

        const response =
          await addAddress({
            fullName:
              customerName,

            phone:
              customerPhone,

            ...cleanedAddress,

            pincode:
              cleanedAddress.pinCode,
          });

        const newAddress =
          response?.address ||
          response?.data ||
          null;

        await loadCheckoutData();

        if (newAddress) {
          setSelectedAddressId(
            getAddressId(
              newAddress
            )
          );
        }

        setAddressForm(
          EMPTY_ADDRESS
        );

        setShowNewAddress(
          false
        );

        setSuccess(
          "Address saved successfully."
        );
      } catch (requestError) {
        console.error(
          "Failed to save checkout address:",
          requestError
        );

        setError(
          requestError.message ||
            "Unable to save this address."
        );
      }
    };

  /* ============================================
     PLACE ORDER
     ============================================ */

  const handlePlaceOrder = async () => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("nmb_token");

    if (!token) {
      setShowLogin(true);
      return;
    }

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    const currentSelectedAddress = addresses.find(
      (address) =>
        getAddressId(address) ===
        String(selectedAddressId)
    );

    if (!currentSelectedAddress) {
      setError("Please select a delivery address.");
      return;
    }

    const customerName =
      profile?.fullName ||
      profile?.name ||
      "";

    const customerPhone =
      profile?.phone ||
      profile?.mobileNumber ||
      profile?.number ||
      "";

    if (!customerName || !customerPhone) {
      setError(
        "Customer details are missing. Please update your profile."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const orderDeliveryAddress = {
        houseNo:
          currentSelectedAddress.houseNo || "",
        area:
          currentSelectedAddress.area || "",
        city:
          currentSelectedAddress.city || "",
        state:
          currentSelectedAddress.state || "",
        pinCode:
          currentSelectedAddress.pinCode ||
          currentSelectedAddress.pincode ||
          currentSelectedAddress.postalCode ||
          "",
      };

      const orderPayload = {
        customerName,
        customerPhone,
        deliveryAddress:
          orderDeliveryAddress,

        items: cartItems.map((item) => ({
          productId:
            item.productId || "",
          cartId:
            item.cartId || "",
          name:
            item.name || "",
          description:
            item.description || "",
          image:
            item.image || "",
          category:
            item.category || "",
          weight:
            item.weight || "",
          price:
            Number(item.price || 0),
          quantity:
            Number(item.quantity || 0),
          itemTotal:
            Number(item.price || 0) *
            Number(item.quantity || 0),
        })),

        subtotal,
        gst,
        deliveryCharge,
        totalAmount:
          grandTotal,
        paymentMethod,
      };

      /* ============================================
         CREATE NMB ORDER
         ============================================ */

      const response =
        await createOrder(orderPayload);

      const createdOrder =
        response?.order ||
        response?.data ||
        response;

      if (!createdOrder?._id) {
        throw new Error(
          "Order was not created. Please try again."
        );
      }

      /* ============================================
         COD
         ============================================ */

      if (paymentMethod === "cod") {
        setPlacedOrder({
          ...createdOrder,
          totalAmount:
            Number(
              createdOrder.totalAmount ??
                orderPayload.totalAmount
            ),
          paymentMethod:
            createdOrder.paymentMethod ||
            "cod",
          paymentStatus:
            createdOrder.paymentStatus ||
            "pending",
          deliveryCharge:
            Number(
              createdOrder.deliveryCharge ??
                orderPayload.deliveryCharge
            ),
          gst:
            Number(
              createdOrder.gst ??
                orderPayload.gst
            ),
        });

        clearCart();
        setShowOrderSuccess(true);
        setPlacingOrder(false);
        return;
      }

      /* ============================================
         ONLINE PAYMENT
         ============================================ */

      const razorpayPayment =
        response?.payment;

      if (
        !razorpayPayment?.razorpayOrderId
      ) {
        throw new Error(
          "Unable to initialize online payment."
        );
      }

      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error(
          "Unable to load Razorpay Checkout. Please check your internet connection and try again."
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is unavailable. Please try again."
        );
      }

      /* ============================================
         RAZORPAY CHECKOUT OPTIONS
         ============================================ */

      const razorpayOptions = {
        key:
          razorpayPayment.razorpayKeyId,

        amount:
          razorpayPayment.amount,

        currency:
          razorpayPayment.currency || "INR",

        name:
          "Narayan Misthan Bhandar",

        description:
          `NMB Order #${String(
            createdOrder._id
          )
            .slice(-8)
            .toUpperCase()}`,

        order_id:
          razorpayPayment.razorpayOrderId,

        prefill: {
          name:
            customerName,
          email:
            profile?.email || "",
          contact:
            customerPhone,
        },

        notes: {
          nmbOrderId:
            String(createdOrder._id),
        },

        theme: {
          color: "#340C48",
        },

        handler: async (razorpayResponse) => {
          try {
            setError("");
            setSuccess("");

            const verificationResponse =
              await verifyRazorpayPayment({
                orderId:
                  createdOrder._id,

                razorpayPaymentId:
                  razorpayResponse.razorpay_payment_id,

                razorpayOrderId:
                  razorpayResponse.razorpay_order_id,

                razorpaySignature:
                  razorpayResponse.razorpay_signature,
              });

            const verifiedOrder =
              verificationResponse?.order ||
              verificationResponse?.data ||
              verificationResponse;

            if (
              !verifiedOrder ||
              verifiedOrder.paymentStatus !==
                "paid"
            ) {
              throw new Error(
                "Payment could not be confirmed. Please contact NMB support if money was deducted."
              );
            }

            setPlacedOrder({
              ...verifiedOrder,

              totalAmount:
                Number(
                  verifiedOrder.totalAmount ??
                    createdOrder.totalAmount ??
                    orderPayload.totalAmount
                ),

              paymentMethod:
                "online",

              paymentStatus:
                "paid",

              deliveryCharge:
                Number(
                  verifiedOrder.deliveryCharge ??
                    createdOrder.deliveryCharge ??
                    orderPayload.deliveryCharge
                ),

              gst:
                Number(
                  verifiedOrder.gst ??
                    createdOrder.gst ??
                    orderPayload.gst
                ),
            });

            clearCart();
            setShowOrderSuccess(true);
          } catch (verificationError) {
            console.error(
              "Razorpay payment verification failed:",
              verificationError
            );

            setError(
              verificationError.message ||
                "Payment verification failed. Please contact NMB support if money was deducted."
            );
          } finally {
            setPlacingOrder(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPlacingOrder(false);

            setError(
              "Payment was cancelled. Your order is still pending and you can try the payment again."
            );
          },
        },
      };

      const razorpayCheckout =
        new window.Razorpay(
          razorpayOptions
        );

      razorpayCheckout.on(
        "payment.failed",
        (paymentFailure) => {
          console.error(
            "Razorpay payment failed:",
            paymentFailure?.error
          );

          setPlacingOrder(false);

          setError(
            paymentFailure?.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpayCheckout.open();
    } catch (requestError) {
      console.error(
        "Failed to place order:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to place your order. Please try again."
      );

      setPlacingOrder(false);
    }
  };

  /* ============================================
     SUCCESS POPUP
     ============================================ */

  const handleCloseSuccess =
    () => {
      setShowOrderSuccess(
        false
      );

      navigate("/");
    };

  const handleViewOrders = () => {
    setShowOrderSuccess(
      false
    );

    navigate("/orders");
  };

  /* ============================================
     DELIVERY LABEL
     ============================================ */

  const deliveryLabel = useMemo(() => {
    if (!selectedAddress) {
      return "Select address";
    }

    if (deliveryCharge === 0) {
      return "Free";
    }

    return `₹${deliveryCharge.toLocaleString(
      "en-IN"
    )}`;
  }, [
    selectedAddress,
    deliveryCharge,
  ]);

  /* ============================================
     GST LABEL
     ============================================ */

  const gstLabel = useMemo(() => {
    if (
      !gstSettings.gstEnabled
    ) {
      return "GST";
    }

    return `GST (${gstSettings.gstRate}%)`;
  }, [
    gstSettings.gstEnabled,
    gstSettings.gstRate,
  ]);

  /* ============================================
     LOADING
     ============================================ */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[60vh] items-center justify-center bg-[#FFF9F2]">

          <div className="flex items-center gap-3 text-[#340C48]">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading checkout...

          </div>

        </main>

        <Footer />
      </>
    );
  }

  /* ============================================
     MAIN CHECKOUT
     ============================================ */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF9F2] px-4 pb-20 pt-12 sm:px-6 sm:pt-16">

        <div className="mx-auto max-w-[1180px]">

          {/* BACK TO CART */}

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#340C48] transition hover:text-[#C9A45C]"
          >
            <ArrowLeft size={16} />

            Back to Cart
          </Link>

          {/* PAGE HEADING */}

          <div className="mt-8">

            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A45C]">
              Secure Checkout
            </p>

            <h1 className="mt-3 font-[var(--font-display)] text-[38px] leading-tight text-[#340C48] sm:text-[48px]">
              Complete Your Order
            </h1>

            <p className="mt-3 text-[13px] leading-6 text-[#6E6670] sm:text-[14px]">
              Confirm your delivery details and payment
              method before placing your order.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-700">
              {success}
            </div>
          )}

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

            {/* ============================================
                LEFT SIDE
                ============================================ */}

            <section className="space-y-6">

              {/* ============================================
                  DELIVERY ADDRESS
                  ============================================ */}

              <div className="rounded-[16px] border border-[#E9DFE9] bg-white p-5 shadow-[0_8px_25px_rgba(52,12,72,0.04)] sm:p-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EBD8] text-[#A77D32]">
                    <MapPin size={18} />
                  </div>

                  <div>

                    <h2 className="font-[var(--font-display)] text-[23px] text-[#340C48]">
                      Delivery Address
                    </h2>

                    <p className="mt-1 text-[12px] text-[#6E6670]">
                      Select where you want your sweets
                      delivered.
                    </p>

                  </div>

                </div>

                {/* SAVED ADDRESSES */}

                {addresses.length > 0 ? (
                  <div className="mt-6 space-y-3">

                    {addresses.map(
                      (
                        address,
                        index
                      ) => {
                        const addressId =
                          getAddressId(
                            address
                          );

                        const selected =
                          selectedAddressId ===
                          addressId;

                        const addressIsUP =
                          isUttarPradesh(
                            address.state
                          );

                        const addressDeliveryCharge =
                          calculateDeliveryCharge(
                            address.state,
                            totalWeightKg
                          );

                        return (
                          <button
                            key={
                              addressId ||
                              index
                            }
                            type="button"
                            onClick={() => {
                              setSelectedAddressId(
                                addressId
                              );

                              setError("");
                            }}
                            className={`w-full rounded-xl border p-4 text-left transition ${
                              selected
                                ? "border-[#340C48] bg-[#F8F1F8]"
                                : "border-[#E9DFE9] bg-white hover:border-[#C9A45C]"
                            }`}
                          >

                            <div className="flex items-start gap-3">

                              {/* RADIO */}

                              <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                  selected
                                    ? "border-[#340C48] bg-[#340C48] text-white"
                                    : "border-[#C8BCCB]"
                                }`}
                              >
                                {selected && (
                                  <CheckCircle2
                                    size={13}
                                  />
                                )}
                              </span>

                              {/* ADDRESS */}

                              <div className="min-w-0 flex-1">

                                <p className="text-[13px] font-semibold text-[#340C48]">
                                  Address{" "}
                                  {index +
                                    1}
                                </p>

                                <p className="mt-1 text-[12px] leading-5 text-[#6E6670]">
                                  {formatAddress(
                                    address
                                  )}
                                </p>

                                {/* DELIVERY BADGE */}

                                <div
                                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold ${
                                    addressIsUP
                                      ? "bg-green-50 text-green-700"
                                      : "bg-[#F5EBD8] text-[#8A6428]"
                                  }`}
                                >

                                  <Truck
                                    size={12}
                                  />

                                  {addressIsUP
                                    ? "FREE DELIVERY — Uttar Pradesh"
                                    : `Delivery: ₹${addressDeliveryCharge.toLocaleString(
                                        "en-IN"
                                      )}`}

                                </div>

                              </div>

                            </div>

                          </button>
                        );
                      }
                    )}

                  </div>
                ) : (
                  <p className="mt-6 rounded-xl border border-dashed border-[#DCCFDF] px-4 py-5 text-[13px] text-[#6E6670]">
                    No saved address found. Add a delivery
                    address to continue.
                  </p>
                )}

                {/* ADD ADDRESS BUTTON */}

                <button
                  type="button"
                  onClick={() => {
                    setShowNewAddress(
                      !showNewAddress
                    );

                    setError("");
                  }}
                  className="mt-5 text-[12px] font-semibold text-[#340C48] hover:text-[#C9A45C]"
                >
                  {showNewAddress
                    ? "Cancel adding address"
                    : "+ Add New Address"}
                </button>

                {/* NEW ADDRESS FORM */}

                {showNewAddress && (
                  <div className="mt-5 border-t border-[#EEE6EE] pt-5">

                    <div className="grid gap-4 sm:grid-cols-2">

                      {[
                        {
                          name: "houseNo",
                          label:
                            "House / Flat / Building",
                        },
                        {
                          name: "area",
                          label:
                            "Area / Street",
                        },
                        {
                          name: "city",
                          label:
                            "City",
                        },
                        {
                          name: "state",
                          label:
                            "State",
                        },
                        {
                          name: "pinCode",
                          label:
                            "PIN Code",
                        },
                      ].map(
                        (field) => (
                          <div
                            key={
                              field.name
                            }
                            className={
                              field.name ===
                              "pinCode"
                                ? "sm:col-span-2"
                                : ""
                            }
                          >

                            <label
                              htmlFor={
                                field.name
                              }
                              className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                            >
                              {
                                field.label
                              }
                            </label>

                            <input
                              id={
                                field.name
                              }
                              name={
                                field.name
                              }
                              value={
                                addressForm[
                                  field.name
                                ]
                              }
                              onChange={
                                handleAddressInput
                              }
                              maxLength={
                                field.name ===
                                "pinCode"
                                  ? 6
                                  : undefined
                              }
                              inputMode={
                                field.name ===
                                "pinCode"
                                  ? "numeric"
                                  : "text"
                              }
                              className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                            />

                          </div>
                        )
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleSaveAddress
                      }
                      className="mt-5 rounded-lg bg-[#340C48] px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-[#4B1D63]"
                    >
                      Save Address
                    </button>

                  </div>
                )}

              </div>

              {/* ============================================
                  PAYMENT METHOD
                  ============================================ */}

              <div className="rounded-[16px] border border-[#E9DFE9] bg-white p-5 shadow-[0_8px_25px_rgba(52,12,72,0.04)] sm:p-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0E9F2] text-[#340C48]">
                    <ShoppingBag size={18} />
                  </div>

                  <div>

                    <h2 className="font-[var(--font-display)] text-[23px] text-[#340C48]">
                      Payment Method
                    </h2>

                    <p className="mt-1 text-[12px] text-[#6E6670]">
                      Choose how you want to pay.
                    </p>

                  </div>

                </div>

                <div className="mt-6 space-y-3">

                  {/* COD */}

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E9DFE9] p-4">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={
                        paymentMethod ===
                        "cod"
                      }
                      onChange={(
                        event
                      ) =>
                        setPaymentMethod(
                          event
                            .target
                            .value
                        )
                      }
                    />

                    <span>

                      <span className="block text-[13px] font-semibold text-[#340C48]">
                        Cash on Delivery
                      </span>

                      <span className="mt-1 block text-[11px] text-[#6E6670]">
                        Pay when your order arrives.
                      </span>

                    </span>

                  </label>

                  {/* ONLINE */}

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E9DFE9] p-4">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={
                        paymentMethod ===
                        "online"
                      }
                      onChange={(
                        event
                      ) =>
                        setPaymentMethod(
                          event
                            .target
                            .value
                        )
                      }
                    />

                    <span>

                      <span className="block text-[13px] font-semibold text-[#340C48]">
                        Online Payment
                      </span>

                      <span className="mt-1 block text-[11px] text-[#6E6670]">
                        Pay securely using Razorpay.
                      </span>

                    </span>

                  </label>

                </div>

              </div>

            </section>

            {/* ============================================
                RIGHT SIDE - ORDER SUMMARY
                ============================================ */}

            <aside className="h-fit rounded-[16px] border border-[#E9DFE9] bg-white p-5 shadow-[0_8px_25px_rgba(52,12,72,0.04)] sm:p-7 lg:sticky lg:top-28">

              <h2 className="font-[var(--font-display)] text-[24px] text-[#340C48]">
                Order Summary
              </h2>

              {/* CART ITEMS */}

              <div className="mt-6 space-y-4">

                {cartItems.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.cartId ||
                        item.productId ||
                        index
                      }
                      className="flex items-start justify-between gap-4"
                    >

                      <div>

                        <p className="text-[12px] font-semibold text-[#340C48]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-[11px] text-[#6E6670]">
                          {item.weight} ×{" "}
                          {item.quantity}
                        </p>

                      </div>

                      <p className="shrink-0 text-[12px] font-semibold text-[#340C48]">
                        ₹
                        {(
                          Number(
                            item.price ||
                              0
                          ) *
                          Number(
                            item.quantity ||
                              0
                          )
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  )
                )}

              </div>

              <div className="my-6 border-t border-[#EEE6EE]" />

              {/* TOTAL WEIGHT */}

              <div className="mb-5 rounded-xl bg-[#F8F1F8] px-4 py-3">

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#340C48]">
                      <Truck size={15} />
                    </div>

                    <div>

                      <p className="text-[11px] font-semibold text-[#340C48]">
                        Total Weight
                      </p>

                      <p className="text-[10px] text-[#6E6670]">
                        Used to calculate delivery
                      </p>

                    </div>

                  </div>

                  <span className="text-[13px] font-semibold text-[#340C48]">
                    {totalWeightKg
                      .toFixed(2)
                      .replace(
                        /\.00$/,
                        ""
                      )}{" "}
                    kg
                  </span>

                </div>

              </div>

              {/* PRICE BREAKDOWN */}

              <div className="space-y-3 text-[13px]">

                {/* SUBTOTAL */}

                <div className="flex justify-between gap-4 text-[#6E6670]">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* GST */}

                <div className="flex justify-between gap-4 text-[#6E6670]">

                  <span>
                    {gstLabel}
                  </span>

                  <span>
                    ₹
                    {gst.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* DELIVERY */}

                <div className="flex justify-between gap-4 text-[#6E6670]">

                  <span>
                    Delivery
                  </span>

                  <span
                    className={
                      deliveryCharge ===
                      0
                        ? "font-semibold text-green-600"
                        : "font-semibold text-[#340C48]"
                    }
                  >
                    {deliveryLabel}
                  </span>

                </div>

              </div>

              {/* ============================================
                  DELIVERY INFORMATION
                  ============================================ */}

              {selectedAddress &&
                !isUttarPradesh(
                  selectedAddress.state
                ) &&
                totalWeightKg > 0 && (
                  <div className="mt-4 rounded-lg border border-[#E9DFE9] bg-[#FFF9F2] px-3 py-2.5 text-[10px] leading-4 text-[#6E6670]">

                    {totalWeightKg <=
                    3
                      ? "Outside Uttar Pradesh: ₹100 per kg"
                      : "Outside Uttar Pradesh above 3 kg: ₹50 per kg"}

                  </div>
                )}

              {selectedAddress &&
                isUttarPradesh(
                  selectedAddress.state
                ) && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-[10px] leading-4 text-green-700">
                    Free delivery within Uttar Pradesh.
                  </div>
                )}

              {/* GST INFORMATION */}

              {!gstSettingsLoading &&
                gstSettings.gstEnabled && (
                  <div className="mt-4 rounded-lg border border-[#E9DFE9] bg-[#FFF9F2] px-3 py-2.5 text-[10px] leading-4 text-[#6E6670]">
                    GST is currently applied at{" "}
                    <strong className="text-[#340C48]">
                      {
                        gstSettings.gstRate
                      }
                      %
                    </strong>
                    .
                  </div>
                )}

              {!gstSettingsLoading &&
                !gstSettings.gstEnabled && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-[10px] leading-4 text-green-700">
                    GST is currently not applicable to this order.
                  </div>
                )}

              <div className="my-6 border-t border-[#EEE6EE]" />

              {/* GRAND TOTAL */}

              <div className="flex items-center justify-between gap-4">

                <span className="font-[var(--font-display)] text-[20px] text-[#340C48]">
                  Total
                </span>

                <span className="text-[20px] font-semibold text-[#340C48]">
                  ₹
                  {grandTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={
                  handlePlaceOrder
                }
                disabled={
                  placingOrder ||
                  !cartItems.length
                }
                className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#340C48] px-5 py-4 text-[13px] font-semibold text-white transition hover:bg-[#4B1D63] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {placingOrder ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}

              </button>

              <p className="mt-4 text-center text-[11px] leading-5 text-[#8A828C]">
                Your order details will be securely saved
                to your NMB account.
              </p>

            </aside>

          </div>

        </div>
      </main>

      <Footer />

      {/* ============================================
          LOGIN POPUP
          ============================================ */}

      {showLogin && (
        <Login
          onClose={() => {
            setShowLogin(false);
            navigate("/cart");
          }}
          onLoginSuccess={
            handleLoginSuccess
          }
        />
      )}

      {/* ============================================
          ORDER SUCCESS POPUP
          ============================================ */}

      {showOrderSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#340C48]/40 px-4 backdrop-blur-sm">

          <div className="relative w-full max-w-[430px] rounded-[20px] bg-[#FFF9F2] px-6 py-8 text-center shadow-2xl sm:px-10 sm:py-10">

            {/* CLOSE */}

            <button
              type="button"
              onClick={
                handleCloseSuccess
              }
              className="absolute right-5 top-5 text-[22px] leading-none text-[#340C48] transition hover:text-[#C9A45C]"
              aria-label="Close order confirmation"
            >
              ×
            </button>

            {/* SUCCESS ICON */}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A45C] bg-[#F5EBD8]">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#340C48] text-white">

                <CheckCircle2
                  size={28}
                  strokeWidth={2}
                />

              </div>

            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A45C]">
              Order Confirmed
            </p>

            <h2 className="mt-3 font-[var(--font-display)] text-[30px] leading-tight text-[#340C48]">
              Order Placed
            </h2>

            <p className="mx-auto mt-3 max-w-[300px] text-[13px] leading-6 text-[#6E6670]">
              Your order has been successfully placed.
              We’ll carefully prepare your sweets.
            </p>

            {/* ORDER DETAILS */}

            <div className="mt-7 rounded-xl bg-[#F5EBD8] px-5 py-4 text-left">

              {/* ORDER NUMBER */}

              <div className="flex items-center justify-between gap-4">

                <span className="text-[11px] text-[#6E6670]">
                  Order Number
                </span>

                <span className="text-[12px] font-semibold text-[#340C48]">
                  #
                  {placedOrder?._id
                    ? String(
                        placedOrder._id
                      )
                        .slice(-8)
                        .toUpperCase()
                    : "CONFIRMED"}
                </span>

              </div>

              {/* PAYMENT METHOD */}

              <div className="mt-3 flex items-center justify-between gap-4">

                <span className="text-[11px] text-[#6E6670]">
                  Payment Method
                </span>

                <span className="text-[12px] font-semibold capitalize text-[#340C48]">
                  {placedOrder?.paymentMethod ===
                  "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </span>

              </div>

              {/* GST */}

              <div className="mt-3 flex items-center justify-between gap-4">

                <span className="text-[11px] text-[#6E6670]">
                  {placedOrder?.gst &&
                  gstSettings.gstEnabled
                    ? `GST (${gstSettings.gstRate}%)`
                    : "GST"}
                </span>

                <span className="text-[12px] font-semibold text-[#340C48]">
                  ₹
                  {Number(
                    placedOrder?.gst ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* DELIVERY */}

              <div className="mt-3 flex items-center justify-between gap-4">

                <span className="text-[11px] text-[#6E6670]">
                  Delivery
                </span>

                <span className="text-[12px] font-semibold text-[#340C48]">

                  {Number(
                    placedOrder?.deliveryCharge ||
                      0
                  ) === 0
                    ? "Free"
                    : `₹${Number(
                        placedOrder?.deliveryCharge ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}`}

                </span>

              </div>

              {/* TOTAL */}

              <div className="mt-3 flex items-center justify-between gap-4 border-t border-[#E2D2B5] pt-3">

                <span className="text-[12px] font-semibold text-[#340C48]">
                  Total Amount
                </span>

                <span className="text-[16px] font-semibold text-[#340C48]">
                  ₹
                  {Number(
                    placedOrder?.totalAmount ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

            {/* ACTION BUTTONS */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={
                  handleViewOrders
                }
                className="flex-1 rounded-xl bg-[#340C48] px-5 py-3.5 text-[12px] font-semibold text-white transition hover:bg-[#4B1D63]"
              >
                View My Orders
              </button>

              <button
                type="button"
                onClick={
                  handleCloseSuccess
                }
                className="flex-1 rounded-xl border border-[#C9A45C] bg-white px-5 py-3.5 text-[12px] font-semibold text-[#340C48] transition hover:bg-[#F5EBD8]"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}