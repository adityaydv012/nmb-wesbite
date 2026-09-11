import React from "react";
import {
  BookOpen,
  Award,
  Leaf,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* =========================================================
   IMAGES
========================================================= */

import heroImage from "../assets/images/Background.png";
import storyImage from "../assets/images/Image.png";
import ctaBackground from "../assets/images/cta-sweets-bg.jpg";

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

              <p>
                We don't just make sweets; we craft memories.
              </p>
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
                    <Icon size={20} strokeWidth={1.7} />
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

  {/* =====================================================
      BLURRED SWEETS BACKGROUND
  ===================================================== */}

  <div className="absolute inset-0 overflow-hidden">

    {/* Background Image */}

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

    {/* Light Dark Overlay */}

    <div
      className="
        absolute
        inset-0
        bg-[#2A1712]/10
      "
    />

    {/* Light Cream Overlay */}

    <div
      className="
        absolute
        inset-0
        bg-[#F5EEE4]/35
      "
    />

    {/* Soft Gradient */}

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


  {/* =====================================================
      CTA CONTENT
  ===================================================== */}

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

      {/* Decorative Top Line */}

      <div className="mx-auto mb-7 h-px w-14 bg-[#C5A15B]" />

      {/* Eyebrow */}

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

      {/* Heading */}

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

      {/* Decorative Line */}

      <div className="mx-auto mt-6 h-[2px] w-16 bg-[#C5A15B]" />

      {/* Description */}

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

      

      {/* CTA */}
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