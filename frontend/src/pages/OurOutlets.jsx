import React from "react";
import {
  MapPin,
  Clock3,
  Phone,
  ArrowRight,
  Car,
  Accessibility,
  Heart,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* =========================================================
   IMAGES
========================================================= */

import outlet1 from "../assets/images/station.JPG";
import outlet2 from "../assets/images/sadar.JPG";

/* =========================================================
   OUTLET DATA
========================================================= */

const OUTLETS = [
  {
    id: 1,
    name: "Station Road",
    subtitle: "The heart of our heritage since 1950.",
    image: outlet1,

    address: (
      <>
        Station Rd, Devpura, Banshi Gohara,
        <br />
        Mainpuri, Devpura Dehat, Uttar Pradesh 205001
      </>
    ),

    hours: "Monday - Sunday: 8:00 AM - 10:45 PM",

    phone: "+91 9084235733",

    directionsUrl:
      "https://maps.app.goo.gl/jLevxkDqSBCUWhuy6",

    featured: true,
  },

  {
    id: 2,
    name: "Sadar Bazaar Flagship",
    subtitle: "Our modern take on traditional gifting.",
    image: outlet2,

    address: (
      <>
        Sadar Bazaar Road, SH84,
        <br />
        Mainpuri, Uttar Pradesh 205001
      </>
    ),

    hours: "Monday - Sunday: 8:00 AM - 10:45 PM",

    phone: "+91 9858585020",

    directionsUrl:
      "https://maps.app.goo.gl/UAKzzVMtVNvA4YWw7",

    featured: false,
  },
];

/* =========================================================
   MAIN MAP
========================================================= */

/*
  Main Google Maps section.
  This map displays the Sadar Bazaar location.
*/

const embedMapUrl =
  "https://www.google.com/maps?q=Narayan+Misthan+Bhandar+Sadar+Bazaar+Mainpuri&output=embed";

const mainMapsUrl =
  "https://maps.app.goo.gl/UAKzzVMtVNvA4YWw7";

/* =========================================================
   OUR OUTLETS PAGE
========================================================= */

export default function OurOutlets() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF7F1]">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          px-6
          pb-16
          pt-20
          sm:px-10
          md:pb-20
          md:pt-24
          lg:px-16
        "
      >

        {/* Background glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-[420px]
            w-[700px]
            -translate-x-1/2
            rounded-full
            bg-[#EBDDEB]/25
            blur-[100px]
          "
        />

        <div className="relative z-10 mx-auto max-w-[1000px] text-center">

          {/* Decorative line */}

          <div className="mb-5 flex items-center justify-center gap-4">

            <span className="h-px w-12 bg-[#C5A15B]" />

            <Heart
              size={13}
              strokeWidth={1.5}
              className="text-[#C5A15B]"
            />

            <span className="h-px w-12 bg-[#C5A15B]" />

          </div>

          {/* Heading */}

          <h1
            className="
              font-['Playfair_Display']
              text-[42px]
              font-semibold
              leading-[1.05]
              tracking-[-0.025em]
              text-[#3B2444]
              sm:text-[52px]
              md:text-[64px]
            "
          >
            Our Outlets
          </h1>

          {/* Gold underline */}

          <div className="mx-auto mt-5 h-[2px] w-16 bg-[#C5A15B]" />

          {/* Description */}

          <p
            className="
              mx-auto
              mt-6
              max-w-[650px]
              text-[14px]
              leading-[1.8]
              text-[#716975]
              sm:text-[15px]
            "
          >
            Discover the timeless sweetness of Narayan Misthan Bhandar.
            Visit our outlets and experience our heritage in every bite.
          </p>

        </div>
      </section>

      {/* =====================================================
          OUTLET CARDS
      ====================================================== */}

      <section
        className="
          relative
          px-6
          pb-20
          sm:px-10
          md:pb-24
          lg:px-16
        "
      >

        <div className="mx-auto max-w-[1120px] space-y-8">

          {OUTLETS.map((outlet, index) => (
            <OutletCard
              key={outlet.id}
              outlet={outlet}
              reverse={index === 1}
            />
          ))}

        </div>

      </section>

      {/* =====================================================
          LOCATION / GOOGLE MAP
      ====================================================== */}

      <section
        className="
          px-6
          pb-20
          sm:px-10
          md:pb-28
          lg:px-16
        "
      >

        <div
          className="
            mx-auto
            grid
            max-w-[1120px]
            overflow-hidden
            rounded-[18px]
            border
            border-[#E4D8DC]
            bg-[#FFFDF9]
            shadow-[0_18px_55px_rgba(62,38,49,0.08)]
            lg:grid-cols-[1.6fr_0.9fr]
          "
        >

          {/* =================================================
              GOOGLE MAP
          ================================================== */}

          <div
            className="
              relative
              min-h-[350px]
              overflow-hidden
              bg-[#F1ECE4]
              sm:min-h-[420px]
              lg:min-h-[470px]
            "
          >

            <iframe
              title="Narayan Misthan Bhandar Location"
              src={embedMapUrl}
              width="100%"
              height="100%"
              className="
                absolute
                inset-0
                h-full
                min-h-[350px]
                w-full
                border-0
                sm:min-h-[420px]
                lg:min-h-[470px]
              "
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>

          {/* =================================================
              MAP INFORMATION
          ================================================== */}

          <div
            className="
              flex
              flex-col
              justify-center
              px-7
              py-10
              sm:px-10
              lg:px-12
            "
          >

            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-[#B08A43]
              "
            >
              Find Us Easily
            </p>

            <h2
              className="
                mt-3
                font-['Playfair_Display']
                text-[32px]
                font-semibold
                leading-[1.1]
                text-[#3B2444]
                sm:text-[38px]
              "
            >
              Visit us.
              <br />
              Taste the tradition.
            </h2>

            <p
              className="
                mt-4
                max-w-[350px]
                text-[13px]
                leading-[1.75]
                text-[#716975]
              "
            >
              Find a little sweetness in the heart of Mainpuri. Our location
              is easy to reach and ready to welcome you.
            </p>

            {/* =================================================
                LOCATION
            ================================================== */}

            <div className="mt-8 flex gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D8B86A]
                  text-[#B08A43]
                "
              >
                <MapPin
                  size={18}
                  strokeWidth={1.6}
                />
              </div>

              <div>

                <h3
                  className="
                    text-[13px]
                    font-semibold
                    text-[#4B1D63]
                  "
                >
                  Mainpuri, Uttar Pradesh
                </h3>

                <p
                  className="
                    mt-1
                    text-[12px]
                    leading-[1.6]
                    text-[#716975]
                  "
                >
                  Narayan Misthan Bhandar
                </p>

              </div>

            </div>

            {/* =================================================
                ACCESSIBILITY
            ================================================== */}

            <div className="mt-6 flex gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D8B86A]
                  text-[#B08A43]
                "
              >
                <Accessibility
                  size={18}
                  strokeWidth={1.6}
                />
              </div>

              <div>

                <h3
                  className="
                    text-[13px]
                    font-semibold
                    text-[#4B1D63]
                  "
                >
                  Easy Accessibility
                </h3>

                <p
                  className="
                    mt-1
                    text-[12px]
                    leading-[1.6]
                    text-[#716975]
                  "
                >
                  Conveniently located for your visit.
                </p>

              </div>

            </div>

            {/* =================================================
                PARKING
            ================================================== */}

            <div className="mt-6 flex gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D8B86A]
                  text-[#B08A43]
                "
              >
                <Car
                  size={18}
                  strokeWidth={1.6}
                />
              </div>

              <div>

                <h3
                  className="
                    text-[13px]
                    font-semibold
                    text-[#4B1D63]
                  "
                >
                  Ample Parking
                </h3>

                <p
                  className="
                    mt-1
                    text-[12px]
                    leading-[1.6]
                    text-[#716975]
                  "
                >
                  Spacious parking available for visitors.
                </p>

              </div>

            </div>

            {/* =================================================
                VIEW ON GOOGLE MAPS
            ================================================== */}

            <a
              href={mainMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                mt-8
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-[4px]
                bg-[#4B1D63]
                px-6
                py-3.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.12em]
                !text-white
                shadow-[0_8px_20px_rgba(75,29,99,0.16)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#351247]
                hover:!text-white
              "
            >
              View On Google Maps

              <ArrowRight
                size={14}
                strokeWidth={1.8}
                className="
                  !text-white
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </div>
  );
}

/* =========================================================
   OUTLET CARD
========================================================= */

function OutletCard({ outlet, reverse }) {
  /*
    Convert:
    +91 9084235733
    +
    +91 9858585020

    into clickable telephone links:
    +919084235733
    +919858585020
  */

  const phoneUrl = `tel:${outlet.phone.replace(/\s/g, "")}`;

  return (
    <article
      className="
        relative
        overflow-hidden
        rounded-[18px]
        border
        border-[#E4D8DC]
        bg-[#FFFDF9]
        shadow-[0_18px_55px_rgba(62,38,49,0.08)]
      "
    >

      {/* =====================================================
          LOW-OPACITY BLURRED IMAGE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <img
          src={outlet.image}
          alt=""
          className="
            absolute
            inset-[-30px]
            h-[calc(100%+60px)]
            w-[calc(100%+60px)]
            scale-110
            object-cover
            object-center
            opacity-[0.055]
            blur-[22px]
          "
        />

        <div className="absolute inset-0 bg-[#FFFDF9]/70" />

      </div>

      {/* =====================================================
          CARD CONTENT
      ====================================================== */}

      <div
        className={`
          relative
          z-10
          grid
          items-center
          gap-8
          p-6
          sm:p-8
          lg:grid-cols-2
          lg:gap-10
          lg:p-8
          ${
            reverse
              ? "lg:[&>*:first-child]:order-2"
              : ""
          }
        `}
      >

        {/* =================================================
            IMAGE
        ================================================== */}

        <div className="relative overflow-hidden rounded-[12px]">

          <img
            src={outlet.image}
            alt={outlet.name}
            className="
              aspect-[4/3]
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              hover:scale-[1.03]
            "
          />

          {/* Image overlay */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-[#2A162E]/15
              via-transparent
              to-transparent
            "
          />

          {/* NEW Badge */}

          {!outlet.featured && (
            <div
              className="
                absolute
                right-0
                top-0
                rounded-bl-[8px]
                bg-[#E8B84F]
                px-4
                py-1.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#3B2444]
              "
            >
              New
            </div>
          )}

        </div>

        {/* =================================================
            DETAILS
        ================================================== */}

        <div className="flex flex-col">

          {/* Title */}

          <h2
            className="
              font-['Playfair_Display']
              text-[30px]
              font-semibold
              leading-[1.08]
              text-[#3B2444]
              sm:text-[36px]
            "
          >
            {outlet.name}
          </h2>

          {/* Subtitle */}

          <p
            className="
              mt-2
              font-[var(--font-display)]
              text-[13px]
              italic
              text-[#756D75]
            "
          >
            {outlet.subtitle}
          </p>

          {/* Information */}

          <div className="mt-7 space-y-5">

            {/* Address */}

            <InfoRow
              icon={MapPin}
              title="Address"
            >
              {outlet.address}
            </InfoRow>

            {/* Opening Hours */}

            <InfoRow
              icon={Clock3}
              title="Opening Hours"
            >
              {outlet.hours}
            </InfoRow>

            {/* Contact */}

            <InfoRow
              icon={Phone}
              title="Contact"
            >
              <a
                href={phoneUrl}
                className="
                  transition-colors
                  hover:text-[#4B1D63]
                "
              >
                {outlet.phone}
              </a>
            </InfoRow>

          </div>

          {/* =================================================
              BUTTONS
          ================================================== */}

          <div className="mt-8 flex flex-wrap gap-3">

            {/* =================================================
                GET DIRECTIONS
            ================================================== */}

            <a
              href={outlet.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-[4px]
                bg-[#4B1D63]
                px-6
                py-3.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.12em]
                !text-white
                shadow-[0_8px_20px_rgba(75,29,99,0.16)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#351247]
              "
            >
              Get Directions

              <ArrowRight
                size={14}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />

            </a>

            {/* =================================================
                CALL STORE
            ================================================== */}

            <a
              href={phoneUrl}
              className="
                inline-flex
                items-center
                gap-2
                rounded-[4px]
                border
                border-[#D8B86A]
                bg-[#FFFDF9]
                px-6
                py-3.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#4B1D63]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#F8F0E3]
              "
            >
              <Phone
                size={13}
                strokeWidth={1.8}
              />

              Call Store
            </a>

          </div>

        </div>

      </div>

    </article>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon: Icon,
  title,
  children,
}) {
  return (
    <div className="flex gap-4">

      {/* Icon */}

      <div
        className="
          mt-0.5
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          text-[#C5A15B]
        "
      >
        <Icon
          size={18}
          strokeWidth={1.6}
        />
      </div>

      {/* Text */}

      <div>

        <h3
          className="
            text-[12px]
            font-semibold
            text-[#4B1D63]
          "
        >
          {title}
        </h3>

        <div
          className="
            mt-1
            text-[12px]
            leading-[1.65]
            text-[#716975]
          "
        >
          {children}
        </div>

      </div>

    </div>
  );
}