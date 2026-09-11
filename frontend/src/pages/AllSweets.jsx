import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  getShowcaseSweets,
} from "../services/api";

import nmbBanner from "../assets/images/nmb-sweets-banner.png";
import sweetsBanner2 from "../assets/images/milk-cake.png";
import sweetsBanner3 from "../assets/images/motichoor-laddu.png";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* =========================================================
   BANNERS
========================================================= */

const BANNERS = [
  {
    id: 1,
    image: nmbBanner,
    title: "NMB Sweets",
    subtitle:
      "Experience the rich heritage of handcrafted Indian sweets.",
    description:
      "Meticulously prepared with the finest ingredients and a touch of tradition.",
  },

  {
    id: 2,
    image: sweetsBanner2,
    title: "The Art of Kaju",
    subtitle:
      "Premium ingredients, timeless craftsmanship.",
    description:
      "Discover our signature collection of rich, delicate and authentic kaju sweets.",
  },

  {
    id: 3,
    image: sweetsBanner3,
    title: "Sweet Traditions",
    subtitle:
      "Made with love, served with tradition.",
    description:
      "Celebrate every special occasion with the authentic taste of Indian mithai.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getImage(sweet) {
  if (
    Array.isArray(sweet.images) &&
    sweet.images.length > 0
  ) {
    return sweet.images[0];
  }

  return "";
}

/* =========================================================
   ALL SWEETS
========================================================= */

export default function AllSweets() {
  const [
    sweets,
    setSweets,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState([]);

  const [
    selectedDietary,
    setSelectedDietary,
  ] = useState([]);

  const [
    sortBy,
    setSortBy,
  ] = useState("Popular");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    mobileFiltersOpen,
    setMobileFiltersOpen,
  ] = useState(false);

  const [
    activeBanner,
    setActiveBanner,
  ] = useState(0);

  const productsPerPage = 4;

  /* =======================================================
     FETCH SHOWCASE SWEETS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchSweets = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getShowcaseSweets();

        if (!mounted) {
          return;
        }

        setSweets(
          Array.isArray(
            response.sweets
          )
            ? response.sweets
            : []
        );
      } catch (err) {
        console.error(
          "Unable to load showcase sweets:",
          err
        );

        if (mounted) {
          setError(
            err.message ||
              "Unable to load sweets."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSweets();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     BANNER SLIDER
  ======================================================= */

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setActiveBanner(
          (current) =>
            current ===
            BANNERS.length - 1
              ? 0
              : current + 1
        );
      }, 5000);

    return () =>
      window.clearInterval(
        interval
      );
  }, []);

  const nextBanner = () => {
    setActiveBanner(
      (current) =>
        current ===
        BANNERS.length - 1
          ? 0
          : current + 1
    );
  };

  const previousBanner = () => {
    setActiveBanner(
      (current) =>
        current === 0
          ? BANNERS.length - 1
          : current - 1
    );
  };

  /* =======================================================
     DYNAMIC FILTER VALUES
  ======================================================= */

  const categoryFilters =
    useMemo(() => {
      return [
        ...new Set(
          sweets
            .map(
              (sweet) =>
                sweet.category
            )
            .filter(Boolean)
        ),
      ];
    }, [sweets]);

  const dietaryFilters =
    useMemo(() => {
      return [
        ...new Set(
          sweets.flatMap(
            (sweet) =>
              Array.isArray(
                sweet.dietary
              )
                ? sweet.dietary
                : []
          )
        ),
      ];
    }, [sweets]);

  /* =======================================================
     CATEGORY FILTER
  ======================================================= */

  const toggleCategory = (
    category
  ) => {
    setPage(1);

    setSelectedCategories(
      (current) =>
        current.includes(category)
          ? current.filter(
              (item) =>
                item !== category
            )
          : [
              ...current,
              category,
            ]
    );
  };

  /* =======================================================
     DIETARY FILTER
  ======================================================= */

  const toggleDietary = (
    dietary
  ) => {
    setPage(1);

    setSelectedDietary(
      (current) =>
        current.includes(dietary)
          ? current.filter(
              (item) =>
                item !== dietary
            )
          : [
              ...current,
              dietary,
            ]
    );
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedDietary([]);
    setPage(1);
  };

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredSweets =
    useMemo(() => {
      let result = [...sweets];

      if (
        selectedCategories.length >
        0
      ) {
        result = result.filter(
          (sweet) =>
            selectedCategories.includes(
              sweet.category
            )
        );
      }

      if (
        selectedDietary.length >
        0
      ) {
        result =
          result.filter(
            (sweet) =>
              selectedDietary.every(
                (filter) =>
                  (
                    sweet.dietary ||
                    []
                  ).includes(filter)
              )
          );
      }

      if (
        sortBy === "Popular"
      ) {
        result.sort(
          (a, b) =>
            Number(
              a.displayOrder || 0
            ) -
            Number(
              b.displayOrder || 0
            )
        );
      }

      if (
        sortBy ===
        "Name: A to Z"
      ) {
        result.sort((a, b) =>
          String(
            a.name || ""
          ).localeCompare(
            String(
              b.name || ""
            )
          )
        );
      }

      if (
        sortBy ===
        "Name: Z to A"
      ) {
        result.sort((a, b) =>
          String(
            b.name || ""
          ).localeCompare(
            String(
              a.name || ""
            )
          )
        );
      }

      return result;
    }, [
      sweets,
      selectedCategories,
      selectedDietary,
      sortBy,
    ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredSweets.length /
        productsPerPage
    )
  );

  const visibleSweets =
    filteredSweets.slice(
      (page - 1) *
        productsPerPage,
      page *
        productsPerPage
    );

  const handlePageChange = (
    newPage
  ) => {
    if (
      newPage < 1 ||
      newPage > totalPages
    ) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const banner =
    BANNERS[activeBanner];

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2]">
        <Navbar />

        <main className="mx-auto flex min-h-[500px] max-w-[1088px] items-center justify-center px-5">
          <p className="text-sm text-[#6F6870]">
            Loading our sweets...
          </p>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      <Navbar />

      {/* =====================================================
          BANNER
      ===================================================== */}

      <section className="relative w-full overflow-hidden bg-[#340C48]">
        <img
          src={banner.image}
          alt={banner.title}
          className="
            h-[660px]
            w-full
            object-cover
            object-center
            sm:h-[630px]
            md:h-[690px]
            lg:h-[430px]
            xl:h-[450px]
          "
        />

        <div className="absolute inset-0 bg-[#340C48]/55" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#1C0925]/60 via-[#1C0925]/10 to-[#1C0925]/40" />

        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <div className="max-w-[760px]">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E8CC8A] sm:text-[12px]">
              Narayan Misthan Bhandar
            </p>

            <h1 className="font-[var(--font-display)] text-[38px] font-semibold leading-none tracking-[-0.025em] !text-white sm:text-[52px] md:text-[62px] lg:text-[68px]">
              {banner.title}
            </h1>

            <p className="mx-auto mt-4 max-w-[650px] font-[var(--font-display)] text-[17px] leading-[1.35] !text-white sm:text-[20px] md:text-[22px]">
              {banner.subtitle}
            </p>

            <p className="mx-auto mt-2 max-w-[620px] text-[11px] leading-[1.6] text-white/85 sm:text-[13px] md:text-[14px]">
              {banner.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={previousBanner}
          aria-label="Previous banner"
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
            border
            border-white/40
            bg-black/20
            text-white
            backdrop-blur-sm
            hover:bg-white
            hover:text-[#340C48]
            sm:left-6
            sm:h-11
            sm:w-11
          "
        >
          <ChevronLeft size={19} />
        </button>

        <button
          type="button"
          onClick={nextBanner}
          aria-label="Next banner"
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
            border
            border-white/40
            bg-black/20
            text-white
            backdrop-blur-sm
            hover:bg-white
            hover:text-[#340C48]
            sm:right-6
            sm:h-11
            sm:w-11
          "
        >
          <ChevronRight size={19} />
        </button>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {BANNERS.map(
            (item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setActiveBanner(
                    index
                  )
                }
                aria-label={`Go to banner ${
                  index + 1
                }`}
                className={`
                  h-[5px]
                  rounded-full
                  transition-all
                  ${
                    activeBanner ===
                    index
                      ? "w-8 bg-[#E8CC8A]"
                      : "w-2 bg-white/60"
                  }
                `}
              />
            )
          )}
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-[1088px] px-5 pb-20 pt-12 sm:px-8 lg:px-0 lg:pt-14">

        {/* HEADER */}

        <div className="flex flex-col gap-8 border-b border-[#E5D8E8] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A45C]">
              NMB Collection
            </p>

            <h2 className="font-[var(--font-display)] text-[42px] font-semibold leading-none tracking-[-0.025em] text-[#4B1D63] sm:text-[48px]">
              Our Sweets
            </h2>

            <p className="mt-3 text-[14px] leading-[1.5] text-[#6F6870] sm:text-[15px]">
              Discover something delicious for every occasion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#6F6870]">
              Sort By
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(
                    e.target.value
                  );
                  setPage(1);
                }}
                className="h-9 min-w-[150px] appearance-none rounded-[2px] border border-[#C9A45C]/50 bg-[#FFF9F2] px-4 pr-9 text-[11px] font-medium text-[#4B1D63] outline-none"
              >
                <option>
                  Popular
                </option>

                <option>
                  Name: A to Z
                </option>

                <option>
                  Name: Z to A
                </option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4B1D63]"
              />
            </div>
          </div>
        </div>

        {/* MOBILE FILTER */}

        <button
          type="button"
          onClick={() =>
            setMobileFiltersOpen(
              true
            )
          }
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#C9A45C] py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4B1D63] lg:hidden"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>

        {/* CONTENT */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[234px_1fr]">

          {/* FILTER */}

          <FilterPanel
            selectedCategories={
              selectedCategories
            }
            selectedDietary={
              selectedDietary
            }
            categoryFilters={
              categoryFilters
            }
            dietaryFilters={
              dietaryFilters
            }
            toggleCategory={
              toggleCategory
            }
            toggleDietary={
              toggleDietary
            }
            clearFilters={
              clearFilters
            }
          />

          {/* SWEETS */}

          <div>
            {error ? (
              <EmptyState
                message={error}
                onClear={
                  clearFilters
                }
              />
            ) : visibleSweets.length >
              0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {visibleSweets.map(
                  (sweet) => (
                    <SweetCard
                      key={
                        sweet._id
                      }
                      sweet={sweet}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState
                onClear={
                  clearFilters
                }
              />
            )}

            {filteredSweets.length >
              0 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    handlePageChange(
                      page - 1
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#D8BBDD] text-[#4B1D63] hover:bg-[#4B1D63] hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft
                    size={15}
                  />
                </button>

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() =>
                        handlePageChange(
                          number
                        )
                      }
                      className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-[3px]
                        border
                        text-[12px]
                        ${
                          page ===
                          number
                            ? "border-[#4B1D63] bg-[#4B1D63] text-white"
                            : "border-[#D8BBDD] text-[#4B1D63]"
                        }
                      `}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={
                    page ===
                    totalPages
                  }
                  onClick={() =>
                    handlePageChange(
                      page + 1
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#D8BBDD] text-[#4B1D63] hover:bg-[#4B1D63] hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronRight
                    size={15}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* MOBILE DRAWER */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(
                false
              )
            }
            className="absolute inset-0 bg-black/30"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[20px] bg-[#FFF9F2] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-[25px] font-semibold text-[#4B1D63]">
                Filters
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8BBDD] text-[#4B1D63]"
              >
                <X size={16} />
              </button>
            </div>

            <FilterContent
              selectedCategories={
                selectedCategories
              }
              selectedDietary={
                selectedDietary
              }
              categoryFilters={
                categoryFilters
              }
              dietaryFilters={
                dietaryFilters
              }
              toggleCategory={
                toggleCategory
              }
              toggleDietary={
                toggleDietary
              }
              clearFilters={
                clearFilters
              }
            />

            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(
                  false
                )
              }
              className="mt-7 w-full rounded-[4px] bg-[#4B1D63] py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   FILTER PANEL
========================================================= */

function FilterPanel({
  selectedCategories,
  selectedDietary,
  categoryFilters,
  dietaryFilters,
  toggleCategory,
  toggleDietary,
  clearFilters,
}) {
  return (
    <aside className="hidden h-fit rounded-[9px] bg-[#EDE0F1] p-5 lg:block">
      <div className="flex items-center gap-2">
        <SlidersHorizontal
          size={18}
          className="text-[#C9A45C]"
        />

        <h2 className="font-[var(--font-display)] text-[25px] font-semibold text-[#4B1D63]">
          Filters
        </h2>
      </div>

      <FilterContent
        selectedCategories={
          selectedCategories
        }
        selectedDietary={
          selectedDietary
        }
        categoryFilters={
          categoryFilters
        }
        dietaryFilters={
          dietaryFilters
        }
        toggleCategory={
          toggleCategory
        }
        toggleDietary={
          toggleDietary
        }
        clearFilters={
          clearFilters
        }
      />
    </aside>
  );
}

/* =========================================================
   FILTER CONTENT
========================================================= */

function FilterContent({
  selectedCategories,
  selectedDietary,
  categoryFilters,
  dietaryFilters,
  toggleCategory,
  toggleDietary,
  clearFilters,
}) {
  return (
    <div>
      <div className="mt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#4B1D63]">
          Categories
        </p>

        <div className="mt-3 h-px bg-[#D5C1DB]" />

        <div className="mt-4 flex flex-col gap-3">
          {categoryFilters.map(
            (category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-3 text-[12px] text-[#514952]"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(
                    category
                  )}
                  onChange={() =>
                    toggleCategory(
                      category
                    )
                  }
                  className="h-4 w-4 cursor-pointer accent-[#4B1D63]"
                />

                {category}
              </label>
            )
          )}
        </div>
      </div>

      {dietaryFilters.length >
        0 && (
        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#4B1D63]">
            Dietary
          </p>

          <div className="mt-3 h-px bg-[#D5C1DB]" />

          <div className="mt-4 flex flex-wrap gap-2">
            {dietaryFilters.map(
              (dietary) => {
                const active =
                  selectedDietary.includes(
                    dietary
                  );

                return (
                  <button
                    key={dietary}
                    type="button"
                    onClick={() =>
                      toggleDietary(
                        dietary
                      )
                    }
                    className={`
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-[10px]
                      ${
                        active
                          ? "border-[#4B1D63] bg-[#4B1D63] text-white"
                          : "border-[#C9A45C]/50 bg-[#FFF9F2] text-[#4B1D63]"
                      }
                    `}
                  >
                    {dietary}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={clearFilters}
        className="mt-7 w-full border border-[#C9A45C] py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#4B1D63]"
      >
        Clear Filters
      </button>
    </div>
  );
}

/* =========================================================
   SWEET CARD
========================================================= */

function SweetCard({
  sweet,
}) {
  const image =
    getImage(sweet);

  return (
    <article className="overflow-hidden rounded-[9px] border border-[#E2D4E5] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(75,29,99,0.10)]">
      <div className="relative h-[250px] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={sweet.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#F7F1ED] text-sm text-[#81747B]">
            No image
          </div>
        )}

        {sweet.badge && (
          <div className="absolute left-3 top-3 rounded-[4px] bg-[#F0E4F3] px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.06em] text-[#4B1D63]">
            {sweet.badge}
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#C9A45C]">
          {sweet.category}
        </p>

        <h3 className="mt-2 font-[var(--font-display)] text-[25px] font-semibold leading-[1.05] text-[#4B1D63]">
          {sweet.name}
        </h3>

        <p className="mt-3 min-h-[52px] text-[12px] leading-[1.6] text-[#6F6870]">
          {sweet.description}
        </p>

        {Array.isArray(
          sweet.dietary
        ) &&
          sweet.dietary.length >
            0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {sweet.dietary.map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[#F4ECF6] px-2.5 py-1 text-[9px] text-[#4B1D63]"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          )}

        <div className="mt-5 border-t border-[#EEE3F0] pt-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#81747B]">
            Available at NMB
          </span>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  onClear,
  message = "No sweets found",
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D8BBDD] bg-white px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE0F1]">
        <ShoppingBag
          size={23}
          className="text-[#4B1D63]"
        />
      </div>

      <h3 className="mt-5 font-[var(--font-display)] text-[25px] font-semibold text-[#4B1D63]">
        {message}
      </h3>

      <p className="mt-2 max-w-[350px] text-[12px] leading-[1.6] text-[#6F6870]">
        Try changing your filters or add
        sweets from the admin panel.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-[4px] bg-[#4B1D63] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
      >
        Clear Filters
      </button>
    </div>
  );
}