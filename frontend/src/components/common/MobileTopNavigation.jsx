import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo/logo.png";

/* =========================================================
   IOS DETECTION
========================================================= */

const isIOS =
  typeof navigator !== "undefined" &&
  (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1
    )
  );

/*
  IMPORTANT:
  The logo is being rendered upside down by iOS/WebKit
  on the actual device.

  We ONLY rotate it on iOS.

  Chrome desktop:
      false

  Chrome DevTools mobile:
      false

  Android:
      false

  Actual iPhone/iPad:
      true
*/

/* =========================================================
   MOBILE MENU ITEMS
========================================================= */

const menuItems = [
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
  {
    label: "Contact Us",
    href: "/contact-us",
  },
];

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const backdropVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

const drawerVariants = {
  hidden: {
    x: "-100%",
    opacity: 0.8,
  },

  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    x: "-100%",
    opacity: 0.8,
    transition: {
      duration: 0.32,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const menuContainerVariants = {
  hidden: {},

  visible: {
    transition: {
      delayChildren: 0.18,
      staggerChildren: 0.075,
    },
  },

  exit: {
    transition: {
      staggerChildren: 0.035,
      staggerDirection: -1,
    },
  },
};

const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: -18,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    x: -12,
    transition: {
      duration: 0.18,
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

function MobileTopNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* =====================================================
          MOBILE TOP NAVIGATION
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.55,
          ease: "easeOut",
        }}
        className="
          absolute
          left-0
          right-0
          top-0
          z-[80]
          block
          min-[1280px]:hidden
        "
      >
        <div
          className="
            relative
            mx-auto
            flex
            h-[60px]
            w-full
            items-center
            justify-between
            overflow-hidden
            border-b
            border-white/15
            bg-[#340C48]/65
            px-5
            shadow-[0_6px_25px_rgba(28,9,37,0.12)]
            backdrop-blur-[5px]
          "
        >
          {/* =================================================
              TOP HIGHLIGHT
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/30
              to-transparent
            "
          />

          {/* =================================================
              HAMBURGER
          ================================================== */}

          <motion.button
            type="button"
            onClick={() => setMenuOpen(true)}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.88,
            }}
            aria-label="Open navigation menu"
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-white
              transition-colors
              duration-200
              hover:bg-white/10
            "
          >
            <Menu
              size={24}
              strokeWidth={1.7}
            />

            <span
              className="
                absolute
                right-[2px]
                top-[3px]
                h-[4px]
                w-[4px]
                rounded-full
                bg-[#E8CC8A]
              "
            />
          </motion.button>

          {/* =================================================
              CENTER LOGO

              iOS ONLY:
              rotate 180 degrees
          ================================================== */}

          <Link
            to="/"
            aria-label="Narayan Misthan Bhandar"
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            <motion.div
              whileTap={{
                scale: 0.92,
              }}
              className="
                flex
                items-center
                justify-center
              "
            >
              <div
                className={
                  isIOS
                    ? "rotate-180"
                    : ""
                }
              >
                <img
                  src={logo}
                  alt="Narayan Misthan Bhandar"
                  className="
                    h-[48px]
                    w-[48px]
                    object-contain
                    drop-shadow-[0_2px_5px_rgba(0,0,0,0.25)]
                  "
                />
              </div>
            </motion.div>
          </Link>

          {/* =================================================
              RIGHT SPACER
          ================================================== */}

          <div className="h-9 w-9" />
        </div>
      </motion.div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="
              fixed
              inset-0
              z-[200]
              min-[1280px]:hidden
            "
          >
            {/* =================================================
                BACKDROP
            ================================================== */}

            <motion.button
              type="button"
              aria-label="Close navigation menu"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMenu}
              className="
                absolute
                inset-0
                cursor-default
                bg-[#16071D]/55
                backdrop-blur-[8px]
              "
            />

            {/* =================================================
                DRAWER
            ================================================== */}

            <motion.aside
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                relative
                flex
                h-full
                w-[84%]
                max-w-[360px]
                flex-col
                overflow-hidden
                bg-[#FFF9F2]
                shadow-[15px_0_50px_rgba(25,7,35,0.28)]
              "
            >
              {/* =================================================
                  DECORATIVE GLOW
              ================================================== */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-[100px]
                  -top-[100px]
                  h-[240px]
                  w-[240px]
                  rounded-full
                  bg-[#EDE0F1]
                  opacity-70
                  blur-[2px]
                "
              />

              {/* =================================================
                  DRAWER HEADER
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: -12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.18,
                  duration: 0.35,
                }}
                className="
                  relative
                  flex
                  h-[92px]
                  shrink-0
                  items-center
                  justify-between
                  overflow-hidden
                  bg-[#340C48]
                  px-5
                "
              >
                {/* HEADER GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-white/10
                    via-transparent
                    to-black/15
                  "
                />

                {/* GOLD LINE */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-full
                    bg-gradient-to-r
                    from-transparent
                    via-[#E8CC8A]
                    to-transparent
                  "
                />

                {/* =================================================
                    DRAWER LOGO

                    Wrapper handles iOS rotation so that
                    Framer Motion's transform remains intact.
                ================================================== */}

                <Link
                  to="/"
                  onClick={closeMenu}
                  className="
                    relative
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className={
                      isIOS
                        ? "rotate-180"
                        : ""
                    }
                  >
                    <motion.img
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        rotate: -8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{
                        delay: 0.25,
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                      src={logo}
                      alt="Narayan Misthan Bhandar"
                      className="
                        h-[50px]
                        w-[50px]
                        object-contain
                        drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]
                      "
                    />
                  </div>
                </Link>

                {/* CLOSE */}

                <motion.button
                  type="button"
                  onClick={closeMenu}
                  whileHover={{
                    rotate: 90,
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.88,
                  }}
                  aria-label="Close menu"
                  className="
                    relative
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/5
                    text-white
                    backdrop-blur-sm
                    transition-colors
                    duration-200
                    hover:bg-white/10
                  "
                >
                  <X
                    size={19}
                    strokeWidth={1.8}
                  />
                </motion.button>
              </motion.div>

              {/* =================================================
                  MENU CONTENT
              ================================================== */}

              <motion.nav
                variants={menuContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="
                  relative
                  flex
                  flex-col
                  px-5
                  pt-4
                "
              >
                {/* SMALL LABEL */}

                <motion.div
                  variants={menuItemVariants}
                  className="mb-1 px-1"
                >
                  <span
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-[#C9A45C]
                    "
                  >
                    Explore NMB
                  </span>
                </motion.div>

                {/* LINKS */}

                {menuItems.map(
                  (item, index) => (
                    <motion.div
                      key={item.label}
                      variants={menuItemVariants}
                    >
                      <Link
                        to={item.href}
                        onClick={closeMenu}
                        className="
                          group
                          relative
                          flex
                          items-center
                          justify-between
                          border-b
                          border-[#340C48]/10
                          py-[18px]
                        "
                      >
                        <span
                          className="
                            pointer-events-none
                            absolute
                            inset-x-[-8px]
                            inset-y-[5px]
                            rounded-[8px]
                            bg-[#EDE0F1]
                            opacity-0
                            transition-opacity
                            duration-200
                            group-hover:opacity-100
                          "
                        />

                        <span
                          className="
                            relative
                            flex
                            items-center
                            gap-3
                          "
                        >
                          <span
                            className="
                              flex
                              h-6
                              w-6
                              items-center
                              justify-center
                              rounded-full
                              bg-[#F3E9F5]
                              text-[8px]
                              font-semibold
                              text-[#C9A45C]
                            "
                          >
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>

                          <span
                            className="
                              font-[var(--font-display)]
                              text-[20px]
                              font-semibold
                              text-[#340C48]
                              transition-transform
                              duration-200
                              group-hover:translate-x-1
                            "
                          >
                            {item.label}
                          </span>
                        </span>

                        <motion.span
                          initial={{
                            x: 0,
                          }}
                          whileHover={{
                            x: 4,
                          }}
                          className="
                            relative
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#C9A45C]/30
                            text-[#C9A45C]
                            transition-all
                            duration-200
                            group-hover:border-[#C9A45C]
                            group-hover:bg-[#C9A45C]
                            group-hover:text-white
                          "
                        >
                          <ChevronRight
                            size={16}
                            strokeWidth={1.8}
                          />
                        </motion.span>
                      </Link>
                    </motion.div>
                  )
                )}
              </motion.nav>

              {/* =================================================
                  BOTTOM BRAND CARD
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.58,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="
                  relative
                  mt-auto
                  px-5
                  pb-7
                  pt-5
                "
              >
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[10px]
                    bg-[#EDE0F1]
                    px-5
                    py-5
                  "
                >
                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      top-0
                      w-[3px]
                      bg-[#C9A45C]
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#C9A45C]
                    "
                  >
                    Since 1950
                  </p>

                  <p
                    className="
                      mt-2
                      font-[var(--font-display)]
                      text-[18px]
                      font-semibold
                      leading-[1.2]
                      text-[#340C48]
                    "
                  >
                    Tradition in every bite.
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      leading-[1.5]
                      text-[#6F6870]
                    "
                  >
                    Crafted with love,
                    shared with joy.
                  </p>
                </div>
              </motion.div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileTopNavigation;