import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  UserRound,
  ShoppingCart,
  Home as HomeIcon,
  Phone,
  Tags,
  ChevronDown,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/logo/logo.png";
import Ticker from "../common/Ticker";
import Login from "../auth/Login";
import MobileTopNavigation from "../common/MobileTopNavigation";

import { useCart } from "../../context/CartContext";

/* =========================================================
   DESKTOP NAVIGATION
========================================================= */

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Sweets",
    href: "/all-sweets",
  },
  {
    label: "Our Story",
    href: "/our-story",
  },
  {
    label: "Our Outlets",
    href: "/our-outlets",
  },
];

/* =========================================================
   MOBILE BOTTOM NAVIGATION
========================================================= */

const mobileNavItems = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "Contact",
    href: "/contact-us",
    icon: Phone,
  },
  {
    label: "Categories",
    href: "/all-sweets",
    icon: Tags,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
];

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [showLogin, setShowLogin] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const location = useLocation();

  const { cartCount } = useCart();

  /* =======================================================
     CHECK SAVED LOGIN
  ======================================================= */

  useEffect(() => {
    const token =
      localStorage.getItem("nmb_token");

    const storedUser =
      localStorage.getItem("nmb_user");

    setIsLoggedIn(Boolean(token));

    if (storedUser) {
      try {
        setUser(
          JSON.parse(storedUser)
        );
      } catch (error) {
        console.error(
          "Failed to read saved user:",
          error
        );

        setUser(null);
      }
    }
  }, []);

  /* =======================================================
     MOBILE BOTTOM NAVBAR SPACE FIX
  ======================================================= */

  useEffect(() => {
    const root =
      document.getElementById("root");

    if (!root) {
      return;
    }

    const updateRootSpacing = () => {
      if (window.innerWidth < 1280) {
        root.style.paddingBottom =
          "calc(72px + env(safe-area-inset-bottom))";
      } else {
        root.style.paddingBottom =
          "0px";
      }
    };

    updateRootSpacing();

    window.addEventListener(
      "resize",
      updateRootSpacing
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateRootSpacing
      );

      root.style.paddingBottom =
        "0px";
    };
  }, []);

  /* =======================================================
     ACTIVE LINK
  ======================================================= */

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === href ||
      location.pathname.startsWith(
        `${href}/`
      )
    );
  };

  /* =======================================================
     OPEN PROFILE / LOGIN
  ======================================================= */

  const openLogin = () => {
    if (isLoggedIn) {
      setShowProfileMenu(
        (current) => !current
      );

      return;
    }

    setShowLogin(true);
  };

  /* =======================================================
     CLOSE LOGIN
  ======================================================= */

  const closeLogin = () => {
    setShowLogin(false);
  };

  /* =======================================================
     LOGIN SUCCESS
  ======================================================= */

  const handleLoginSuccess = (
    response
  ) => {
    console.log(
      "NMB Login successful:",
      response
    );

    if (response?.token) {
      localStorage.setItem(
        "nmb_token",
        response.token
      );
    }

    if (response?.user) {
      localStorage.setItem(
        "nmb_user",
        JSON.stringify(
          response.user
        )
      );
    }

    setIsLoggedIn(true);

    setUser(
      response?.user || null
    );

    setShowLogin(false);

    setShowProfileMenu(false);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "nmb_token"
    );

    localStorage.removeItem(
      "nmb_user"
    );

    setIsLoggedIn(false);

    setUser(null);

    setShowProfileMenu(false);
  };

  /* =======================================================
     USER DISPLAY NAME
  ======================================================= */

  const displayName =
    user?.fullName ||
    user?.name ||
    "My Account";

  /* =======================================================
     MOBILE ACTIVE STATE
  ======================================================= */

  const isMobileItemActive = (
    href
  ) => {
    if (href === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === href ||
      location.pathname.startsWith(
        `${href}/`
      )
    );
  };

  return (
    <>
      {/* =====================================================
          MAIN HEADER
      ====================================================== */}

      <motion.header
        initial={{
          y: -20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.55,
          ease: "easeOut",
        }}
        className="
          sticky
          top-0
          z-50
          w-full
          bg-[#FFF9F2]
        "
      >
        {/* =====================================================
            TICKER
        ====================================================== */}

        <Ticker />

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav
          className="
            hidden
            w-full
            border-b
            border-[#340C48]/10
            bg-[#FFF9F2]
            min-[1280px]:block
          "
        >
          <div
            className="
              flex
              h-[92px]
              w-full
              items-center
            "
            style={{
              paddingLeft:
                "clamp(40px, 3vw, 72px)",

              paddingRight:
                "clamp(40px, 3vw, 72px)",
            }}
          >
            {/* =================================================
                BRAND
            ================================================== */}

            <Link
              to="/"
              className="
                flex
                shrink-0
                items-center
                gap-[18px]
              "
            >
              <img
                src={logo}
                alt="Narayan Misthan Bhandar"
                className="
                  h-[76px]
                  w-[72px]
                  shrink-0
                  object-contain
                "
              />

              <div
                className="
                  flex
                  flex-col
                  leading-none
                "
              >
                <span
                  className="
                    font-['Playfair_Display']
                    text-[31px]
                    font-semibold
                    tracking-[-0.02em]
                  "
                  style={{
                    color: "#340C48",
                  }}
                >
                  Narayan Misthan
                </span>

                <span
                  className="
                    mt-[5px]
                    font-['Playfair_Display']
                    text-[31px]
                    font-semibold
                    tracking-[-0.02em]
                  "
                  style={{
                    color: "#340C48",
                  }}
                >
                  Bhandar
                </span>
              </div>
            </Link>

            {/* =================================================
                DESKTOP NAV LINKS
            ================================================== */}

            <div
              className="
                flex
                min-w-0
                flex-1
                items-center
                justify-center
              "
              style={{
                paddingLeft:
                  "clamp(25px, 2.5vw, 50px)",

                paddingRight:
                  "clamp(25px, 2.5vw, 50px)",
              }}
            >
              <div
                className="
                  flex
                  items-center
                  gap-[clamp(22px,2.2vw,38px)]
                "
              >
                {navLinks.map(
                  (
                    link,
                    index
                  ) => {
                    const active =
                      isActive(
                        link.href
                      );

                    return (
                      <motion.div
                        key={
                          link.label
                        }
                        initial={{
                          opacity: 0,
                          y: -8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            0.1 +
                            index *
                              0.06,
                          duration:
                            0.35,
                        }}
                      >
                        <Link
                          to={
                            link.href
                          }
                          className="
                            group
                            relative
                            whitespace-nowrap
                            font-[var(--font-body)]
                            text-[14px]
                            font-semibold
                            tracking-[0.01em]
                          "
                          style={{
                            color:
                              "#340C48",
                          }}
                        >
                          {
                            link.label
                          }

                          <span
                            className={`
                              absolute
                              -bottom-[8px]
                              left-0
                              h-[1.5px]
                              bg-[#340C48]
                              transition-all
                              duration-300
                              ${
                                active
                                  ? "w-full"
                                  : "w-0 group-hover:w-full"
                              }
                            `}
                          />
                        </Link>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================================
                DESKTOP ACTIONS
            ================================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-[20px]
              "
            >
              {/* ACCOUNT */}

              <div className="relative">
                <motion.button
                  type="button"
                  onClick={
                    openLogin
                  }
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  aria-label={
                    isLoggedIn
                      ? "Open profile menu"
                      : "Login"
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    text-[#340C48]
                  "
                >
                  <UserRound
                    size={25}
                    strokeWidth={
                      1.8
                    }
                  />

                  {isLoggedIn && (
                    <>
                      <span className="max-w-[120px] truncate text-[13px] font-semibold">
                        {
                          displayName
                        }
                      </span>

                      <ChevronDown
                        size={15}
                        strokeWidth={
                          1.8
                        }
                      />
                    </>
                  )}
                </motion.button>

                {/* PROFILE MENU */}

                <AnimatePresence>
                  {isLoggedIn &&
                    showProfileMenu && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -8,
                          scale: 0.96,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                          scale: 0.96,
                        }}
                        transition={{
                          duration:
                            0.18,
                        }}
                        className="
                          absolute
                          right-0
                          top-[42px]
                          z-[100]
                          w-[220px]
                          overflow-hidden
                          rounded-[8px]
                          border
                          border-[#340C48]/10
                          bg-[#FFF9F2]
                          shadow-[0_12px_35px_rgba(52,12,72,0.15)]
                        "
                      >
                        <div className="border-b border-[#340C48]/10 px-4 py-4">
                          <p className="text-[11px] uppercase tracking-[0.08em] text-[#8A7D8F]">
                            Welcome
                            back
                          </p>

                          <p className="mt-1 truncate font-[var(--font-display)] text-[18px] font-semibold text-[#340C48]">
                            {
                              displayName
                            }
                          </p>

                          {user?.phone && (
                            <p className="mt-1 text-[11px] text-[#6E6670]">
                              {
                                user.phone
                              }
                            </p>
                          )}
                        </div>

                        <Link
                          to="/profile"
                          onClick={() =>
                            setShowProfileMenu(
                              false
                            )
                          }
                          className="
                            block
                            border-b
                            border-[#340C48]/10
                            px-4
                            py-3
                            text-[14px]
                            font-semibold
                            text-[#340C48]
                            transition-colors
                            hover:bg-[#340C48]/5
                          "
                        >
                          Profile
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() =>
                            setShowProfileMenu(
                              false
                            )
                          }
                          className="
                            block
                            border-b
                            border-[#340C48]/10
                            px-4
                            py-3
                            text-[14px]
                            font-semibold
                            text-[#340C48]
                            transition-colors
                            hover:bg-[#340C48]/5
                          "
                        >
                          Orders
                        </Link>

                        <button
                          type="button"
                          onClick={
                            handleLogout
                          }
                          className="
                            block
                            w-full
                            px-4
                            py-3
                            text-left
                            text-[14px]
                            font-semibold
                            text-red-700
                            transition-colors
                            hover:bg-red-50
                          "
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>

              {/* CART */}

              <Link
                to="/cart"
                aria-label="Shopping cart"
                className="
                  relative
                  flex
                  items-center
                  justify-center
                "
                style={{
                  color:
                    "#340C48",
                }}
              >
                <ShoppingCart
                  size={27}
                  strokeWidth={
                    1.8
                  }
                />

                {cartCount >
                  0 && (
                  <span
                    className="
                      absolute
                      -right-[9px]
                      -top-[10px]
                      flex
                      h-[20px]
                      min-w-[20px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#D8B36A]
                      px-1
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {
                      cartCount
                    }
                  </span>
                )}
              </Link>

              {/* ORDER NOW */}

              <motion.div
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <Link
                  to="/all-sweets"
                  className="
                    flex
                    h-[56px]
                    w-[142px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[5px]
                    bg-[#340C48]
                    text-center
                    font-[var(--font-body)]
                    text-[16px]
                    font-semibold
                    uppercase
                    leading-[1.2]
                    tracking-[0.04em]
                    transition-colors
                    duration-300
                    hover:bg-[#260832]
                  "
                  style={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  ORDER
                  <br />
                  NOW
                </Link>
              </motion.div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* =========================================================
          MOBILE TOP NAVIGATION
          
          IMPORTANT:
          This is OUTSIDE the sticky header so it can visually
          overlay the hero section.
      ========================================================== */}

      <MobileTopNavigation />

      {/* =========================================================
          MOBILE BOTTOM NAVIGATION
      ========================================================== */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-[90]
          block
          px-2
          pb-[env(safe-area-inset-bottom)]
          min-[1280px]:hidden
        "
      >
        <motion.nav
          initial={{
            y: 100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="
            mx-auto
            flex
            h-[72px]
            w-full
            max-w-[430px]
            items-center
            justify-between
            rounded-t-[18px]
            bg-[#FFF9F2]
            px-2
            shadow-[0_-8px_30px_rgba(52,12,72,0.12)]
          "
        >
          {/* =================================================
              MOBILE NAV ITEMS
          ================================================== */}

          {mobileNavItems.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                isMobileItemActive(
                  item.href
                );

              return (
                <Link
                  key={
                    item.label
                  }
                  to={
                    item.href
                  }
                  className="
                    flex
                    h-full
                    flex-1
                    items-center
                    justify-center
                  "
                >
                  <motion.div
                    whileTap={{
                      scale: 0.92,
                    }}
                    animate={{
                      scale:
                        active
                          ? 1
                          : 0.98,
                    }}
                    transition={{
                      duration:
                        0.2,
                    }}
                    className={`
                      relative
                      flex
                      min-w-[58px]
                      flex-col
                      items-center
                      justify-center
                      gap-[3px]
                      rounded-[13px]
                      px-2
                      py-2
                      transition-all
                      duration-300
                      ${
                        active
                          ? "bg-[#E6D8EA] text-[#340C48]"
                          : "text-[#4C444E]"
                      }
                    `}
                  >
                    <Icon
                      size={22}
                      strokeWidth={
                        active
                          ? 2.1
                          : 1.8
                      }
                    />

                    <span
                      className={`
                        text-[11px]
                        leading-none
                        ${
                          active
                            ? "font-semibold"
                            : "font-medium"
                        }
                      `}
                    >
                      {
                        item.label
                      }
                    </span>

                    {/* Cart Badge */}

                    {item.label ===
                      "Cart" &&
                      cartCount >
                        0 && (
                        <span
                          className="
                            absolute
                            right-[2px]
                            top-[2px]
                            flex
                            h-[16px]
                            min-w-[16px]
                            items-center
                            justify-center
                            rounded-full
                            bg-[#D8B36A]
                            px-1
                            text-[8px]
                            font-bold
                            text-white
                          "
                        >
                          {
                            cartCount
                          }
                        </span>
                      )}
                  </motion.div>
                </Link>
              );
            }
          )}

          {/* =================================================
              ACCOUNT
          ================================================== */}

          <div className="relative flex h-full flex-1 items-center justify-center">
            <motion.button
              type="button"
              onClick={
                openLogin
              }
              whileTap={{
                scale: 0.92,
              }}
              className={`
                flex
                min-w-[58px]
                flex-col
                items-center
                justify-center
                gap-[3px]
                rounded-[13px]
                px-2
                py-2
                transition-all
                duration-300
                ${
                  location.pathname ===
                    "/profile" ||
                  showProfileMenu
                    ? "bg-[#E6D8EA] text-[#340C48]"
                    : "text-[#4C444E]"
                }
              `}
            >
              <UserRound
                size={22}
                strokeWidth={
                  location.pathname ===
                      "/profile" ||
                    showProfileMenu
                    ? 2.1
                    : 1.8
                }
              />

              <span
                className={`
                  text-[11px]
                  leading-none
                  ${
                    location.pathname ===
                        "/profile" ||
                      showProfileMenu
                      ? "font-semibold"
                      : "font-medium"
                  }
                `}
              >
                Account
              </span>
            </motion.button>

            {/* =================================================
                MOBILE ACCOUNT MENU
            ================================================== */}

            <AnimatePresence>
              {isLoggedIn &&
                showProfileMenu && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 12,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 12,
                      scale: 0.95,
                    }}
                    transition={{
                      duration:
                        0.2,
                    }}
                    className="
                      absolute
                      bottom-[78px]
                      right-1
                      z-[120]
                      w-[210px]
                      overflow-hidden
                      rounded-[14px]
                      border
                      border-[#340C48]/10
                      bg-[#FFF9F2]
                      shadow-[0_12px_35px_rgba(52,12,72,0.18)]
                    "
                  >
                    <div className="border-b border-[#340C48]/10 px-4 py-4">
                      <p className="text-[10px] uppercase tracking-[0.08em] text-[#8A7D8F]">
                        Welcome
                        back
                      </p>

                      <p className="mt-1 truncate font-[var(--font-display)] text-[17px] font-semibold text-[#340C48]">
                        {
                          displayName
                        }
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() =>
                        setShowProfileMenu(
                          false
                        )
                      }
                      className="
                        block
                        border-b
                        border-[#340C48]/10
                        px-4
                        py-3
                        text-[13px]
                        font-semibold
                        text-[#340C48]
                      "
                    >
                      Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() =>
                        setShowProfileMenu(
                          false
                        )
                      }
                      className="
                        block
                        border-b
                        border-[#340C48]/10
                        px-4
                        py-3
                        text-[13px]
                        font-semibold
                        text-[#340C48]
                      "
                    >
                      Orders
                    </Link>

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="
                        block
                        w-full
                        px-4
                        py-3
                        text-left
                        text-[13px]
                        font-semibold
                        text-red-700
                      "
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.nav>
      </div>

      {/* =========================================================
          LOGIN POPUP
      ========================================================== */}

      <AnimatePresence>
        {showLogin && (
          <Login
            onClose={
              closeLogin
            }
            onLoginSuccess={
              handleLoginSuccess
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;