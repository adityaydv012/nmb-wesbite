import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Award,
  Leaf,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BadgeCheck,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* =========================================================
   IMAGES
========================================================= */

import heroImage from "../assets/images/Background.png";
import storyImage from "../assets/images/Image.png";
import ctaBackground from "../assets/images/cta-sweets-bg.jpg";

import achievementImage1 from "../assets/images/achivemnet.png";
import achievementImage2 from "../assets/images/home-bg.jpeg";

/* =========================================================
   PILLARS
========================================================= */

const PILLARS = [
  {
    icon: BookOpen,
    title: "Tradition",
    description:
      "Honoring recipes passed down through generations, preserving the authentic soul of Indian confectionery.",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "Sourcing only the finest ingredients—pure desi ghee, premium nuts, and authentic saffron.",
  },
  {
    icon: Leaf,
    title: "Freshness",
    description:
      "Crafted daily in small batches to ensure unparalleled taste and melt-in-the-mouth perfection.",
  },
  {
    icon: Sparkles,
    title: "Celebration",
    description:
      "Elevating every milestone and festive occasion with sweets designed for joyous moments.",
  },
];

/* =========================================================
   OUR STORY PAGE
========================================================= */

export default function OurStory() {
  /* =========================================================
     ACHIEVEMENT CAROUSEL
  ========================================================= */

  const [achievementSlide, setAchievementSlide] = useState(0);

  const achievementImages = [
    {
      image: achievementImage1,
      alt: "Narayan Misthan Bhandar One District One Cuisine recognition",
    },
    {
      image: achievementImage2,
      alt: "Narayan Misthan Bhandar ODOC achievement",
    },
  ];

  /* =========================================================
     AUTO SLIDE
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setAchievementSlide((prev) =>
        prev === achievementImages.length - 1 ? 0 : prev + 1
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     PREVIOUS ACHIEVEMENT
  ========================================================= */

  const previousAchievement = () => {
    setAchievementSlide((prev) =>
      prev === 0 ? achievementImages.length - 1 : prev - 1
    );
  };

  /* =========================================================
     NEXT ACHIEVEMENT
  ========================================================= */

  const nextAchievement = () => {
    setAchievementSlide((prev) =>
      prev === achievementImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF7F1]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative h-[630px] overflow-hidden sm:h-[500px] md:h-[580px] lg:h-[650px]">
        {/* Background Image */}

        <img
          src={heroImage}
          alt="Traditional Indian sweets"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-[#1C1014]/55" />

        {/* Bottom Gradient */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[55%]
            bg-gradient-to-t
            from-[#FAF7F1]
            via-[#FAF7F1]/45
            to-transparent
          "
        />

        {/* Hero Content */}

        <div
          className="
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-center
            px-5
            text-center
          "
        >
          <div className="mt-[-30px] max-w-[850px]">
            <p className="mb-5 text-xs font-semibold tracking-[0.35em] text-[#d6b56d]">
              HERITAGE & LEGACY
            </p>

            <h1
              className="
                font-['Playfair_Display']
                text-[42px]
                font-semibold
                leading-[1.05]
                tracking-[-0.02em]
                !text-white
                sm:text-[58px]
                md:text-[70px]
                lg:text-[82px]
              "
            >
              A Tradition Worth Sharing
            </h1>

            <div className="mx-auto my-6 h-px w-16 bg-[#d6b56d]" />

            <p className="text-lg text-white md:text-xl">
              Life is a little sweeter when tradition lives on.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          STORY SECTION
      ===================================================== */}

      <section
        className="
          relative
          mx-auto
          max-w-[1300px]
          px-6
          py-16
          sm:px-10
          md:py-24
          lg:px-16
          lg:py-28
        "
      >
        <div
          className="
            grid
            items-center
            gap-14
            lg:grid-cols-[0.95fr_1.05fr]
            lg:gap-20
          "
        >
          {/* TEXT */}

          <div className="max-w-[520px]">
            <p
              className="
                mb-4
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#B08A43]
              "
            >
              Our Story
            </p>

            <h2
              className="
                font-['Playfair_Display']
                text-[42px]
                font-semibold
                leading-[1.08]
                tracking-[-0.02em]
                text-[#3B2444]
                sm:text-[52px]
                md:text-[58px]
              "
            >
              Where Tradition Meets Taste
            </h2>

            <div className="mt-5 h-[2px] w-16 bg-[#C5A15B]" />

            <div
              className="
                mt-7
                space-y-5
                text-[14px]
                leading-[1.8]
                text-[#6D6570]
                sm:text-[15px]
              "
            >
              <p>
                For generations, Narayan Misthan Bhandar has been more than a
                sweet shop; it is a custodian of joy, a silent witness to
                countless celebrations, and a testament to the enduring power
                of authentic flavors.
              </p>

              <p>
                Our journey began in a modest kitchen, where time-honored
                recipes were perfected with patience and pure ingredients. We
                believe that true luxury lies in craftsmanship—in the slow
                simmering of milk, the precise roasting of nuts, and the
                delicate touch of saffron.
              </p>

              <p>
                Today, while we embrace the modern elegance of presentation,
                our soul remains rooted in traditional methods that ensure
                every bite transports you to a memory of pure, unadulterated
                happiness.
              </p>

              <p>We don't just make sweets; we craft memories.</p>
            </div>
          </div>

          {/* STORY IMAGE */}

          <div
            className="
              relative
              mx-auto
              w-full
              max-w-[650px]
            "
          >
            <div
              className="
                absolute
                -right-5
                -top-5
                h-[85%]
                w-[85%]
                rounded-[45%]
                border
                border-[#D7C6A8]
                opacity-40
                sm:-right-8
                sm:-top-8
              "
            />

            <div
              className="
                relative
                aspect-[1/1]
                overflow-hidden
                rounded-tl-[48%]
                rounded-tr-[8%]
                rounded-br-[48%]
                rounded-bl-[8%]
                shadow-[0_25px_60px_rgba(62,38,49,0.15)]
              "
            >
              <img
                src={storyImage}
                alt="Crafting traditional Indian sweets"
                className="
                  h-full
                  w-full
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-tr
                  from-[#2A162E]/15
                  via-transparent
                  to-transparent
                "
              />
            </div>

            <div
              className="
                absolute
                -bottom-6
                -left-6
                hidden
                h-24
                w-24
                rounded-full
                border
                border-[#C5A15B]/50
                sm:block
              "
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          ODOC / ACHIEVEMENT SECTION
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-y
          border-[#E5DCCE]
          bg-[#F2ECE3]
          px-6
          py-16
          sm:px-10
          md:py-24
          lg:px-16
          lg:py-28
        "
      >
        {/* Decorative Background */}

        <div
          className="
            pointer-events-none
            absolute
            -right-[180px]
            -top-[180px]
            h-[420px]
            w-[420px]
            rounded-full
            border
            border-[#C5A15B]/20
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-[200px]
            -left-[180px]
            h-[400px]
            w-[400px]
            rounded-full
            border
            border-[#C5A15B]/15
          "
        />

        <div className="relative mx-auto max-w-[1250px]">
          {/* =================================================
              SECTION INTRO
          ================================================== */}

          <div className="mb-12 max-w-[650px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#C5A15B]" />

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#A27A36]
                "
              >
                A Milestone In Our Journey
              </p>
            </div>

            <h2
              className="
                mt-4
                font-['Playfair_Display']
                text-[38px]
                font-semibold
                leading-[1.08]
                tracking-[-0.02em]
                text-[#3B2444]
                sm:text-[48px]
                md:text-[56px]
              "
            >
              When a Local Taste
              <br />
              <span className="text-[#7A1731]">
                Earns Its Place.
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-[600px]
                text-[13px]
                leading-[1.85]
                text-[#6D6570]
                sm:text-[14px]
              "
            >
              Some recognitions are more than certificates. They are a
              reminder of where you come from, what you stand for, and why a
              tradition deserves to be carried forward.
            </p>
          </div>

          {/* =================================================
              MAIN ACHIEVEMENT GRID
          ================================================== */}

          <div
            className="
              grid
              items-center
              gap-12
              lg:grid-cols-[1.05fr_0.95fr]
              lg:gap-20
            "
          >
            {/* =================================================
                IMAGE / CERTIFICATE CAROUSEL
            ================================================== */}

            <div className="relative">
              {/* Decorative Frame */}

              <div
                className="
                  absolute
                  -right-4
                  -top-4
                  h-[75%]
                  w-[75%]
                  rounded-[18px]
                  border
                  border-[#C5A15B]/40
                  sm:-right-6
                  sm:-top-6
                "
              />

              {/* Image Card */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[12px]
                  border
                  border-[#D9C9B0]
                  bg-[#FBF8F2]
                  p-3
                  shadow-[0_25px_60px_rgba(62,38,49,0.13)]
                  sm:p-4
                "
              >
                <div
                  className="
                    relative
                    flex
                    h-[330px]
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[8px]
                    bg-[#EEE5D8]
                    sm:h-[430px]
                    md:h-[480px]
                  "
                >
                  <img
                    src={achievementImages[achievementSlide].image}
                    alt={achievementImages[achievementSlide].alt}
                    className="
                      h-full
                      w-full
                      object-contain
                    "
                  />

                  {/* Previous Button */}

                  <button
                    type="button"
                    onClick={previousAchievement}
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
                      bg-[#3B2444]
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

                  {/* Next Button */}

                  <button
                    type="button"
                    onClick={nextAchievement}
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
                      bg-[#3B2444]
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

                  {/* Dots */}

                  <div
                    className="
                      absolute
                      bottom-4
                      left-1/2
                      flex
                      -translate-x-1/2
                      items-center
                      gap-2
                      rounded-full
                      bg-[#FFFDF9]/90
                      px-3
                      py-2
                      backdrop-blur-sm
                    "
                  >
                    {achievementImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAchievementSlide(index)}
                        aria-label={`View achievement ${index + 1}`}
                        className={`
                          h-1.5
                          rounded-full
                          transition-all
                          duration-300
                          ${
                            achievementSlide === index
                              ? "w-7 bg-[#3B2444]"
                              : "w-1.5 bg-[#C5A15B]/60"
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Recognition Label */}

              <div
                className="
                  absolute
                  -bottom-5
                  -left-3
                  hidden
                  items-center
                  gap-3
                  rounded-[8px]
                  border
                  border-[#D9C9B0]
                  bg-[#FFFDF9]
                  px-5
                  py-3
                  shadow-[0_10px_25px_rgba(62,38,49,0.10)]
                  sm:flex
                "
              >
                <BadgeCheck
                  size={18}
                  className="text-[#A27A36]"
                  strokeWidth={1.6}
                />

                <div>
                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#A27A36]
                    "
                  >
                    Recognised
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-[#4B404A]
                    "
                  >
                    One District One Cuisine
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                ACHIEVEMENT STORY
            ================================================== */}

            <div className="max-w-[520px]">
              {/* Location */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#A27A36]
                "
              >
                <MapPin
                  size={14}
                  strokeWidth={1.6}
                />

                Mainpuri · Uttar Pradesh
              </div>

              <h3
                className="
                  mt-5
                  font-['Playfair_Display']
                  text-[32px]
                  font-semibold
                  leading-[1.12]
                  text-[#3B2444]
                  sm:text-[40px]
                "
              >
                Our Soan Papdi,
                <br />
                <span className="text-[#7A1731]">
                  Our District's Pride.
                </span>
              </h3>

              <div className="mt-5 h-[2px] w-14 bg-[#C5A15B]" />

              <div
                className="
                  mt-7
                  space-y-5
                  text-[13px]
                  leading-[1.85]
                  text-[#6D6570]
                  sm:text-[14px]
                "
              >
                <p>
                  Narayan Misthan Bhandar's Soan Papdi represents more than a
                  beloved sweet. It carries a small piece of Mainpuri's
                  culinary identity.
                </p>

                <p>
                  Through the{" "}
                  <span className="font-semibold text-[#3B2444]">
                    One District One Cuisine
                  </span>{" "}
                  initiative of Uttar Pradesh, Mainpuri's culinary heritage
                  has received recognition, giving traditional local
                  craftsmanship a platform beyond the boundaries of the city.
                </p>

                <p>
                  For us, this recognition is a reason to continue doing what
                  we have always believed in — using time-honoured techniques,
                  carefully selected ingredients, and the patience that
                  authentic mithai deserves.
                </p>
              </div>

              {/* =================================================
                  THREE FACTS
              ================================================== */}

              <div
                className="
                  mt-8
                  grid
                  grid-cols-3
                  gap-3
                  border-t
                  border-[#D9CFC2]
                  pt-7
                "
              >
                {/* FACT 1 */}

                <div>
                  <p
                    className="
                      font-['Playfair_Display']
                      text-[22px]
                      font-semibold
                      text-[#3B2444]
                    "
                  >
                    05
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      font-semibold
                      uppercase
                      leading-[1.5]
                      tracking-[0.12em]
                      text-[#A27A36]
                    "
                  >
                    State
                    <br />
                    Recognition
                  </p>
                </div>

                {/* FACT 2 */}

                <div
                  className="
                    border-l
                    border-[#D9CFC2]
                    pl-4
                  "
                >
                  <p
                    className="
                      font-['Playfair_Display']
                      text-[22px]
                      font-semibold
                      text-[#3B2444]
                    "
                  >
                    UP
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      font-semibold
                      uppercase
                      leading-[1.5]
                      tracking-[0.12em]
                      text-[#A27A36]
                    "
                  >
                    One District
                    <br />
                    One Cuisine
                  </p>
                </div>

                {/* FACT 3 */}

                <div
                  className="
                    border-l
                    border-[#D9CFC2]
                    pl-4
                  "
                >
                  <p
                    className="
                      font-['Playfair_Display']
                      text-[22px]
                      font-semibold
                      text-[#3B2444]
                    "
                  >
                    NMB
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      font-semibold
                      uppercase
                      leading-[1.5]
                      tracking-[0.12em]
                      text-[#A27A36]
                    "
                  >
                    Sweet
                    <br />
                    Heritage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PILLARS SECTION
      ===================================================== */}

      <section
        className="
          border-y
          border-[#E6DDD2]
          bg-[#F7F3ED]
          px-6
          py-16
          sm:px-10
          md:py-20
          lg:px-16
          lg:py-24
        "
      >
        <div className="mx-auto max-w-[1250px]">
          <div className="text-center">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#B08A43]
              "
            >
              What We Believe In
            </p>

            <h2
              className="
                mt-3
                font-['Playfair_Display']
                text-[34px]
                font-semibold
                text-[#3B2444]
                sm:text-[42px]
                md:text-[48px]
              "
            >
              The Pillars of Our Craft
            </h2>
          </div>

          <div
            className="
              mt-12
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article
                  key={pillar.title}
                  className="
                    group
                    rounded-[10px]
                    border
                    border-[#E2D8E4]
                    bg-[#FBF9F5]
                    p-7
                    text-center
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:shadow-[0_18px_40px_rgba(61,34,71,0.10)]
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-[#EEE7F0]
                      text-[#4B1D63]
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.7}
                    />
                  </div>

                  <h3
                    className="
                      mt-6
                      font-['Playfair_Display']
                      text-[21px]
                      font-semibold
                      text-[#43224E]
                    "
                  >
                    {pillar.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-[12px]
                      leading-[1.75]
                      text-[#746C75]
                    "
                  >
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          HERITAGE CTA SECTION
      ===================================================== */}

      <section
        className="
          relative
          min-h-[600px]
          overflow-hidden
          px-6
          py-20
          sm:px-10
          md:min-h-[650px]
          md:py-28
          lg:px-16
        "
      >
        {/* Background */}

        <div className="absolute inset-0 overflow-hidden">
          <img
            src={ctaBackground}
            alt="Traditional Indian sweets"
            className="
              absolute
              inset-0
              h-full
              w-full
              scale-105
              object-cover
              object-center
              blur-[8px]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-[#2A1712]/10
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-[#F5EEE4]/35
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-[#FAF7F1]/15
              via-transparent
              to-[#FAF7F1]/20
            "
          />
        </div>

        {/* CTA CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[460px]
            max-w-[950px]
            items-center
            justify-center
          "
        >
          <div
            className="
              w-full
              rounded-[15px]
              border
              border-white/50
              bg-[#FFFDF9]/70
              px-7
              py-14
              text-center
              shadow-[0_25px_80px_rgba(49,30,25,0.20)]
              backdrop-blur-[3px]
              sm:px-12
              md:px-20
              md:py-20
            "
          >
            <div className="mx-auto mb-7 h-px w-14 bg-[#C5A15B]" />

            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#9E7735]
              "
            >
              Crafted With Heart
            </p>

            <h2
              className="
                mx-auto
                mt-5
                max-w-[700px]
                font-['Playfair_Display']
                text-[36px]
                font-semibold
                leading-[1.12]
                text-[#3B2444]
                sm:text-[48px]
                md:text-[58px]
              "
            >
              Made For Moments Worth Remembering
            </h2>

            <div className="mx-auto mt-6 h-[2px] w-16 bg-[#C5A15B]" />

            <p
              className="
                mx-auto
                mt-7
                max-w-[600px]
                text-[14px]
                leading-[1.8]
                text-[#5F5860]
                sm:text-[15px]
              "
            >
              Discover our collection of artisanal sweets, crafted for
              celebrations, gifting, and the simple joy of savoring a piece of
              heritage.
            </p>

            <a
              href="/sweets"
              className="
                group
                mt-9
                inline-flex
                min-w-[235px]
                items-center
                justify-center
                gap-4
                rounded-[3px]
                bg-[#4B1D63]
                px-8
                py-[15px]
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                !text-white
                shadow-[0_12px_30px_rgba(75,29,99,0.25)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#3A174D]
                hover:!text-white
                hover:shadow-[0_18px_35px_rgba(75,29,99,0.35)]
                active:translate-y-0
              "
            >
              <span className="!text-white">
                Explore Our Sweets
              </span>

              <ArrowRight
                size={15}
                strokeWidth={1.8}
                className="
                  !text-white
                  transition-transform
                  duration-300
                  group-hover:translate-x-2
                "
              />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </div>
  );
}