

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import desktopAchievement from "../../assets/images/achivemnet.png";
import mobileAchievement from "../../assets/images/home-bg.jpeg";

const NmbAchievement = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const achievements = [
    {
      image: desktopAchievement,
      alt: "Narayan Misthan Bhandar - One District One Cuisine recognition",
    },
    {
      image: mobileAchievement,
      alt: "Narayan Misthan Bhandar - ODOP recognition",
    },
  ];

  /* =========================================================
     AUTO SLIDE
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === achievements.length - 1
          ? 0
          : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [achievements.length]);

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const handlePrevious = () => {
    setCurrentSlide((prev) =>
      prev === 0
        ? achievements.length - 1
        : prev - 1
    );
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const handleNext = () => {
    setCurrentSlide((prev) =>
      prev === achievements.length - 1
        ? 0
        : prev + 1
    );
  };

  return (
    <section className="w-full bg-[#FFF9F2] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mx-auto max-w-[760px] text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-[#C9A45C]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C9A45C]">
              A Proud Milestone
            </span>

            <span className="h-px w-7 bg-[#C9A45C]" />
          </div>

          <h2
            className="
              mt-4
              font-[var(--font-display)]
              text-[32px]
              font-semibold
              leading-[1.1]
              text-[#340C48]
              sm:text-[42px]
              lg:text-[48px]
            "
          >
            A Taste of Tradition,
            <br />

            <span className="text-[#7A1731]">
              Recognised with Pride.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-[620px]
              text-[11px]
              leading-[1.8]
              text-[#6F6870]
              sm:text-[12px]
              lg:text-[13px]
            "
          >
            Our dedication to preserving the authentic flavours
            of Mainpuri has earned Narayan Misthan Bhandar
            recognition under the{" "}
            <span className="font-semibold text-[#340C48]">
              One District One Cuisine
            </span>{" "}
            initiative.
          </p>
        </div>

        {/* =====================================================
            CAROUSEL
        ====================================================== */}

        <div className="mx-auto mt-9 max-w-[820px] sm:mt-11">

          {/* IMAGE CONTAINER */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[16px]
              border
              border-[#C9A45C]/30
              bg-white
              p-3
              shadow-[0_18px_50px_rgba(52,12,72,0.09)]
              sm:p-4
            "
          >
            <div
              className="
                relative
                flex
                h-[330px]
                w-full
                items-center
                justify-center
                overflow-hidden
                rounded-[10px]
                bg-[#F8F0E8]
                sm:h-[400px]
                lg:h-[440px]
              "
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={achievements[currentSlide].image}
                  alt={achievements[currentSlide].alt}
                  initial={{
                    opacity: 0,
                    x: 35,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -35,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: "easeInOut",
                  }}
                  className="
                    h-full
                    w-full
                    object-contain
                    p-2
                    sm:p-3
                  "
                />
              </AnimatePresence>

              {/* =================================================
                  PREVIOUS BUTTON
              ================================================== */}

              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous achievement"
                className="
                  absolute
                  left-3
                  top-1/2
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-[#340C48]
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:bg-[#4B1D63]
                  sm:left-5
                  sm:h-10
                  sm:w-10
                "
              >
                <ChevronLeft
                  size={18}
                  strokeWidth={1.7}
                />
              </button>

              {/* =================================================
                  NEXT BUTTON
              ================================================== */}

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next achievement"
                className="
                  absolute
                  right-3
                  top-1/2
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-[#340C48]
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:bg-[#4B1D63]
                  sm:right-5
                  sm:h-10
                  sm:w-10
                "
              >
                <ChevronRight
                  size={18}
                  strokeWidth={1.7}
                />
              </button>
            </div>

            {/* =================================================
                DOTS
            ================================================== */}

            <div
              className="
                absolute
                bottom-6
                left-1/2
                flex
                -translate-x-1/2
                items-center
                gap-2
              "
            >
              {achievements.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setCurrentSlide(index)
                  }
                  aria-label={`Go to achievement ${index + 1}`}
                  className={`
                    h-1.5
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      currentSlide === index
                        ? "w-7 bg-[#340C48]"
                        : "w-1.5 bg-[#C9A45C]/70"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            TEXT BELOW CAROUSEL
        ====================================================== */}

        <div className="mx-auto mt-7 max-w-[720px] text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-5 bg-[#C9A45C]" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#C9A45C]">
              One District · One Cuisine
            </span>

            <span className="h-px w-5 bg-[#C9A45C]" />
          </div>

          <h3
            className="
              mt-3
              font-[var(--font-display)]
              text-[21px]
              leading-[1.3]
              text-[#340C48]
              sm:text-[25px]
            "
          >
            Preserving Mainpuri's culinary heritage,
            <br className="hidden sm:block" />
            one sweet tradition at a time.
          </h3>

          <p
            className="
              mt-3
              text-[10px]
              leading-[1.8]
              text-[#756D74]
              sm:text-[11px]
            "
          >
            From our kitchen to generations of families,
            Narayan Misthan Bhandar continues to carry
            forward the authentic flavours and traditions
            of Mainpuri.
          </p>
        </div>

      </div>
    </section>
  );
};

export default NmbAchievement;