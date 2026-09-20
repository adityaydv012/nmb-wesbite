import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Send,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* =========================================================
   CONTACT US
========================================================= */

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    feedbackMessage: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  /* =========================================================
     FORM SUBMIT - WEB3FORMS
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.contactNumber.trim() ||
      !formData.email.trim() ||
      !formData.feedbackMessage.trim()
    ) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const payload = {
        access_key: "7d9cda88-4c27-4556-a5c8-1e4cb7f694b4",

        subject:
          "New Contact Enquiry - Narayan Misthan Bhandar",

        from_name:
          "Narayan Misthan Bhandar Website",

        name: formData.name,

        contactNumber:
          formData.contactNumber,

        email:
          formData.email,

        message:
          formData.feedbackMessage,

        replyto:
          formData.email,

        botcheck: "",

        website:
          "Narayan Misthan Bhandar",
      };

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to submit the form."
        );
      }

      setMessage(
        "Thank you! Your message has been sent successfully."
      );

      setMessageType("success");

      setFormData({
        name: "",
        contactNumber: "",
        email: "",
        feedbackMessage: "",
      });
    } catch (error) {
      console.error(
        "Web3Forms Error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );

      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     OUTLET DATA
     
     Latitude and longitude have been removed.
     Google Maps links are used directly for directions.
  ========================================================= */

  const outlets = [
    {
      number: "01",
      name: "Sadar Bazaar",

      address: (
        <>
          Narayan Misthan Bhandar
          <br />
          Sadar Bazaar
        </>
      ),

      mapEmbedUrl:
        "https://www.google.com/maps?q=Narayan+Misthan+Bhandar+Sadar+Bazaar+Mainpuri&output=embed",

      directionsUrl:
        "https://maps.app.goo.gl/UAKzzVMtVNvA4YWw7",
    },

    {
      number: "02",
      name: "Station Road",

      address: (
        <>
          Narayan Misthan Bhandar
          <br />
          Station Road, Devpura
        </>
      ),

      mapEmbedUrl:
        "https://www.google.com/maps?q=Narayan+Misthan+Bhandar+Station+Road+Devpura+Mainpuri&output=embed",

      directionsUrl:
        "https://maps.app.goo.gl/jLevxkDqSBCUWhuy6",
    },
  ];

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* =====================================================
          MAIN PAGE
      ====================================================== */}

      <main className="w-full bg-[#FFF9F2]">

        {/* ===================================================
            CONTACT HERO
        ==================================================== */}

        <section
          className="
            relative
            overflow-hidden
            bg-[#FFF9F2]
            px-5
            pb-16
            pt-16
            sm:px-8
            sm:pb-20
            sm:pt-20
            lg:px-12
            lg:pb-24
            lg:pt-24
          "
        >
          {/* Decorative Glow */}

          <div
            className="
              pointer-events-none
              absolute
              -left-[160px]
              -top-[160px]
              h-[380px]
              w-[380px]
              rounded-full
              bg-[#EDE0F1]
              opacity-60
              blur-[70px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-[180px]
              -right-[160px]
              h-[420px]
              w-[420px]
              rounded-full
              bg-[#F3E5C7]
              opacity-50
              blur-[80px]
            "
          />

          <div
            className="
              relative
              mx-auto
              max-w-[1250px]
            "
          >
            {/* TOP LABEL */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-[#C9A45C]
                "
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#C9A45C]
                "
              >
                Get In Touch
              </span>
            </div>

            {/* HEADING */}

            <h1
              className="
                mt-5
                max-w-[850px]
                font-[var(--font-display)]
                text-[44px]
                font-semibold
                leading-[1.05]
                tracking-[-0.02em]
                text-[#340C48]
                sm:text-[58px]
                md:text-[68px]
                lg:text-[78px]
              "
            >
              We'd love to
              <br />
              hear from you.
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                max-w-[620px]
                text-[13px]
                leading-[1.8]
                text-[#6F6870]
                sm:text-[14px]
              "
            >
              Have a question, feedback, or simply want
              to say hello? Send us a message and our
              team will get back to you shortly.
            </p>
          </div>
        </section>

        {/* ===================================================
            CONTACT FORM + INFORMATION
        ==================================================== */}

        <section
          className="
            px-5
            pb-20
            sm:px-8
            lg:px-12
            lg:pb-24
          "
        >
          <div
            className="
              mx-auto
              grid
              max-w-[1250px]
              grid-cols-1
              gap-8
              lg:grid-cols-[1.05fr_0.95fr]
              lg:gap-12
            "
          >

            {/* =================================================
                CONTACT FORM
            ================================================== */}

            <div
              className="
                rounded-[18px]
                border
                border-[#340C48]/10
                bg-white
                p-6
                shadow-[0_20px_60px_rgba(52,12,72,0.07)]
                sm:p-8
                lg:p-10
              "
            >
              {/* FORM HEADER */}

              <div>
                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#C9A45C]
                  "
                >
                  Send A Message
                </span>

                <h2
                  className="
                    mt-3
                    font-[var(--font-display)]
                    text-[32px]
                    font-semibold
                    leading-tight
                    text-[#340C48]
                    sm:text-[38px]
                  "
                >
                  Let's connect.
                </h2>

                <p
                  className="
                    mt-3
                    max-w-[480px]
                    text-[12px]
                    leading-[1.7]
                    text-[#777078]
                  "
                >
                  Fill out the form below and we'll
                  get back to you as soon as possible.
                </p>
              </div>

              {/* STATUS MESSAGE */}

              {message && (
                <div
                  className={`
                    mt-6
                    flex
                    items-start
                    gap-3
                    rounded-[10px]
                    border
                    px-4
                    py-3
                    text-[12px]
                    leading-[1.5]
                    ${
                      messageType === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }
                  `}
                >
                  {messageType === "success" ? (
                    <CheckCircle2
                      size={18}
                      className="mt-[1px] shrink-0"
                    />
                  ) : (
                    <AlertCircle
                      size={18}
                      className="mt-[1px] shrink-0"
                    />
                  )}

                  <span>{message}</span>
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="
                  mt-8
                  space-y-5
                "
              >

                {/* NAME */}

                <div>
                  <label
                    htmlFor="name"
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#4C444E]
                    "
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                    className="
                      h-[52px]
                      w-full
                      rounded-[8px]
                      border
                      border-[#340C48]/10
                      bg-[#FFF9F2]
                      px-4
                      text-[13px]
                      text-[#340C48]
                      outline-none
                      transition-all
                      placeholder:text-[#9B949C]
                      focus:border-[#C9A45C]
                      focus:ring-2
                      focus:ring-[#C9A45C]/10
                    "
                  />
                </div>

                {/* CONTACT NUMBER */}

                <div>
                  <label
                    htmlFor="contactNumber"
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#4C444E]
                    "
                  >
                    Contact Number
                  </label>

                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                    className="
                      h-[52px]
                      w-full
                      rounded-[8px]
                      border
                      border-[#340C48]/10
                      bg-[#FFF9F2]
                      px-4
                      text-[13px]
                      text-[#340C48]
                      outline-none
                      transition-all
                      placeholder:text-[#9B949C]
                      focus:border-[#C9A45C]
                      focus:ring-2
                      focus:ring-[#C9A45C]/10
                    "
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#4C444E]
                    "
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    required
                    className="
                      h-[52px]
                      w-full
                      rounded-[8px]
                      border
                      border-[#340C48]/10
                      bg-[#FFF9F2]
                      px-4
                      text-[13px]
                      text-[#340C48]
                      outline-none
                      transition-all
                      placeholder:text-[#9B949C]
                      focus:border-[#C9A45C]
                      focus:ring-2
                      focus:ring-[#C9A45C]/10
                    "
                  />
                </div>

                {/* MESSAGE */}

                <div>
                  <label
                    htmlFor="feedbackMessage"
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#4C444E]
                    "
                  >
                    Message
                  </label>

                  <textarea
                    id="feedbackMessage"
                    name="feedbackMessage"
                    value={formData.feedbackMessage}
                    onChange={handleInputChange}
                    placeholder="Write your message here..."
                    required
                    rows={6}
                    className="
                      w-full
                      resize-none
                      rounded-[8px]
                      border
                      border-[#340C48]/10
                      bg-[#FFF9F2]
                      px-4
                      py-4
                      text-[13px]
                      leading-[1.6]
                      text-[#340C48]
                      outline-none
                      transition-all
                      placeholder:text-[#9B949C]
                      focus:border-[#C9A45C]
                      focus:ring-2
                      focus:ring-[#C9A45C]/10
                    "
                  />
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    group
                    flex
                    h-[54px]
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-[8px]
                    bg-[#340C48]
                    px-6
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-white
                    transition-all
                    duration-300
                    hover:bg-[#4B1D63]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message

                      <Send
                        size={15}
                        strokeWidth={1.7}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* =================================================
                CONTACT INFORMATION
            ================================================== */}

            <div
              className="
                flex
                flex-col
              "
            >
              {/* CONTACT INFO CARD */}

              <div
                className="
                  rounded-[18px]
                  bg-[#340C48]
                  p-7
                  text-white
                  shadow-[0_20px_60px_rgba(52,12,72,0.16)]
                  sm:p-9
                "
              >
                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#C9A45C]
                  "
                >
                  Contact Information
                </span>

                <h2
                  className="
                    mt-4
                    max-w-[420px]
                    font-[var(--font-display)]
                    text-[30px]
                    font-semibold
                    leading-[1.15]
                    sm:text-[36px]
                  "
                >
                  We're here to
                  <br />
                  help.
                </h2>

                <div
                  className="
                    mt-8
                    space-y-5
                  "
                >
                  {/* EMAIL */}

                  <a
                    href="mailto:narayanmisthanbhandar@gmail.com"
                    className="
                      group
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <span
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#C9A45C]/40
                        bg-white/5
                        text-[#C9A45C]
                      "
                    >
                      <Mail
                        size={17}
                        strokeWidth={1.6}
                      />
                    </span>

                    <span>
                      <span
                        className="
                          block
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#C9A45C]
                        "
                      >
                        Email
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          text-[12px]
                          text-white/85
                          transition-colors
                          group-hover:text-white
                        "
                      >
                        narayanmisthanbhandar@gmail.com
                      </span>
                    </span>
                  </a>

                  {/* PHONE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <span
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#C9A45C]/40
                        bg-white/5
                        text-[#C9A45C]
                      "
                    >
                      <Phone
                        size={17}
                        strokeWidth={1.6}
                      />
                    </span>

                    <span>
                      <span
                        className="
                          block
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#C9A45C]
                        "
                      >
                        Phone
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          text-[12px]
                          text-white/85
                        "
                      >
                        +91 9084235733,
                        <br />
                        +91 9858585020
                      </span>
                    </span>
                  </div>

                  {/* LOCATION */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <span
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#C9A45C]/40
                        bg-white/5
                        text-[#C9A45C]
                      "
                    >
                      <MapPin
                        size={17}
                        strokeWidth={1.6}
                      />
                    </span>

                    <span>
                      <span
                        className="
                          block
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#C9A45C]
                        "
                      >
                        Locations
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          text-[12px]
                          leading-[1.6]
                          text-white/85
                        "
                      >
                        Sadar Bazaar & Station Road,
                        <br />
                        Mainpuri
                      </span>
                    </span>
                  </div>
                </div>

                {/* GOLD DIVIDER */}

                <div
                  className="
                    mt-8
                    h-px
                    w-full
                    bg-[#C9A45C]/25
                  "
                />

                <p
                  className="
                    mt-6
                    text-[11px]
                    leading-[1.7]
                    text-white/60
                  "
                >
                  Visit us at either of our outlets and
                  experience the authentic taste and
                  tradition of Narayan Misthan Bhandar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            OUR OUTLETS
        ==================================================== */}

        <section
          className="
            bg-[#F7EEE7]
            px-5
            py-20
            sm:px-8
            lg:px-12
            lg:py-24
          "
        >
          <div
            className="
              mx-auto
              max-w-[1250px]
            "
          >
            {/* SECTION HEADER */}

            <div
              className="
                flex
                flex-col
                justify-between
                gap-6
                md:flex-row
                md:items-end
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      h-px
                      w-8
                      bg-[#C9A45C]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.25em]
                      text-[#C9A45C]
                    "
                  >
                    Visit Us
                  </span>
                </div>

                <h2
                  className="
                    mt-4
                    font-[var(--font-display)]
                    text-[40px]
                    font-semibold
                    leading-none
                    text-[#340C48]
                    sm:text-[50px]
                  "
                >
                  Our Outlets
                </h2>
              </div>

              <p
                className="
                  max-w-[420px]
                  text-[12px]
                  leading-[1.7]
                  text-[#756D74]
                "
              >
                Find the Narayan Misthan Bhandar outlet
                nearest to you and come enjoy our
                traditional sweets and treats.
              </p>
            </div>

            {/* OUTLET GRID */}

            <div
              className="
                mt-12
                grid
                grid-cols-1
                gap-7
                lg:grid-cols-2
              "
            >
              {outlets.map((outlet) => {
                return (
                  <div
                    key={outlet.number}
                    className="
                      overflow-hidden
                      rounded-[16px]
                      border
                      border-[#340C48]/10
                      bg-white
                      shadow-[0_18px_50px_rgba(52,12,72,0.07)]
                    "
                  >
                    {/* MAP */}

                    <div
                      className="
                        relative
                        h-[280px]
                        w-full
                        overflow-hidden
                        sm:h-[320px]
                      "
                    >
                      <iframe
                        title={`Narayan Misthan Bhandar - ${outlet.name}`}
                        src={outlet.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{
                          border: 0,
                        }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />

                      {/* OUTLET NUMBER */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          left-5
                          top-5
                          flex
                          items-center
                          gap-2
                          rounded-full
                          bg-[#FFF9F2]/95
                          px-3
                          py-2
                          shadow-md
                          backdrop-blur-sm
                        "
                      >
                        <span
                          className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-[#C9A45C]
                          "
                        >
                          Outlet
                        </span>

                        <span
                          className="
                            text-[9px]
                            font-semibold
                            tracking-[0.12em]
                            text-[#340C48]
                          "
                        >
                          {outlet.number}
                        </span>
                      </div>
                    </div>

                    {/* OUTLET DETAILS */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-6
                        p-6
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:p-7
                      "
                    >
                      <div>
                        <h3
                          className="
                            font-[var(--font-display)]
                            text-[27px]
                            font-semibold
                            leading-none
                            text-[#340C48]
                          "
                        >
                          {outlet.name}
                        </h3>

                        <div
                          className="
                            mt-4
                            flex
                            items-start
                            gap-2
                            text-[11px]
                            leading-[1.6]
                            text-[#6F6870]
                          "
                        >
                          <MapPin
                            size={15}
                            strokeWidth={1.7}
                            className="
                              mt-[1px]
                              shrink-0
                              text-[#C9A45C]
                            "
                          />

                          <span>
                            {outlet.address}
                          </span>
                        </div>
                      </div>

                      {/* =================================================
                          GET DIRECTIONS
                          Uses exact Google Maps link provided by you.
                      ================================================== */}

                      <a
                        href={outlet.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          group
                          inline-flex
                          shrink-0
                          items-center
                          justify-center
                          gap-2
                          rounded-[7px]
                          bg-[#340C48]
                          px-5
                          py-3.5
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.16em]
                          text-white
                          transition-all
                          duration-300
                          hover:bg-[#4B1D63]
                          hover:shadow-[0_8px_20px_rgba(52,12,72,0.18)]
                        "
                      >
                        <Navigation
                          size={14}
                          strokeWidth={1.7}
                          className="
                            text-white
                            transition-transform
                            duration-300
                            group-hover:translate-x-0.5
                          "
                        />

                        <span className="text-white">
                          Get Directions
                        </span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================
            BOTTOM CTA
        ==================================================== */}

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Footer />
    </>
  );
};

export default ContactUs;