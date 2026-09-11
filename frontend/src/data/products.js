import kajuImage from "../assets/images/kaju.png";
import motichoorImage from "../assets/images/motichoor-laddu.png";
import rosePedaImage from "../assets/images/rose-petal-ped.png";
import milkCakeImage from "../assets/images/milk-cake.png";

const PRODUCTS = [
  {
    id: "premium-kaju-katli",
    name: "Premium Kaju Katli",
    description:
      "Delicate diamond-shaped cashew sweets crafted with premium ingredients.",
    price: 850,
    category: "Kaju Sweets",
    dietary: ["Vegan", "Gluten-Free"],
    badge: "BESTSELLER",
    image: kajuImage,
    weights: ["250g", "500g", "1kg"],
    popularity: 5,
  },

  {
    id: "motichoor-laddu",
    name: "Motichoor Laddu",
    description:
      "Classic spherical sweets made from fine gram flour and rich ingredients.",
    price: 600,
    category: "Besan & Laddu",
    dietary: ["Gluten-Free"],
    badge: null,
    image: motichoorImage,
    weights: ["250g", "500g", "1kg"],
    popularity: 4,
  },

  {
    id: "rose-petal-peda",
    name: "Rose Petal Peda",
    description:
      "Soft milk fudge infused with delicate rose and traditional flavours.",
    price: 950,
    category: "Milk Sweets",
    dietary: ["Gluten-Free"],
    badge: "LIMITED EDITION",
    image: rosePedaImage,
    weights: ["250g", "500g", "1kg"],
    popularity: 5,
  },

  {
    id: "authentic-milk-cake",
    name: "Authentic Milk Cake",
    description:
      "Rich, granular caramelized milk sweet with a traditional texture.",
    price: 750,
    category: "Milk Sweets",
    dietary: ["Gluten-Free"],
    badge: null,
    image: milkCakeImage,
    weights: ["250g", "500g", "1kg"],
    popularity: 4,
  },

  {
    id: "besan-laddu",
    name: "Besan Laddu",
    description:
      "Golden roasted gram flour laddus finished with aromatic ghee.",
    price: 650,
    category: "Besan & Laddu",
    dietary: ["Vegetarian"],
    badge: null,
    image: motichoorImage,
    weights: ["250g", "500g", "1kg"],
    popularity: 4,
  },

  {
    id: "kaju-roll",
    name: "Kaju Roll",
    description:
      "Silky cashew fudge rolled into an elegant festive sweet.",
    price: 900,
    category: "Kaju Sweets",
    dietary: ["Vegan"],
    badge: null,
    image: kajuImage,
    weights: ["250g", "500g", "1kg"],
    popularity: 4,
  },

  {
    id: "pista-barfi",
    name: "Pista Barfi",
    description:
      "Rich pistachio barfi made for celebrations and gifting.",
    price: 880,
    category: "Kaju Sweets",
    dietary: ["Gluten-Free"],
    badge: null,
    image: kajuImage,
    weights: ["250g", "500g", "1kg"],
    popularity: 3,
  },

  {
    id: "kalakand",
    name: "Traditional Kalakand",
    description:
      "Soft, grainy milk sweet with a delicate caramelised finish.",
    price: 720,
    category: "Milk Sweets",
    dietary: ["Gluten-Free"],
    badge: null,
    image: milkCakeImage,
    weights: ["250g", "500g", "1kg"],
    popularity: 3,
  },
];

export default PRODUCTS;