import { motion } from "framer-motion";

function Ticker() {
  const tickerText =
    "Limited Time Offer – Rakshabandhan Offer is Live  •  Buy Now  •";

  return (
    <div className="w-full overflow-hidden bg-[#340C48]">
      <motion.div
        className="
          flex
          w-max
          whitespace-nowrap
          py-[7px]
        "
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {/* Copy 1 */}
        <span
          className="
            shrink-0
            pr-[80px]
            font-[var(--font-display)]
            text-[20px]
            italic
            leading-[1.2]
            !text-white
          "
        >
          {tickerText}
        </span>

        {/* Copy 2 */}
        <span
          className="
            shrink-0
            pr-[80px]
            font-[var(--font-display)]
            text-[20px]
            italic
            leading-[1.2]
            !text-white
          "
        >
          {tickerText}
        </span>

        {/* Copy 3 */}
        <span
          className="
            shrink-0
            pr-[80px]
            font-[var(--font-display)]
            text-[20px]
            italic
            leading-[1.2]
            !text-white
          "
        >
          {tickerText}
        </span>

        {/* Copy 4 */}
        <span
          className="
            shrink-0
            pr-[80px]
            font-[var(--font-display)]
            text-[20px]
            italic
            leading-[1.2]
            !text-white
          "
        >
          {tickerText}
        </span>
      </motion.div>
    </div>
  );
}

export default Ticker;