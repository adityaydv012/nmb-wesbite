import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "nmb_cart";

/* =========================================================
   HELPERS
========================================================= */

/**
 * Get a consistent product ID.
 *
 * Supports:
 * - MongoDB products: _id
 * - Existing frontend products: id
 */
const getProductId = (product) => {
  return String(product?._id || product?.id || "").trim();
};

/**
 * Get the selected variety from a product.
 */
const getSelectedVariety = (product, selectedWeight) => {
  if (!Array.isArray(product?.varieties)) {
    return null;
  }

  return (
    product.varieties.find(
      (variety) =>
        String(variety?.weight || "").trim() ===
        String(selectedWeight || "").trim()
    ) || product.varieties[0] || null
  );
};

/**
 * Get pricing for the selected variety.
 *
 * Supports:
 * - sellingPrice + offerPrice
 * - old price field
 */
const getProductPricing = (
  product,
  selectedWeight
) => {
  const variety = getSelectedVariety(
    product,
    selectedWeight
  );

  const sellingPrice = Number(
    variety?.sellingPrice ??
      variety?.price ??
      product?.sellingPrice ??
      product?.price ??
      0
  );

  const rawOfferPrice =
    variety?.offerPrice ??
    product?.offerPrice ??
    null;

  const parsedOfferPrice =
    rawOfferPrice === "" ||
    rawOfferPrice === null ||
    rawOfferPrice === undefined
      ? null
      : Number(rawOfferPrice);

  const hasOffer =
    Number.isFinite(parsedOfferPrice) &&
    parsedOfferPrice > 0 &&
    parsedOfferPrice < sellingPrice;

  const finalPrice = hasOffer
    ? parsedOfferPrice
    : sellingPrice;

  const discountPercentage = hasOffer
    ? Math.round(
        ((sellingPrice - parsedOfferPrice) /
          sellingPrice) *
          100
      )
    : 0;

  return {
    sellingPrice,
    offerPrice: hasOffer
      ? parsedOfferPrice
      : null,
    finalPrice,
    discountPercentage,
  };
};

/* =========================================================
   CART PROVIDER
========================================================= */

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart =
        localStorage.getItem(
          CART_STORAGE_KEY
        );

      if (!storedCart) {
        return [];
      }

      const parsedCart =
        JSON.parse(storedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      return parsedCart.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          item.cartId &&
          item.productId
      );
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      return [];
    }
  });

  /* =======================================================
     SAVE CART
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cartItems]);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = (
    product,
    selectedWeight = "500g"
  ) => {
    if (!product) {
      console.error(
        "Invalid product passed to addToCart:",
        product
      );

      return;
    }

    /*
     * MongoDB products use _id.
     * Old local products may use id.
     */
    const productId = getProductId(product);

    if (!productId) {
      console.error(
        "Product does not have a valid id or _id:",
        product
      );

      return;
    }

    const safeWeight =
      String(
        selectedWeight ||
          product?.varieties?.[0]?.weight ||
          product?.weights?.[0] ||
          "500g"
      ).trim();

    /*
     * Same product + same weight = same cart item.
     */
    const cartId = `${productId}-${safeWeight}`;

    const pricing = getProductPricing(
      product,
      safeWeight
    );

    setCartItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.cartId === cartId
        );

      /* ===================================================
         SAME PRODUCT + SAME WEIGHT
      =================================================== */

      if (existingItem) {
        return currentItems.map(
          (item) =>
            item.cartId === cartId
              ? {
                  ...item,
                  quantity:
                    Number(
                      item.quantity || 0
                    ) + 1,

                  /*
                   * Keep pricing updated in case
                   * the product was changed in admin.
                   */
                  sellingPrice:
                    pricing.sellingPrice,

                  offerPrice:
                    pricing.offerPrice,

                  price:
                    pricing.finalPrice,

                  discountPercentage:
                    pricing.discountPercentage,
                }
              : item
        );
      }

      /* ===================================================
         NEW PRODUCT / WEIGHT
      =================================================== */

      return [
        ...currentItems,

        {
          /*
           * Cart identity
           */
          cartId,

          /*
           * MongoDB _id is stored as productId.
           */
          productId,

          /*
           * Keep _id too for compatibility.
           */
          _id: productId,

          /*
           * Product information
           */
          name:
            product.name || "",

          description:
            product.description || "",

          category:
            product.category || "",

          image:
            product.image ||
            product.images?.[0] ||
            "",

          images:
            Array.isArray(product.images)
              ? product.images
              : product.image
              ? [product.image]
              : [],

          dietary:
            Array.isArray(product.dietary)
              ? product.dietary
              : [],

          /*
           * Selected weight
           */
          weight: safeWeight,

          /*
           * Pricing
           */
          sellingPrice:
            pricing.sellingPrice,

          offerPrice:
            pricing.offerPrice,

          price:
            pricing.finalPrice,

          originalPrice:
            pricing.offerPrice
              ? pricing.sellingPrice
              : null,

          discountPercentage:
            pricing.discountPercentage,

          /*
           * Quantity
           */
          quantity: 1,
        },
      ];
    });
  };

  /* =======================================================
     REMOVE
  ======================================================= */

  const removeFromCart = (cartId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.cartId !== cartId
      )
    );
  };

  /* =======================================================
     INCREASE
  ======================================================= */

  const increaseQuantity = (cartId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity:
                Number(
                  item.quantity || 0
                ) + 1,
            }
          : item
      )
    );
  };

  /* =======================================================
     DECREASE
  ======================================================= */

  const decreaseQuantity = (cartId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity:
                  Number(
                    item.quantity || 0
                  ) - 1,
              }
            : item
        )
        .filter(
          (item) =>
            Number(
              item.quantity || 0
            ) > 0
        )
    );
  };

  /* =======================================================
     UPDATE QUANTITY
  ======================================================= */

  const updateQuantity = (
    cartId,
    quantity
  ) => {
    const safeQuantity = Math.max(
      0,
      Number(quantity) || 0
    );

    if (safeQuantity === 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity:
                safeQuantity,
            }
          : item
      )
    );
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    setCartItems([]);
  };

  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount = cartItems.reduce(
    (total, item) =>
      total +
      Number(
        item.quantity || 0
      ),
    0
  );

  /* =======================================================
     CART TOTAL
  ======================================================= */

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(
        item.price || 0
      ) *
        Number(
          item.quantity || 0
        ),
    0
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        updateQuantity,

        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================================================
   USE CART
========================================================= */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}