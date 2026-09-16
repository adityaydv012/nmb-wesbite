const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5001/api";

// ============================================
// GET AUTH TOKEN
// ============================================

function getAuthToken() {
  return localStorage.getItem("nmb_token");
}

// ============================================
// GENERIC API REQUEST
// ============================================

async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      console.error("Unauthorized API request:", {
        endpoint,
        hasToken: Boolean(token),
        tokenLength: token?.length || 0,
        response: data,
      });

      throw new Error(
        data.message ||
          "Your login session has expired. Please login again."
      );
    }

    throw new Error(
      data.message ||
        data.error ||
        "Something went wrong. Please try again."
    );
  }

  return data;
}

// ============================================
// AUTH API
// ============================================

export const sendOtp = (phone) => {
  return apiRequest("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({
      phone,
    }),
  });
};

export const verifyOtp = (phone, otp) => {
  return apiRequest("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      phone,
      otp,
    }),
  });
};

// ============================================
// USER PROFILE
// ============================================

export const getProfile = () => {
  return apiRequest("/user/profile", {
    method: "GET",
  });
};

export const updateProfile = (profileData) => {
  return apiRequest("/user/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

// ============================================
// ADDRESS
// ============================================

export const getAddresses = () => {
  return apiRequest("/user/addresses", {
    method: "GET",
  });
};

export const addAddress = (addressData) => {
  return apiRequest("/user/addresses", {
    method: "POST",
    body: JSON.stringify(addressData),
  });
};

export const updateAddress = (addressId, addressData) => {
  return apiRequest(`/user/addresses/${addressId}`, {
    method: "PUT",
    body: JSON.stringify(addressData),
  });
};

export const setDefaultAddress = (addressId) => {
  return apiRequest(`/user/addresses/${addressId}/default`, {
    method: "PUT",
  });
};

export const deleteAddress = (addressId) => {
  return apiRequest(`/user/addresses/${addressId}`, {
    method: "DELETE",
  });
};

// ============================================
// ORDERS
// ============================================

export const createOrder = (orderData) => {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getOrders = () => {
  return apiRequest("/orders", {
    method: "GET",
  });
};

export const getOrderById = (orderId) => {
  return apiRequest(`/orders/${orderId}`, {
    method: "GET",
  });
};

// ============================================
// RAZORPAY PAYMENT
// ============================================

export const verifyRazorpayPayment = (paymentData) => {
  return apiRequest("/orders/verify-payment", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};

// ============================================
// PRODUCTS
// ============================================

export const getProducts = () => {
  return apiRequest("/products", {
    method: "GET",
  });
};

export const getProductById = (productId) => {
  return apiRequest(`/products/${productId}`, {
    method: "GET",
  });
};

// ============================================
// SHOWCASE SWEETS
// ============================================

export const getShowcaseSweets = () => {
  return apiRequest("/showcase-sweets", {
    method: "GET",
  });
};

// ============================================
// GST SETTINGS
// PUBLIC CUSTOMER API
// ============================================

export const getPublicGstSettings = () => {
  return apiRequest("/settings/gst", {
    method: "GET",
  });
};

// ============================================
// LOGOUT
// ============================================

export const logoutUser = () => {
  localStorage.removeItem("nmb_token");
  localStorage.removeItem("nmb_user");
};