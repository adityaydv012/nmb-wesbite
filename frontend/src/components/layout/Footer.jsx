import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import logo from "../../assets/logo/logo.png";
import footerImage from "../../assets/images/Background Image with Fade.png";

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

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  return (
    <footer
      className="
        relative
        w-full
        overflow-hidden
        bg-[#4B1D63]
      "
      style={{
        color: "#C9A45C",
      }}
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <img
          src={footerImage}
          alt=""
          className="
            absolute
            inset-y-0
            right-0
            h-full
            w-[65%]
            object-cover
            object-center
            opacity-70
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#4B1D63]
            via-[#4B1D63]/90
            via-[58%]
            to-[#4B1D63]/10
          "
        />

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-32
            bg-gradient-to-t
            from-[#4B1D63]
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          FOOTER CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1088px]
          px-6
          py-16
          sm:px-8
          lg:px-0
          lg:py-20
        "
      >
        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div
          className="
            grid
            gap-14
            lg:grid-cols-[1.35fr_1fr_1fr_1fr]
            lg:gap-10
          "
        >
          {/* =================================================
              BRAND
          ================================================== */}

          <div className="max-w-[300px]">
            <Link
              to="/"
              className="
                flex
                h-[94px]
                w-[70px]
                items-center
                justify-center
                rounded-[7px]
                bg-white
                p-2
              "
            >
              {/* IOS FIX */}

              <div className={isIOS ? "rotate-180" : ""}>
                <img
                  src={logo}
                  alt="Narayan Misthan Bhandar"
                  className="
                    h-full
                    w-full
                    object-contain
                  "
                />
              </div>
            </Link>

            <h3
              className="
                mt-6
                font-[var(--font-display)]
                text-[24px]
                font-semibold
                italic
                leading-none
              "
              style={{
                color: "#C9A45C",
              }}
            >
              Life... a little sweeter!
            </h3>

            <p
              className="
                mt-4
                max-w-[270px]
                text-[11px]
                leading-[1.65]
              "
              style={{
                color: "#FFF9F2",
              }}
            >
              Traditional flavours.
              Timeless celebrations.
              Made with care.
            </p>

            {/* =================================================
                SOCIAL BUTTONS
            ================================================== */}

            <div className="mt-7 flex items-center gap-2.5">

              {/* =================================================
                  INSTAGRAM
              ================================================== */}

              <a
                href="https://www.instagram.com/narayanmisthanbhandar?utm_source=qr&stkn=MWc1azY1ZWVwejVw"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C9A45C]
                  text-[#C9A45C]
                  transition-all
                  hover:bg-[#C9A45C]
                  hover:text-[#4B1D63]
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* =================================================
                  FACEBOOK
              ================================================== */}

              <a
                href="https://www.facebook.com/nmbmainpuri/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C9A45C]
                  text-[#C9A45C]
                  transition-all
                  hover:bg-[#C9A45C]
                  hover:text-[#4B1D63]
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="
                      M14.5 8H17V4.5
                      C16.3 4.4 15.4 4.3 14.5 4.3
                      C11.7 4.3 9.8 6 9.8 9.1V11.5H7V15H9.8V21H13.5V15H16.4L17 11.5H13.5V9.4
                      C13.5 8.5 13.8 8 14.5 8Z
                    "
                  />
                </svg>
              </a>

            </div>
          </div>

          {/* =================================================
              EXPLORE
          ================================================== */}

          <FooterColumn
            title="Explore"
            links={[
              {
                label: "Home",
                to: "/",
              },
              {
                label: "Our Story",
                to: "/our-story",
              },
              {
                label: "Contact Us",
                to: "/contact-us",
              },
            ]}
          />

          {/* =================================================
              SHOP
          ================================================== */}

          <FooterColumn
            title="Shop"
            links={[
              {
                label: "All Sweets",
                to: "/sweets",
              },
              {
                label: "Dry Fruits",
                to: "/sweets",
              },
              {
                label: "Gift Boxes",
                to: "/sweets",
              },
              {
                label: "Bulk Orders",
                to: "/contact-us",
              },
            ]}
          />

          {/* =================================================
              VISIT
          ================================================== */}

          <FooterColumn
            title="Visit"
            links={[
              {
                label: "Station Road",
                to: "/contact-us",
              },
              {
                label: "Sadar Bazaar",
                to: "/contact-us",
              },
              {
                label: "Contact Us",
                to: "/contact-us",
              },
            ]}
          />
        </div>

        {/* =====================================================
            DIVIDER
        ====================================================== */}

        <div
          className="
            mt-14
            h-px
            w-full
          "
          style={{
            backgroundColor: "#C9A45C",
            opacity: 0.4,
          }}
        />

        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div
          className="
            mt-5
            flex
            flex-col
            gap-4
            text-[9px]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
          style={{
            color: "#C9A45C",
          }}
        >
          <p>
            ©Narayan Misthan Bhandar.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="
                transition-opacity
                hover:opacity-70
              "
              style={{
                color: "#C9A45C",
              }}
            >
              PRIVACY POLICY
            </Link>

            <Link
              to="/terms"
              className="
                transition-opacity
                hover:opacity-70
              "
              style={{
                color: "#C9A45C",
              }}
            >
              TERMS & CONDITIONS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({
  title,
  links,
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="h-px w-5 shrink-0"
          style={{
            backgroundColor: "#C9A45C",
          }}
        />

        <h4
          className="
            whitespace-nowrap
            font-[var(--font-body)]
            text-[14px]
            font-semibold
            uppercase
            leading-none
            tracking-[0.22em]
          "
          style={{
            color: "#FFF9F2",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          {title}
        </h4>

        <span
          className="h-px w-5 shrink-0"
          style={{
            backgroundColor: "#C9A45C",
          }}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="
              group
              flex
              w-fit
              items-center
              gap-1
              text-[15px]
              transition-all
              duration-200
              hover:opacity-70
            "
            style={{
              color: "#C9A45C",
            }}
          >
            {link.label}

            <ArrowUpRight
              size={9}
              strokeWidth={1.5}
              className="
                opacity-0
                transition-all
                group-hover:translate-x-[2px]
                group-hover:-translate-y-[2px]
                group-hover:opacity-100
              "
            />
          </Link>
        ))}
      </div>
    </div>
  );
}