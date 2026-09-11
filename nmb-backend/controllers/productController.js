import mongoose from "mongoose";
import Product from "../models/Product.js";

const formatProduct = (product) => {
  const productObject = product.toObject
    ? product.toObject()
    : product;

  const varieties = Array.isArray(productObject.varieties)
    ? productObject.varieties
    : [];

  const formattedVarieties = varieties.map((variety) => {
    const sellingPrice = Number(
      variety.sellingPrice ?? variety.price ?? 0
    );

    const offerPrice =
      variety.offerPrice !== null &&
      variety.offerPrice !== undefined &&
      variety.offerPrice !== ""
        ? Number(variety.offerPrice)
        : null;

    const hasOffer =
      Number.isFinite(offerPrice) &&
      offerPrice > 0 &&
      offerPrice < sellingPrice;

    const discountPercentage = hasOffer
      ? Math.round(
          ((sellingPrice - offerPrice) / sellingPrice) * 100
        )
      : 0;

    return {
      weight: variety.weight,

      sellingPrice,

      offerPrice: hasOffer ? offerPrice : null,

      price: hasOffer ? offerPrice : sellingPrice,

      originalPrice: hasOffer ? sellingPrice : null,

      discountPercentage,

      stock: variety.stock ?? 0,

      isAvailable: variety.isAvailable !== false,
    };
  });

  return {
    ...productObject,

    image:
      productObject.images?.[0] ||
      productObject.image ||
      "",

    images:
      Array.isArray(productObject.images) &&
      productObject.images.length > 0
        ? productObject.images
        : productObject.image
        ? [productObject.image]
        : [],

    varieties: formattedVarieties,

    // Compatibility with your existing frontend
    weights: formattedVarieties.map(
      (variety) => variety.weight
    ),

    price: formattedVarieties[0]?.price || 0,

    sellingPrice:
      formattedVarieties[0]?.sellingPrice || 0,

    offerPrice:
      formattedVarieties[0]?.offerPrice || null,

    discountPercentage:
      formattedVarieties[0]?.discountPercentage || 0,
  };
};

/**
 * GET ALL ACTIVE PRODUCTS
 * GET /api/products
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    const formattedProducts = products.map(formatProduct);

    return res.status(200).json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Get all public products error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch products.",
    });
  }
};

/**
 * GET SINGLE ACTIVE PRODUCT
 * GET /api/products/:productId
 */
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product: formatProduct(product),
    });
  } catch (error) {
    console.error("Get public product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch product.",
    });
  }
};