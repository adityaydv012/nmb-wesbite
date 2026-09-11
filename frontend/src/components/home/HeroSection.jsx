import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import heroImage from "../../assets/images/hero-bg.png";
import heroMobileImage from "../../assets/images/hero-mobile.png";
import readabilityOverlay from "../../assets/images/Overlay Gradient for Readability.png";

function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <section
      className="nmb-hero"
      style={
        isMobile
          ? {
              position: "relative",
              overflow: "hidden",
            }
          : undefined
      }
    >
      {/* =====================================================
          DESKTOP HERO IMAGE
          ===================================================== */}

      {!isMobile && (
        <img
          src={heroImage}
          alt="Narayan Misthan Bhandar sweets"
          className="nmb-hero-background nmb-hero-background-desktop"
        />
      )}

      {/* =====================================================
          MOBILE HERO IMAGE
          ===================================================== */}

      {isMobile && (
        <img
          src={heroMobileImage}
          alt="Narayan Misthan Bhandar sweets"
          className="nmb-hero-background nmb-hero-background-mobile"
        />
      )}

      {/* =====================================================
          MOBILE GRADIENT
          ABOVE THE IMAGE
          ===================================================== */}

      {isMobile && (
        <div
          className="nmb-hero-mobile-gradient"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(52, 12, 72, 0.9) 0%, rgba(52, 12, 72, 0.4) 50%, rgba(52, 12, 72, 0) 100%)",
          }}
        />
      )}

      {/* =====================================================
          DESKTOP READABILITY OVERLAY
          ===================================================== */}

      {!isMobile && (
        <img
          src={readabilityOverlay}
          alt=""
          aria-hidden="true"
          className="nmb-hero-overlay"
        />
      )}

      {/* =====================================================
          HERO CONTAINER
          ===================================================== */}

      <div
        className="nmb-hero-container"
        style={
          isMobile
            ? {
                position: "relative",
                zIndex: 2,
              }
            : undefined
        }
      >
        <div
          className="nmb-hero-content"
          style={
            isMobile
              ? {
                  width: "100%",
                  maxWidth: "100%",
                  margin: 0,
                  padding: 0,
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: "57px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }
              : undefined
          }
        >
          {/* =================================================
              MOBILE CONTENT
              ================================================= */}

          {isMobile ? (
            <>
              {/* =============================================
                  EYEBROW
                  ============================================= */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: "easeOut",
                }}
                className="nmb-hero-eyebrow"
                style={{
                  width: "100%",
                  margin: "0 0 7px",
                  textAlign: "center",
                }}
              >
                Sweetness, Crafted With Tradition.
              </motion.p>

              {/* =============================================
                  HEADING
                  ============================================= */}

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="nmb-hero-title"
                style={{
                  width: "100%",
                  margin: 0,
                  textAlign: "center",
                  whiteSpace: "normal",
                }}
              >
                Every Celebration
                <br />
                Deserves Something
                <br />
                Sweet.
              </motion.h1>

              {/* =============================================
                  FIND YOUR FAVOURITE
                  ============================================= */}

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
                  duration: 0.7,
                  delay: 0.5,
                  ease: "easeOut",
                }}
                className="nmb-hero-buttons"
                style={{
                  width: "100%",
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <motion.a
                  href="/sweets"
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="nmb-hero-primary-button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <span className="nmb-hero-primary-text">
                    Find Your Favourite
                  </span>
                </motion.a>
              </motion.div>
            </>
          ) : (
            /* =================================================
               DESKTOP CONTENT
               ================================================= */

            <>
              {/* =============================================
                  DESKTOP HEADING
                  ============================================= */}

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="nmb-hero-title"
              >
                Life...
                <br />
                a little sweeter!
              </motion.h1>

              {/* =============================================
                  DESKTOP DESCRIPTION
                  ============================================= */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: "easeOut",
                }}
                className="nmb-hero-description"
              >
                Traditional flavours. Made with love. Shared with joy.
                <br />
                Experience the heritage of Narayan Misthan Bhandar.
              </motion.p>

              {/* =============================================
                  DESKTOP BUTTONS
                  ============================================= */}

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
                  duration: 0.7,
                  delay: 0.35,
                  ease: "easeOut",
                }}
                className="nmb-hero-buttons"
              >
                <motion.a
                  href="/sweets"
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="nmb-hero-primary-button"
                >
                  <span className="nmb-hero-primary-text">
                    EXPLORE SWEETS
                  </span>

                  <span className="nmb-hero-arrow">
                    →
                  </span>
                </motion.a>

                <motion.a
                  href="/gifting"
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="nmb-hero-secondary-button"
                >
                  SHOP GIFTING
                </motion.a>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          DESKTOP SCROLL INDICATOR
          ===================================================== */}

      {!isMobile && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
            duration: 0.8,
          }}
          className="nmb-hero-scroll"
        >
          <span className="nmb-hero-scroll-text">
            SCROLL
          </span>

          <motion.span
            animate={{
              y: [0, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="nmb-hero-scroll-arrow"
          >
            ↓
          </motion.span>
        </motion.div>
      )}
    </section>
  );
}

export default HeroSection;