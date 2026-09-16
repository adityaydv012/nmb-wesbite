import React from "react";
import { MapPin, ArrowRight } from "lucide-react";

import outletsImage from "../../assets/images/sadar.JPG";

const outlets = [
  {
    name: "Station Road",
    city: "Mainpuri, Uttar Pradesh",
  },
  {
    name: "Sadar Bazaar",
    city: "Mainpuri, Uttar Pradesh",
  },
];

export default function OutletsSection() {
  return (
    <section className="w-full bg-[#FDEFFE] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1088px] px-4 sm:px-6 lg:px-0">

        {/* ================= HEADER ================= */}
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

        {/* ================= OUTLETS CONTENT ================= */}
        <div className="mt-10 grid items-stretch gap-6 sm:mt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-7">

          {/* ================= IMAGE ================= */}
          <div className="relative min-h-[360px] overflow-hidden rounded-[6px] bg-white shadow-[0_18px_35px_rgba(67,34,65,0.14)] sm:min-h-[420px] lg:min-h-[450px]">

            <img
              src={outletsImage}
              alt="Narayan Misthan Bhandar outlet"
              className="absolute inset-0 h-full w-full object-cover"
            />

          </div>

          {/* ================= OUTLET CARDS ================= */}
          <div className="flex flex-col gap-5">

            {outlets.map((outlet) => (
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

                {/* Location icon */}
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

                {/* City */}
                <p className="mt-1 pl-[31px] text-[11px] text-[#857C86]">
                  {outlet.city}
                </p>

                {/* Timings */}
                <div className="mt-5 pl-[31px]">

                  <p className="text-[9px] leading-[1.5] text-[#817982]">
                    Opening Hours — Coming
                  </p>

                  <p className="text-[9px] leading-[1.5] text-[#817982]">
                    Soon
                  </p>

                  <p className="mt-1 text-[9px] leading-[1.5] text-[#817982]">
                    Contact — Coming Soon
                  </p>

                </div>

                {/* Directions */}
                <button
                  type="button"
                  className="
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
                    transition-opacity
                    hover:opacity-70
                  "
                >
                  Get Directions
                  <ArrowRight size={13} strokeWidth={1.7} />
                </button>

              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}