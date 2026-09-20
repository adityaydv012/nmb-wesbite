import React from "react";
import { MapPin, ArrowRight } from "lucide-react";

import outletsImage from "../../assets/images/home-outlet.jpeg";

/* =========================================================
   OUTLETS
========================================================= */

const outlets = [
  {
    name: "Station Road",
    city: "Mainpuri, Uttar Pradesh",

    latitude: "27.226630590007744",
    longitude: "79.03542054846737",

    openingHours: "8am - 10:45pm",
    contact: "+91 9084235733",
  },

  {
    name: "Sadar Bazaar",
    city: "Mainpuri, Uttar Pradesh",

    latitude: "27.229044614855948",
    longitude: "79.02851123404506",

    openingHours: "8am - 10:45pm",
    contact: "+91 9858585020",
  },
];

/* =========================================================
   OUTLETS SECTION
========================================================= */

export default function OutletsSection() {
  return (
    <section className="w-full bg-[#FDEFFE] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1088px] px-4 sm:px-6 lg:px-0">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-[620px] text-center">
          <h2
            className="
              font-[var(--font-display)]
              text-[38px]
              font-semibold
              leading-[1.05]
              tracking-[-0.03em]
              text-[var(--nmb-purple)]
              sm:text-[44px]
              lg:text-[46px]
            "
          >
            Come Visit Us
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-[560px]
              text-[12px]
              leading-[1.65]
              text-[#756D76]
              sm:text-[13px]
            "
          >
            A little sweetness is always closer than you think. Visit Narayan
            Misthan Bhandar at our Mainpuri outlets and experience the taste
            of traditional Indian mithai, freshly prepared and beautifully
            served.
          </p>
        </div>

        {/* =====================================================
            OUTLETS CONTENT
        ===================================================== */}

        <div
          className="
            mt-10
            grid
            items-stretch
            gap-6
            sm:mt-12
            lg:grid-cols-[1.05fr_1fr]
            lg:gap-7
          "
        >

          {/* ===================================================
              IMAGE
          ==================================================== */}

          <div
            className="
              relative
              min-h-[360px]
              overflow-hidden
              rounded-[6px]
              bg-white
              shadow-[0_18px_35px_rgba(67,34,65,0.14)]
              sm:min-h-[420px]
              lg:min-h-[450px]
            "
          >
            <img
              src={outletsImage}
              alt="Narayan Misthan Bhandar outlet"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
            />
          </div>

          {/* ===================================================
              OUTLET CARDS
          ==================================================== */}

          <div className="flex flex-col gap-5">
            {outlets.map((outlet) => {

              /* Google Maps Directions URL */
              const directionsUrl =
                `https://www.google.com/maps/dir/?api=1&destination=${outlet.latitude},${outlet.longitude}`;

              return (
                <div
                  key={outlet.name}
                  className="
                    flex
                    min-h-[210px]
                    flex-1
                    flex-col
                    justify-center
                    rounded-[10px]
                    bg-white
                    px-7
                    py-7
                    shadow-[0_8px_25px_rgba(67,34,65,0.05)]
                    sm:px-8
                  "
                >

                  {/* =================================================
                      LOCATION
                  ================================================== */}

                  <div className="flex items-center gap-3">
                    <MapPin
                      size={18}
                      strokeWidth={1.7}
                      className="text-[#C89C4D]"
                    />

                    <h3
                      className="
                        font-[var(--font-display)]
                        text-[21px]
                        font-semibold
                        text-[var(--nmb-purple)]
                        sm:text-[22px]
                      "
                    >
                      {outlet.name}
                    </h3>
                  </div>

                  {/* =================================================
                      CITY
                  ================================================== */}

                  <p
                    className="
                      mt-1
                      pl-[31px]
                      text-[11px]
                      text-[#857C86]
                    "
                  >
                    {outlet.city}
                  </p>

                  {/* =================================================
                      TIMINGS & CONTACT
                  ================================================== */}

                  <div className="mt-5 pl-[31px]">

                    <p
                      className="
                        text-[9px]
                        leading-[1.5]
                        text-[#817982]
                      "
                    >
                      Opening Hours — {outlet.openingHours}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        leading-[1.5]
                        text-[#817982]
                      "
                    >
                      Contact — {outlet.contact}
                    </p>

                  </div>

                  {/* =================================================
                      DIRECTIONS
                  ================================================== */}

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get directions to ${outlet.name}`}
                    className="
                      group
                      mt-5
                      flex
                      w-fit
                      items-center
                      gap-2
                      pl-[31px]
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.04em]
                      text-[var(--nmb-purple)]
                      transition-all
                      duration-300
                      hover:gap-3
                      hover:text-[#C89C4D]
                    "
                  >
                    <span>Get Directions</span>

                    <ArrowRight
                      size={13}
                      strokeWidth={1.7}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </a>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}