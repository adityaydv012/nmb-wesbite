import React from "react";
import {
  Phone,
  MessageSquare,
  Mail,
  Store,
  Clock3,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* =========================================================
   IMAGES
========================================================= */

import heritageImage from "../assets/images/contact-heritage.png";

/* =========================================================
   CONTACT OPTIONS
========================================================= */

const CONTACT_OPTIONS = [
  {
    icon: Phone,
    title: "Call Us",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp",
  },
  {
    icon: Mail,
    title: "Email Us",
  },
  {
    icon: Store,
    title: "Visit Us",
  },
];

/* =========================================================
   OUTLETS
========================================================= */

const OUTLETS = [
  {
    name: "Station Road Branch",
    address:
      "123 Heritage Lane, Near Central Station, Cityville, State, 123456",
    hours: "8:00 AM - 10:00 PM (Daily)",
    map: "https://www.google.com/maps?q=Station+Road+India&output=embed",
  },
  {
    name: "Sadar Bazaar Branch",
    address:
      "45 Market Square, Main Sadar Bazaar, Cityville, State, 123457",
    hours: "9:00 AM - 9:00 PM (Closed Mondays)",
    map: "https://www.google.com/maps?q=Sadar+Bazaar+India&output=embed",
  },
];

/* =========================================================
   CONTACT US PAGE
========================================================= */

export default function ContactUs() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF7F1]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main>
        {/* =====================================================
            HERO / CONTACT INTRO
        ===================================================== */}

        <section className="relative overflow-hidden px-5 pb-20 pt-20 sm:px-8 md:pb-24 md:pt-24 lg:px-12 lg:pt-28">
          {/* Background Soft Glow */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-[#EDE4D5]/50 blur-[100px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1200px]">
            {/* Heading */}

            <div className="text-center">
              <h1
                className="
                  font-['Playfair_Display']
                  text-[40px]
                  font-semibold
                  leading-[1.1]
                  tracking-[-0.02em]
                  text-[#3B2444]
                  sm:text-[52px]
                  md:text-[62px]
                "
              >
                Let's Make Life a Little Sweeter
              </h1>

              <p
                className="
                  mx-auto
                  mt-4
                  max-w-[650px]
                  text-[14px]
                  leading-relaxed
                  text-[#746C75]
                  sm:text-[15px]
                "
              >
                Have a question, want to place a special order, or simply want
                to say hello?
              </p>

              {/* Decorative Divider */}

              <div className="mt-5 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-[#C5A15B]/70" />

                <Heart
                  size={10}
                  strokeWidth={1.8}
                  className="fill-[#C5A15B] text-[#C5A15B]"
                />

                <span className="h-px w-12 bg-[#C5A15B]/70" />
              </div>
            </div>

            {/* =====================================================
                CONTACT GRID
            ===================================================== */}

            <div
              className="
                mx-auto
                mt-16
                grid
                max-w-[1100px]
                gap-5
                lg:grid-cols-[1.15fr_0.85fr]
              "
            >
              {/* =================================================
                  CONTACT FORM
              ================================================= */}

              <div
                className="
                  rounded-[12px]
                  border
                  border-[#E1D8E2]
                  bg-[#FCFAF7]
                  p-6
                  shadow-[0_12px_40px_rgba(61,34,71,0.05)]
                  sm:p-8
                  md:p-10
                "
              >
                <h2
                  className="
                    font-['Playfair_Display']
                    text-[28px]
                    font-semibold
                    text-[#3B2444]
                    sm:text-[32px]
                  "
                >
                  Send a Message
                </h2>

                <form className="mt-7 space-y-5">
                  {/* Name + Phone */}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="
                          mb-2
                          block
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[#746C75]
                        "
                      >
                        Name
                      </label>

                      <input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        className="
                          w-full
                          rounded-[5px]
                          border
                          border-[#D9CBE0]
                          bg-[#F8F5F7]
                          px-4
                          py-3
                          text-[12px]
                          text-[#4B4250]
                          outline-none
                          transition-all
                          placeholder:text-[#B8AFB9]
                          focus:border-[#7A4D89]
                          focus:ring-2
                          focus:ring-[#7A4D89]/10
                        "
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="
                          mb-2
                          block
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[#746C75]
                        "
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        placeholder="+91 00000 00000"
                        className="
                          w-full
                          rounded-[5px]
                          border
                          border-[#D9CBE0]
                          bg-[#F8F5F7]
                          px-4
                          py-3
                          text-[12px]
                          text-[#4B4250]
                          outline-none
                          transition-all
                          placeholder:text-[#B8AFB9]
                          focus:border-[#7A4D89]
                          focus:ring-2
                          focus:ring-[#7A4D89]/10
                        "
                      />
                    </div>
                  </div>

                  {/* Email */}

                  <div>
                    <label
                      htmlFor="email"
                      className="
                        mb-2
                        block
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#746C75]
                      "
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      className="
                        w-full
                        rounded-[5px]
                        border
                        border-[#D9CBE0]
                        bg-[#F8F5F7]
                        px-4
                        py-3
                        text-[12px]
                        text-[#4B4250]
                        outline-none
                        transition-all
                        placeholder:text-[#B8AFB9]
                        focus:border-[#7A4D89]
                        focus:ring-2
                        focus:ring-[#7A4D89]/10
                      "
                    />
                  </div>

                  {/* Message */}

                  <div>
                    <label
                      htmlFor="message"
                      className="
                        mb-2
                        block
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#746C75]
                      "
                    >
                      Your Message
                    </label>

                    <textarea
                      id="message"
                      rows={5}
                      placeholder="How can we help you today?"
                      className="
                        w-full
                        resize-none
                        rounded-[5px]
                        border
                        border-[#D9CBE0]
                        bg-[#F8F5F7]
                        px-4
                        py-3
                        text-[12px]
                        text-[#4B4250]
                        outline-none
                        transition-all
                        placeholder:text-[#B8AFB9]
                        focus:border-[#7A4D89]
                        focus:ring-2
                        focus:ring-[#7A4D89]/10
                      "
                    />
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-[3px]
                      bg-[#4B1D63]
                      px-6
                      py-4
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      !text-white
                      shadow-[0_10px_25px_rgba(75,29,99,0.15)]
                      transition-all
                      duration-300
                      hover:bg-[#391448]
                      hover:shadow-[0_15px_30px_rgba(75,29,99,0.25)]
                    "
                  >
                    <span className="!text-white">Send Message</span>

                    <ArrowRight
                      size={15}
                      className="
                        !text-white
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </button>
                </form>
              </div>

              {/* =================================================
                  CONTACT RIGHT SIDE
              ================================================= */}

              <div className="flex flex-col gap-5">
                {/* Contact Options */}

                <div className="grid grid-cols-2 gap-5">
                  {CONTACT_OPTIONS.map((option) => {
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.title}
                        type="button"
                        className="
                          group
                          flex
                          min-h-[135px]
                          flex-col
                          items-center
                          justify-center
                          rounded-[12px]
                          border
                          border-[#E1D8E2]
                          bg-[#F8F5F7]
                          px-4
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:border-[#C5A15B]/60
                          hover:bg-white
                          hover:shadow-[0_15px_30px_rgba(61,34,71,0.08)]
                        "
                      >
                        <Icon
                          size={23}
                          strokeWidth={1.7}
                          className="
                            text-[#4B1D63]
                            transition-transform
                            duration-300
                            group-hover:scale-110
                          "
                        />

                        <span
                          className="
                            mt-4
                            text-[11px]
                            font-semibold
                            tracking-[0.04em]
                            text-[#4B3A50]
                          "
                        >
                          {option.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Heritage Image */}

                <div
                  className="
                    relative
                    min-h-[220px]
                    flex-1
                    overflow-hidden
                    rounded-[12px]
                  "
                >
                  <img
                    src={heritageImage}
                    alt="Traditional Indian sweets"
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  {/* Overlay */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#28121F]/75
                      via-[#28121F]/10
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      p-7
                    "
                  >
                    <p
                      className="
                        font-['Playfair_Display']
                        text-[30px]
                        font-semibold
                        text-white
                        sm:text-[34px]
                      "
                    >
                      Crafted with Heritage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                DIVIDER
            ===================================================== */}

            <div className="mx-auto mt-24 h-px max-w-[1100px] bg-[#DED4C7]" />

            {/* =====================================================
                OUTLETS
            ===================================================== */}

            <section className="pt-16 md:pt-20">
              {/* Heading */}

              <div className="text-center">
                <h2
                  className="
                    font-['Playfair_Display']
                    text-[36px]
                    font-semibold
                    text-[#3B2444]
                    sm:text-[44px]
                  "
                >
                  Our Outlets
                </h2>

                <p className="mt-2 text-[13px] text-[#746C75]">
                  Find a Narayan Misthan Bhandar near you.
                </p>
              </div>

              {/* Outlet Cards */}

              <div
                className="
                  mx-auto
                  mt-10
                  grid
                  max-w-[1100px]
                  gap-6
                  md:grid-cols-2
                "
              >
                {OUTLETS.map((outlet) => (
                  <article
                    key={outlet.name}
                    className="
                      overflow-hidden
                      rounded-[12px]
                      border
                      border-[#E1D8E2]
                      bg-[#FCFAF7]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-[0_18px_45px_rgba(61,34,71,0.08)]
                    "
                  >
                    {/* Map */}

                    <div className="h-[210px] overflow-hidden">
                      <iframe
                        title={outlet.name}
                        src={outlet.map}
                        className="
                          h-full
                          w-full
                          border-0
                          grayscale-[25%]
                        "
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}

                    <div className="p-7">
                      <h3
                        className="
                          font-['Playfair_Display']
                          text-[25px]
                          font-semibold
                          text-[#3B2444]
                        "
                      >
                        {outlet.name}
                      </h3>

                      <div className="mt-4 flex items-start gap-2">
                        <MapPin
                          size={14}
                          strokeWidth={1.8}
                          className="
                            mt-[2px]
                            shrink-0
                            text-[#7B687F]
                          "
                        />

                        <p
                          className="
                            text-[12px]
                            leading-[1.7]
                            text-[#746C75]
                          "
                        >
                          {outlet.address}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center gap-2">
                        <Clock3
                          size={13}
                          strokeWidth={1.8}
                          className="text-[#7B687F]"
                        />

                        <span
                          className="
                            text-[10px]
                            font-medium
                            text-[#5F5363]
                          "
                        >
                          {outlet.hours}
                        </span>
                      </div>

                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="
                          group
                          mt-6
                          inline-flex
                          items-center
                          gap-2
                          border-b
                          border-[#C5A15B]
                          pb-1
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[#3B2444]
                          transition-all
                          hover:text-[#8C6B32]
                        "
                      >
                        View Directions

                        <ArrowRight
                          size={13}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {/* View All Locations */}

              <div className="mt-10 text-center">
                <a
                  href="/outlets"
                  className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    rounded-[4px]
                    border
                    border-[#C9AF7A]
                    bg-transparent
                    px-8
                    py-3.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#3B2444]
                    transition-all
                    duration-300
                    hover:bg-[#4B1D63]
                    hover:!text-white
                    hover:shadow-[0_12px_25px_rgba(75,29,99,0.15)]
                  "
                >
                  <span>View All Locations</span>

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </div>
  );
}