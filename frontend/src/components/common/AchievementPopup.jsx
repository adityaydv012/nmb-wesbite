import { useEffect, useState } from "react";

import { X, ArrowRight } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import popupImage from "../../assets/images/pop-up.jpeg";

const AchievementPopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Close popup with ESC key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent background scrolling while popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setIsOpen(false)}
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/50
            px-4
            py-5
            backdrop-blur-[3px]
            sm:px-6
            sm:py-8
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            onClick={(event) => event.stopPropagation()}
            className="
              relative
              w-full
              max-w-[360px]
              overflow-hidden
              rounded-[20px]
              bg-[#FFF9F2]
              shadow-[0_25px_80px_rgba(0,0,0,0.3)]
              sm:max-w-[380px]
            "
          >
            {/* =====================================================
                CLOSE BUTTON
            ====================================================== */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close popup"
              className="
                absolute
                right-3
                top-3
                z-30
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-white/95
                text-[#340C48]
                shadow-md
                transition-all
                duration-200
                hover:scale-105
                hover:bg-white
              "
            >
              <X
                size={18}
                strokeWidth={1.8}
              />
            </button>

            {/* =====================================================
                FULL IMAGE
                IMPORTANT:
                No fixed height
                No max-height
                No object-cover
            ====================================================== */}
            <div className="w-full bg-[#FFF9F2]">
              <img
                src={popupImage}
                alt="Narayan Misthan Bhandar Soan Papdi recognition"
                className="
                  block
                  h-auto
                  w-full
                  object-contain
                "
              />
            </div>

            {/* =====================================================
                CONTENT
            ====================================================== */}
            <div
              className="
                px-5
                pb-5
                pt-4
                text-center
                sm:px-6
                sm:pb-6
                sm:pt-5
              "
            >
              <p
                className="
                  mb-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#C9A45C]
                  sm:text-[10px]
                "
              >
                A Sweet Pride of Mainpuri
              </p>

              <h2
                className="
                  font-[var(--font-display)]
                  text-[25px]
                  leading-[1.05]
                  text-[#340C48]
                  sm:text-[28px]
                "
              >
                Soan Papdi
              </h2>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-[310px]
                  text-[12px]
                  leading-[1.5]
                  text-[#5E5361]
                  sm:mt-3
                  sm:text-[13px]
                  sm:leading-[1.6]
                "
              >
                Celebrating the sweet that represents Mainpuri under
                Uttar Pradesh's One District, One Cuisine initiative.
              </p>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  group
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  border-b
                  border-[#340C48]
                  pb-1
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[#340C48]
                  transition-all
                  duration-300
                  hover:gap-3
                  hover:border-[#C9A45C]
                  hover:text-[#C9A45C]
                  sm:mt-5
                  sm:text-[11px]
                "
              >
                Explore Our Story

                <ArrowRight
                  size={14}
                  strokeWidth={1.6}
                  className="
                    transition-transform
                    duration-300
                  "
                />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementPopup;