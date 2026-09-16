import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowRight,
  ChevronDown,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import PRODUCTS from "../data/products";
import { useCart } from "../context/CartContext";
import { getPublicGstSettings } from "../services/api";

/* =========================================================
   DEFAULT GST CONFIGURATION
========================================================= */

const DEFAULT_GST_ENABLED = true;
const DEFAULT_GST_RATE = 5;

/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

/* =========================================================
   CART PAGE
========================================================= */

export default function Cart() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  /* =======================================================
     GST SETTINGS
  ======================================================= */

  const [gstSettings, setGstSettings] = useState({
    gstEnabled: DEFAULT_GST_ENABLED,
    gstRate: DEFAULT_GST_RATE,
  });

  const [gstSettingsLoading, setGstSettingsLoading] =
    useState(true);

  /* =======================================================
     LOAD GST SETTINGS
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadGstSettings = async () => {
      try {
        setGstSettingsLoading(true);

        const response =
          await getPublicGstSettings();

        if (!isMounted) {
          return;
        }

        /*
         * Backend may return:
         *
         * {
         *   gstEnabled: true,
         *   gstRate: 5
         * }
         *
         * OR:
         *
         * {
         *   settings: {
         *     gstEnabled: true,
         *     gstRate: 5
         *   }
         * }
         */

        const settings =
          response?.settings ||
          response?.data ||
          response ||
          {};

        const configuredRate = Number(
          settings.gstRate ??
            DEFAULT_GST_RATE
        );

        setGstSettings({
          gstEnabled:
            settings.gstEnabled !== false,

          gstRate:
            Number.isFinite(configuredRate) &&
            configuredRate >= 0
              ? configuredRate
              : DEFAULT_GST_RATE,
        });
      } catch (error) {
        console.error(
          "Failed to load GST settings:",
          error
        );

        /*
         * Keep the existing default GST configuration
         * if the settings request fails.
         */
        if (isMounted) {
          setGstSettings({
            gstEnabled:
              DEFAULT_GST_ENABLED,

            gstRate:
              DEFAULT_GST_RATE,
          });
        }
      } finally {
        if (isMounted) {
          setGstSettingsLoading(false);
        }
      }
    };

    loadGstSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     RECOMMENDED PRODUCTS
  ======================================================= */

  const recommendedProducts = useMemo(() => {
    const cartProductIds = new Set(
      cartItems.map(
        (item) => item.productId
      )
    );

    return PRODUCTS.filter(
      (product) =>
        !cartProductIds.has(product.id)
    ).slice(0, 4);
  }, [cartItems]);

  /* =======================================================
     GST
  ======================================================= */

  const gst = useMemo(() => {
    /*
     * GST disabled from Admin Panel
     */
    if (!gstSettings.gstEnabled) {
      return 0;
    }

    const rate = Number(
      gstSettings.gstRate || 0
    );

    /*
     * Invalid / zero GST rate
     */
    if (
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      return 0;
    }

    return Math.round(
      Number(cartTotal || 0) *
        (rate / 100)
    );
  }, [
    cartTotal,
    gstSettings.gstEnabled,
    gstSettings.gstRate,
  ]);

  /* =======================================================
     GST LABEL
  ======================================================= */

  const gstLabel = useMemo(() => {
    if (!gstSettings.gstEnabled) {
      return "GST";
    }

    const rate = Number(
      gstSettings.gstRate || 0
    );

    if (
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      return "GST";
    }

    return `GST (${rate}%)`;
  }, [
    gstSettings.gstEnabled,
    gstSettings.gstRate,
  ]);

  /* =======================================================
     DELIVERY
  ======================================================= */

  /*
   * Cart page does not have a delivery address yet,
   * so delivery remains Free here.
   *
   * Actual delivery is calculated on Checkout
   * according to the selected address and weight.
   */
  const delivery = 0;

  /* =======================================================
     GRAND TOTAL
  ======================================================= */

  const grandTotal =
    Number(cartTotal || 0) +
    gst +
    delivery;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1088px]
          px-5
          pb-20
          pt-10
          sm:px-8
          lg:px-0
          lg:pt-12
        "
      >
        {/* ===================================================
            PAGE HEADING
        =================================================== */}

        <div className="mb-7">
          <h1
            className="
              inline-block
              border-b
              border-[#E8D6A8]
              pb-2
              font-[var(--font-display)]
              text-[38px]
              font-semibold
              leading-none
              tracking-[-0.03em]
              text-[#4B1D63]
              sm:text-[44px]
              lg:text-[48px]
            "
          >
            Your Cart
          </h1>
        </div>

        {/* ===================================================
            EMPTY CART
        =================================================== */}

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* =================================================
                CART + SUMMARY
            ================================================= */}

            <div
              className="
                grid
                gap-7
                lg:grid-cols-[1fr_302px]
                lg:items-start
              "
            >
              {/* =================================================
                  CART ITEMS
              ================================================= */}

              <div className="flex flex-col gap-5">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cartId}
                    item={item}
                    onIncrease={() =>
                      increaseQuantity(
                        item.cartId
                      )
                    }
                    onDecrease={() =>
                      decreaseQuantity(
                        item.cartId
                      )
                    }
                    onRemove={() =>
                      removeFromCart(
                        item.cartId
                      )
                    }
                  />
                ))}
              </div>

              {/* =================================================
                  ORDER SUMMARY
              ================================================= */}

              <OrderSummary
                cartCount={cartCount}
                subtotal={cartTotal}
                gst={gst}
                gstLabel={gstLabel}
                gstSettingsLoading={
                  gstSettingsLoading
                }
                delivery={delivery}
                total={grandTotal}
              />
            </div>

            {/* =================================================
                RECOMMENDED
            ================================================= */}

            {recommendedProducts.length > 0 && (
              <section className="mt-20 sm:mt-24">
                <SectionHeading>
                  You May Also Like
                </SectionHeading>

                <div
                  className="
                    mt-7
                    grid
                    grid-cols-2
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-4
                  "
                >
                  {recommendedProducts.map(
                    (product) => (
                      <RecommendedCard
                        key={product.id}
                        product={product}
                      />
                    )
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </div>
  );
}

/* =========================================================
   CART ITEM
========================================================= */

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <article
      className="
        rounded-[8px]
        border
        border-[#E2D4E5]
        bg-white
        p-3
        sm:p-4
      "
    >
      <div
        className="
          flex
          gap-4
          sm:gap-5
        "
      >
        {/* IMAGE */}

        <div
          className="
            h-[92px]
            w-[92px]
            shrink-0
            overflow-hidden
            rounded-[5px]
            bg-[#F5ECE5]
            sm:h-[105px]
            sm:w-[105px]
          "
        >
          <img
            src={item.image}
            alt={item.name}
            className="
              h-full
              w-full
              object-cover
            "
          />
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >
            <div>
              <h2
                className="
                  font-[var(--font-display)]
                  text-[17px]
                  font-semibold
                  leading-[1.15]
                  text-[#4B1D63]
                  sm:text-[19px]
                "
              >
                {item.name}
              </h2>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#6F6870]
                  sm:text-[11px]
                "
              >
                Weight: {item.weight}
              </p>
            </div>

            {/* PRICE */}

            <p
              className="
                shrink-0
                font-[var(--font-body)]
                text-[15px]
                font-bold
                text-[#241128]
                sm:text-[16px]
              "
            >
              {formatPrice(
                Number(item.price || 0) *
                  Number(item.quantity || 0)
              )}
            </p>
          </div>

          {/* BOTTOM */}

          <div
            className="
              mt-6
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
            "
          >
            {/* QUANTITY */}

            <div
              className="
                flex
                h-[29px]
                items-center
                overflow-hidden
                rounded-[3px]
                border
                border-[#D8BBDD]
              "
            >
              <button
                type="button"
                onClick={onDecrease}
                aria-label={`Decrease ${item.name}`}
                className="
                  flex
                  h-full
                  w-[27px]
                  items-center
                  justify-center
                  text-[#4B1D63]
                  transition-colors
                  hover:bg-[#F1E7F3]
                "
              >
                <Minus size={11} />
              </button>

              <span
                className="
                  flex
                  h-full
                  min-w-[30px]
                  items-center
                  justify-center
                  border-x
                  border-[#D8BBDD]
                  px-2
                  text-[11px]
                  font-medium
                  text-[#4B1D63]
                "
              >
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={onIncrease}
                aria-label={`Increase ${item.name}`}
                className="
                  flex
                  h-full
                  w-[27px]
                  items-center
                  justify-center
                  text-[#4B1D63]
                  transition-colors
                  hover:bg-[#F1E7F3]
                "
              >
                <Plus size={11} />
              </button>
            </div>

            {/* ACTIONS */}

            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={onRemove}
                className="
                  flex
                  items-center
                  gap-1
                  text-[9px]
                  font-medium
                  text-[#D33A3A]
                  transition-colors
                  hover:text-[#A92020]
                "
              >
                <Trash2
                  size={12}
                  strokeWidth={1.7}
                />

                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   ORDER SUMMARY
========================================================= */

function OrderSummary({
  cartCount,
  subtotal,
  gst,
  gstLabel,
  gstSettingsLoading,
  delivery,
  total,
}) {
  return (
    <aside
      className="
        rounded-[9px]
        border
        border-[#D9C6DE]
        bg-[#EDE0F1]
        p-5
        sm:p-6
        lg:sticky
        lg:top-[130px]
      "
    >
      <h2
        className="
          font-[var(--font-display)]
          text-[24px]
          font-semibold
          text-[#4B1D63]
          sm:text-[26px]
        "
      >
        Order Summary
      </h2>

      <div className="mt-2 h-px bg-[#D5C1DB]" />

      {/* SUBTOTAL */}

      <div className="mt-5 flex items-center justify-between">
        <span
          className="
            text-[11px]
            text-[#6F6870]
            sm:text-[12px]
          "
        >
          Subtotal ({cartCount}{" "}
          {cartCount === 1
            ? "item"
            : "items"})
        </span>

        <span
          className="
            text-[11px]
            font-medium
            text-[#514952]
            sm:text-[12px]
          "
        >
          {formatPrice(subtotal)}
        </span>
      </div>

      {/* DELIVERY */}

      <div className="mt-4 flex items-center justify-between">
        <span
          className="
            text-[11px]
            text-[#6F6870]
            sm:text-[12px]
          "
        >
          Delivery
        </span>

        <span
          className="
            text-[11px]
            font-semibold
            text-[#C9A45C]
            sm:text-[12px]
          "
        >
          Free
        </span>
      </div>

      {/* GST */}

      <div className="mt-4 flex items-center justify-between">
        <span
          className="
            text-[11px]
            text-[#6F6870]
            sm:text-[12px]
          "
        >
          {gstLabel}
        </span>

        <span
          className="
            text-[11px]
            font-medium
            text-[#514952]
            sm:text-[12px]
          "
        >
          {gstSettingsLoading
            ? "..."
            : formatPrice(gst)}
        </span>
      </div>

      {/* GST STATUS */}

      {!gstSettingsLoading &&
        gst === 0 && (
          <p
            className="
              mt-2
              text-right
              text-[9px]
              font-medium
              text-green-700
            "
          >
            GST not applicable
          </p>
        )}

      {/* DIVIDER */}

      <div className="my-5 h-px bg-[#D5C1DB]" />

      {/* TOTAL */}

      <div className="flex items-center justify-between">
        <span
          className="
            text-[14px]
            font-bold
            text-[#35133F]
          "
        >
          Total
        </span>

        <span
          className="
            font-[var(--font-display)]
            text-[23px]
            font-semibold
            text-[#4B1D63]
          "
        >
          {formatPrice(total)}
        </span>
      </div>

      {/* CHECKOUT */}

      <Link
        to="/checkout"
        className="
          group
          mt-6
          flex
          h-[44px]
          w-full
          items-center
          justify-center
          gap-2
          rounded-[4px]
          bg-[#4B1D63]
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.08em]
          !text-white
          no-underline
          transition-all
          duration-300
          hover:bg-[#351247]
        "
      >
        Proceed To Checkout

        <ArrowRight
          size={14}
          strokeWidth={1.8}
          className="
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        />
      </Link>

      {/* SECURE */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-center
          gap-1.5
          text-[9px]
          text-[#6F6870]
        "
      >
        <LockKeyhole
          size={11}
          strokeWidth={1.6}
        />

        Secure Checkout
      </div>
    </aside>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ children }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="h-px w-10 bg-[#C9A45C]" />

      <h2
        className="
          font-[var(--font-display)]
          text-[24px]
          font-semibold
          text-[#4B1D63]
          sm:text-[27px]
        "
      >
        {children}
      </h2>

      <span className="h-px w-10 bg-[#C9A45C]" />
    </div>
  );
}

/* =========================================================
   RECOMMENDED CARD
========================================================= */

function RecommendedCard({ product }) {
  const { addToCart } = useCart();

  const [selectedWeight, setSelectedWeight] =
    useState(
      product.weights?.[1] ||
        product.weights?.[0] ||
        "500g"
    );

  const [added, setAdded] =
    useState(false);

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedWeight
    );

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  return (
    <article
      className="
        overflow-hidden
        rounded-[7px]
        border
        border-[#E2D4E5]
        bg-white
        p-3
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_10px_25px_rgba(75,29,99,0.10)]
        sm:p-3.5
      "
    >
      {/* IMAGE */}

      <div
        className="
          aspect-square
          w-full
          overflow-hidden
          rounded-[4px]
          bg-[#F5ECE5]
        "
      >
        <img
          src={product.image}
          alt={product.name}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            hover:scale-[1.03]
          "
        />
      </div>

      {/* CONTENT */}

      <div className="pt-3">
        <h3
          className="
            line-clamp-2
            min-h-[36px]
            font-[var(--font-display)]
            text-[15px]
            font-semibold
            leading-[1.15]
            text-[#4B1D63]
            sm:text-[16px]
          "
        >
          {product.name}
        </h3>

        <p
          className="
            mt-1.5
            text-[10px]
            text-[#6F6870]
          "
        >
          {formatPrice(product.price)} /{" "}
          {selectedWeight}
        </p>

        {/* WEIGHT SELECT */}

        <div className="relative mt-2.5">
          <select
            value={selectedWeight}
            onChange={(event) =>
              setSelectedWeight(
                event.target.value
              )
            }
            className="
              h-7
              w-full
              appearance-none
              rounded-[2px]
              border
              border-[#D8BBDD]
              bg-[#FFF9F2]
              px-2
              pr-7
              text-[9px]
              font-medium
              text-[#4B1D63]
              outline-none
              focus:border-[#4B1D63]
            "
          >
            {(product.weights || [
              "500g",
            ]).map((weight) => (
              <option
                key={weight}
                value={weight}
              >
                {weight}
              </option>
            ))}
          </select>

          <ChevronDown
            size={12}
            className="
              pointer-events-none
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              text-[#4B1D63]
            "
          />
        </div>

        {/* ADD TO CART */}

        {/*
        <button
          type="button"
          onClick={handleAddToCart}
          className={`
            mt-2.5
            flex
            h-8
            w-full
            items-center
            justify-center
            rounded-[3px]
            border
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.05em]
            transition-all
            duration-200
            active:scale-[0.98]
            ${
              added
                ? "border-[#4B1D63] bg-[#4B1D63] text-white"
                : "border-[#C9A45C] bg-white text-[#4B1D63] hover:bg-[#4B1D63] hover:text-white"
            }
          `}
        >
          {added
            ? "Added To Cart"
            : "Add To Cart"}
        </button>
        */}
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY CART
========================================================= */

function EmptyCart() {
  return (
    <div
      className="
        flex
        min-h-[420px]
        flex-col
        items-center
        justify-center
        rounded-[10px]
        border
        border-dashed
        border-[#D8BBDD]
        bg-white
        px-6
        text-center
      "
    >
      <div
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-[#EDE0F1]
        "
      >
        <ShoppingBag
          size={25}
          className="text-[#4B1D63]"
          strokeWidth={1.6}
        />
      </div>

      <h2
        className="
          mt-5
          font-[var(--font-display)]
          text-[28px]
          font-semibold
          text-[#4B1D63]
        "
      >
        Your Cart Is Empty
      </h2>

      <p
        className="
          mt-2
          max-w-[380px]
          text-[12px]
          leading-[1.6]
          text-[#6F6870]
        "
      >
        Add something delicious from our
        collection of handcrafted sweets.
      </p>

      <Link
        to="/sweets"
        className="
          mt-6
          inline-flex
          items-center
          gap-2
          rounded-[4px]
          bg-[#4B1D63]
          px-6
          py-3
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.08em]
          !text-white
          no-underline
          transition-colors
          hover:bg-[#351247]
        "
      >
        Explore Sweets

        <ArrowRight size={14} />
      </Link>
    </div>
  );
}