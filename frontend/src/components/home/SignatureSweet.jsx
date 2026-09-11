import React, { useEffect, useMemo, useState } from "react";

import { useCart } from "../../context/CartContext";

import {
  getProducts,
} from "../../services/api";

function SignatureSweet() {
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [added, setAdded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // ============================================
  // FETCH PRODUCT
  // ============================================

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        const products = response.products || [];

        if (!mounted) return;

        /*
         * For now there is only one product.
         *
         * When more products are added later,
         * you can replace this logic with a
         * specific product/category selection.
         */
        const selectedProduct =
          products.find(
            (item) =>
              item.name
                ?.toLowerCase()
                .includes("kaju katli")
          ) || products[0];

        setProduct(selectedProduct || null);
      } catch (err) {
        console.error(
          "Unable to load signature sweet:",
          err
        );

        if (mounted) {
          setError(
            err.message ||
              "Unable to load product."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================
  // PRODUCT IMAGES
  // ============================================

  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images.map(
        (image, index) => ({
          src: image,
          alt: `${product.name} - Image ${
            index + 1
          }`,
        })
      );
    }

    if (product.image) {
      return [
        {
          src: product.image,
          alt: product.name,
        },
      ];
    }

    return [];
  }, [product]);

  // ============================================
  // RESET SLIDE WHEN PRODUCT CHANGES
  // ============================================

  useEffect(() => {
    setActiveSlide(0);
  }, [product]);

  // ============================================
  // AUTO CAROUSEL
  // ============================================

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((previous) =>
        previous === images.length - 1
          ? 0
          : previous + 1
      );
    }, 2500);

    return () =>
      window.clearInterval(interval);
  }, [images.length]);

  // ============================================
  // FIRST VARIETY
  // ============================================

  const firstVariety =
    product?.varieties?.[0] || null;

  const sellingPrice = Number(
    firstVariety?.sellingPrice ??
      firstVariety?.price ??
      product?.sellingPrice ??
      product?.price ??
      0
  );

  const offerPrice =
    firstVariety?.offerPrice !== null &&
    firstVariety?.offerPrice !== undefined &&
    firstVariety?.offerPrice !== ""
      ? Number(firstVariety.offerPrice)
      : product?.offerPrice !== null &&
        product?.offerPrice !== undefined &&
        product?.offerPrice !== ""
      ? Number(product.offerPrice)
      : null;

  const hasOffer =
    Number.isFinite(offerPrice) &&
    offerPrice > 0 &&
    offerPrice < sellingPrice;

  const finalPrice = hasOffer
    ? offerPrice
    : sellingPrice;

  const discountPercentage = hasOffer
    ? Math.round(
        ((sellingPrice - offerPrice) /
          sellingPrice) *
          100
      )
    : 0;

  // ============================================
  // ADD TO CART
  // ============================================

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    const selectedWeight =
      firstVariety?.weight ||
      product.weights?.[0] ||
      "500g";

    addToCart(product, selectedWeight);

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  // ============================================
  // CAROUSEL
  // ============================================

  const handlePrevious = () => {
    setActiveSlide((previous) =>
      previous === 0
        ? images.length - 1
        : previous - 1
    );
  };

  const handleNext = () => {
    setActiveSlide((previous) =>
      previous === images.length - 1
        ? 0
        : previous + 1
    );
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <section className="w-full bg-[var(--nmb-cream)] py-12 sm:py-14 lg:py-20">
        <div className="mx-auto w-full max-w-[1088px] px-4 sm:px-6 lg:px-0">
          <div className="flex min-h-[360px] items-center justify-center rounded-[14px] bg-white lg:min-h-[520px]">
            <p className="text-sm text-[#6F6870]">
              Loading our signature sweet...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // ERROR / NO PRODUCT
  // ============================================

  if (error || !product) {
    return (
      <section className="w-full bg-[var(--nmb-cream)] py-12 sm:py-14 lg:py-20">
        <div className="mx-auto w-full max-w-[1088px] px-4 sm:px-6 lg:px-0">
          <div className="flex min-h-[260px] items-center justify-center rounded-[14px] bg-white px-6 text-center">
            <div>
              <p className="text-sm font-medium text-[#6F6870]">
                {error ||
                  "Our signature sweet is currently unavailable."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[var(--nmb-cream)] py-12 sm:py-14 lg:py-20">
      <div className="mx-auto w-full max-w-[1088px] px-4 sm:px-6 lg:px-0">
        <div className="grid w-full overflow-hidden rounded-[14px] bg-white lg:grid-cols-2">

          {/* ========================================
              IMAGE CAROUSEL
          ======================================== */}

          <div className="relative h-[360px] sm:h-[420px] lg:h-[520px]">
            <div className="h-full w-full overflow-hidden">
              {images.length > 0 ? (
                <div
                  className="flex h-full w-full transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${
                      activeSlide * 100
                    }%)`,
                  }}
                >
                  {images.map(
                    (image, index) => (
                      <div
                        key={`${image.src}-${index}`}
                        className="h-full w-full shrink-0"
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f7f1ed]">
                  <span className="text-sm text-[#81747b]">
                    No product image
                  </span>
                </div>
              )}
            </div>

            {/* Previous */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous image"
                className="
                  absolute
                  left-4
                  top-1/2
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/90
                  text-[var(--nmb-purple)]
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-white
                  active:scale-95
                "
              >
                <span className="text-xl leading-none">
                  ‹
                </span>
              </button>
            )}

            {/* Next */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="
                  absolute
                  right-4
                  top-1/2
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/90
                  text-[var(--nmb-purple)]
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-white
                  active:scale-95
                "
              >
                <span className="text-xl leading-none">
                  ›
                </span>
              </button>
            )}

            {/* Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map(
                  (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setActiveSlide(index)
                      }
                      aria-label={`Go to image ${
                        index + 1
                      }`}
                      className={`
                        h-1.5
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          activeSlide === index
                            ? "w-6 bg-white"
                            : "w-1.5 bg-white/50"
                        }
                      `}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* ========================================
              CONTENT
          ======================================== */}

          <div className="flex items-center px-8 py-10 sm:px-10 sm:py-12 lg:px-10 lg:py-12">
            <div className="max-w-[460px]">

              <p className="mb-3 text-[20px] font-medium uppercase tracking-[0.25em] text-[#C59A4A]">
                Masterpiece
              </p>

              <h2 className="max-w-[400px] font-[var(--font-display)] text-[38px] font-semibold leading-[0.98] tracking-[-0.03em] text-[var(--nmb-purple)] sm:text-[42px] lg:text-[44px]">
                {product.name}
              </h2>

              <p className="mt-5 max-w-[430px] text-[13px] leading-[1.65] text-[#6F6870]">
                {product.description}
              </p>

              {/* ========================================
                  PRICE
              ======================================== */}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {hasOffer && (
                  <span className="text-[17px] text-[#8A8186] line-through">
                    ₹
                    {sellingPrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                )}

                <span className="text-[24px] font-bold text-[var(--nmb-purple)]">
                  ₹
                  {finalPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>

                {hasOffer && (
                  <span className="rounded-full bg-[#E9F6EC] px-2.5 py-1 text-[11px] font-bold text-[#2E7D32]">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Weight */}
              {firstVariety?.weight && (
                <p className="mt-2 text-xs text-[#81747b]">
                  Starting from{" "}
                  <span className="font-semibold text-[#4C4147]">
                    {firstVariety.weight}
                  </span>
                </p>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-3
                  rounded-[4px]
                  bg-[var(--nmb-purple)]
                  px-5
                  py-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  !text-white
                  transition-all
                  duration-200
                  hover:opacity-90
                  active:scale-[0.98]
                "
              >
                {added
                  ? "Added To Cart"
                  : "Add to Cart"}

                <span className="text-sm">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignatureSweet;