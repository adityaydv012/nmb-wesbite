import { motion } from "framer-motion";

import kajuImage from "../../assets/images/kaju-sweets.png";
import ladduImage from "../../assets/images/laddu.png";
import milkSweetsImage from "../../assets/images/milk-sweets.png";
import bengaliSweetsImage from "../../assets/images/bengali-sweets.png";
import dryFruitSweetsImage from "../../assets/images/dry-fruit-sweets.png";

const collections = [
  {
    title: "Laddu",
    image: ladduImage,
  },
  {
    title: "Milk Sweets",
    image: milkSweetsImage,
  },
  {
    title: "Bengali Sweets",
    image: bengaliSweetsImage,
  },
  {
    title: "Dry Fruit Sweets",
    image: dryFruitSweetsImage,
  },
];

function CollectionCard({
  title,
  image,
  large = false,
  index = 0,
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{
        scale: 0.98,
      }}
      className={`nmb-collection-card ${
        large ? "nmb-collection-card-large" : ""
      }`}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={image}
        alt={title}
        className="nmb-collection-image"
      />

      {/* Gradient only on Kaju Sweets */}
      {large && (
        <div
          className="nmb-collection-gradient"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        />
      )}

      <motion.div
        className="nmb-collection-label"
        initial={{
          opacity: 0,
          y: 10,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.5,
          delay: 0.15 + index * 0.08,
        }}
      >
        <h3>{title}</h3>
      </motion.div>
    </motion.article>
  );
}

function CuratedCollections() {
  return (
    <section className="nmb-collections-section">
      <div className="nmb-collections-container">

        {/* =================================================
            HEADING
            ================================================= */}

        <motion.div
          className="nmb-collections-heading"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <span />

          <h2>
            Curated Collections
          </h2>

          <span />
        </motion.div>

        {/* =================================================
            DESKTOP COLLECTION GRID
            ================================================= */}

        <div className="nmb-collections-grid">
          {/* Large Kaju Card */}
          <div className="nmb-collection-large-wrapper">
            <CollectionCard
              title="Kaju Sweets"
              image={kajuImage}
              large
              index={0}
            />
          </div>

          {/* Laddu */}
          <CollectionCard
            title="Laddu"
            image={ladduImage}
            index={1}
          />

          {/* Milk Sweets */}
          <CollectionCard
            title="Milk Sweets"
            image={milkSweetsImage}
            index={2}
          />

          {/* Bengali Sweets */}
          <CollectionCard
            title="Bengali Sweets"
            image={bengaliSweetsImage}
            index={3}
          />

          {/* Dry Fruit Sweets */}
          <CollectionCard
            title="Dry Fruit Sweets"
            image={dryFruitSweetsImage}
            index={4}
          />
        </div>

        {/* =================================================
            MOBILE COLLECTION LAYOUT
            ================================================= */}

        <div
          className="nmb-collections-mobile"
          style={{
            display: "none",
          }}
        >
          {/* Kaju Sweets - Full Width */}

          <div
            style={{
              width: "100%",
            }}
          >
            <CollectionCard
              title="Kaju Sweets"
              image={kajuImage}
              large
              index={0}
            />
          </div>

          {/* Remaining Four - 2 Column Grid */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "12px",
              width: "100%",
              marginTop: "12px",
            }}
          >
            {collections.map((collection, index) => (
              <CollectionCard
                key={collection.title}
                title={collection.title}
                image={collection.image}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* =================================================
          MOBILE ONLY VISIBILITY
          ================================================= */}

      <style>
        {`
          @media (max-width: 767px) {
            .nmb-collections-grid {
              display: none !important;
            }

            .nmb-collections-mobile {
              display: block !important;
            }
          }
        `}
      </style>
    </section>
  );
}

export default CuratedCollections;