import React from "react";

import heritageImage from "../../assets/images/heritage.png";
import saffronImage from "../../assets/images/saffron.png";

export default function HeritageSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F8EAF8] py-20 sm:py-24 lg:min-h-[650px] lg:py-28">

      {/* Soft background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-white/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1088px] px-4 sm:px-6 lg:px-0">

        <div className="relative grid min-h-[560px] items-center lg:grid-cols-[1fr_0.95fr]">

          {/* =====================================================
              IMAGE AREA
          ===================================================== */}
          <div className="relative flex min-h-[480px] items-center justify-center lg:min-h-[560px] lg:justify-start">

            {/* Main circular image */}
            <div
              className="
                relative
                h-[330px]
                w-[330px]
                overflow-hidden
                rounded-full
                border-[3px]
                border-white
                shadow-[0_18px_45px_rgba(67,34,65,0.18)]
                sm:h-[400px]
                sm:w-[400px]
                lg:absolute
                lg:left-0
                lg:top-1/2
                lg:h-[455px]
                lg:w-[455px]
                lg:-translate-y-1/2
              "
            >
              <img
                src={heritageImage}
                alt="Traditional sweet making at Narayan Misthan Bhandar"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Small overlapping accent image */}
            <div
              className="
                absolute
                bottom-[25px]
                right-[8%]
                h-[105px]
                w-[105px]
                overflow-hidden
                rounded-full
                border-[3px]
                border-white
                bg-white
                shadow-[0_10px_25px_rgba(67,34,65,0.18)]
                sm:right-[12%]
                sm:h-[120px]
                sm:w-[120px]
                lg:bottom-[45px]
                lg:left-[285px]
                lg:right-auto
                lg:h-[112px]
                lg:w-[112px]
              "
            >
              <img
                src={saffronImage}
                alt="Saffron and pistachios"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* =====================================================
              CONTENT AREA
          ===================================================== */}
          <div className="relative z-10 lg:pl-4">

            {/* Eyebrow */}
            <p className="mb-5 text-[20px] font-medium uppercase tracking-[0.28em] text-[#C49A50]">
              Our Heritage
            </p>

            {/* Heading */}
            <h2
              className="
                max-w-[500px]
                font-[var(--font-display)]
                text-[38px]
                font-semibold
                leading-[1.02]
                tracking-[-0.035em]
                text-[var(--nmb-purple)]
                sm:text-[46px]
                lg:text-[48px]
              "
            >
              A Little Tradition.
              <br />
              A Lot of Sweetness.
            </h2>

            {/* First paragraph */}
            <p
              className="
                mt-6
                max-w-[450px]
                text-[12px]
                leading-[1.65]
                text-[#716873]
                sm:text-[13px]
              "
            >
              For generations, Narayan Misthan Bhandar has been the
              cornerstone of celebrations in Mainpuri. Our recipes are
              guarded secrets, passed down through time, blending pure
              ingredients with the artisanal skill of our master halwais.
            </p>

            {/* Second paragraph */}
            <p
              className="
                mt-4
                max-w-[450px]
                text-[12px]
                leading-[1.65]
                text-[#716873]
                sm:text-[13px]
              "
            >
              Every bite is a testament to our commitment to quality—a
              luxurious symphony of taste that honors our deep-seated
              cultural legacy while embracing modern refinement.
            </p>

            {/* Crafted since */}
            <div className="mt-7 flex items-center gap-4">

              <span className="h-px w-[38px] bg-[#D6B76D]" />

              <span
                className="
                  font-[var(--font-display)]
                  text-[10px]
                  text-[var(--nmb-purple)]
                "
              >
                Crafted since 1870
              </span>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}